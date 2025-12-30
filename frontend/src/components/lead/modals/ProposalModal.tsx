import React, { useState } from 'react';

interface Lead {
  _id: string;
  name: string;
}

interface ProposalModalProps {
  lead: Lead;
  onClose: () => void;
}

const ProposalModal: React.FC<ProposalModalProps> = ({ lead, onClose }) => {
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Mock properties data
  const properties = [
    {
      id: 'prop1',
      name: '3 BHK Apartment - Downtown',
      price: '75L',
      area: '1500 sqft',
    },
    {
      id: 'prop2',
      name: '4 BHK Villa - Suburb',
      price: '1.2Cr',
      area: '2500 sqft',
    },
    {
      id: 'prop3',
      name: '2 BHK Flat - City Center',
      price: '50L',
      area: '1000 sqft',
    },
    {
      id: 'prop4',
      name: '5 BHK Independent House',
      price: '2Cr',
      area: '3500 sqft',
    },
  ];

  const handleToggleProperty = (propId: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propId) ? prev.filter((p) => p !== propId) : [...prev, propId]
    );
  };

  const handleGenerate = async () => {
    if (selectedProperties.length === 0) {
      alert('Please select at least one property');
      return;
    }

    setLoading(true);
    try {
      // TODO: Make API call to generate proposal
      // const response = await fetch(`/api/leads/${lead._id}/generate-proposal`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     propertyIds: selectedProperties,
      //   }),
      // });

      alert(`Proposal generated with ${selectedProperties.length} property(ies)`);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full shadow-lg max-h-96 overflow-y-auto">
        <h2 className="text-2xl font-bold text-foreground mb-2">Generate Proposal</h2>
        <p className="text-gray-600 text-sm mb-6">Select properties to include in the proposal for {lead.name}</p>

        {/* Properties List */}
        <div className="space-y-3 mb-6">
          {properties.map((property) => (
            <label
              key={property.id}
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
            >
              <input
                type="checkbox"
                checked={selectedProperties.includes(property.id)}
                onChange={() => handleToggleProperty(property.id)}
                className="w-4 h-4 text-primary rounded"
              />
              <div className="ml-4 flex-1">
                <div className="font-semibold text-foreground">{property.name}</div>
                <div className="text-xs text-gray-600 mt-1">
                  💰 {property.price} • 📐 {property.area}
                </div>
              </div>
              <input
                type="checkbox"
                checked={selectedProperties.includes(property.id)}
                readOnly
                className="w-4 h-4 text-primary rounded"
              />
            </label>
          ))}
        </div>

        {/* Selection Summary */}
        {selectedProperties.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm font-semibold text-blue-900">
              {selectedProperties.length} property(ies) selected
            </div>
            <div className="text-xs text-blue-800 mt-1">
              {selectedProperties
                .map((id) => properties.find((p) => p.id === id)?.name)
                .filter(Boolean)
                .join(', ')}
            </div>
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
            onClick={handleGenerate}
            disabled={selectedProperties.length === 0 || loading}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition"
          >
            {loading ? 'Generating...' : '📄 Generate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalModal;
