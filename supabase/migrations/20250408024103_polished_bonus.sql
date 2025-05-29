/*
  # Fix relationships and constraints for business interests

  1. Changes
    - Drop and recreate business_interests table with proper constraints
    - Update foreign key relationships
    - Add proper indexes

  2. Security
    - Maintain RLS policies
    - Ensure proper access control
*/

-- Drop existing table and recreate with proper constraints
DROP TABLE IF EXISTS business_interests CASCADE;

CREATE TABLE business_interests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_type text NOT NULL,
  investment_amount numeric NOT NULL CHECK (investment_amount > 0),
  expected_roi numeric NOT NULL,
  location_preference text,
  experience text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS business_interests_user_id_idx ON business_interests(user_id);

-- Enable RLS
ALTER TABLE business_interests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for authenticated users"
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

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_business_interests_updated_at
    BEFORE UPDATE ON business_interests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();