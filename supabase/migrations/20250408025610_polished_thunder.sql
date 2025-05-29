/*
  # Final fix for business interests visibility

  1. Changes
    - Update RLS policies to ensure proper visibility
    - Add necessary indexes
    - Fix triggers and notifications

  2. Security
    - Maintain RLS with proper access control
    - Ensure data integrity
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON business_interests;
DROP POLICY IF EXISTS "Enable insert for own business interests" ON business_interests;
DROP POLICY IF EXISTS "Enable update for own business interests" ON business_interests;
DROP POLICY IF EXISTS "Enable delete for own business interests" ON business_interests;

-- Create updated policies with proper visibility
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

-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_business_interests_user_id ON business_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_business_interests_created_at ON business_interests(created_at DESC);

-- Update notification trigger
CREATE OR REPLACE FUNCTION notify_new_business_interest()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify all users except the creator
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

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_new_business_interest ON business_interests;
CREATE TRIGGER on_new_business_interest
  AFTER INSERT ON business_interests
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_business_interest();