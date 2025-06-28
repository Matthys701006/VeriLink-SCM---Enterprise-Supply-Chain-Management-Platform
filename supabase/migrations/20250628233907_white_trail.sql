/*
  # Fix Policy Creation Issues

  1. Organization and Profiles
    - Add default organization if it doesn't exist
    - Create profiles table if needed
    - Add RLS policies with proper existence checks

  2. Security
    - Enable RLS on profiles and organizations tables
    - Add policies for user profile management
    - Add organization viewing policy

  3. Utilities
    - Add version() function for connection testing
*/

-- Create default organization if it doesn't exist
INSERT INTO organizations (id, name, code, description, is_active)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'Default Organization', 
  'DEFAULT',
  'Default organization for testing',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Create default profiles table if doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  organization_id UUID REFERENCES organizations(id) DEFAULT '550e8400-e29b-41d4-a716-446655440000',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Make sure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Create policies safely with existence checks
DO $$
BEGIN
  -- Check if "Users can view their own profile" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public'
    AND tablename = 'profiles' 
    AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);
  END IF;
  
  -- Check if "Users can update their own profile" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public'
    AND tablename = 'profiles' 
    AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);
  END IF;
  
  -- Check if "Users can insert their own profile" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public'
    AND tablename = 'profiles' 
    AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);
  END IF;
  
  -- Check if "Users can view their organization" policy exists
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public'
    AND tablename = 'organizations' 
    AND policyname = 'Users can view their organization'
  ) THEN
    CREATE POLICY "Users can view their organization"
    ON organizations FOR SELECT
    USING (id = (SELECT organization_id FROM profiles WHERE profiles.id = auth.uid()));
  END IF;
END
$$;

-- Create a simple function to get database version
-- This is useful for connection testing without requiring specific tables
CREATE OR REPLACE FUNCTION version()
RETURNS text
LANGUAGE sql
AS $$
  SELECT version();
$$;