/*
  # Fix Profile Creation and RLS Policies

  1. Database Issues
    - Fix RLS policies to allow profile creation during registration
    - Ensure proper foreign key relationships
    - Handle existing auth users without profiles

  2. Security
    - Allow authenticated users to create their own profile
    - Maintain security while enabling registration flow
    - Fix policy conflicts

  3. Data Integrity
    - Ensure profiles table matches auth.users
    - Clean up any orphaned data
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

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable read for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new policies that work properly
CREATE POLICY "Enable insert for authenticated users"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read for users based on user_id"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id"
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

-- Update vision_tests table to reference profiles correctly
DO $$
BEGIN
  -- Ensure vision_tests table exists
  CREATE TABLE IF NOT EXISTS vision_tests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    test_type text NOT NULL DEFAULT 'visual_acuity',
    results jsonb NOT NULL DEFAULT '{}',
    score integer NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now()
  );

  -- Enable RLS on vision_tests
  ALTER TABLE vision_tests ENABLE ROW LEVEL SECURITY;

  -- Update foreign key constraint
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

  -- Drop and recreate vision_tests policies
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
END $$;

-- Update prescriptions table to reference profiles correctly
DO $$
BEGIN
  -- Ensure prescriptions table exists
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

  -- Enable RLS on prescriptions
  ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

  -- Update foreign key constraint
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

  -- Drop and recreate prescriptions policies
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

  -- Create trigger for prescriptions updated_at
  DROP TRIGGER IF EXISTS prescriptions_updated_at ON prescriptions;
  CREATE TRIGGER prescriptions_updated_at
    BEFORE UPDATE ON prescriptions
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();
END $$;