import type { Request, Response } from "express";

import { Role } from "../models/User.js";
import { LeadStatus } from "../types/lead.types.js";
import { createNotification } from "./notificationController.js";
import {
  NotificationMessage,
  NotificationType,
  RelatedEntity,
} from "../models/Notification.js";
import type { AuthRequest, AuthUser } from "../middlewares/auth.js";
import { leadZodSchema, type LeadInput } from "@/types/Lead.zod.js";
import Lead from "@/models/Lead.js";
import mongoose from "mongoose";

const getAgentIdForLead = (user?: AuthUser | null): string | null => {
  if (user && user.role === Role.salesAgent) {
    return user.id;
  }
  return null;
};

export async function createLeadController(req: Request, res: Response) {
  try {
    const validationResult = leadZodSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error,
      });
    }

    const leadData: LeadInput = validationResult.data;

    // Create lead with system defaults
    const lead = new Lead({
      ...leadData,
      system: {
        leadStatus: leadData.system?.leadStatus || LeadStatus.New,
        priorityScore: leadData.system?.priorityScore || 0,
        investmentScore: leadData.system?.investmentScore || 0,
        assignedAgent: leadData.system?.assignedAgent || null,
      },
    });

    await lead.save();

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Error creating lead:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
export const updateLeadController = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID format",
      });
    }

    // Find the lead
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Check role-based access
    if (req.user?.role === Role.salesAgent) {
      // Sales agents can only update their own assigned leads
      if (!lead.system?.assignedAgent || 
          lead.system.assignedAgent.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only update leads assigned to you.",
        });
      }
    }

    // Validate the update data
    const validationResult = leadZodSchema.partial().safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.errors,
      });
    }

    const updateData = validationResult.data;

    // Define role-based field restrictions
    const restrictedFields = {
      [Role.salesAgent]: [
        // Cannot modify these fields
        "identity.firstName",
        "identity.lastName",
        "identity.email",
        "identity.phone",
        "identity.homeCountry",
        "identity.taxResidencyCountry",
        "identity.visaResidencyStatus",
        "identity.leadSource",
        "identity.ageYears",
        "identity.profession",
        "identity.householdSize",
        "identity.householdIncomeBandInr",
        "identity.priorPropertiesPurchased",
        "identity.propertyRolePrimary",
        "identity.searchTrigger",
        "identity.buyingJourneyStage",
        "identity.explorationDuration",
        "identity.purchaseTimeline",
        "system.assignedAgent",
      ],
      [Role.salesManager]: [
        // Can update all fields except system.assignedAgent
        "system.assignedAgent"
      ],
      [Role.admin]: [
        // Admin can update everything - no restrictions
      ]
    };

    // Check for restricted field updates based on role
    if (req.user?.role && restrictedFields[req.user.role]) {
      const attemptedUpdates = getNestedFieldPaths(req.body);
      const restricted = restrictedFields[req.user.role];
      
      const unauthorizedUpdates = attemptedUpdates.filter(field => 
        restricted.some(restrictedField => 
          field === restrictedField || field.startsWith(restrictedField.split('.')[0] + '.')
        )
      );

      if (unauthorizedUpdates.length > 0) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You cannot update the following fields:",
          restrictedFields: unauthorizedUpdates,
        });
      }
    }

    // Apply the updates
    const updateObject: any = {};

    // Update identity fields
    if (updateData.identity) {
      Object.entries(updateData.identity).forEach(([key, value]) => {
        updateObject[`identity.${key}`] = value;
      });
    }

    // Update location fields
    if (updateData.location) {
      Object.entries(updateData.location).forEach(([key, value]) => {
        updateObject[`location.${key}`] = value;
      });
    }

    // Update property fields
    if (updateData.property) {
      Object.entries(updateData.property).forEach(([key, value]) => {
        updateObject[`property.${key}`] = value;
      });
    }

    // Update system fields
    if (updateData.system) {
      Object.entries(updateData.system).forEach(([key, value]) => {
        updateObject[`system.${key}`] = value;
      });
    }

    // Update the lead
    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: updateObject },
      { new: true, runValidators: true }
    )
      .populate("system.assignedAgent", "name email phone")
      .lean();

    // Create audit log (optional)
    // await createAuditLog({
    //   userId: req.user?.userId,
    //   action: "UPDATE_LEAD",
    //   entityType: "Lead",
    //   entityId: id,
    //   changes: updateObject,
    //   ipAddress: req.ip,
    //   userAgent: req.get("user-agent"),
    // });

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });

  } catch (error) {
    console.error("Error updating lead:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `Duplicate value for ${field}`,
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err: any) => err.message),
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Helper function to get all nested field paths
function getNestedFieldPaths(obj: any, prefix = ""): string[] {
  const paths: string[] = [];
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const path = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        // Recursively get nested paths
        paths.push(...getNestedFieldPaths(obj[key], path));
      } else {
        paths.push(path);
      }
    }
  }
  
  return paths;
}

// Optional: Create audit log function
async function createAuditLog(data: any) {
  try {
    // Implement your audit log creation logic here
    // This could save to an AuditLog collection or external service
    console.log("Audit log:", data);
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}
export const getAllLeadsController = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      assignedAgent,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query as any;

    const filter: any = {};

    // Status filter
    if (status) {
      filter["system.leadStatus"] = status;
    }

    // Assigned agent filter
    if (assignedAgent) {
      if (mongoose.Types.ObjectId.isValid(assignedAgent as string)) {
        filter["system.assignedAgent"] = new mongoose.Types.ObjectId(
          assignedAgent as string
        );
      }
    }

    // Search filter (search across name, email, phone)
    if (search) {
      filter.$or = [
        { "identity.firstName": { $regex: search, $options: "i" } },
        { "identity.lastName": { $regex: search, $options: "i" } },
        { "identity.email": { $regex: search, $options: "i" } },
        { "identity.phone": { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const sort: any = {};
    sort[`${sortBy}`] = sortOrder === "asc" ? 1 : -1;

    const leads = await Lead.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate("system.assignedAgent", "name email")
      .lean();

    const total = await Lead.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Leads retrieved successfully",
      data: {
        leads,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching leads:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getLeadByIdController = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid lead ID format",
    });
  }
  try {
    const lead = await Lead.findById(id).populate(
      "system.assignedAgent",
      "name email"
    );

    if (!lead) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }

    if (
      req.user?.role === Role.salesAgent &&
      lead.system?.assignedAgent?.toString() !== req.user.id
    ) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    res.status(200).json({ data: lead });
  } catch (error) {
    console.error("Get lead error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteLeadController = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    const lead = await Lead.findById(id);
    if (!lead) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }

    if (
      req.user?.role === Role.salesAgent &&
      lead.system?.assignedAgent?.toString() !== req.user.id
    ) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    await Lead.findByIdAndDelete(id);

    res.status(200).json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Delete lead error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const updateLeadStatusController = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { leadStatus, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID format",
      });
    }

    if (!leadStatus || !Object.values(LeadStatus).includes(leadStatus)) {
      return res.status(400).json({
        success: false,
        message: "Valid lead status is required",
        validStatuses: Object.values(LeadStatus),
      });
    }

    // Find the lead
    const lead = await Lead.findById(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    // Check role-based access
    if (req.user?.role === Role.salesAgent) {
      // Sales agents can only update their own assigned leads
      if (!lead.system?.assignedAgent || 
          lead.system.assignedAgent.toString() !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "Access denied. You can only update leads assigned to you.",
        });
      }
    }

    // Store old status for notification
    const oldStatus = lead.system?.leadStatus || LeadStatus.New;

    // Update lead status
    lead.system.leadStatus = leadStatus;
    
    // Add status change notes if provided
    if (notes) {
      if (!lead.system.statusHistory) {
        lead.system.statusHistory = [];
      }
      
      lead.system.statusHistory.push({
        fromStatus: oldStatus,
        toStatus: leadStatus,
        changedBy: req.user?.userId,
        changedAt: new Date(),
        notes: notes
      });
    }

    await lead.save();

    // Create notification for status change
    if (lead.system?.assignedAgent && oldStatus !== leadStatus) {
      await createNotification({
        recipient: lead.system.assignedAgent,
        type: NotificationType.LeadStatusChanged,
        title: "Lead Status Updated",
        message: `Lead status changed from ${oldStatus} to ${leadStatus}`,
        relatedEntity: RelatedEntity.Lead,
        relatedEntityId: lead._id,
        isRead: false,
      });
    }

    // Create notification for admin/sales manager
    if (req.user?.role !== Role.admin && req.user?.role !== Role.salesManager) {
      // Find admin/sales manager to notify
      const admins = await User.find({ 
        role: { $in: [Role.admin, Role.salesManager] } 
      }).select("_id");

      for (const admin of admins) {
        await createNotification({
          recipient: admin._id,
          type: NotificationType.LeadStatusChanged,
          title: "Lead Status Changed by Agent",
          message: `Agent ${req.user?.name} changed lead status from ${oldStatus} to ${leadStatus}`,
          relatedEntity: RelatedEntity.Lead,
          relatedEntityId: lead._id,
          isRead: false,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      data: {
        leadId: lead._id,
        oldStatus,
        newStatus: leadStatus,
        updatedAt: lead.updatedAt,
      },
    });

  } catch (error) {
    console.error("Error updating lead status:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const assignAgentToLeadController = async (
  req: AuthRequest,
  res: Response
) => {
  const { leadId } = req.params;
  const { agentId } = req.body;

  try {
    if (!agentId) {
      res.status(400).json({ message: "Agent ID is required" });
      return;
    }

    const lead = await Lead.findById(leadId);
    if (!lead) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }

    if (req.user?.role === Role.salesAgent) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    const oldAgent = lead.system?.assignedAgent?.toString();
    if (!lead.system) {
      lead.system = { assignedAgent: agentId, leadStatus: LeadStatus.New };
    } else {
      lead.system.assignedAgent = agentId;
    }
    await lead.save();

    if (agentId !== oldAgent) {
      await createNotification({
        recipient: agentId,
        type: NotificationType.LeadAssigned,
        title: NotificationType.LeadAssigned,
        message: NotificationMessage.LeadAssigned,
        relatedEntity: RelatedEntity.Lead,
        relatedEntityId: lead._id,
        isRead: false,
      });
    }

    res.status(200).json({ message: "Agent assigned to lead", data: lead });
  } catch (error) {
    console.error("Assign agent error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const convertLeadToCustomer = async (
  req: AuthRequest,
  res: Response
) => {
  const { id } = req.params;

  try {
    const lead = await Lead.findById(id);
    if (!lead) {
      res.status(404).json({ message: "Lead not found" });
      return;
    }

    if (lead.system?.leadStatus === LeadStatus.Converted) {
      res.status(400).json({ message: "Lead already converted" });
      return;
    }

    if (!lead.system) {
      lead.system = { leadStatus: LeadStatus.Converted };
    } else {
      lead.system.leadStatus = LeadStatus.Converted;
    }
    await lead.save();

    if (lead.system?.assignedAgent) {
      await createNotification({
        recipient: lead.system.assignedAgent,
        type: NotificationType.StatusUpdate,
        title: "Lead Converted",
        message: `Lead ${lead.} ${lead.lastName} has been converted`,
        relatedEntity: RelatedEntity.Lead,
        relatedEntityId: lead._id,
        isRead: false,
      });
    }

    res
      .status(200)
      .json({ message: "Lead converted successfully", data: lead });
  } catch (error) {
    console.error("Convert lead error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
