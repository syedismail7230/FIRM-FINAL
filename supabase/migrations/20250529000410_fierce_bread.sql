/*
  # Fix admin user creation policies

  1. Changes
    - Add new RLS policy to allow admin user creation
    - Add policy for admin access to all operations
  
  2. Security
    - Maintains existing RLS on profiles table
    - Adds specific policy for admin user creation
    - Ensures admin users have full access
*/

-- Add policy to allow creation of admin user
CREATE POLICY "Allow admin user creation"
ON public.profiles
FOR INSERT
TO public
WITH CHECK (
  email = 'super_admin@example.com'
  AND role = 'admin'
);

-- Add policy for admin access to all operations
CREATE POLICY "Enable full access for admin users"
ON public.profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.username = auth.jwt() ->> 'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.username = auth.jwt() ->> 'email'
  )
);