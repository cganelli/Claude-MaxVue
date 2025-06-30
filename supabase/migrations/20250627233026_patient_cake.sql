/*
  # Fix profiles table RLS policies

  1. Security Changes
    - Drop existing RLS policies that use incorrect `uid()` function
    - Create new RLS policies using correct `auth.uid()` function
    - Ensure authenticated users can insert, select, and update their own profiles

  2. Policy Details
    - INSERT: Allow authenticated users to create profiles with their own auth.uid()
    - SELECT: Allow authenticated users to read their own profile data
    - UPDATE: Allow authenticated users to update their own profile data

  This fixes the "new row violates row-level security policy" errors during registration.
*/

-- Drop existing policies that use incorrect uid() function
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new policies using correct auth.uid() function
CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);