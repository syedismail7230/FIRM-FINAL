/*
  # Fix business interests policies for better visibility

  1. Changes
    - Update RLS policies for business_interests table
    - Add better filtering for investor visibility
    - Ensure proper data access control

  2. Security
    - Maintain RLS
    - Update policies for better visibility
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON business_interests;
DROP POLICY IF EXISTS "Enable insert for own business interests" ON business_interests;
DROP POLICY IF EXISTS "Enable update for own business interests" ON business_interests;
DROP POLICY IF EXISTS "Enable delete for own business interests" ON business_interests;

-- Create updated policies
CREATE POLICY "Enable read access for all authenticated users"
  ON business_interests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Enable insert for own business interests"
  ON business_interests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for own business interests"
  ON business_interests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for own business interests"
  ON business_interests FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_business_interests_user_id ON business_interests(user_id);