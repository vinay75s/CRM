import React, { useState } from 'react';

interface Lead {
  _id: string;
  name: string;
  phone: string;
}

interface AssignAgentModalProps {
  lead: Lead;
  setLead: (lead: any) => void;
  onClose: () => void;
}

const AssignAgentModal: React.FC<AssignAgentModalProps> = ({ lead, setLead, onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Mock agents data
  const mockAgents = [
    { _id: 'agent1', name: 'John Smith', email: 'john@example.com', leadsCount: 5 },
    { _id: 'agent2', name: 'Sarah Johnson', email: 'sarah@example.com', leadsCount: 3 },
    { _id: 'agent3', name: 'Mike Davis', email: 'mike@example.com', leadsCount: 8 },
    { _id: 'agent4', name: 'Emma Wilson', email: 'emma@example.com', leadsCount: 2 },
  ];

  const filteredAgents = mockAgents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = async () => {
    if (!selectedAgent) return;

    setLoading(true);
    try {
      // TODO: Make API call to assign lead
      // const response = await fetch(`/api/leads/${lead._id}/assign`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ agentId: selectedAgent }),
      // });
      // const updated = await response.json();
      // setLead(updated.lead);

      const agent = mockAgents.find((a) => a._id === selectedAgent);
      setLead({
        ...lead,
        assignedAgent: agent?.name,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
        <h2 className="text-2xl font-bold text-foreground mb-6">Assign to Agent</h2>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search agents by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Agent List */}
        <div className="mb-6 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent) => (
              <button
                key={agent._id}
                onClick={() => setSelectedAgent(agent._id)}
                className={`w-full p-3 text-left border-b border-gray-100 last:border-b-0 transition ${
                  selectedAgent === agent._id
                    ? 'bg-blue-50 border-l-4 border-primary'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-foreground">{agent.name}</div>
                <div className="text-xs text-gray-600">{agent.email}</div>
                <div className="text-xs text-gray-500 mt-1">📊 {agent.leadsCount} leads assigned</div>
              </button>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No agents found</div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={!selectedAgent || loading}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignAgentModal;
