/*
  # Initial schema and seed data for VeriLink SCM

  1. New Tables
    - `organizations` - Organization information
    - `warehouses` - Warehouse facilities
    - `inventory_items` - Inventory items
    - `suppliers` - Supplier information
    - `purchase_orders` - Purchase orders
    - `profiles` - User profiles linked to auth.users

  2. Security
    - Enable RLS on relevant tables
    - Add necessary policies for authenticated users

  3. Seed Data
    - Default organization
    - Sample warehouses
    - Sample suppliers
    - User profiles setup
*/

-- Create Organizations Table
CREATE TABLE IF NOT EXISTS public.organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name character varying(255) NOT NULL,
  code character varying(50) NOT NULL UNIQUE,
  description text,
  industry character varying(100),
  headquarters_address text,
  compliance_certifications jsonb DEFAULT '[]'::jsonb,
  blockchain_node_id character varying(64),
  ai_ethics_settings jsonb DEFAULT '{"bias_monitoring": true, "transparency_level": "high", "human_oversight_required": true}'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb
);

-- Create Warehouses Table
CREATE TABLE IF NOT EXISTS public.warehouses (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  code character varying(20) NOT NULL UNIQUE,
  name character varying(255) NOT NULL,
  description text,
  address text,
  city character varying(100),
  country character varying(100),
  postal_code character varying(20),
  latitude numeric(10,8),
  longitude numeric(11,8),
  total_capacity numeric(12,2) COMMENT 'Total capacity in cubic meters',
  used_capacity numeric(12,2) NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  deleted_by uuid,
  version character varying(36) NOT NULL DEFAULT uuid_generate_v4(),
  metadata jsonb,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  capacity_cubic_meters numeric(15,2),
  contact_person character varying(255),
  phone character varying(50),
  email character varying(255),
  
  -- Constraints
  CONSTRAINT ck_warehouse_capacity_valid CHECK (total_capacity IS NULL OR used_capacity <= total_capacity),
  CONSTRAINT ck_warehouse_total_capacity_positive CHECK (total_capacity IS NULL OR total_capacity > 0),
  CONSTRAINT ck_warehouse_used_capacity_positive CHECK (used_capacity >= 0)
);

-- Create Inventory Items Table
CREATE TABLE IF NOT EXISTS public.inventory_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku character varying(50) NOT NULL UNIQUE,
  name character varying(255) NOT NULL,
  description text,
  category character varying(100) NOT NULL,
  on_hand integer NOT NULL DEFAULT 0,
  reserved integer NOT NULL DEFAULT 0,
  in_transit integer NOT NULL DEFAULT 0,
  reorder_point integer NOT NULL DEFAULT 0,
  reorder_quantity integer NOT NULL DEFAULT 0,
  max_stock_level integer,
  unit_cost numeric(10,2),
  last_cost numeric(10,2),
  average_cost numeric(10,2),
  status character varying(20) NOT NULL DEFAULT 'available',
  is_active boolean NOT NULL DEFAULT true,
  is_serialized boolean NOT NULL DEFAULT false,
  is_lot_tracked boolean NOT NULL DEFAULT false,
  warehouse_id uuid NOT NULL REFERENCES warehouses(id),
  location_code character varying(50),
  ai_predicted_demand jsonb,
  blockchain_hash character varying(64) UNIQUE,
  last_blockchain_sync timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  is_deleted boolean NOT NULL DEFAULT false,
  deleted_at timestamptz,
  deleted_by uuid,
  version character varying(36) NOT NULL DEFAULT uuid_generate_v4(),
  metadata jsonb,
  organization_id uuid NOT NULL REFERENCES organizations(id),
  
  -- Constraints
  CONSTRAINT ck_in_transit_positive CHECK (in_transit >= 0),
  CONSTRAINT ck_on_hand_positive CHECK (on_hand >= 0),
  CONSTRAINT ck_reorder_point_positive CHECK (reorder_point >= 0),
  CONSTRAINT ck_reserved_positive CHECK (reserved >= 0)
);

-- Create Suppliers Table
CREATE TABLE IF NOT EXISTS public.suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  code character varying(50) NOT NULL,
  name character varying(255) NOT NULL,
  description text,
  contact_person character varying(255),
  email character varying(255),
  phone character varying(50),
  address text,
  city character varying(100),
  state character varying(100),
  country character varying(100),
  postal_code character varying(20),
  tax_id character varying(50),
  payment_terms character varying(100),
  credit_limit numeric(12,2),
  currency character varying(3) DEFAULT 'USD',
  ai_performance_score numeric(5,2) DEFAULT 0,
  ai_risk_score numeric(5,2) DEFAULT 0,
  ai_model_version character varying(50),
  last_ai_evaluation timestamptz,
  performance_metrics jsonb DEFAULT '{"quality_score": 0, "response_time": 0, "invoice_accuracy": 0, "on_time_delivery": 0}'::jsonb,
  certifications jsonb DEFAULT '[]'::jsonb,
  blockchain_verified boolean DEFAULT false,
  blockchain_hash character varying(64),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  metadata jsonb,
  
  -- Constraints
  CONSTRAINT suppliers_organization_id_code_key UNIQUE (organization_id, code)
);

-- Create Purchase Orders Table
CREATE TABLE IF NOT EXISTS public.purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  po_number character varying(50) NOT NULL UNIQUE,
  supplier_id uuid NOT NULL REFERENCES suppliers(id),
  status character varying(20) DEFAULT 'draft',
  priority character varying(10) DEFAULT 'normal',
  currency character varying(3) DEFAULT 'USD',
  subtotal numeric(12,2) DEFAULT 0,
  tax_amount numeric(12,2) DEFAULT 0,
  shipping_amount numeric(12,2) DEFAULT 0,
  total_amount numeric(12,2) DEFAULT 0,
  order_date timestamptz DEFAULT now(),
  expected_delivery_date timestamptz,
  actual_delivery_date timestamptz,
  payment_terms character varying(100),
  shipping_address text,
  billing_address text,
  notes text,
  approval_workflow jsonb DEFAULT '[]'::jsonb,
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  blockchain_tx_hash character varying(64),
  blockchain_verified boolean DEFAULT false,
  ai_fraud_score numeric(5,2),
  ai_risk_assessment jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  metadata jsonb
);

-- Create Purchase Order Items Table
CREATE TABLE IF NOT EXISTS public.purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id uuid NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  item_id uuid REFERENCES inventory_items(id),
  sku character varying(50),
  description text NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(12,2) NOT NULL,
  received_quantity integer DEFAULT 0,
  quality_score numeric(3,2),
  inspection_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Profiles Table (for auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  role text DEFAULT 'user',
  organization_id uuid DEFAULT '550e8400-e29b-41d4-a716-446655440000'::uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create Shipments Table
CREATE TABLE IF NOT EXISTS public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  shipment_number character varying(50) NOT NULL UNIQUE,
  po_id uuid REFERENCES purchase_orders(id),
  carrier_id uuid,
  vehicle_id uuid,
  route_id uuid,
  status character varying(20) DEFAULT 'pending',
  priority character varying(10) DEFAULT 'normal',
  shipment_type character varying(50) DEFAULT 'outbound',
  origin_warehouse_id uuid REFERENCES warehouses(id),
  destination_address text,
  destination_coordinates jsonb,
  tracking_number character varying(100),
  planned_pickup_date timestamptz,
  actual_pickup_date timestamptz,
  planned_delivery_date timestamptz,
  actual_delivery_date timestamptz,
  total_weight numeric(10,2),
  total_volume numeric(10,2),
  package_count integer DEFAULT 1,
  special_instructions text,
  temperature_requirements jsonb,
  handling_requirements jsonb DEFAULT '[]'::jsonb,
  insurance_value numeric(12,2),
  shipping_cost numeric(12,2),
  fuel_surcharge numeric(12,2),
  additional_charges jsonb DEFAULT '{}'::jsonb,
  proof_of_delivery jsonb,
  delivery_issues jsonb DEFAULT '[]'::jsonb,
  gps_tracking jsonb DEFAULT '[]'::jsonb,
  blockchain_hash character varying(64),
  ai_risk_assessment jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  metadata jsonb
);

-- Create Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  invoice_number character varying(50) NOT NULL UNIQUE,
  invoice_type character varying(20) DEFAULT 'supplier',
  supplier_id uuid REFERENCES suppliers(id),
  carrier_id uuid,
  po_id uuid REFERENCES purchase_orders(id),
  shipment_id uuid REFERENCES shipments(id),
  status character varying(20) DEFAULT 'pending',
  currency character varying(3) DEFAULT 'USD',
  subtotal numeric(12,2) DEFAULT 0,
  tax_amount numeric(12,2) DEFAULT 0,
  discount_amount numeric(12,2) DEFAULT 0,
  shipping_amount numeric(12,2) DEFAULT 0,
  total_amount numeric(12,2) DEFAULT 0,
  invoice_date timestamptz DEFAULT now(),
  due_date timestamptz,
  payment_terms character varying(100),
  line_items jsonb DEFAULT '[]'::jsonb,
  tax_breakdown jsonb DEFAULT '{}'::jsonb,
  payment_method character varying(50),
  payment_reference character varying(100),
  ai_fraud_score numeric(5,2),
  ai_audit_flags jsonb DEFAULT '[]'::jsonb,
  approval_workflow jsonb DEFAULT '[]'::jsonb,
  approved_by uuid REFERENCES auth.users(id),
  approved_at timestamptz,
  blockchain_verified boolean DEFAULT false,
  blockchain_hash character varying(64),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_by uuid REFERENCES auth.users(id),
  metadata jsonb
);

-- Create Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  payment_reference character varying(100) NOT NULL,
  invoice_id uuid REFERENCES invoices(id),
  payment_method character varying(50) NOT NULL,
  payment_gateway character varying(50),
  transaction_id character varying(100),
  status character varying(20) DEFAULT 'pending',
  currency character varying(3) DEFAULT 'USD',
  amount numeric(12,2) NOT NULL,
  exchange_rate numeric(10,6) DEFAULT 1.0,
  base_amount numeric(12,2),
  fees numeric(12,2) DEFAULT 0,
  payment_date timestamptz,
  settlement_date timestamptz,
  bank_details jsonb,
  reconciliation_status character varying(20) DEFAULT 'pending',
  reconciled_at timestamptz,
  reconciled_by uuid REFERENCES auth.users(id),
  blockchain_verified boolean DEFAULT false,
  blockchain_hash character varying(64),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  metadata jsonb
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_inventory_status_category ON inventory_items (status, category);
CREATE INDEX IF NOT EXISTS idx_shipments_status_date ON shipments (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status_date ON purchase_orders (status, order_date DESC);

-- Seed Default Organization (if it doesn't exist)
INSERT INTO organizations (id, name, code, description, industry, is_active)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'VeriLink Demo Organization',
  'VERILINK',
  'Default organization for VeriLink SCM demo',
  'Manufacturing',
  true
)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Policies for Organizations
CREATE POLICY "Users can view own organization" 
ON organizations FOR SELECT
TO authenticated
USING (id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Policies for Suppliers
CREATE POLICY "Users can manage organization suppliers" 
ON suppliers FOR ALL
TO authenticated
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Policies for Warehouses
CREATE POLICY "Users can manage organization warehouses" 
ON warehouses FOR ALL
TO authenticated
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Policies for Inventory Items
CREATE POLICY "Users can manage organization inventory" 
ON inventory_items FOR ALL
TO authenticated
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Policies for Purchase Orders
CREATE POLICY "Users can manage organization purchase orders" 
ON purchase_orders FOR ALL
TO authenticated
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Policies for Purchase Order Items
CREATE POLICY "Users can manage organization po items" 
ON purchase_order_items FOR ALL
TO authenticated
USING (EXISTS (
  SELECT 1 FROM purchase_orders po
  WHERE po.id = purchase_order_items.po_id
  AND po.organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
));

-- Policies for Shipments
CREATE POLICY "Users can manage organization shipments" 
ON shipments FOR ALL
TO authenticated
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Policies for Invoices
CREATE POLICY "Users can manage organization invoices" 
ON invoices FOR ALL
TO authenticated
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Policies for Payments
CREATE POLICY "Users can manage organization payments" 
ON payments FOR ALL
TO authenticated
USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Policies for Profiles
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT
TO authenticated
USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid());

-- Seed Sample Data
-- Sample Warehouses
INSERT INTO warehouses (
  code, 
  name, 
  description, 
  address, 
  city, 
  country, 
  postal_code, 
  total_capacity, 
  used_capacity, 
  organization_id,
  capacity_cubic_meters,
  contact_person,
  phone,
  email
)
VALUES
  (
    'WH001', 
    'Main Warehouse', 
    'Primary distribution center', 
    '123 Logistics Way', 
    'Chicago', 
    'USA', 
    '60007', 
    10000, 
    3500, 
    '550e8400-e29b-41d4-a716-446655440000',
    10000,
    'John Smith',
    '+1-555-123-4567',
    'warehouse@verilink.com'
  ),
  (
    'WH002', 
    'West Coast Facility', 
    'Western regional distribution', 
    '456 Supply Chain Blvd', 
    'Los Angeles', 
    'USA', 
    '90001', 
    8500, 
    4200, 
    '550e8400-e29b-41d4-a716-446655440000',
    8500,
    'Sarah Johnson',
    '+1-555-987-6543',
    'westcoast@verilink.com'
  )
ON CONFLICT (code) DO NOTHING;

-- Sample Suppliers
INSERT INTO suppliers (
  organization_id,
  code,
  name,
  description,
  contact_person,
  email,
  phone,
  address,
  city,
  state,
  country,
  postal_code,
  payment_terms,
  currency,
  ai_performance_score,
  ai_risk_score,
  performance_metrics
)
VALUES
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'SUP001',
    'Global Electronics Inc',
    'Provider of electronic components',
    'James Wilson',
    'james@globalelectronics.com',
    '+1-555-444-3333',
    '789 Component Drive',
    'San Jose',
    'CA',
    'USA',
    '95123',
    'Net 30',
    'USD',
    4.2,
    1.5,
    '{"quality_score": 0.92, "response_time": 0.88, "invoice_accuracy": 0.95, "on_time_delivery": 0.96}'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'SUP002',
    'Precision Parts Co',
    'Manufacturer of precision mechanical components',
    'Lisa Chen',
    'lisa@precisionparts.com',
    '+1-555-222-1111',
    '456 Gear Avenue',
    'Detroit',
    'MI',
    'USA',
    '48201',
    'Net 45',
    'USD',
    3.9,
    2.1,
    '{"quality_score": 0.87, "response_time": 0.75, "invoice_accuracy": 0.92, "on_time_delivery": 0.88}'
  )
ON CONFLICT (organization_id, code) DO NOTHING;

-- Function for updating inventory status based on stock levels
CREATE OR REPLACE FUNCTION update_inventory_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.on_hand <= 0 THEN
    NEW.status := 'out_of_stock';
  ELSIF NEW.on_hand <= NEW.reorder_point THEN
    NEW.status := 'low_stock';
  ELSE
    NEW.status := 'available';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function for updating warehouse capacity
CREATE OR REPLACE FUNCTION update_warehouse_capacity()
RETURNS TRIGGER AS $$
DECLARE
  warehouse_record RECORD;
  total_usage NUMERIC;
BEGIN
  -- Get the warehouse record
  SELECT * INTO warehouse_record FROM warehouses WHERE id = NEW.warehouse_id;
  
  -- Calculate total usage
  SELECT COALESCE(SUM(on_hand * 0.01), 0) INTO total_usage
  FROM inventory_items
  WHERE warehouse_id = NEW.warehouse_id AND is_active = true;
  
  -- Update the warehouse capacity
  UPDATE warehouses
  SET used_capacity = total_usage
  WHERE id = NEW.warehouse_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function for audit logging
CREATE OR REPLACE FUNCTION audit_log()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (
    table_name,
    operation,
    record_id,
    old_data,
    new_data,
    changed_by,
    timestamp
  ) VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE row_to_json(OLD) END,
    CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE row_to_json(NEW) END,
    CASE
      WHEN TG_OP = 'INSERT' THEN NEW.created_by
      WHEN TG_OP = 'UPDATE' THEN NEW.updated_by
      ELSE NULL
    END,
    now()
  );
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function for updating updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for inventory status updates
CREATE TRIGGER inventory_status_update
BEFORE INSERT OR UPDATE OF on_hand, reorder_point ON inventory_items
FOR EACH ROW
EXECUTE FUNCTION update_inventory_status();

-- Create trigger for warehouse capacity updates
CREATE TRIGGER warehouse_capacity_update
AFTER INSERT OR UPDATE OF on_hand, warehouse_id, is_active ON inventory_items
FOR EACH ROW
EXECUTE FUNCTION update_warehouse_capacity();

-- Create trigger for profile updates
CREATE TRIGGER handle_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();