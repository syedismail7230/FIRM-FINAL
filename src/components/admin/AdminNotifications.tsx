import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Bell, CheckCircle, Trash2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter === 'unread') {
        query = query.eq('read', false);
      } else if (filter === 'read') {
        query = query.eq('read', true);
      }

      const { data, error } = await query;

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.filter(n => n.id !== notificationId)
      );
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
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
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-bold">Notifications</h2>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
            className="rounded-lg border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <button
            onClick={loadNotifications}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Mark all as read
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No notifications found
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 ${notification.read ? 'bg-white' : 'bg-indigo-50'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {notification.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 text-green-600 hover:text-green-900"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {notification.data && Object.keys(notification.data).length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <pre className="text-xs text-gray-600 overflow-auto">
                    {JSON.stringify(notification.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}