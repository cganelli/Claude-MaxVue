/*
  # Fix Profiles RLS Policies for Registration

  1. Security Updates
    - Enable RLS on profiles table
    - Add proper RLS policies for authenticated users
    - Use auth.uid() function to scope access correctly
    - Allow INSERT, SELECT, and UPDATE operations for own profiles

  2. Policy Details
    - INSERT: Allow authenticated users to insert their own profile
    - SELECT: Allow authenticated users to read their own profile  
    - UPDATE: Allow authenticated users to update their own profile
    - All policies use auth.uid()::text = id::text for proper UUID comparison
*/

-- Ensure RLS is enabled on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable read for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can select their profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can update their profile" ON profiles;

-- Allow authenticated users to insert their own profile
CREATE POLICY "Authenticated users can insert their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid()::text = id::text);

-- Allow authenticated users to select their own profile
CREATE POLICY "Authenticated users can select their profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid()::text = id::text);

-- Allow authenticated users to update their own profile
CREATE POLICY "Authenticated users can update their profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid()::text = id::text)
WITH CHECK (auth.uid()::text = id::text);