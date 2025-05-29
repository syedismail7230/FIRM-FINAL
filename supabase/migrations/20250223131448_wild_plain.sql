/*
  # Add contact information to profiles table

  1. Changes
    - Add contact_info JSONB column to profiles table
    - Set default empty JSON object
    - Add validation check for required fields

  2. Security
    - Maintain existing RLS policies
*/

-- Add contact_info column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS contact_info JSONB DEFAULT '{
  "email": "",
  "phone": "",
  "preferred_contact_method": "email"
}'::JSONB;

-- Add check constraint to ensure contact_info has required fields
ALTER TABLE profiles
ADD CONSTRAINT contact_info_check
CHECK (
  contact_info ? 'email' AND
  contact_info ? 'phone' AND
  contact_info ? 'preferred_contact_method' AND
  contact_info->>'preferred_contact_method' IN ('email', 'phone')
);

-- Create business_proposals table if it doesn't exist
CREATE TABLE IF NOT EXISTS business_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  investor_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  investment_required numeric NOT NULL,
  expected_returns numeric NOT NULL,
  timeline text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on business_proposals
ALTER TABLE business_proposals ENABLE ROW LEVEL SECURITY;

-- Create policies for business_proposals
CREATE POLICY "Users can view their own proposals"
  ON business_proposals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = investor_id);

CREATE POLICY "Users can create proposals"
  ON business_proposals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own proposals"
  ON business_proposals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = investor_id);

CREATE POLICY "Users can delete their own proposals"
  ON business_proposals
  FOR DELETE
  TO authenticated
  USING (auth.uid() = investor_id);