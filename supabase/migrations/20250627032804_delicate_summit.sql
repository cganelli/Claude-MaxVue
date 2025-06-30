/*
  # Initial VividVue Database Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Links to auth.users
      - `email` (text, unique)
      - `first_name` (text)
      - `last_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `vision_tests`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `test_type` (text) - Type of vision test
      - `results` (jsonb) - Test results data
      - `score` (integer) - Test score
      - `created_at` (timestamp)
    
    - `prescriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - Eye prescription fields for both eyes
      - `pupillary_distance` (text)
      - `prescription_date` (date)
      - `doctor_name` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vision_tests table
CREATE TABLE IF NOT EXISTS vision_tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  test_type text NOT NULL DEFAULT 'visual_acuity',
  results jsonb NOT NULL DEFAULT '{}',
  score integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create prescriptions table
CREATE TABLE IF NOT EXISTS prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = id::text);

-- Create policies for vision_tests table
CREATE POLICY "Users can read own vision tests"
  ON vision_tests
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can insert own vision tests"
  ON vision_tests
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can update own vision tests"
  ON vision_tests
  FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

-- Create policies for prescriptions table
CREATE POLICY "Users can read own prescriptions"
  ON prescriptions
  FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can insert own prescriptions"
  ON prescriptions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

CREATE POLICY "Users can update own prescriptions"
  ON prescriptions
  FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM users WHERE auth.uid()::text = id::text));

-- Create function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER prescriptions_updated_at
  BEFORE UPDATE ON prescriptions
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();