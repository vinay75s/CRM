import React from 'react';
import { User, Phone, Mail, Tag, Wallet, UserCheck, Calendar } from 'lucide-react';

interface Lead {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  source: string;
  budgetRange?: string;
  classification: 'Cold' | 'Warm' | 'Hot' | 'Void';
  assignedAgent?: { _id: string; name: string; email: string } | string;
  createdAt: string;
}

interface LeadTabsProps {
  activeTab: 'overview' | 'tasks';
  lead: Lead;
}

const LeadTabs: React.FC<LeadTabsProps> = ({ activeTab, lead }) => {
  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-foreground mb-4">Lead Details</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <label className="text-sm text-gray-600">Full Name</label>
              <p className="text-foreground font-medium truncate">{lead.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <label className="text-sm text-gray-600">Phone</label>
              <p className="text-foreground font-medium truncate">{lead.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <label className="text-sm text-gray-600">Email</label>
              <p className="text-foreground font-medium truncate">{lead.email || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <label className="text-sm text-gray-600">Source</label>
              <p className="text-foreground font-medium truncate">{lead.source}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-foreground mb-4">Lead Status</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Classification</label>
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
              lead.classification === 'Cold' ? 'bg-blue-100 text-blue-800' :
              lead.classification === 'Warm' ? 'bg-yellow-100 text-yellow-800' :
              lead.classification === 'Hot' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {lead.classification}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Wallet className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <label className="text-sm text-gray-600">Budget Range</label>
              <p className="text-foreground font-medium truncate">{lead.budgetRange || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <UserCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <label className="text-sm text-gray-600">Assigned Agent</label>
              <p className="text-foreground font-medium truncate">
                {typeof lead.assignedAgent === 'object' 
                  ? lead.assignedAgent?.name 
                  : lead.assignedAgent || 'Unassigned'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <div className="min-w-0">
              <label className="text-sm text-gray-600">Created</label>
              <p className="text-foreground font-medium">
                {new Date(lead.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="bg-white p-4 md:p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-foreground mb-4">Tasks</h3>
      <div className="text-center py-8 md:py-12">
        <p className="text-gray-500 mb-4">No tasks created yet</p>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
          Create Task
        </button>
      </div>
    </div>
  );

  return <div>{activeTab === 'overview' ? renderOverview() : renderTasks()}</div>;
};

export default LeadTabs;
