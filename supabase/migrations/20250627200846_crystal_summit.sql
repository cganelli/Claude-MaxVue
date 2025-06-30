/*
  # Update Database Schema for Profiles Integration

  1. New Tables
    - `profiles` table that references auth.users
    - `vision_tests` table for storing test results
    - `prescriptions` table for storing prescription data

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data

  3. Triggers
    - Add updated_at triggers for timestamp management
*/

-- ----------------------------
-- 1. CREATE PROFILES TABLE (IF NOT EXISTS)
-- ----------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  first_name text,
  last_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ----------------------------
-- 2. ENABLE RLS ON PROFILES
-- ----------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist, then recreate them
DO $$
BEGIN
  -- Drop policies if they exist
  DROP POLICY IF EXISTS "Users can read their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
  
  -- Create policies
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
END $$;

-- ----------------------------
-- 3. VISION TESTS TABLE
-- ----------------------------

CREATE TABLE IF NOT EXISTS vision_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  test_type text NOT NULL DEFAULT 'visual_acuity',
  results jsonb NOT NULL DEFAULT '{}',
  score integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vision_tests ENABLE ROW LEVEL SECURITY;

-- Drop and recreate vision_tests policies
DO $$
BEGIN
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

-- ----------------------------
-- 4. PRESCRIPTIONS TABLE
-- ----------------------------

CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
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

-- Drop and recreate prescriptions policies
DO $$
BEGIN
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
END $$;

-- ----------------------------
-- 5. TRIGGER FUNCTION FOR UPDATED_AT
-- ----------------------------

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------
-- 6. TRIGGERS FOR UPDATED_AT
-- ----------------------------

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS prescriptions_updated_at ON prescriptions;

-- Create triggers
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();