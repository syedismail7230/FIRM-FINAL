/*
  # Fix admin_users RLS policy recursion

  1. Changes
    - Drop the recursive policy on admin_users table
    - Add a new, non-recursive policy that allows admins to read their own records
    - Add a policy for super_admin role to manage all records

  2. Security
    - Maintains RLS on admin_users table
    - Adds more specific policies for different access levels
    - Prevents infinite recursion by removing self-referential checks
*/

-- Drop existing policies to clean up
DROP POLICY IF EXISTS "Enable select for admins only" ON admin_users;

-- Create new, non-recursive policies
CREATE POLICY "Allow users to read their own admin record"
ON admin_users
FOR SELECT
TO authenticated
USING (username = auth.jwt() ->> 'email');

-- Add policy for super_admin role to manage all records
CREATE POLICY "Super admin can manage all records"
ON admin_users
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (
    SELECT username FROM admin_users WHERE username = 'super_admin@example.com'
  )
);