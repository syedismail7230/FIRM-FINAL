import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart, Users, Building2, Bell, TrendingUp, DollarSign } from 'lucide-react';
import {
  BarChart as Chart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProposals: 0,
    pendingProposals: 0,
    totalRevenue: 0,
    activeSubscriptions: 0
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);
  const [proposalDistributionData, setProposalDistributionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch user stats
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, is_approved, created_at');

      if (usersError) throw usersError;

      // Fetch proposal stats
      const { data: proposals, error: proposalsError } = await supabase
        .from('business_proposals')
        .select('id, status, type, created_at');

      if (proposalsError) throw proposalsError;

      // Fetch subscription stats
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('id, status, plan');

      if (subscriptionsError) throw subscriptionsError;

      // Calculate stats
      const activeUsers = users?.filter(u => u.is_approved).length || 0;
      const pendingProposals = proposals?.filter(p => p.status === 'pending').length || 0;
      const activeSubscriptionCount = subscriptions?.filter(s => s.status === 'active').length || 0;
      const totalRevenue = subscriptions?.reduce((sum, sub) => {
        const planPrices = {
          'free': 0,
          'starter': 999,
          'professional': 2499,
          'enterprise': 4999
        };
        return sum + (planPrices[sub.plan as keyof typeof planPrices] || 0);
      }, 0) || 0;

      setStats({
        totalUsers: users?.length || 0,
        activeUsers,
        totalProposals: proposals?.length || 0,
        pendingProposals,
        totalRevenue,
        activeSubscriptions: activeSubscriptionCount
      });

      // Process user growth data
      const usersByMonth = users?.reduce((acc: { [key: string]: number }, user) => {
        const date = new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {}) || {};

      const userGrowth = Object.entries(usersByMonth).map(([date, count]) => ({
        date,
        count
      })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      setUserGrowthData(userGrowth);

      // Process proposal distribution data
      const proposalsByType = proposals?.reduce((acc: { [key: string]: number }, proposal) => {
        acc[proposal.type] = (acc[proposal.type] || 0) + 1;
        return acc;
      }, {}) || {};

      const proposalDistribution = Object.entries(proposalsByType).map(([name, value]) => ({
        name,
        value
      }));

      setProposalDistributionData(proposalDistribution);

      // Fetch recent activity
      const { data: activity, error: activityError } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (activityError) throw activityError;
      setRecentActivity(activity || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Users</p>
              <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
            </div>
            <Users className="w-8 h-8 text-indigo-600" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {stats.activeUsers} active users
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Business Proposals</p>
              <h3 className="text-2xl font-bold">{stats.totalProposals}</h3>
            </div>
            <Building2 className="w-8 h-8 text-indigo-600" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {stats.pendingProposals} pending approval
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <DollarSign className="w-8 h-8 text-indigo-600" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {stats.activeSubscriptions} active subscriptions
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" name="Users" stroke="#4f46e5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Proposal Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <Chart data={proposalDistributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Proposals" fill="#4f46e5" />
              </Chart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Bell className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-medium">{activity.title}</h4>
                <p className="text-sm text-gray-600">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}