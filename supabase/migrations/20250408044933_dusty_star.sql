/*
  # Fix admin_users table structure and policies

  1. Changes
    - Add dark_mode column to admin_users table
    - Fix RLS policies to prevent infinite recursion
    - Simplify admin access checks

  2. Security
    - Replace recursive policies with direct role checks
    - Enable RLS on admin_users table
    - Add simplified policies for admin access
*/

-- Add dark_mode column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'admin_users' 
    AND column_name = 'dark_mode'
  ) THEN
    ALTER TABLE admin_users ADD COLUMN dark_mode boolean DEFAULT false;
  END IF;
END $$;

-- Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "admin_users_admin_access" ON admin_users;
DROP POLICY IF EXISTS "super_admin_full_access" ON admin_users;
DROP POLICY IF EXISTS "users_read_own_record" ON admin_users;

-- Create new, simplified policies
CREATE POLICY "enable_admin_read"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = username
  );

CREATE POLICY "enable_admin_update"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    auth.jwt() ->> 'email' = username
  )
  WITH CHECK (
    auth.jwt() ->> 'email' = username
  );

-- Ensure RLS is enabled
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;