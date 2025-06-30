/*
  # Fix profiles table INSERT policy for user registration

  1. Policy Changes
    - Update the INSERT policy for profiles table to allow profile creation during registration
    - The policy now allows INSERT when the user_id matches the authenticated user's ID
    - This fixes the RLS violation error during user registration

  2. Security
    - Maintains security by ensuring users can only create profiles for themselves
    - Uses auth.uid() to verify the authenticated user matches the profile being created
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;

-- Create a new INSERT policy that works during registration
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);