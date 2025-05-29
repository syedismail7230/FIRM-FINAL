/*
  # Fix relationships between profiles and business_interests tables

  1. Changes
    - Drop existing business_interests table
    - Recreate business_interests table with proper foreign key relationship
    - Update RLS policies

  2. Security
    - Maintain RLS policies
    - Ensure proper foreign key constraints
*/

-- Drop existing business_interests table
DROP TABLE IF EXISTS business_interests CASCADE;

-- Recreate business_interests table with proper foreign key relationship
CREATE TABLE business_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_type text NOT NULL,
  investment_amount numeric NOT NULL,
  expected_roi numeric NOT NULL,
  location_preference text,
  experience text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE business_interests ENABLE ROW LEVEL SECURITY;

-- Create policies for business_interests
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