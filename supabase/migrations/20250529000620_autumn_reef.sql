/*
  # Fix admin users RLS policies

  1. Changes
    - Remove existing RLS policies on admin_users table
    - Add new RLS policies for admin_users table:
      - Allow admins to read their own data
      - Allow admins to update their own data
      - Prevent any direct inserts through RLS
  
  2. Security
    - Enforce strict RLS policies for admin_users table
    - Admin users can only read and update their own data
    - No direct inserts allowed through RLS (must be done through service role)
*/

-- Drop existing policies
DROP POLICY IF EXISTS "enable_admin_read" ON admin_users;
DROP POLICY IF EXISTS "enable_admin_update" ON admin_users;

-- Create new policies
CREATE POLICY "admins_can_read_own_data"
ON admin_users
FOR SELECT
TO authenticated
USING (username = auth.jwt() ->> 'email');

CREATE POLICY "admins_can_update_own_data"
ON admin_users
FOR UPDATE
TO authenticated
USING (username = auth.jwt() ->> 'email')
WITH CHECK (username = auth.jwt() ->> 'email');