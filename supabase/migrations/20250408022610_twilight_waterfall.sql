/*
  # Add type column to business_proposals table

  1. Changes
    - Add 'type' column to business_proposals table with default value 'business'
    - Add check constraint to ensure valid types
    - Update existing rows to have the default type

  2. Security
    - No changes to RLS policies needed as the column inherits existing table policies
*/

-- Add type column with default value
ALTER TABLE business_proposals 
ADD COLUMN IF NOT EXISTS type text NOT NULL DEFAULT 'business';

-- Add check constraint to ensure valid types
ALTER TABLE business_proposals 
ADD CONSTRAINT valid_proposal_type 
CHECK (type IN ('business', 'franchise', 'partnership'));

-- Update any existing rows to have the default type
UPDATE business_proposals 
SET type = 'business' 
WHERE type IS NULL;