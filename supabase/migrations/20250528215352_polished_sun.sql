/*
  # Fix profile schema

  1. Changes
    - Add missing columns to profiles table:
      - `full_name` (text)
      - `avatar_url` (text)
    - Update existing profiles to set default values for new columns
  
  2. Security
    - Maintain existing RLS policies
*/

-- Add missing columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'avatar_url'
  ) THEN
    ALTER TABLE profiles ADD COLUMN avatar_url text;
  END IF;
END $$;