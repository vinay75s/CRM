import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { leadService, type Lead } from '../services/leadService';
import LeadTabs from '../components/lead/LeadTabs';
import QuickActionsPanel from '../components/lead/QuickActionsPanel';
import LeadHeader from '../components/lead/LeadHeader';

const LeadProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'tasks' | 'documents'>('overview');
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      try {
        const response = await leadService.getLeadById(id);
        setLead(response.data);
      } catch (error) {
        console.error('Failed to fetch lead:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!lead) {
    return <div className="p-8 text-center">Lead not found</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-background text-white">
      
      {/* Header */}
      <LeadHeader lead={lead} setLead={setLead} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Tabs Navigation */}
            <div className="flex gap-6 border-b border-gray-200 mb-6">
              {(['overview', 'history', 'tasks', 'documents'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-2 font-medium transition ${
                    activeTab === tab
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-gray-600 hover:text-foreground'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <LeadTabs activeTab={activeTab} lead={lead} />
          </div>
        </div>

        {/* Right Sidebar - Quick Actions */}
        <QuickActionsPanel lead={lead} setLead={setLead} />
      </div>
    </div>
  );
};

export default LeadProfilePage;
