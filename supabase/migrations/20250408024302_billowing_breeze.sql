/*
  # Fix relationships and add missing indexes

  1. Changes
    - Add missing indexes for performance
    - Update foreign key relationships
    - Add proper constraints

  2. Security
    - Maintain existing RLS policies
*/

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_business_interests_user_id ON business_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_business_proposals_investor_id ON business_proposals(investor_id);
CREATE INDEX IF NOT EXISTS idx_business_proposals_user_id ON business_proposals(user_id);

-- Ensure proper foreign key relationships
ALTER TABLE business_interests
DROP CONSTRAINT IF EXISTS business_interests_user_id_fkey,
ADD CONSTRAINT business_interests_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

-- Add updated_at trigger if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to business_interests if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_business_interests_updated_at'
  ) THEN
    CREATE TRIGGER update_business_interests_updated_at
      BEFORE UPDATE ON business_interests
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END
$$;