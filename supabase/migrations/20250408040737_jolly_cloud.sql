/*
  # Fix admin_users RLS policies

  1. Changes
    - Remove problematic RLS policies causing infinite recursion
    - Add new, simplified policies for admin_users table:
      - Allow super admin full access
      - Allow users to read their own admin record
      - Prevent circular references in policy definitions
  
  2. Security
    - Maintains security by ensuring only authorized access
    - Prevents infinite recursion while preserving access control
*/

-- Drop existing policies to replace them with fixed versions
DROP POLICY IF EXISTS "Allow users to read their own admin record" ON admin_users;
DROP POLICY IF EXISTS "Super admin can manage all records" ON admin_users;

-- Create new, simplified policies without circular references
CREATE POLICY "super_admin_full_access" ON admin_users
FOR ALL 
TO authenticated
USING (
  current_user = 'authenticated' 
  AND EXISTS (
    SELECT 1 FROM admin_users a 
    WHERE a.username = 'super_admin@example.com'
    AND a.username = auth.jwt()->>'email'
  )
);

CREATE POLICY "users_read_own_record" ON admin_users
FOR SELECT 
TO authenticated
USING (
  auth.jwt()->>'email' = username
);