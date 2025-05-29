import { useState, useEffect } from 'react';
import { initializePresence } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useRealtimePresence(user: User) {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, any>>({});

  useEffect(() => {
    const presenceChannel = initializePresence(user.id);

    presenceChannel.on('presence', { event: 'sync' }, () => {
      const state = presenceChannel.presenceState();
      setOnlineUsers(state);
    });

    return () => {
      presenceChannel.unsubscribe();
    };
  }, [user.id]);

  return onlineUsers;
}