import { createClient } from '@supabase/supabase-js';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { toast } from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  toast.error('Configuration error. Please contact support.');
  throw new Error('Missing Supabase environment variables');
}

// Validate Supabase URL format
try {
  new URL(supabaseUrl);
} catch (e) {
  console.error(`Invalid Supabase URL format: ${supabaseUrl}`);
  toast.error('Invalid configuration. Please contact support.');
  throw new Error(`Invalid Supabase URL format: ${supabaseUrl}`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
});

// Create profile for new user
export async function createUserProfile(user: any) {
  try {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          role: user.email === 'super_admin@example.com' ? 'admin' : 'entrepreneur',
          is_approved: user.email === 'super_admin@example.com',
          first_name: user.email?.split('@')[0] || '',
          last_name: '',
          full_name: user.email?.split('@')[0] || '',
          contact_info: {
            email: user.email,
            phone: '',
            preferred_contact_method: 'email'
          }
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
        throw profileError;
      }

      // Create notification for admin
      if (user.email !== 'super_admin@example.com') {
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            title: 'New User Registration',
            message: `New user ${user.email} has registered and needs approval`,
            type: 'registration',
            data: { user_id: user.id, email: user.email }
          });

        if (notificationError) {
          console.error('Error creating notification:', notificationError);
        }
      }
    }

    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
}