import React, { useState } from 'react';

interface Lead {
  _id: string;
  name: string;
  phone: string;
}

interface WhatsAppModalProps {
  lead: Lead;
  onClose: () => void;
}

const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ lead, onClose }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const templates = [
    {
      id: 'greeting',
      name: 'Initial Greeting',
      text: `Hi ${lead.name},\n\nWe hope you are doing well! We would like to discuss about our properties with you.`,
    },
    {
      id: 'followup',
      name: 'Follow-up Message',
      text: `Hi ${lead.name},\n\nJust following up on our previous conversation. Would you like to schedule a call?`,
    },
    {
      id: 'property',
      name: 'Property Offer',
      text: `Hi ${lead.name},\n\nWe have found a perfect property matching your requirements. Can we schedule a viewing?`,
    },
    {
      id: 'custom',
      name: 'Custom Message',
      text: '',
    },
  ];

  const handleSelectTemplate = (template: any) => {
    setSelectedTemplate(template.id);
    setMessage(template.text);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      // TODO: Make API call to send WhatsApp message
      // const response = await fetch(`/api/leads/${lead._id}/send-whatsapp`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     message,
      //     templateId: selectedTemplate,
      //   }),
      // });

      alert(`WhatsApp message sent to ${lead.phone}`);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-lg max-h-96 overflow-y-auto">
        <h2 className="text-2xl font-bold text-foreground mb-6">Send WhatsApp Message</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className={`p-3 rounded-lg border-2 text-left transition ${
                selectedTemplate === template.id
                  ? 'border-primary bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-foreground">{template.name}</div>
              <div className="text-xs text-gray-600 mt-1 line-clamp-2">{template.text}</div>
            </button>
          ))}
        </div>

        {/* Message Editor */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-foreground mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Type or select a template..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="text-xs text-gray-500 mt-1">
            Character count: {message.length} / 1600
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs font-semibold text-gray-600 mb-2">Preview</div>
          <div className="text-sm text-foreground whitespace-pre-wrap break-words">{message || 'Message preview...'}</div>
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
            onClick={handleSend}
            disabled={!message.trim() || loading}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition"
          >
            {loading ? 'Sending...' : '💬 Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;
