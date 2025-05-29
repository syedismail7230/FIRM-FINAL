/*
  # Add admin portal functionality

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `plan` (text)
      - `status` (text)
      - `current_period_start` (timestamp)
      - `current_period_end` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `admin_users`
      - `id` (uuid, primary key)
      - `username` (text)
      - `password_hash` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS
    - Add policies for admin access
*/

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

-- Create admin user
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2a$10$xJ7Yt1ZXf5K5D5Y5L5L5O.5L5L5O.5L5L5O.5L5L5O.5L5L5O.');

-- Create policies for subscriptions
CREATE POLICY "Enable read access for admins"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE username = current_user
  ));

CREATE POLICY "Enable write access for admins"
  ON subscriptions FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE username = current_user
  ));

-- Create function to update updated_at
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