/*
  # Create compliance tables

  1. New Tables
    - `compliance_records` - Records of compliance assessments
      - `id` (uuid, primary key)
      - `organization_id` (uuid, foreign key)
      - `regulation_type` (character varying)
      - `entity_type` (character varying)
      - `entity_id` (uuid)
      - `compliance_status` (character varying)
      - and more compliance-related fields
    
  2. Security
    - Enable RLS on `compliance_records` table
    - Add policy for authenticated users
*/

-- Create organizations if it doesn't exist (to resolve foreign key constraints)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'organizations'
  ) THEN
    CREATE TABLE public.organizations (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name character varying(255) NOT NULL,
      code character varying(50) NOT NULL,
      description text,
      is_active boolean DEFAULT true,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now(),
      CONSTRAINT organizations_code_key UNIQUE (code)
    );

    ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

    -- Insert default organization
    INSERT INTO public.organizations (id, name, code, description)
    VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Default Organization', 'DEFAULT', 'Default organization for system');
  ELSE
    -- Insert default organization if it doesn't exist
    INSERT INTO public.organizations (id, name, code, description)
    VALUES ('550e8400-e29b-41d4-a716-446655440000', 'Default Organization', 'DEFAULT', 'Default organization for system')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END
$$;

-- Create compliance_records table
CREATE TABLE IF NOT EXISTS public.compliance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  regulation_type character varying(50) NOT NULL,
  entity_type character varying(50) NOT NULL,
  entity_id uuid NOT NULL,
  compliance_status character varying(20) DEFAULT 'pending'::character varying,
  assessment_date timestamptz DEFAULT now(),
  expiry_date timestamptz,
  assessor_id uuid,
  evidence_documents jsonb DEFAULT '[]'::jsonb,
  violations jsonb DEFAULT '[]'::jsonb,
  remediation_plan text,
  next_review_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb,
  FOREIGN KEY (organization_id) REFERENCES public.organizations(id)
);

-- Enable RLS on compliance_records
ALTER TABLE public.compliance_records ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read their organization's compliance records
CREATE POLICY "Users can view organization compliance records"
  ON public.compliance_records
  FOR SELECT
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM public.users WHERE id = auth.uid()));

-- Sample compliance records
INSERT INTO public.compliance_records 
(organization_id, regulation_type, entity_type, entity_id, compliance_status, assessment_date, next_review_date)
VALUES
('550e8400-e29b-41d4-a716-446655440000', 'GDPR', 'System', '00000000-0000-0000-0000-000000000001', 'compliant', '2025-01-15', '2025-07-15'),
('550e8400-e29b-41d4-a716-446655440000', 'ISO 27001', 'System', '00000000-0000-0000-0000-000000000002', 'pending', '2025-02-01', '2025-05-01'),
('550e8400-e29b-41d4-a716-446655440000', 'CCPA', 'System', '00000000-0000-0000-0000-000000000003', 'non_compliant', '2025-01-10', '2025-02-10'),
('550e8400-e29b-41d4-a716-446655440000', 'SOC 2', 'System', '00000000-0000-0000-0000-000000000004', 'compliant', '2024-12-20', '2025-06-20'),
('550e8400-e29b-41d4-a716-446655440000', 'PCI DSS', 'System', '00000000-0000-0000-0000-000000000005', 'compliant', '2025-01-05', '2025-04-05');