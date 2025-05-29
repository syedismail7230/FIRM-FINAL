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

-- Drop ALL existing policies to avoid conflicts
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable read access for own profile" ON profiles;
  DROP POLICY IF EXISTS "Enable system-level profile operations" ON profiles;
  DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
  DROP POLICY IF EXISTS "admin_view_all_profiles" ON profiles;
  DROP POLICY IF EXISTS "user_view_own_profile" ON profiles;
  DROP POLICY IF EXISTS "profiles_admin_view" ON profiles;
  DROP POLICY IF EXISTS "profiles_user_view" ON profiles;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies with proper checks
CREATE POLICY "profiles_admin_view"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.username = current_user
    )
  );

CREATE POLICY "profiles_user_view"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    (auth.uid() = id) OR 
    (EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.username = current_user
    ))
  );

-- Add indexes for better performance
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_profiles_email'
  ) THEN
    CREATE INDEX idx_profiles_email ON profiles(email);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_profiles_created_at'
  ) THEN
    CREATE INDEX idx_profiles_created_at ON profiles(created_at DESC);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_profiles_is_approved'
  ) THEN
    CREATE INDEX idx_profiles_is_approved ON profiles(is_approved);
  END IF;
END $$;