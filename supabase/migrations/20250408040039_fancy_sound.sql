/*
  # Add subscription management and admin portal functionality

  1. Changes
    - Drop existing triggers if they exist
    - Create subscriptions and admin_users tables
    - Add proper indexes and constraints
    - Set up RLS policies
    - Add notification triggers

  2. Security
    - Enable RLS
    - Add policies for admin access
    - Ensure proper constraints
*/

-- Drop existing triggers if they exist
DO $$ 
BEGIN
  DROP TRIGGER IF EXISTS update_subscriptions_updated_at ON subscriptions;
  DROP TRIGGER IF EXISTS on_subscription_change ON subscriptions;
EXCEPTION
  WHEN undefined_object THEN
    NULL;
END $$;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  plan text NOT NULL CHECK (plan IN ('free', 'starter', 'professional', 'enterprise')),
  status text NOT NULL CHECK (status IN ('active', 'inactive', 'cancelled')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for subscriptions
CREATE POLICY "Enable select for admins"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE username = CURRENT_USER
  ));

CREATE POLICY "Enable all for admins"
  ON subscriptions FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE username = CURRENT_USER
  ));

-- Create policies for admin_users
CREATE POLICY "Enable select for admins only"
  ON admin_users FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE username = CURRENT_USER
  ));

-- Create function to update updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for subscriptions
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create notification trigger for subscription changes
CREATE OR REPLACE FUNCTION notify_subscription_change()
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
      'Subscription Status Updated',
      'Your subscription status has been updated to ' || NEW.status,
      'subscription_status',
      jsonb_build_object(
        'subscription_id', NEW.id,
        'old_status', OLD.status,
        'new_status', NEW.status,
        'plan', NEW.plan
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_subscription_change
  AFTER UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION notify_subscription_change();