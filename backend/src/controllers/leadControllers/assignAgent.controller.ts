// controllers/assignAgent.controller.ts
import { Response } from "express";
import mongoose from "mongoose";
import Lead from "../models/lead.model.js";
import { AuthRequest } from "../types/express.types.js";
import { LeadStatus, Role } from "../types/lead.types.js";

import User from "@/models/User.js";
import { createNotification } from "../notificationController.js";

export const assignAgentToLeadController = async (
  req: AuthRequest,
  res: Response
) => {
  const { leadId } = req.params;
  const { agentId, reassignReason } = req.body;

  try {
    if (!agentId) {
      return res.status(400).json({
        success: false,
        message: "Agent ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(agentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Agent ID format",
      });
    }

    // Check user role
    if (req.user?.role === Role.salesAgent) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. Only admins and sales managers can assign agents.",
      });
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Check if agent exists (optional)
    const agent = await User.findById(agentId);
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    const oldAgent = lead.system?.assignedAgent?.toString();

    // If assigning to same agent, return early
    if (oldAgent === agentId) {
      return res.status(200).json({
        success: true,
        message: "Lead is already assigned to this agent",
        data: lead,
      });
    }

    // Update lead assignment
    if (!lead.system) {
      lead.system = {
        assignedAgent: agentId,
        leadStatus: LeadStatus.New,
        assignmentHistory: [],
      };
    } else {
      // Track assignment history
      if (!lead.system.assignmentHistory) {
        lead.system.assignmentHistory = [];
      }

      lead.system.assignmentHistory.push({
        fromAgent: oldAgent,
        toAgent: agentId,
        assignedBy: req.user?.userId,
        assignedAt: new Date(),
        reason: reassignReason || "Manual assignment",
      });

      lead.system.assignedAgent = agentId;
      lead.system.leadStatus = LeadStatus.Contacted; // Auto-update status
    }

    await lead.save();

    // Create notification for new agent
    if (agentId !== oldAgent) {
      await createNotification({
        recipient: agentId,
        type: NotificationType.LeadAssigned,
        title: "New Lead Assigned",
        message: `You have been assigned a new lead: ${
          lead.identity?.firstName || ""
        } ${lead.identity?.lastName || ""}`,
        relatedEntity: RelatedEntity.Lead,
        relatedEntityId: lead._id,
        isRead: false,
      });

      // Notify old agent if exists
      if (oldAgent) {
        await createNotification({
          recipient: oldAgent,
          type: NotificationType.LeadUnassigned,
          title: "Lead Reassigned",
          message: `Lead has been reassigned to another agent`,
          relatedEntity: RelatedEntity.Lead,
          relatedEntityId: lead._id,
          isRead: false,
        });
      }

      // Notify admin/sales manager who made the assignment
      if (req.user?.userId !== agentId) {
        await createNotification({
          recipient: req.user?.userId,
          type: NotificationType.LeadAssignmentConfirmed,
          title: "Assignment Confirmed",
          message: `Lead successfully assigned to ${agent.name}`,
          relatedEntity: RelatedEntity.Lead,
          relatedEntityId: lead._id,
          isRead: false,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Agent assigned to lead",
      data: {
        lead,
        assignedTo: agent.name,
        assignedBy: req.user?.name,
      },
    });
  } catch (error) {
    console.error("Assign agent error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
