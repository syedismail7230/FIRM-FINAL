/*
  # Update Admin Policies and Access Control

  1. Changes
    - Drop existing policies to avoid conflicts
    - Create new admin policies with proper access control
    - Update table policies for admin access

  2. Security
    - Enable RLS
    - Ensure proper admin access control
*/

-- First, drop existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Drop policies from notifications table
  DROP POLICY IF EXISTS "Enable all for admins" ON notifications;
  
  -- Drop policies from business_proposals table
  DROP POLICY IF EXISTS "Enable all for admins" ON business_proposals;
  
  -- Drop policies from business_interests table
  DROP POLICY IF EXISTS "Enable all for admins" ON business_interests;
  
  -- Drop admin_users policies
  DROP POLICY IF EXISTS "super_admin_full_access" ON admin_users;
  DROP POLICY IF EXISTS "users_read_own_record" ON admin_users;
END $$;

-- Create super admin user
INSERT INTO admin_users (username, password_hash)
VALUES (
  'super_admin@example.com',
  '1234567890'
)
ON CONFLICT (username) 
DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Create policies for admin access
CREATE POLICY "super_admin_full_access"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    auth.email() = 'super_admin@example.com'
  );

CREATE POLICY "users_read_own_record"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.email() = username);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_created_at ON admin_users(created_at DESC);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create new policies for other tables with unique names
CREATE POLICY "admin_full_access_notifications"
  ON notifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE username = auth.email()
    )
  );

CREATE POLICY "admin_full_access_proposals"
  ON business_proposals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE username = auth.email()
    )
  );

CREATE POLICY "admin_full_access_interests"
  ON business_interests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE username = auth.email()
    )
  );