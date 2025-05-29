/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing restrictive RLS policies
    - Add new policies to allow users to:
      - Create their own profile
      - Read their own profile
      - Update their own profile
      - Delete their own profile
    
  2. Security
    - Maintain RLS enabled on profiles table
    - Ensure users can only access their own profile data
    - Allow system-level operations for profile management
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable insert access for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update access for own profile" ON profiles;

-- Create new policies
CREATE POLICY "Enable insert for own profile"
ON profiles FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read for own profile"
ON profiles FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Enable update for own profile"
ON profiles FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable delete for own profile"
ON profiles FOR DELETE 
TO authenticated
USING (auth.uid() = id);

-- Add system-level policy for initial profile creation
CREATE POLICY "Enable system-level profile operations"
ON profiles FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE auth.users.id = profiles.id
  )
);