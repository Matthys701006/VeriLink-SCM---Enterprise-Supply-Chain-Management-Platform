
-- Add missing contact person fields to warehouses table
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS contact_person VARCHAR(255);
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- Update sample data with contact information
UPDATE warehouses 
SET 
  contact_person = 'John Smith',
  phone = '+1-555-0101',
  email = 'john.smith@warehouse1.com'
WHERE code = 'WH001';

UPDATE warehouses 
SET 
  contact_person = 'Sarah Johnson',
  phone = '+1-555-0102', 
  email = 'sarah.johnson@warehouse2.com'
WHERE code = 'WH002';

UPDATE warehouses 
SET 
  contact_person = 'Mike Davis',
  phone = '+1-555-0103',
  email = 'mike.davis@warehouse3.com'
WHERE code = 'WH003';
