/*
  # Fix Database Schema - Use Profiles Consistently

  1. Schema Updates
    - Ensure all foreign key references point to profiles table
    - Update all policies to reference profiles correctly
    - Clean up any remaining users table references

  2. Tables Updated
    - vision_tests: user_id references profiles(id)
    - prescriptions: user_id references profiles(id)
    - All RLS policies updated accordingly

  3. Security
    - All policies use auth.uid() = profiles.id pattern
    - Consistent security model across all tables
*/

-- First, let's make sure the profiles table exists and is properly configured
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  first_name text,
  last_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate all policies for profiles
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can read their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Update vision_tests table to reference profiles
DO $$
BEGIN
  -- Drop the foreign key constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'vision_tests_user_id_fkey' 
    AND table_name = 'vision_tests'
  ) THEN
    ALTER TABLE vision_tests DROP CONSTRAINT vision_tests_user_id_fkey;
  END IF;
  
  -- Add the correct foreign key constraint
  ALTER TABLE vision_tests 
  ADD CONSTRAINT vision_tests_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
END $$;

-- Update prescriptions table to reference profiles
DO $$
BEGIN
  -- Drop the foreign key constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'prescriptions_user_id_fkey' 
    AND table_name = 'prescriptions'
  ) THEN
    ALTER TABLE prescriptions DROP CONSTRAINT prescriptions_user_id_fkey;
  END IF;
  
  -- Add the correct foreign key constraint
  ALTER TABLE prescriptions 
  ADD CONSTRAINT prescriptions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
END $$;

-- Update vision_tests policies to use correct references
DROP POLICY IF EXISTS "Users can read own vision tests" ON vision_tests;
DROP POLICY IF EXISTS "Users can insert own vision tests" ON vision_tests;
DROP POLICY IF EXISTS "Users can update own vision tests" ON vision_tests;

CREATE POLICY "Users can read own vision tests"
  ON vision_tests
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own vision tests"
  ON vision_tests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own vision tests"
  ON vision_tests
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Update prescriptions policies to use correct references
DROP POLICY IF EXISTS "Users can read own prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "Users can insert own prescriptions" ON prescriptions;
DROP POLICY IF EXISTS "Users can update own prescriptions" ON prescriptions;

CREATE POLICY "Users can read own prescriptions"
  ON prescriptions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own prescriptions"
  ON prescriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own prescriptions"
  ON prescriptions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Ensure the updated_at trigger function exists
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure triggers exist for updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS prescriptions_updated_at ON prescriptions;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();