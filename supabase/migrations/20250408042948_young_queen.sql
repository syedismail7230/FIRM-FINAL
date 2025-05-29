/*
  # Fix admin access and policies

  1. Changes
    - Drop existing policies
    - Create admin_users table with proper structure
    - Set up super admin user
    - Create proper admin access policies
    - Add indexes for performance

  2. Security
    - Enable RLS
    - Add proper admin access policies
    - Ensure super admin has full access
*/

-- Drop existing policies to avoid conflicts
DO $$ 
BEGIN
  -- Drop policies from notifications table
  DROP POLICY IF EXISTS "notifications_admin_access" ON notifications;
  
  -- Drop policies from business_proposals table
  DROP POLICY IF EXISTS "business_proposals_admin_access" ON business_proposals;
  
  -- Drop policies from business_interests table
  DROP POLICY IF EXISTS "business_interests_admin_access" ON business_interests;
  
  -- Drop admin_users policies
  DROP POLICY IF EXISTS "admin_users_super_admin_access" ON admin_users;
  DROP POLICY IF EXISTS "admin_users_read_own" ON admin_users;
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

-- Create policies for admin access
CREATE POLICY "admin_users_admin_access"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE username = current_user
    )
  );

-- Create policies for other tables to respect admin access
CREATE POLICY "notifications_admin_access"
  ON notifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE username = current_user
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
      WHERE username = current_user
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
      WHERE username = current_user
    )
  );

CREATE POLICY "subscriptions_admin_access"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE username = current_user
    )
  );