-- Drop existing policies
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
  FOR ALL
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

-- Ensure admin user exists
INSERT INTO admin_users (username, password_hash)
VALUES ('super_admin@example.com', '1234567890')
ON CONFLICT (username) DO NOTHING;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_is_approved ON profiles(is_approved);