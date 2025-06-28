/*
# Sample Data for SCM System

1. New Tables
  - `compliance_records` - For tracking regulatory compliance status

2. Sample Data
  - Inventory items
  - Purchase orders
  - Shipments
  - Invoices
  - Compliance records

3. RLS Policies
  - Added policies for compliance records
*/

-- Create Compliance Records Table (this is missing from the schema)
CREATE TABLE IF NOT EXISTS public.compliance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  regulation_type character varying(50) NOT NULL,
  entity_type character varying(50) NOT NULL,
  entity_id uuid NOT NULL,
  compliance_status character varying(20) DEFAULT 'pending',
  assessment_date timestamptz DEFAULT now(),
  expiry_date timestamptz,
  assessor_id uuid REFERENCES users(id),
  evidence_documents jsonb DEFAULT '[]'::jsonb,
  violations jsonb DEFAULT '[]'::jsonb,
  remediation_plan text,
  next_review_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb
);

-- Sample Inventory Items
INSERT INTO inventory_items (
  sku,
  name,
  description,
  category,
  on_hand,
  reserved,
  reorder_point,
  reorder_quantity,
  unit_cost,
  status,
  warehouse_id,
  organization_id
)
SELECT 
  'SKU-' || RIGHT('0000' || i::text, 4),
  'Product ' || i,
  'This is a sample product ' || i,
  CASE (i % 5)
    WHEN 0 THEN 'Electronics'
    WHEN 1 THEN 'Components'
    WHEN 2 THEN 'Hardware'
    WHEN 3 THEN 'Software'
    WHEN 4 THEN 'Accessories'
  END,
  50 + (i % 100),
  (i % 20),
  20 + (i % 30),
  40 + (i % 30),
  10.00 + (i % 90),
  CASE 
    WHEN (i % 10) = 0 THEN 'out_of_stock'
    WHEN (i % 5) = 0 THEN 'low_stock'
    ELSE 'available'
  END,
  CASE 
    WHEN (i % 2) = 0 THEN (SELECT id FROM warehouses WHERE code = 'WH001' LIMIT 1)
    ELSE (SELECT id FROM warehouses WHERE code = 'WH002' LIMIT 1)
  END,
  '550e8400-e29b-41d4-a716-446655440000'
FROM generate_series(1, 20) i
ON CONFLICT (sku) DO NOTHING;

-- Sample Purchase Orders
INSERT INTO purchase_orders (
  po_number,
  organization_id,
  supplier_id,
  status,
  priority,
  subtotal,
  tax_amount,
  shipping_amount,
  total_amount,
  order_date,
  expected_delivery_date,
  payment_terms,
  shipping_address,
  notes
)
SELECT
  'PO-' || RIGHT('0000' || i::text, 4),
  '550e8400-e29b-41d4-a716-446655440000',
  CASE 
    WHEN (i % 2) = 0 THEN (SELECT id FROM suppliers WHERE code = 'SUP001' LIMIT 1)
    ELSE (SELECT id FROM suppliers WHERE code = 'SUP002' LIMIT 1)
  END,
  CASE (i % 5)
    WHEN 0 THEN 'draft'
    WHEN 1 THEN 'pending'
    WHEN 2 THEN 'approved'
    WHEN 3 THEN 'delivered'
    WHEN 4 THEN 'cancelled'
  END,
  CASE (i % 3)
    WHEN 0 THEN 'low'
    WHEN 1 THEN 'normal'
    WHEN 2 THEN 'high'
  END,
  1000.00 + (i * 100),
  (1000.00 + (i * 100)) * 0.07,
  50.00,
  (1000.00 + (i * 100)) * 1.07 + 50.00,
  now() - ((i % 60)::text || ' days')::interval,
  now() + ((i % 30)::text || ' days')::interval,
  'Net 30',
  '123 Main St, Chicago, IL 60601',
  'Sample purchase order ' || i
FROM generate_series(1, 10) i
ON CONFLICT (po_number) DO NOTHING;

-- Sample Shipments
INSERT INTO shipments (
  shipment_number,
  organization_id,
  po_id,
  status,
  priority,
  tracking_number,
  destination_address,
  planned_delivery_date,
  total_weight,
  total_volume,
  package_count,
  shipping_cost,
  special_instructions
)
SELECT
  'SH-' || RIGHT('0000' || i::text, 4),
  '550e8400-e29b-41d4-a716-446655440000',
  (SELECT id FROM purchase_orders LIMIT 1 OFFSET (i % 10)),
  CASE (i % 4)
    WHEN 0 THEN 'pending'
    WHEN 1 THEN 'in_transit'
    WHEN 2 THEN 'delivered'
    WHEN 3 THEN 'cancelled'
  END,
  CASE (i % 3)
    WHEN 0 THEN 'low'
    WHEN 1 THEN 'normal'
    WHEN 2 THEN 'high'
  END,
  'TRK' || LPAD((1000 + i)::text, 7, '0'),
  '456 Distribution Ave, Los Angeles, CA 90001',
  now() + ((i % 14)::text || ' days')::interval,
  100.00 + (i * 10),
  5.00 + (i * 0.5),
  1 + (i % 5),
  75.00 + (i * 5),
  CASE 
    WHEN (i % 4) = 0 THEN 'Handle with care'
    WHEN (i % 4) = 1 THEN 'Fragile contents'
    WHEN (i % 4) = 2 THEN 'Refrigeration required'
    ELSE NULL
  END
FROM generate_series(1, 15) i
ON CONFLICT (shipment_number) DO NOTHING;

-- Sample Invoices
INSERT INTO invoices (
  invoice_number,
  organization_id,
  supplier_id,
  po_id,
  status,
  subtotal,
  tax_amount,
  total_amount,
  invoice_date,
  due_date,
  payment_terms
)
SELECT
  'INV-' || RIGHT('0000' || i::text, 4),
  '550e8400-e29b-41d4-a716-446655440000',
  CASE 
    WHEN (i % 2) = 0 THEN (SELECT id FROM suppliers WHERE code = 'SUP001' LIMIT 1)
    ELSE (SELECT id FROM suppliers WHERE code = 'SUP002' LIMIT 1)
  END,
  (SELECT id FROM purchase_orders LIMIT 1 OFFSET (i % 10)),
  CASE (i % 4)
    WHEN 0 THEN 'draft'
    WHEN 1 THEN 'pending'
    WHEN 2 THEN 'approved'
    WHEN 3 THEN 'paid'
  END,
  1000.00 + (i * 100),
  (1000.00 + (i * 100)) * 0.07,
  (1000.00 + (i * 100)) * 1.07,
  now() - ((i % 30)::text || ' days')::interval,
  now() + ((30 - (i % 30))::text || ' days')::interval,
  'Net 30'
FROM generate_series(1, 12) i
ON CONFLICT (invoice_number) DO NOTHING;

-- Sample Compliance Records - Fixed with proper JSONB handling
INSERT INTO compliance_records (
  organization_id,
  regulation_type,
  entity_type,
  entity_id,
  compliance_status,
  assessment_date,
  expiry_date,
  evidence_documents,
  violations,
  next_review_date
)
SELECT
  '550e8400-e29b-41d4-a716-446655440000',
  CASE (i % 4)
    WHEN 0 THEN 'GDPR'
    WHEN 1 THEN 'ISO 27001'
    WHEN 2 THEN 'CCPA'
    WHEN 3 THEN 'SOC 2'
  END,
  'System',
  gen_random_uuid(),  -- Generate a proper UUID for each record
  CASE (i % 3)
    WHEN 0 THEN 'compliant'
    WHEN 1 THEN 'non_compliant'
    WHEN 2 THEN 'pending'
  END,
  now() - ((i % 90)::text || ' days')::interval,
  now() + ((180 + (i % 180))::text || ' days')::interval,
  '[]'::jsonb,
  CASE 
    WHEN (i % 3) = 1 THEN '[{"violation": "Missing documentation", "severity": "medium"}]'::jsonb
    ELSE '[]'::jsonb
  END,
  now() + ((90 + (i % 90))::text || ' days')::interval
FROM generate_series(1, 15) i
ON CONFLICT DO NOTHING;

-- Enable RLS Policies for Compliance Records
ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;

-- Create RLS Policy for Compliance Records if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'compliance_records' 
        AND policyname = 'Users can view organization compliance records'
    ) THEN
        CREATE POLICY "Users can view organization compliance records"
        ON compliance_records FOR SELECT
        TO authenticated
        USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));
    END IF;
END
$$;