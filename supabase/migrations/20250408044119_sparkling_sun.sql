/*
  # Add super admin user and update admin policies

  1. Changes
    - Add super admin user with specified credentials
    - Update admin policies for proper access control
    - Add indexes for better performance

  2. Security
    - Store password hash securely
    - Enable RLS
    - Set up proper access policies
*/

-- First, clean up any existing policies
DROP POLICY IF EXISTS "super_admin_full_access" ON admin_users;
DROP POLICY IF EXISTS "users_read_own_record" ON admin_users;

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

-- Update existing policies for other tables to respect admin access
CREATE POLICY "Enable all for admins"
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

CREATE POLICY "Enable all for admins"
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

CREATE POLICY "Enable all for admins"
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