import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadService } from '../services/leadService';
import { userService } from '../services/userService';

interface Stats {
  totalLeads: number;
  totalUsers: number;
  hotLeads: number;
  coldLeads: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    totalUsers: 0,
    hotLeads: 0,
    coldLeads: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [leadsRes, usersRes] = await Promise.all([
          leadService.getLeads(1, 100),
          userService.getUsers(1, 100),
        ]);

        const leads = leadsRes.data;
        setStats({
          totalLeads: leadsRes.pagination.total,
          totalUsers: usersRes.pagination.total,
          hotLeads: leads.filter((l) => l.classification === 'Hot').length,
          coldLeads: leads.filter((l) => l.classification === 'Cold').length,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: '📋',
      color: 'bg-blue-500/20 text-blue-400',
      link: '/leads',
    },
    {
      title: 'Hot Leads',
      value: stats.hotLeads,
      icon: '🔥',
      color: 'bg-red-500/20 text-red-400',
      link: '/leads',
    },
    {
      title: 'Cold Leads',
      value: stats.coldLeads,
      icon: '❄️',
      color: 'bg-cyan-500/20 text-cyan-400',
      link: '/leads',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-purple-500/20 text-purple-400',
      link: '/users',
    },
  ];

  return (
    <div className="p-6 text-white bg-background min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome to Avacasa CRM</p>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card) => (
              <div
                key={card.title}
                onClick={() => navigate(card.link)}
                className="bg-gray-900 border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-gray-600 transition"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{card.icon}</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${card.color}`}>
                    {card.value}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-300">{card.title}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/leads')}
                  className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📋</span>
                    <div>
                      <div className="font-medium">View All Leads</div>
                      <div className="text-sm text-gray-400">Manage your leads</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => navigate('/users')}
                  className="w-full p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👥</span>
                    <div>
                      <div className="font-medium">Manage Users</div>
                      <div className="text-sm text-gray-400">Add or edit users</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Overview</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Active Leads</span>
                  <span className="font-medium">{stats.totalLeads}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Team Members</span>
                  <span className="font-medium">{stats.totalUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Hot Leads Rate</span>
                  <span className="font-medium">
                    {stats.totalLeads > 0
                      ? Math.round((stats.hotLeads / stats.totalLeads) * 100)
                      : 0}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
