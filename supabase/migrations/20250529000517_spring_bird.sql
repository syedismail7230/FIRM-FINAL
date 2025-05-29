/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing conflicting policies
    - Add new policies for:
      - Public admin creation
      - Authenticated user profile management
      - Admin access
    
  2. Security
    - Enable RLS on profiles table
    - Add policies for:
      - Initial admin creation
      - User profile management
      - Admin access control
*/

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Allow admin user creation" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for own profile" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_access" ON profiles;
DROP POLICY IF EXISTS "profiles_user_access" ON profiles;

-- Create new policies
-- Allow initial admin creation
CREATE POLICY "Allow initial admin creation"
ON profiles
FOR INSERT
TO public
WITH CHECK (
  (email = 'super_admin@example.com' AND role = 'admin')
  OR
  (auth.uid() = id)
);

-- Allow users to manage their own profiles
CREATE POLICY "Enable user profile management"
ON profiles
FOR ALL
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow admins full access
CREATE POLICY "Enable admin access"
ON profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.username = auth.jwt()->>'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admin_users 
    WHERE admin_users.username = auth.jwt()->>'email'
  )
);