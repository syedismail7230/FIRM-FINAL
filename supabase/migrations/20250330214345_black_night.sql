/*
  # Add user_id column to business_proposals table

  1. Changes
    - Add user_id column to business_proposals table
    - Add foreign key constraint referencing profiles table
    - Update RLS policies to include user_id checks

  2. Security
    - Maintain existing RLS policies
    - Add new policies for user_id access control
*/

-- Add user_id column
ALTER TABLE business_proposals
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES profiles(id) ON DELETE CASCADE;

-- Update RLS policies
DROP POLICY IF EXISTS "Enable read access for involved users" ON business_proposals;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON business_proposals;
DROP POLICY IF EXISTS "Enable update for involved users" ON business_proposals;
DROP POLICY IF EXISTS "Enable delete for proposal creator" ON business_proposals;

-- Create updated policies
CREATE POLICY "Enable read access for involved users"
  ON business_proposals FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.uid() = investor_id
  );

CREATE POLICY "Enable insert for authenticated users"
  ON business_proposals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for involved users"
  ON business_proposals FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id OR 
    auth.uid() = investor_id
  );

CREATE POLICY "Enable delete for proposal creator"
  ON business_proposals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);