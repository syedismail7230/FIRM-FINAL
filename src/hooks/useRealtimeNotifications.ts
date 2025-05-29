import { useState, useEffect } from 'react';
import { supabase, subscribeToChannel } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export function useRealtimeNotifications(user: User) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchNotifications = async () => {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        if (mounted) {
          setNotifications(data || []);
          setUnreadCount(data?.filter(n => !n.read).length || 0);
        }
      } catch (error) {
        console.error('Error loading notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchNotifications();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToChannel(
      `notifications-${user.id}`,
      'notifications',
      (payload) => {
        const { eventType, new: newNotification } = payload;

        if (eventType === 'INSERT') {
          setNotifications(current => [newNotification, ...current]);
          setUnreadCount(count => count + 1);
        } else if (eventType === 'UPDATE') {
          setNotifications(current =>
            current.map(n =>
              n.id === newNotification.id ? newNotification : n
            )
          );
          // Update unread count
          setUnreadCount(count => 
            newNotification.read ? count - 1 : count
          );
        }
      },
      `user_id=eq.${user.id}`
    );

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, [user.id]);

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead
  };
}