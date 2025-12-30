import React, { useState } from 'react';

interface Lead {
  _id: string;
  name: string;
}

interface EmailModalProps {
  lead: Lead;
  onClose: () => void;
}

const EmailModal: React.FC<EmailModalProps> = ({ lead, onClose }) => {
  const [to, setTo] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [cc, setCc] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const emailTemplates = [
    {
      name: 'Initial Inquiry',
      subject: `Property Inquiry - ${lead.name}`,
      body: `Dear ${lead.name},\n\nThank you for your interest in our properties. We would like to help you find the perfect home.\n\nBest regards`,
    },
    {
      name: 'Follow-up',
      subject: `Follow-up: Your Property Interest`,
      body: `Dear ${lead.name},\n\nFollowing up on your recent inquiry. Do you have any questions?\n\nBest regards`,
    },
    {
      name: 'Proposal',
      subject: `Property Proposal for You`,
      body: `Dear ${lead.name},\n\nPlease find attached our proposal for the properties matching your requirements.\n\nBest regards`,
    },
  ];

  const handleSend = async () => {
    setError('');

    if (!to.trim()) {
      setError('Email address is required');
      return;
    }

    if (!subject.trim()) {
      setError('Subject is required');
      return;
    }

    setLoading(true);
    try {
      // TODO: Make API call to send email
      // const response = await fetch(`/api/leads/${lead._id}/send-email`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     to,
      //     subject,
      //     body,
      //     cc: cc || undefined,
      //   }),
      // });

      alert(`Email sent to ${to}`);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-lg max-h-96 overflow-y-auto">
        <h2 className="text-2xl font-bold text-foreground mb-6">Send Email</h2>

        {/* Templates */}
        <div className="mb-6">
          <label className="text-sm font-semibold text-foreground block mb-2">Quick Templates</label>
          <div className="flex gap-2">
            {emailTemplates.map((template) => (
              <button
                key={template.name}
                onClick={() => {
                  setSubject(template.subject);
                  setBody(template.body);
                }}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-foreground rounded transition"
              >
                {template.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* To */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              To <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* CC */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">CC</label>
            <input
              type="email"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="Optional"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Email body"
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {loading ? 'Sending...' : '📧 Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
