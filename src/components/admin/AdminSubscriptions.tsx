import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { CreditCard, User, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          profiles!subscriptions_user_id_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions(data || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      toast.error('Failed to load subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (subscriptionId: string, status: 'active' | 'inactive' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ status })
        .eq('id', subscriptionId);

      if (error) throw error;

      toast.success(`Subscription status updated to ${status}`);
      loadSubscriptions();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription status');
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Subscriptions</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Total: {subscriptions.length}
          </span>
          <span className="text-sm text-gray-600">
            Active: {subscriptions.filter(s => s.status === 'active').length}
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions.map((subscription) => (
              <tr key={subscription.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {subscription.profiles?.full_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subscription.profiles?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    subscription.plan === 'enterprise'
                      ? 'bg-purple-100 text-purple-800'
                      : subscription.plan === 'professional'
                      ? 'bg-blue-100 text-blue-800'
                      : subscription.plan === 'starter'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {subscription.plan}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    subscription.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : subscription.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subscription.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    Start: {new Date(subscription.current_period_start).toLocaleDateString()}
                  </div>
                  <div>
                    End: {new Date(subscription.current_period_end).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(subscription.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {subscription.status !== 'active' && (
                      <button
                        onClick={() => handleStatusUpdate(subscription.id, 'active')}
                        className="text-green-600 hover:text-green-900"
                        title="Activate"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    {subscription.status !== 'inactive' && (
                      <button
                        onClick={() => handleStatusUpdate(subscription.id, 'inactive')}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Deactivate"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                    {subscription.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusUpdate(subscription.id, 'cancelled')}
                        className="text-red-600 hover:text-red-900"
                        title="Cancel"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedSubscription(subscription)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Manage"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Subscription Details Modal */}
      {selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Subscription Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">User</label>
                <p className="mt-1">{selectedSubscription.profiles?.full_name}</p>
                <p className="text-sm text-gray-500">{selectedSubscription.profiles?.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Plan</label>
                <p className="mt-1">{selectedSubscription.plan}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1">{selectedSubscription.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Period</label>
                <p className="mt-1">
                  From: {new Date(selectedSubscription.current_period_start).toLocaleDateString()}
                  <br />
                  To: {new Date(selectedSubscription.current_period_end).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                {selectedSubscription.status !== 'active' && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedSubscription.id, 'active');
                      setSelectedSubscription(null);
                    }}
                    className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Activate
                  </button>
                )}
                {selectedSubscription.status !== 'inactive' && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedSubscription.id, 'inactive');
                      setSelectedSubscription(null);
                    }}
                    className="px-4 py-2 text-white bg-yellow-600 rounded-lg hover:bg-yellow-700"
                  >
                    Deactivate
                  </button>
                )}
                {selectedSubscription.status !== 'cancelled' && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedSubscription.id, 'cancelled');
                      setSelectedSubscription(null);
                    }}
                    className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => setSelectedSubscription(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}