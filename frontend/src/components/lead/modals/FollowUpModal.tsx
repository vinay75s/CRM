import React, { useState } from 'react';

interface Lead {
  _id: string;
  name: string;
  phone: string;
}

interface FollowUpModalProps {
  lead: Lead;
  onClose: () => void;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({ lead, onClose }) => {
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSchedule = async () => {
    setError('');

    if (!date || !time) {
      setError('Please select date and time');
      return;
    }

    setLoading(true);
    try {
      // TODO: Make API call to schedule follow-up
      // const response = await fetch(`/api/leads/${lead._id}/schedule-followup`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     scheduledAt: `${date}T${time}`,
      //     notes,
      //   }),
      // });

      // Mock success
      alert(`Follow-up scheduled for ${date} at ${time}`);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg">
        <h2 className="text-2xl font-bold text-foreground mb-6">Schedule Follow-up</h2>

        <div className="space-y-4">
          {/* Lead Name */}
          <div>
            <label className="text-sm font-semibold text-foreground">Contact</label>
            <div className="p-2 bg-gray-50 rounded-lg text-foreground">{lead.name}</div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={today}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes for the follow-up..."
              rows={3}
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
            onClick={handleSchedule}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {loading ? 'Scheduling...' : 'Schedule'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FollowUpModal;
