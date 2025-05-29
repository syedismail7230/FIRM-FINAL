/*
  # Remove super admin from users table

  1. Changes
    - Delete super_admin@example.com from auth.users table
    - Keep super_admin@example.com in admin_users table
    - Update policies to ensure admin access remains intact

  2. Security
    - Maintain RLS policies
    - Ensure admin functionality continues to work
*/

-- Delete super admin from auth.users if it exists
DELETE FROM auth.users 
WHERE email = 'super_admin@example.com';

-- Ensure super admin exists in admin_users
INSERT INTO admin_users (username, password_hash)
VALUES (
  'super_admin@example.com',
  '1234567890'
)
ON CONFLICT (username) 
DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Update policies to use CURRENT_USER instead of auth.email()
DROP POLICY IF EXISTS "super_admin_full_access" ON admin_users;
CREATE POLICY "super_admin_full_access"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE username = CURRENT_USER
    )
  );

-- Update other table policies to use CURRENT_USER
DROP POLICY IF EXISTS "Enable all for admins" ON notifications;
CREATE POLICY "Enable all for admins"
  ON notifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE username = CURRENT_USER
    )
  );

DROP POLICY IF EXISTS "Enable all for admins" ON business_proposals;
CREATE POLICY "Enable all for admins"
  ON business_proposals
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE username = CURRENT_USER
    )
  );

DROP POLICY IF EXISTS "Enable all for admins" ON business_interests;
CREATE POLICY "Enable all for admins"
  ON business_interests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE username = CURRENT_USER
    )
  );

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);