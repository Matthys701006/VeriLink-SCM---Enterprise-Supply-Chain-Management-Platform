/*
  # Fix Auth Profiles and Default Organization

  This migration ensures the required database structure for authentication and profiles exists,
  creates the default organization, and sets up proper RLS policies.

  1. Organization Creation
     - Creates default organization if it doesn't exist
  
  2. Profile Table
     - Creates profiles table linked to auth.users
     - Adds necessary columns for user data
  
  3. Security
     - Enables RLS on affected tables
     - Creates policies for profiles and organizations
     
  4. Helper Function
     - Adds version() function for connection testing
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

-- Make sure the profiles table exists with correct schema
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  organization_id UUID REFERENCES organizations(id) DEFAULT '550e8400-e29b-41d4-a716-446655440000',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Make sure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies safely with existence checks
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

  -- Add additional policy for users to view their organization via profiles too
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'organizations' 
    AND policyname = 'Users can view their organization via profiles'
  ) THEN
    CREATE POLICY "Users can view their organization via profiles"
    ON organizations FOR SELECT
    TO public
    USING (id = (SELECT organization_id FROM profiles WHERE profiles.id = auth.uid()));
  END IF;
END
$$;

-- Create an updated trigger for handling updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger for profiles table if it doesn't exist
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON profiles;
CREATE TRIGGER handle_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

-- Create a simple function to get database version
-- This is useful for connection testing without requiring specific tables
CREATE OR REPLACE FUNCTION version()
RETURNS text
LANGUAGE sql
AS $$
  SELECT version();
$$;