
-- Add the missing capacity_cubic_meters column to warehouses table
ALTER TABLE warehouses ADD COLUMN IF NOT EXISTS capacity_cubic_meters DECIMAL(15,2);

-- Update existing sample data to have capacity values
UPDATE warehouses 
SET capacity_cubic_meters = 50000 
WHERE code = 'WH001' AND capacity_cubic_meters IS NULL;

UPDATE warehouses 
SET capacity_cubic_meters = 75000 
WHERE code = 'WH002' AND capacity_cubic_meters IS NULL;

UPDATE warehouses 
SET capacity_cubic_meters = 60000 
WHERE code = 'WH003' AND capacity_cubic_meters IS NULL;
