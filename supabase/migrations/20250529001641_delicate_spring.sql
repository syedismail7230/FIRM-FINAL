-- Drop all existing policies
DROP POLICY IF EXISTS "profiles_allow_admin_creation" ON profiles;
DROP POLICY IF EXISTS "profiles_view_own" ON profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON profiles;
DROP POLICY IF EXISTS "profiles_admin_access" ON profiles;

-- Create new policies with unique names
CREATE POLICY "profiles_allow_admin_creation_v2"
ON profiles
FOR INSERT
TO public
WITH CHECK (
  (email = 'super_admin@example.com' AND role = 'admin')
  OR
  (auth.uid() = id)
);

CREATE POLICY "profiles_view_own_v2"
ON profiles
FOR SELECT
TO public
USING (auth.uid() = id);

CREATE POLICY "profiles_update_own_v2"
ON profiles
FOR UPDATE
TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_admin_access_v2"
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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_user_approval ON profiles;

-- Update notification function
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

-- Create trigger with new name
CREATE TRIGGER on_user_approval_v2
  AFTER UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION notify_user_approval();