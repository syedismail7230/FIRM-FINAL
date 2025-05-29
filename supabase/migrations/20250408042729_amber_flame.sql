/*
  # Fix admin policies and access control

  1. Changes
    - Drop existing policies
    - Create admin_users table if not exists
    - Set up super admin user
    - Create new policies with unique names
    - Add indexes for performance

  2. Security
    - Enable RLS
    - Add proper admin access policies
*/

-- First, drop existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Drop policies from notifications table
  DROP POLICY IF EXISTS "admin_full_access_notifications" ON notifications;
  
  -- Drop policies from business_proposals table
  DROP POLICY IF EXISTS "admin_full_access_proposals" ON business_proposals;
  
  -- Drop policies from business_interests table
  DROP POLICY IF EXISTS "admin_full_access_interests" ON business_interests;
  
  -- Drop admin_users policies
  DROP POLICY IF EXISTS "super_admin_full_access" ON admin_users;
  DROP POLICY IF EXISTS "users_read_own_record" ON admin_users;
END $$;

-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_created_at ON admin_users(created_at DESC);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create super admin user
INSERT INTO admin_users (username, password_hash)
VALUES (
  'super_admin@example.com',
  '1234567890'
)
ON CONFLICT (username) 
DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Create policies for admin access with unique names
CREATE POLICY "admin_users_super_admin_access"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    auth.email() = 'super_admin@example.com'
  );

CREATE POLICY "admin_users_read_own"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (auth.email() = username);

-- Create policies for other tables with unique names
CREATE POLICY "notifications_admin_access"
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

CREATE POLICY "business_proposals_admin_access"
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

CREATE POLICY "business_interests_admin_access"
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