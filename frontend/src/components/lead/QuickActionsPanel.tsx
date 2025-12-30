import React, { useState } from 'react';
import ClassifyModal from './modals/ClassifyModal';
import AssignAgentModal from './modals/AssignAgentModal';
import FollowUpModal from './modals/FollowUpModal';
import WhatsAppModal from './modals/WhatsAppModal';
import EmailModal from './modals/EmailModal';
import ProposalModal from './modals/ProposalModal';

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
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showProposalModal, setShowProposalModal] = useState(false);

  const actionButtons = [
    {
      id: 'classify',
      label: 'Classify',
      icon: '📊',
      description: 'Set lead classification',
      onClick: () => setShowClassifyModal(true),
      color: 'bg-blue-50 hover:bg-blue-100',
    },
    {
      id: 'assign',
      label: 'Assign Agent',
      icon: '👤',
      description: 'Assign to agent',
      onClick: () => setShowAssignModal(true),
      color: 'bg-purple-50 hover:bg-purple-100',
    },
    {
      id: 'followup',
      label: 'Schedule Follow-up',
      icon: '📅',
      description: 'Schedule follow-up',
      onClick: () => setShowFollowUpModal(true),
      color: 'bg-green-50 hover:bg-green-100',
    },
    {
      id: 'whatsapp',
      label: 'Send WhatsApp',
      icon: '💬',
      description: 'Send WhatsApp message',
      onClick: () => setShowWhatsAppModal(true),
      color: 'bg-emerald-50 hover:bg-emerald-100',
    },
    {
      id: 'email',
      label: 'Send Email',
      icon: '📧',
      description: 'Send email',
      onClick: () => setShowEmailModal(true),
      color: 'bg-indigo-50 hover:bg-indigo-100',
    },
    {
      id: 'proposal',
      label: 'Generate Proposal',
      icon: '📄',
      description: 'Create proposal',
      onClick: () => setShowProposalModal(true),
      color: 'bg-orange-50 hover:bg-orange-100',
    },
  ];

  return (
    <>
      <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
        <h2 className="text-lg font-bold text-foreground mb-6">Quick Actions</h2>

        <div className="space-y-3">
          {actionButtons.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`w-full p-4 rounded-lg transition text-left ${action.color}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{action.icon}</span>
                <div>
                  <div className="font-semibold text-foreground">{action.label}</div>
                  <div className="text-xs text-gray-600">{action.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Lead Info Section */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-foreground mb-4">Lead Information</h3>
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
              <div className="font-medium text-foreground text-xs">{lead._id}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
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
      {showFollowUpModal && (
        <FollowUpModal lead={lead} onClose={() => setShowFollowUpModal(false)} />
      )}
      {showWhatsAppModal && (
        <WhatsAppModal lead={lead} onClose={() => setShowWhatsAppModal(false)} />
      )}
      {showEmailModal && (
        <EmailModal lead={lead} onClose={() => setShowEmailModal(false)} />
      )}
      {showProposalModal && (
        <ProposalModal lead={lead} onClose={() => setShowProposalModal(false)} />
      )}
    </>
  );
};

export default QuickActionsPanel;
