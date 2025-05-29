-- Drop existing policies
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "profiles_admin_view" ON profiles;
  DROP POLICY IF EXISTS "profiles_user_view" ON profiles;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Create new policies with proper checks
CREATE POLICY "profiles_admin_access"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE username = auth.email()
    )
  );

CREATE POLICY "profiles_user_access"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1
      FROM admin_users
      WHERE username = auth.email()
    )
  );

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Add missing indexes
CREATE INDEX IF NOT EXISTS idx_profiles_id ON profiles(id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_approved ON profiles(is_approved);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);