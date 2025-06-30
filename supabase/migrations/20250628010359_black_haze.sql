/*
  # Add RLS Policy for Profiles Table

  1. Security Updates
    - Enable row-level security on profiles table
    - Add policy to allow authenticated users to insert their own profile
    - Ensure proper access control for profile operations

  2. Policy Details
    - Users can only insert profiles where auth.uid() matches the id field
    - This prevents users from creating profiles for other users
    - Maintains data integrity and security
*/

-- Enable row-level security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Allow insert own profile" ON profiles;

-- Allow insert if authenticated user is inserting their own profile
CREATE POLICY "Allow insert own profile"
ON profiles
FOR INSERT
WITH CHECK (auth.uid() = id);