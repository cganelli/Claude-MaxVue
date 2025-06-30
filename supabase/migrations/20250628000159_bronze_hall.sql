/*
  # Comprehensive Auth and Profiles Fix

  1. Database Structure
    - Ensure profiles table is correctly configured
    - Fix all RLS policies to work with Supabase Auth
    - Ensure proper foreign key relationships

  2. Security
    - Create working RLS policies for all operations
    - Handle edge cases in user registration flow

  3. Data Integrity
    - Ensure consistent schema across all tables
*/

-- Ensure profiles table exists with correct structure
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  first_name text,
  last_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start completely fresh
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    -- Drop all policies on profiles table
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON public.profiles';
    END LOOP;
END $$;

-- Create new, working policies
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure updated_at trigger function exists
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Ensure vision_tests table is properly configured
CREATE TABLE IF NOT EXISTS vision_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  test_type text NOT NULL DEFAULT 'visual_acuity',
  results jsonb NOT NULL DEFAULT '{}',
  score integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vision_tests ENABLE ROW LEVEL SECURITY;

-- Fix vision_tests foreign key
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'vision_tests_user_id_fkey' 
    AND table_name = 'vision_tests'
  ) THEN
    ALTER TABLE vision_tests DROP CONSTRAINT vision_tests_user_id_fkey;
  END IF;
  
  ALTER TABLE vision_tests 
  ADD CONSTRAINT vision_tests_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
END $$;

-- Drop and recreate vision_tests policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'vision_tests' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON vision_tests';
    END LOOP;
END $$;

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

-- Ensure prescriptions table is properly configured
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  right_eye_sphere text,
  right_eye_cylinder text,
  right_eye_axis text,
  right_eye_add text,
  left_eye_sphere text,
  left_eye_cylinder text,
  left_eye_axis text,
  left_eye_add text,
  pupillary_distance text,
  prescription_date date,
  doctor_name text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- Fix prescriptions foreign key
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'prescriptions_user_id_fkey' 
    AND table_name = 'prescriptions'
  ) THEN
    ALTER TABLE prescriptions DROP CONSTRAINT prescriptions_user_id_fkey;
  END IF;
  
  ALTER TABLE prescriptions 
  ADD CONSTRAINT prescriptions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
END $$;

-- Drop and recreate prescriptions policies
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'prescriptions' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON prescriptions';
    END LOOP;
END $$;

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

-- Create trigger for prescriptions updated_at
DROP TRIGGER IF EXISTS prescriptions_updated_at ON prescriptions;
CREATE TRIGGER prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();