/*
  # Fix users table permissions and RLS policies

  1. Changes
    - Grant proper permissions for users table
    - Update RLS policies for better access control
    - Fix profile and business interests relationships

  2. Security
    - Maintain RLS
    - Ensure proper access control
*/

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable read access for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable system-level profile operations" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON business_interests;

-- Create updated policies for profiles
CREATE POLICY "Enable read access for own profile"
ON profiles FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE username = auth.jwt() ->> 'email'
  )
);

CREATE POLICY "Enable system-level profile operations"
ON profiles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM admin_users
    WHERE username = auth.jwt() ->> 'email'
  )
);

-- Update business_interests policies
CREATE POLICY "Enable read access for all authenticated users"
ON business_interests FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = business_interests.user_id
    AND (
      profiles.is_approved = true OR
      EXISTS (
        SELECT 1 FROM admin_users
        WHERE username = auth.jwt() ->> 'email'
      )
    )
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_interests_user_id ON business_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_approved ON profiles(is_approved);

-- Update any existing business interests to link to approved profiles
UPDATE business_interests
SET user_id = profiles.id
FROM profiles
WHERE business_interests.user_id = profiles.id
AND profiles.is_approved = true;