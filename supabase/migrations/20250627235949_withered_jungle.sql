/*
  # Fix profiles table INSERT policy

  1. Security Policy Updates
    - Drop the existing INSERT policy that may be using incorrect syntax
    - Create a new INSERT policy using the correct `auth.uid()` function
    - Ensure authenticated users can insert their own profile data

  2. Changes
    - Replace "Users can insert own profile" policy with corrected version
    - Use `auth.uid() = id` condition for proper user identification
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a new INSERT policy with the correct syntax
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also ensure the SELECT policy uses the correct syntax
DROP POLICY IF EXISTS "Enable read for users based on user_id" ON profiles;

CREATE POLICY "Enable read for users based on user_id"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- And the UPDATE policy
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;

CREATE POLICY "Enable update for users based on user_id"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);