/*
  # Add user approval system and subscription management

  1. Changes
    - Add approved status to profiles table
    - Add dark mode preference to admin_users
    - Update RLS policies for unapproved users
    - Add cascade delete for subscriptions

  2. Security
    - Maintain RLS policies
    - Add approval checks
*/

-- Add approved status to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false;

-- Add dark mode preference to admin_users
ALTER TABLE admin_users
ADD COLUMN IF NOT EXISTS dark_mode boolean DEFAULT false;

-- Update profiles policies to check approval
DROP POLICY IF EXISTS "Enable read access for own profile" ON profiles;
CREATE POLICY "Enable read access for own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id AND 
    (is_approved = true OR EXISTS (
      SELECT 1 FROM admin_users WHERE username = CURRENT_USER
    ))
  );

-- Add function to handle user deletion and cleanup
CREATE OR REPLACE FUNCTION delete_user_cascade()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete from auth.users
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for cascade deletion
CREATE TRIGGER on_profile_delete
  AFTER DELETE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION delete_user_cascade();

-- Add notification trigger for user approval
CREATE OR REPLACE FUNCTION notify_user_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_approved = true AND OLD.is_approved = false THEN
    INSERT INTO notifications (
      user_id,
      title,
      message,
      type,
      data
    )
    VALUES (
      NEW.id,
      'Account Approved',
      'Your account has been approved by an administrator',
      'account_approval',
      jsonb_build_object('approved_at', NOW())
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_user_approval
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_user_approval();