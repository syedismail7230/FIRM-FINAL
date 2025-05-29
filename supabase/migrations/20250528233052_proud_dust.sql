/*
  # Fix profile policies and add missing columns

  1. Changes
    - Add missing columns to profiles table
    - Update policies for admin access
    - Add performance indexes
    
  2. Security
    - Drop existing policies first
    - Create new policies with unique names
*/

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text;
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable system-level profile operations" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

-- Create new policies with unique names
CREATE POLICY "admin_view_all_profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE username = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "user_view_own_profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE username = auth.jwt() ->> 'email'
    )
  );

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_is_approved ON profiles(is_approved);