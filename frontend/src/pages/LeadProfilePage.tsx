import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  Tag,
  Wallet,
  UserCheck,
  BarChart3,
  UserPlus,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";
import { leadService, type Lead } from "../services/leadService";
import { userService, type User } from "../services/userService";
import { Button } from "@/components/ui/button";

const LeadProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "tasks">("overview");
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [showClassifyModal, setShowClassifyModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [agents, setAgents] = useState<User[]>([]);
  const [selectedClassification, setSelectedClassification] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      try {
        const response = await leadService.getLeadById(id);
        setLead(response.data);
        setSelectedClassification(response.data.classification);
      } catch (error) {
        console.error("Failed to fetch lead:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  const fetchAgents = async () => {
    try {
      const response = await userService.getUsers(1, 100);
      setAgents(response.data.filter((u) => u.role === "sales_agent"));
    } catch {
      console.error("Failed to fetch agents");
    }
  };

  const handleClassify = async () => {
    if (!id || !selectedClassification) return;
    setUpdating(true);
    try {
      const response = await leadService.updateLead(id, {
        classification: selectedClassification,
      });
      setLead(response.lead || response);
      setShowClassifyModal(false);
    } catch (error) {
      console.error("Failed to classify lead:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssign = async () => {
    if (!id || !selectedAgent) return;
    setUpdating(true);
    try {
      await leadService.assignAgent(id, selectedAgent);
      const response = await leadService.getLeadById(id);
      setLead(response.data);
      setShowAssignModal(false);
    } catch (error) {
      console.error("Failed to assign agent:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getClassificationStyle = (classification: string) => {
    switch (classification) {
      case "Hot":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Warm":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Cold":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "Void":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Lead not found</p>
          <Button onClick={() => navigate("/leads")}>Back to Leads</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="p-4 md:p-6">
          <button
            onClick={() => navigate("/leads")}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Leads</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-xl md:text-2xl font-bold">{lead.name}</h1>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getClassificationStyle(lead.classification)}`}
                  >
                    {lead.classification}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {lead.phone}
                  </span>
                  {lead.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {lead.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions - Desktop */}
            <div className="hidden md:flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowClassifyModal(true);
                }}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Classify
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  fetchAgents();
                  setShowAssignModal(true);
                }}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Agent
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 md:px-6">
          <div className="flex gap-6 border-b border-gray-800">
            {(["overview", "tasks"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-1 text-sm font-medium transition relative ${
                  activeTab === tab
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        {/* Mobile Quick Actions */}
        <div className="md:hidden grid grid-cols-2 gap-3 mb-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowClassifyModal(true)}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Classify
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              fetchAgents();
              setShowAssignModal(true);
            }}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Assign
          </Button>
        </div>

        {activeTab === "overview" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lead Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-4">Lead Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium">{lead.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium">{lead.email || "Not provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Source</p>
                      <p className="font-medium">{lead.source}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <Wallet className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Budget Range</p>
                      <p className="font-medium">{lead.budgetRange || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <UserCheck className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Assigned Agent</p>
                      <p className="font-medium">
                        {typeof lead.assignedAgent === "object"
                          ? lead.assignedAgent?.name
                          : "Unassigned"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Created</p>
                      <p className="font-medium">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-4">Status</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Classification</p>
                    <span
                      className={`inline-block px-4 py-2 rounded-lg text-sm font-medium border ${getClassificationStyle(lead.classification)}`}
                    >
                      {lead.classification}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Conversion Status</p>
                    <div className="flex items-center gap-2">
                      {lead.isConverted ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <span className="text-green-400">Converted</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-yellow-400" />
                          <span className="text-yellow-400">In Progress</span>
                        </>
                      )}
                    </div>
                  </div>
                  {lead.isDuplicate && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Duplicate</p>
                      <span className="text-yellow-400 text-sm">
                        Duplicate detected ({lead.duplicateTag})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tasks</h3>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-gray-600" />
              </div>
              <p className="text-gray-400 mb-2">No tasks yet</p>
              <p className="text-sm text-gray-500">
                Create a task to track follow-ups and activities
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Classify Modal */}
      {showClassifyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Classify Lead</h2>
            <div className="space-y-2 mb-6">
              {["Cold", "Warm", "Hot", "Void"].map((cls) => (
                <button
                  key={cls}
                  onClick={() => setSelectedClassification(cls)}
                  className={`w-full p-3 rounded-lg border text-left transition ${
                    selectedClassification === cls
                      ? getClassificationStyle(cls) + " border-2"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowClassifyModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleClassify}
                disabled={updating}
              >
                {updating ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Agent Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Assign Agent</h2>
            <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
              {agents.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No agents available</p>
              ) : (
                agents.map((agent) => (
                  <button
                    key={agent._id}
                    onClick={() => setSelectedAgent(agent._id)}
                    className={`w-full p-3 rounded-lg border text-left transition ${
                      selectedAgent === agent._id
                        ? "border-blue-500 bg-blue-500/20"
                        : "border-gray-700 hover:border-gray-600"
                    }`}
                  >
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-gray-400">{agent.email}</p>
                  </button>
                ))
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowAssignModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleAssign}
                disabled={updating || !selectedAgent}
              >
                {updating ? "Assigning..." : "Assign"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadProfilePage;
