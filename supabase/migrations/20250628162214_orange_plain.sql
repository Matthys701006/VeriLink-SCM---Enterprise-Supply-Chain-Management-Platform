/*
  # Create default organization

  This migration ensures the default organization exists to resolve foreign key constraints.
*/

-- Check if organization exists and create if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.organizations 
    WHERE id = '550e8400-e29b-41d4-a716-446655440000'
  ) THEN
    INSERT INTO public.organizations (
      id, 
      name, 
      code, 
      description, 
      is_active
    )
    VALUES (
      '550e8400-e29b-41d4-a716-446655440000',
      'Default Organization',
      'DEFAULT',
      'Default organization for demo purposes',
      true
    );
  END IF;
END
$$;