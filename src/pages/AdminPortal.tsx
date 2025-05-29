import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminHeader } from '../components/admin/AdminHeader';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminUsers } from '../components/admin/AdminUsers';
import { AdminProposals } from '../components/admin/AdminProposals';
import { AdminSubscriptions } from '../components/admin/AdminSubscriptions';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminNotifications } from '../components/admin/AdminNotifications';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AdminPortalProps {
  user: {
    email: string;
  };
}

export function AdminPortal({ user }: AdminPortalProps) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAccess();
  }, [user.email]);

  const checkAdminAccess = async () => {
    try {
      if (!user.email) {
        throw new Error('No user email found');
      }

      // Check if user exists in admin_users table
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('username')
        .eq('username', user.email)
        .maybeSingle();

      if (adminError) throw adminError;

      if (!adminData) {
        toast.error('Access denied. This account does not have administrator privileges.');
        navigate('/');
        return;
      }

      // Set admin status to true since we found the user in admin_users
      setIsAdmin(true);
    } catch (error: any) {
      console.error('Error checking admin access:', error);
      toast.error(error.message);
      setIsAdmin(false);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader user={user} onSignOut={handleSignOut} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col space-y-6">
          {/* Tab Navigation */}
          <nav className="flex space-x-4">
            {['dashboard', 'users', 'proposals', 'subscriptions', 'notifications', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          <div className="bg-white rounded-lg shadow p-6">
            {activeTab === 'dashboard' && <AdminDashboard />}
            {activeTab === 'users' && <AdminUsers />}
            {activeTab === 'proposals' && <AdminProposals />}
            {activeTab === 'subscriptions' && <AdminSubscriptions />}
            {activeTab === 'notifications' && <AdminNotifications />}
            {activeTab === 'settings' && <AdminSettings />}
          </div>
        </div>
      </div>
    </div>
  );
}