/*
  # Add indexes and constraints with data validation

  1. Changes
    - Add missing indexes for better query performance
    - Add check constraints with data validation
    - Add triggers for business proposals
    - Handle existing data before adding constraints

  2. Security
    - Maintain existing RLS policies
*/

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_business_proposals_created_at ON business_proposals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_updated_at ON profiles(updated_at DESC);

-- Update any invalid data in business_interests before adding constraints
UPDATE business_interests 
SET investment_amount = 1 
WHERE investment_amount <= 0;

UPDATE business_interests 
SET expected_roi = 
  CASE 
    WHEN expected_roi < 0 THEN 0
    WHEN expected_roi > 100 THEN 100
    ELSE expected_roi
  END;

-- Add check constraints for business_interests
ALTER TABLE business_interests
ADD CONSTRAINT check_investment_amount CHECK (investment_amount > 0),
ADD CONSTRAINT check_expected_roi CHECK (expected_roi >= 0 AND expected_roi <= 100);

-- Update any invalid data in business_proposals before adding constraints
UPDATE business_proposals 
SET investment_required = 1 
WHERE investment_required <= 0;

UPDATE business_proposals 
SET expected_returns = 
  CASE 
    WHEN expected_returns < 0 THEN 0
    WHEN expected_returns > 100 THEN 100
    ELSE expected_returns
  END;

-- Add check constraints for business_proposals
ALTER TABLE business_proposals
ADD CONSTRAINT check_investment_required CHECK (investment_required > 0),
ADD CONSTRAINT check_expected_returns CHECK (expected_returns >= 0 AND expected_returns <= 100);

-- Add updated_at trigger for business proposals
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_business_proposals_updated_at
  BEFORE UPDATE ON business_proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add notification trigger for business proposals
CREATE OR REPLACE FUNCTION notify_proposal_update()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.status != OLD.status THEN
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      data
    )
    VALUES (
      NEW.user_id,
      'Proposal Status Updated',
      'Your proposal status has been updated to ' || NEW.status,
      'proposal_status',
      jsonb_build_object(
        'proposal_id', NEW.id,
        'old_status', OLD.status,
        'new_status', NEW.status
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_proposal_update
  AFTER UPDATE ON business_proposals
  FOR EACH ROW
  EXECUTE FUNCTION notify_proposal_update();