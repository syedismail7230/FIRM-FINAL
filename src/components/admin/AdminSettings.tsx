import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Settings, Moon, Sun, Shield, Key, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    darkMode: false,
    twoFactorEnabled: false,
    notificationsEnabled: true,
    autoApproveUsers: false
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', user.email)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings({
          darkMode: data.dark_mode || false,
          twoFactorEnabled: !!data.two_factor_secret,
          notificationsEnabled: true,
          autoApproveUsers: false
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (setting: string, value: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');

      const updates: any = {};

      switch (setting) {
        case 'darkMode':
          updates.dark_mode = value;
          break;
        case 'twoFactorEnabled':
          // Handle 2FA setup separately
          return;
        case 'notificationsEnabled':
          // Handle notifications setting
          break;
        case 'autoApproveUsers':
          // Handle auto-approve setting
          break;
      }

      const { error } = await supabase
        .from('admin_users')
        .update(updates)
        .eq('username', user.email);

      if (error) throw error;

      setSettings(prev => ({ ...prev, [setting]: value }));
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
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
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-bold">Admin Settings</h2>
      </div>

      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
        {/* Theme Setting */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.darkMode ? (
                <Moon className="w-5 h-5 text-indigo-600" />
              ) : (
                <Sun className="w-5 h-5 text-indigo-600" />
              )}
              <div>
                <h3 className="text-lg font-medium">Dark Mode</h3>
                <p className="text-sm text-gray-500">
                  Enable dark mode for the admin interface
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.darkMode}
                onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">
                  Add an extra layer of security to your admin account
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.twoFactorEnabled}
                onChange={(e) => handleSettingChange('twoFactorEnabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <p className="text-sm text-gray-500">
                  Receive email notifications for important events
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.notificationsEnabled}
                onChange={(e) => handleSettingChange('notificationsEnabled', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Auto-Approve Users */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Key className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="text-lg font-medium">Auto-Approve Users</h3>
                <p className="text-sm text-gray-500">
                  Automatically approve new user registrations
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.autoApproveUsers}
                onChange={(e) => handleSettingChange('autoApproveUsers', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}