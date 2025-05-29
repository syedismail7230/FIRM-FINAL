import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { User, CheckCircle, XCircle, MoreVertical, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all profiles with their subscription info
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          *,
          subscriptions (
            plan,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw new Error('Failed to load user profiles');
      }

      setUsers(profiles || []);
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast.error(error.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (userId: string, approve: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_approved: approve,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success(`User ${approve ? 'approved' : 'unapproved'} successfully`);
      loadUsers(); // Reload the users list
    } catch (error) {
      console.error('Error updating user approval:', error);
      toast.error('Failed to update user approval status');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete user profile (this will cascade to other tables)
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;

      toast.success('User deleted successfully');
      loadUsers(); // Reload the users list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const pendingUsers = users.filter(u => !u.is_approved).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Total Users: {users.length}
          </span>
          {pendingUsers > 0 && (
            <span className="text-sm font-medium text-yellow-600">
              Pending Approval: {pendingUsers}
            </span>
          )}
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
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {user.avatar_url ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={user.avatar_url}
                          alt={user.full_name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-indigo-600" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'No Name'}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.role === 'admin' ? (
                      <Shield className="w-4 h-4 text-indigo-600 mr-1" />
                    ) : null}
                    <span className="text-sm text-gray-900">{user.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.is_approved
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.subscriptions?.[0]?.status === 'active'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.subscriptions?.[0]?.plan || 'No Plan'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    {user.is_approved ? (
                      <button
                        onClick={() => handleApproval(user.id, false)}
                        className="text-red-600 hover:text-red-900"
                        title="Revoke approval"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApproval(user.id, true)}
                        className="text-green-600 hover:text-green-900"
                        title="Approve user"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-gray-400 hover:text-gray-500"
                      title="More options"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">User Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1">{selectedUser.full_name || `${selectedUser.first_name || ''} ${selectedUser.last_name || ''}`.trim() || 'No Name'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1">{selectedUser.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1">{selectedUser.role}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1">{selectedUser.is_approved ? 'Approved' : 'Pending'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subscription</label>
                <p className="mt-1">
                  {selectedUser.subscriptions?.[0]?.plan || 'No Plan'} ({selectedUser.subscriptions?.[0]?.status || 'inactive'})
                </p>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => handleDelete(selectedUser.id)}
                  className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete User
                </button>
                <button
                  onClick={() => setSelectedUser(null)}
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