import React, { useState } from 'react';

interface Lead {
  _id: string;
  name: string;
  classification: 'Cold' | 'Warm' | 'Hot' | 'Void';
}

interface ClassifyModalProps {
  lead: Lead;
  setLead: (lead: any) => void;
  onClose: () => void;
}

const ClassifyModal: React.FC<ClassifyModalProps> = ({ lead, setLead, onClose }) => {
  const [classification, setClassification] = useState<'Cold' | 'Warm' | 'Hot' | 'Void'>(lead.classification);
  const [voidReason, setVoidReason] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const classifications: Array<'Cold' | 'Warm' | 'Hot' | 'Void'> = ['Cold', 'Warm', 'Hot', 'Void'];
  const voidReasons = [
    'Budget mismatch',
    'Location issue',
    'Junk lead',
    'Not interested',
    'Other',
  ];

  const handleClassify = async () => {
    setError('');

    // Validation
    if (classification === 'Void' && !voidReason) {
      setError('Please select a void reason');
      return;
    }

    if (classification === 'Void' && voidReason === 'Other' && !customReason.trim()) {
      setError('Please enter a custom reason');
      return;
    }

    setLoading(true);

    try {
      // TODO: Make API call to classify lead
      // const response = await fetch(`/api/leads/${lead._id}/classify`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     classification,
      //     voidReason: classification === 'Void' ? voidReason : undefined,
      //     customVoidReason: classification === 'Void' && voidReason === 'Other' ? customReason : undefined,
      //   }),
      // });
      // const updated = await response.json();
      // setLead(updated.lead);

      // Mock success
      setLead({
        ...lead,
        classification,
        voidReason: classification === 'Void' ? voidReason : undefined,
      });

      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
        <h2 className="text-2xl font-bold text-foreground mb-6">Classify Lead</h2>

        {/* Classification Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-3">
            Select Classification
          </label>
          <div className="grid grid-cols-2 gap-3">
            {classifications.map((cls) => (
              <button
                key={cls}
                onClick={() => {
                  setClassification(cls);
                  if (cls !== 'Void') setVoidReason('');
                }}
                className={`p-3 rounded-lg font-medium transition ${
                  classification === cls
                    ? cls === 'Cold'
                      ? 'bg-blue-500 text-white'
                      : cls === 'Warm'
                      ? 'bg-yellow-500 text-white'
                      : cls === 'Hot'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-500 text-white'
                    : 'bg-gray-100 text-foreground hover:bg-gray-200'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Void Reason (Conditional) */}
        {classification === 'Void' && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <label className="block text-sm font-semibold text-foreground mb-3">
              Reason for Void <span className="text-red-500">*</span>
            </label>
            <select
              value={voidReason}
              onChange={(e) => {
                setVoidReason(e.target.value);
                if (e.target.value !== 'Other') setCustomReason('');
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a reason</option>
              {voidReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>

            {/* Custom Reason (Conditional) */}
            {voidReason === 'Other' && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Custom Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Please explain the reason for voiding this lead"
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-foreground rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleClassify}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {loading ? 'Updating...' : 'Classify'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassifyModal;
