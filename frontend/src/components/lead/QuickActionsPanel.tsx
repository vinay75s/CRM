import React, { useState } from 'react';
import { BarChart3, UserPlus } from 'lucide-react';
import ClassifyModal from './modals/ClassifyModal';
import AssignAgentModal from './modals/AssignAgentModal';

interface Lead {
  _id: string;
  name: string;
  phone: string;
  classification: 'Cold' | 'Warm' | 'Hot' | 'Void';
}

interface QuickActionsPanelProps {
  lead: Lead;
  setLead: (lead: any) => void;
}

const QuickActionsPanel: React.FC<QuickActionsPanelProps> = ({ lead, setLead }) => {
  const [showClassifyModal, setShowClassifyModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const actionButtons = [
    {
      id: 'classify',
      label: 'Classify',
      icon: BarChart3,
      description: 'Set lead classification',
      onClick: () => setShowClassifyModal(true),
      color: 'bg-blue-50 hover:bg-blue-100',
    },
    {
      id: 'assign',
      label: 'Assign Agent',
      icon: UserPlus,
      description: 'Assign to agent',
      onClick: () => setShowAssignModal(true),
      color: 'bg-purple-50 hover:bg-purple-100',
    },
  ];

  return (
    <>
      <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-4 md:p-6 overflow-y-auto">
        <h2 className="text-lg font-bold text-foreground mb-4 md:mb-6">Quick Actions</h2>

        <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
          {actionButtons.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={action.onClick}
                className={`w-full p-3 md:p-4 rounded-lg transition text-left ${action.color}`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground text-sm md:text-base">{action.label}</div>
                    <div className="text-xs text-gray-600 hidden md:block">{action.description}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-foreground mb-3 md:mb-4">Lead Information</h3>
          <div className="space-y-3 text-sm">
            <div>
              <div className="text-gray-600">Status</div>
              <div className="font-medium text-foreground">{lead.classification}</div>
            </div>
            <div>
              <div className="text-gray-600">Phone</div>
              <div className="font-medium text-foreground">{lead.phone}</div>
            </div>
            <div>
              <div className="text-gray-600">Lead ID</div>
              <div className="font-medium text-foreground text-xs break-all">{lead._id}</div>
            </div>
          </div>
        </div>
      </div>

      {showClassifyModal && (
        <ClassifyModal
          lead={lead}
          setLead={setLead}
          onClose={() => setShowClassifyModal(false)}
        />
      )}
      {showAssignModal && (
        <AssignAgentModal
          lead={lead}
          setLead={setLead}
          onClose={() => setShowAssignModal(false)}
        />
      )}
    </>
  );
};

export default QuickActionsPanel;
