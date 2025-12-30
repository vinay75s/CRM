import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { leadService, type Lead } from "../../services/leadService";
import { userService, type User } from "../../services/userService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAGE_SIZE = 10;

const LeadsPage: React.FC = () => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [agents, setAgents] = useState<User[]>([]);
  const [createForm, setCreateForm] = useState({
    name: "",
    phone: "",
    email: "",
    source: "Portal" as string,
    budgetRange: "" as string,
    assignedAgent: "" as string,
  });
  const [createLoading, setCreateLoading] = useState(false);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await leadService.getLeads(page, PAGE_SIZE, search);
      setLeads(response.data);
      setTotalPages(response.pagination.totalPages);
      setTotal(response.pagination.total);
    } catch {
      setError("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  const fetchAgents = useCallback(async () => {
    try {
      const response = await userService.getUsers(1, 100);
      setAgents(response.data.filter((u) => u.role === "sales_agent"));
    } catch {
      console.error("Failed to fetch agents");
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    if (showCreateModal) {
      fetchAgents();
    }
  }, [showCreateModal, fetchAgents]);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);
    setError(null);
    try {
      await leadService.createLead({
        name: createForm.name,
        phone: createForm.phone,
        email: createForm.email || undefined,
        source: createForm.source || undefined,
        budgetRange: createForm.budgetRange || undefined,
        assignedAgent: createForm.assignedAgent || undefined,
      });
      setShowCreateModal(false);
      setCreateForm({
        name: "",
        phone: "",
        email: "",
        source: "Portal",
        budgetRange: "",
        assignedAgent: "",
      });
      fetchLeads();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create lead");
    } finally {
      setCreateLoading(false);
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "Hot":
        return "bg-red-500/20 text-red-400";
      case "Warm":
        return "bg-orange-500/20 text-orange-400";
      case "Cold":
        return "bg-blue-500/20 text-blue-400";
      case "Void":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="p-4 md:p-6 text-white bg-background min-h-screen w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">Leads</h1>
          <p className="text-gray-400 text-sm mt-1">{total} total leads</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search leads..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pl-9 bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <Button onClick={handleSearch} variant="secondary" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded text-red-400">
          {error}
        </div>
      )}

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="p-6 text-center text-gray-400">Loading...</div>
        ) : leads.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No leads found</div>
        ) : (
          leads.map((lead) => (
            <div
              key={lead._id}
              onClick={() => navigate(`/leads/${lead._id}`)}
              className="bg-gray-900 border border-gray-700 rounded-lg p-4 cursor-pointer active:bg-gray-800"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{lead.name}</h3>
                  <p className="text-sm text-gray-400">{lead.phone}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs ${getClassificationColor(lead.classification)}`}
                >
                  {lead.classification}
                </span>
              </div>
              <div className="flex justify-between items-center mt-3 text-sm">
                <span className="text-gray-400">{lead.source}</span>
                <span className="text-gray-400">
                  {lead.assignedAgent?.name || "Unassigned"}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto rounded border border-gray-700">
        <table className="w-full text-left">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Email</th>
              <th className="p-3">Classification</th>
              <th className="p-3">Source</th>
              <th className="p-3">Assigned Agent</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-400">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-t border-gray-700 hover:bg-gray-800 cursor-pointer"
                  onClick={() => navigate(`/leads/${lead._id}`)}
                >
                  <td className="p-3 font-medium">{lead.name}</td>
                  <td className="p-3">{lead.phone}</td>
                  <td className="p-3">{lead.email || "-"}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getClassificationColor(lead.classification)}`}
                    >
                      {lead.classification}
                    </span>
                  </td>
                  <td className="p-3">{lead.source}</td>
                  <td className="p-3">{lead.assignedAgent?.name || "-"}</td>
                  <td className="p-3">
                    {lead.isConverted ? (
                      <span className="px-2 py-1 rounded text-xs bg-green-500/20 text-green-400">
                        Converted
                      </span>
                    ) : lead.isDuplicate ? (
                      <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">
                        Duplicate
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                        Active
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center md:justify-end items-center gap-3 mt-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-gray-400">
            {page} / {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Create Lead</h2>
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name *</label>
                <Input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Phone *</label>
                <Input
                  type="text"
                  required
                  value={createForm.phone}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, phone: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <Input
                  type="email"
                  value={createForm.email}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, email: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Source</label>
                <select
                  value={createForm.source}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, source: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none text-white"
                >
                  <option value="Portal">Portal</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Social">Social</option>
                  <option value="Walk-in">Walk-in</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Budget Range</label>
                <select
                  value={createForm.budgetRange}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, budgetRange: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none text-white"
                >
                  <option value="">Select budget</option>
                  <option value="<50L">Below 50L</option>
                  <option value="50-75L">50-75L</option>
                  <option value="75L-1Cr">75L-1Cr</option>
                  <option value="1Cr+">Above 1Cr</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Assign to Agent</label>
                <select
                  value={createForm.assignedAgent}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, assignedAgent: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none text-white"
                >
                  <option value="">Auto-assign</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? "Creating..." : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsPage;
