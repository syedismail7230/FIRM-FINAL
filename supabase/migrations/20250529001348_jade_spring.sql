-- Drop all existing policies
DROP POLICY IF EXISTS "Allow initial admin creation" ON profiles;
DROP POLICY IF EXISTS "Enable user profile management" ON profiles;
DROP POLICY IF EXISTS "Enable admin access" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable update for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for own profile" ON profiles;
DROP POLICY IF EXISTS "Enable delete for own profile" ON profiles;

-- Create new policies with unique names
CREATE POLICY "profiles_allow_admin_creation"
ON profiles
FOR INSERT
TO public
WITH CHECK (
  (email = 'super_admin@example.com' AND role = 'admin')
  OR
  (auth.uid() = id)
);

CREATE POLICY "profiles_view_own"
ON profiles
FOR SELECT
TO public
USING (auth.uid() = id);

CREATE POLICY "profiles_update_own"
ON profiles
FOR UPDATE
TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_admin_access"
ON profiles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM admin_users
    WHERE username = (auth.jwt() ->> 'email')
  )
);

-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS on_user_approval ON profiles;
DROP FUNCTION IF EXISTS notify_user_approval();

-- Recreate function and trigger for user approval notifications
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