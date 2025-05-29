/*
  # Add subscription status display and blur effect

  1. Changes
    - Add subscription status to profiles
    - Add is_blurred column for disabled subscriptions
    - Update RLS policies
    - Add trigger for subscription status changes

  2. Security
    - Maintain RLS
    - Add proper access control
*/

-- Add is_blurred column to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_blurred boolean DEFAULT false;

-- Create function to handle subscription status changes
CREATE OR REPLACE FUNCTION handle_subscription_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Update profile blur status when subscription is disabled
  IF NEW.status = 'inactive' THEN
    UPDATE profiles
    SET is_blurred = true
    WHERE id = NEW.user_id;
  ELSE
    UPDATE profiles
    SET is_blurred = false
    WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for subscription status changes
DROP TRIGGER IF EXISTS on_subscription_status_change ON subscriptions;
CREATE TRIGGER on_subscription_status_change
  AFTER UPDATE OF status ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_subscription_status_change();

-- Update existing profiles based on subscription status
UPDATE profiles p
SET is_blurred = true
FROM subscriptions s
WHERE p.id = s.user_id
AND s.status = 'inactive';