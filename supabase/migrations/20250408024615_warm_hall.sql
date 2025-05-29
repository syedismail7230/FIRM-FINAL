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

-- Update RLS policies for better visibility
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON business_interests;
CREATE POLICY "Enable read access for authenticated users"
  ON business_interests FOR SELECT
  TO authenticated
  USING (true);

-- Add notification trigger for new business interests
CREATE OR REPLACE FUNCTION notify_new_business_interest()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (
    user_id,
    title,
    message,
    type,
    data
  )
  SELECT 
    p.id,
    'New Investment Opportunity',
    'A new investor has expressed interest in ' || NEW.business_type,
    'new_business_interest',
    jsonb_build_object(
      'business_interest_id', NEW.id,
      'business_type', NEW.business_type,
      'investment_amount', NEW.investment_amount
    )
  FROM profiles p
  WHERE p.id != NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_new_business_interest
  AFTER INSERT ON business_interests
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_business_interest();