import React from 'react';

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
  activities?: Array<any>;
}

interface LeadTabsProps {
  activeTab: 'overview' | 'history' | 'tasks' | 'documents';
  lead: Lead;
}

const LeadTabs: React.FC<LeadTabsProps> = ({ activeTab, lead }) => {
  const renderOverview = () => (
    <div className="grid grid-cols-2 gap-6">
      {/* Lead Details */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-foreground mb-4">Lead Details</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Full Name</label>
            <p className="text-foreground font-medium">{lead.name}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Phone</label>
            <p className="text-foreground font-medium">{lead.phone}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <p className="text-foreground font-medium">{lead.email || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Source</label>
            <p className="text-foreground font-medium">{lead.source}</p>
          </div>
        </div>
      </div>

      {/* Lead Status */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
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
          <div>
            <label className="text-sm text-gray-600">Budget Range</label>
            <p className="text-foreground font-medium">{lead.budgetRange || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Assigned Agent</label>
            <p className="text-foreground font-medium">
              {typeof lead.assignedAgent === 'object' 
                ? lead.assignedAgent?.name 
                : lead.assignedAgent || 'Unassigned'}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Created</label>
            <p className="text-foreground font-medium">
              {new Date(lead.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-foreground mb-4">Activity History</h3>
      <div className="space-y-4">
        {lead.activities && lead.activities.length > 0 ? (
          lead.activities.map((activity, idx) => (
            <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 last:border-b-0">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
              <div>
                <div className="font-semibold text-foreground">{activity.action}</div>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <span className="text-xs text-gray-500">
                  {new Date(activity.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No activities yet</p>
        )}
      </div>
    </div>
  );

  const renderTasks = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-foreground mb-4">Tasks</h3>
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No tasks created yet</p>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
          Create Task
        </button>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-foreground mb-4">Documents</h3>
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No documents attached</p>
        <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
          Upload Document
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'history':
        return renderHistory();
      case 'tasks':
        return renderTasks();
      case 'documents':
        return renderDocuments();
      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
};

export default LeadTabs;
