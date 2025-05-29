import React from 'react';
import { Bell, Settings, LogOut, User } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

interface AdminHeaderProps {
  user: any;
  onSignOut: () => void;
}

export function AdminHeader({ user, onSignOut }: AdminHeaderProps) {
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      onSignOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-indigo-600">Admin Portal</span>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500">
              <Bell className="h-6 w-6" />
            </button>
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500">
              <Settings className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <div className="flex items-center">
                <button className="p-2 rounded-md text-gray-400 hover:text-gray-500">
                  <User className="h-6 w-6" />
                </button>
                <button
                  onClick={handleSignOut}
                  className="ml-2 p-2 rounded-md text-gray-400 hover:text-gray-500"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}