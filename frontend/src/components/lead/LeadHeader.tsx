import React from 'react';

 
enum VoidReason {
  BudgetMismatch = "BUDGET_MISMATCH",
  LocationIssue = "LOCATION_ISSUE",
  JunkLead = "JUNK_LEAD",
  NotInterested = "NOT_INTERESTED",
  Other = "OTHER"
}
interface Lead {
  _id: string;
  name: string;
  phone: string;
  classification: 'Cold' | 'Warm' | 'Hot' | 'Void';
  lastContactedAt?: string;
}

interface LeadHeaderProps {
  lead: Lead;
  setLead: (lead: any) => void;
}

const LeadHeader: React.FC<LeadHeaderProps> = ({ lead }) => {
  const getStatusBadgeColor = (classification: string) => {
    switch (classification) {
      case 'Cold':
        return 'bg-blue-100 text-blue-800';
      case 'Warm':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hot':
        return 'bg-red-100 text-red-800';
      case 'Void':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Lead Avatar */}
          <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
            {lead.name.charAt(0).toUpperCase()}
          </div>

          {/* Lead Info */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{lead.name}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(lead.classification)}`}>
                {lead.classification}
              </span>
            </div>

            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span>📞 {lead.phone}</span>
              <span>•</span>
              <span className="text-xs">Last contacted: {formatDate(lead.lastContactedAt)}</span>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button className="px-4 py-2 text-foreground hover:bg-gray-100 rounded-lg transition">
          ← Back to Leads
        </button>
      </div>
    </div>
  );
};

export default LeadHeader;
