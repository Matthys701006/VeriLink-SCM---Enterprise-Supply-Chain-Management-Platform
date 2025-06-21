/*
  # OrchestrixSCM Foundation - Phase 1 Database Schema

  ## Overview
  This migration establishes the foundational database schema for OrchestrixSCM,
  a comprehensive supply chain management platform with blockchain integration,
  AI-driven insights, and multi-persona support.

  ## New Tables
  1. **personas** - User role definitions and permissions
  2. **organizations** - Multi-tenant organization support
  3. **suppliers** - Supplier management with AI scoring
  4. **purchase_orders** - Procurement management
  5. **blockchain_transactions** - Immutable transaction records
  6. **ai_models** - AI model metadata and versioning
  7. **audit_trail** - Enhanced audit logging
  8. **notifications** - Real-time notification system
  9. **workflow_templates** - Configurable business workflows
  10. **compliance_records** - Regulatory compliance tracking

  ## Security
  - Enable RLS on all tables
  - Multi-tenant data isolation
  - Audit logging for all operations
  - Role-based access control

  ## AI & Analytics
  - Supplier scoring integration
  - Demand forecasting data structures
  - Anomaly detection logging
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations table (multi-tenant support)
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(255) NOT NULL,
  code varchar(50) UNIQUE NOT NULL,
  description text,
  industry varchar(100),
  headquarters_address text,
  compliance_certifications jsonb DEFAULT '[]'::jsonb,
  blockchain_node_id varchar(64),
  ai_ethics_settings jsonb DEFAULT '{
    "bias_monitoring": true,
    "human_oversight_required": true,
    "transparency_level": "high"
  }'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb
);

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Personas table (role-based access control)
CREATE TABLE IF NOT EXISTS personas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  name varchar(100) NOT NULL,
  code varchar(50) NOT NULL,
  description text,
  permissions jsonb NOT NULL DEFAULT '[]'::jsonb,
  dashboard_config jsonb DEFAULT '{
    "widgets": [],
    "layout": "default",
    "theme": "professional"
  }'::jsonb,
  workflow_access jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, code)
);

ALTER TABLE personas ENABLE ROW LEVEL SECURITY;

-- Enhanced users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE users ADD COLUMN organization_id uuid REFERENCES organizations(id);
    ALTER TABLE users ADD COLUMN persona_id uuid REFERENCES personas(id);
    ALTER TABLE users ADD COLUMN full_name varchar(255);
    ALTER TABLE users ADD COLUMN phone varchar(50);
    ALTER TABLE users ADD COLUMN timezone varchar(50) DEFAULT 'UTC';
    ALTER TABLE users ADD COLUMN language_preference varchar(10) DEFAULT 'en';
    ALTER TABLE users ADD COLUMN accessibility_settings jsonb DEFAULT '{
      "low_stimulus_mode": false,
      "high_contrast": false,
      "screen_reader": false
    }'::jsonb;
    ALTER TABLE users ADD COLUMN last_active_at timestamptz;
    ALTER TABLE users ADD COLUMN mfa_enabled boolean DEFAULT false;
    ALTER TABLE users ADD COLUMN mfa_secret text;
  END IF;
END $$;

-- Suppliers table with AI scoring
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  code varchar(50) NOT NULL,
  name varchar(255) NOT NULL,
  description text,
  contact_person varchar(255),
  email varchar(255),
  phone varchar(50),
  address text,
  city varchar(100),
  state varchar(100),
  country varchar(100),
  postal_code varchar(20),
  tax_id varchar(50),
  payment_terms varchar(100),
  credit_limit numeric(12,2),
  currency varchar(3) DEFAULT 'USD',
  ai_performance_score numeric(5,2) DEFAULT 0,
  ai_risk_score numeric(5,2) DEFAULT 0,
  ai_model_version varchar(50),
  last_ai_evaluation timestamptz,
  performance_metrics jsonb DEFAULT '{
    "on_time_delivery": 0,
    "quality_score": 0,
    "invoice_accuracy": 0,
    "response_time": 0
  }'::jsonb,
  certifications jsonb DEFAULT '[]'::jsonb,
  blockchain_verified boolean DEFAULT false,
  blockchain_hash varchar(64),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id),
  metadata jsonb,
  UNIQUE(organization_id, code)
);

ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Purchase Orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  po_number varchar(50) UNIQUE NOT NULL,
  supplier_id uuid NOT NULL REFERENCES suppliers(id),
  status varchar(20) DEFAULT 'draft',
  priority varchar(10) DEFAULT 'normal',
  currency varchar(3) DEFAULT 'USD',
  subtotal numeric(12,2) DEFAULT 0,
  tax_amount numeric(12,2) DEFAULT 0,
  shipping_amount numeric(12,2) DEFAULT 0,
  total_amount numeric(12,2) DEFAULT 0,
  order_date timestamptz DEFAULT now(),
  expected_delivery_date timestamptz,
  actual_delivery_date timestamptz,
  payment_terms varchar(100),
  shipping_address text,
  billing_address text,
  notes text,
  approval_workflow jsonb DEFAULT '[]'::jsonb,
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  blockchain_tx_hash varchar(64),
  blockchain_verified boolean DEFAULT false,
  ai_fraud_score numeric(5,2),
  ai_risk_assessment jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id),
  metadata jsonb
);

ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

-- Purchase Order Line Items
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id uuid NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  item_id uuid REFERENCES inventory_items(id),
  sku varchar(50),
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

ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;

-- Blockchain Transactions (immutable ledger)
CREATE TABLE IF NOT EXISTS blockchain_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  transaction_hash varchar(64) UNIQUE NOT NULL,
  block_number bigint,
  transaction_type varchar(50) NOT NULL,
  entity_type varchar(50) NOT NULL,
  entity_id uuid NOT NULL,
  payload jsonb NOT NULL,
  gas_used bigint,
  gas_price numeric(20,8),
  timestamp timestamptz DEFAULT now(),
  verified boolean DEFAULT false,
  verification_attempts integer DEFAULT 0,
  metadata jsonb
);

ALTER TABLE blockchain_transactions ENABLE ROW LEVEL SECURITY;

-- AI Models registry
CREATE TABLE IF NOT EXISTS ai_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  name varchar(255) NOT NULL,
  version varchar(50) NOT NULL,
  model_type varchar(50) NOT NULL,
  description text,
  training_data_hash varchar(64),
  accuracy_metrics jsonb,
  bias_audit_results jsonb,
  ethical_review_status varchar(20) DEFAULT 'pending',
  deployment_status varchar(20) DEFAULT 'inactive',
  endpoint_url text,
  last_retrained_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb,
  UNIQUE(organization_id, name, version)
);

ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;

-- Enhanced audit trail
CREATE TABLE IF NOT EXISTS audit_trail (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organizations(id),
  trace_id varchar(64),
  session_id varchar(64),
  user_id uuid REFERENCES users(id),
  persona varchar(50),
  action varchar(100) NOT NULL,
  entity_type varchar(50),
  entity_id uuid,
  ip_address inet,
  user_agent text,
  old_values jsonb,
  new_values jsonb,
  risk_score numeric(5,2),
  compliance_flags jsonb DEFAULT '[]'::jsonb,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb
);

ALTER TABLE audit_trail ENABLE ROW LEVEL SECURITY;

-- Notifications system
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  recipient_id uuid NOT NULL REFERENCES users(id),
  sender_id uuid REFERENCES users(id),
  type varchar(50) NOT NULL,
  priority varchar(10) DEFAULT 'normal',
  title varchar(255) NOT NULL,
  message text NOT NULL,
  action_url text,
  action_data jsonb,
  is_read boolean DEFAULT false,
  read_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  metadata jsonb
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Workflow Templates
CREATE TABLE IF NOT EXISTS workflow_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  name varchar(255) NOT NULL,
  description text,
  trigger_type varchar(50) NOT NULL,
  trigger_conditions jsonb,
  workflow_steps jsonb NOT NULL,
  approval_matrix jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  metadata jsonb
);

ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;

-- Compliance Records
CREATE TABLE IF NOT EXISTS compliance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  regulation_type varchar(50) NOT NULL,
  entity_type varchar(50) NOT NULL,
  entity_id uuid NOT NULL,
  compliance_status varchar(20) DEFAULT 'pending',
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

ALTER TABLE compliance_records ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_organization_persona ON users(organization_id, persona_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_ai_scores ON suppliers(ai_performance_score DESC, ai_risk_score ASC);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status_date ON purchase_orders(status, order_date DESC);
CREATE INDEX IF NOT EXISTS idx_blockchain_tx_hash ON blockchain_transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_audit_trail_user_timestamp ON audit_trail(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread ON notifications(recipient_id, is_read, created_at DESC);

-- Row Level Security Policies

-- Organizations: Users can only see their own organization
CREATE POLICY "Users can view own organization"
  ON organizations FOR SELECT
  TO authenticated
  USING (id = (SELECT organization_id FROM users WHERE users.id = auth.uid()));

-- Personas: Users can view personas in their organization
CREATE POLICY "Users can view organization personas"
  ON personas FOR SELECT
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE users.id = auth.uid()));

-- Suppliers: Organization-scoped access
CREATE POLICY "Users can manage organization suppliers"
  ON suppliers FOR ALL
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE users.id = auth.uid()));

-- Purchase Orders: Organization-scoped access
CREATE POLICY "Users can manage organization purchase orders"
  ON purchase_orders FOR ALL
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE users.id = auth.uid()));

-- Enhanced inventory items with organization scope
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'inventory_items' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE inventory_items ADD COLUMN organization_id uuid REFERENCES organizations(id);
    -- Update existing items to belong to first organization (you'll need to adjust this)
    UPDATE inventory_items SET organization_id = (SELECT id FROM organizations LIMIT 1) WHERE organization_id IS NULL;
    ALTER TABLE inventory_items ALTER COLUMN organization_id SET NOT NULL;
  END IF;
END $$;

-- Enhanced warehouses with organization scope
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'warehouses' AND column_name = 'organization_id'
  ) THEN
    ALTER TABLE warehouses ADD COLUMN organization_id uuid REFERENCES organizations(id);
    UPDATE warehouses SET organization_id = (SELECT id FROM organizations LIMIT 1) WHERE organization_id IS NULL;
    ALTER TABLE warehouses ALTER COLUMN organization_id SET NOT NULL;
  END IF;
END $$;

-- Insert default organization and personas
DO $$
DECLARE
    org_id uuid;
    scm_persona_id uuid;
    proc_persona_id uuid;
    wms_persona_id uuid;
    finance_persona_id uuid;
BEGIN
  -- Create default organization
  INSERT INTO organizations (id, name, code, description, industry)
  VALUES (
    gen_random_uuid(),
    'OrchestrixSCM Enterprise',
    'ORCHESTRIX',
    'Advanced Supply Chain Management Platform',
    'Technology'
  )
  ON CONFLICT (code) DO NOTHING
  RETURNING id INTO org_id;

  -- Get the organization ID if it already exists
  IF org_id IS NULL THEN
    SELECT id INTO org_id FROM organizations WHERE code = 'ORCHESTRIX';
  END IF;

  -- Create personas
  INSERT INTO personas (organization_id, name, code, description, permissions, dashboard_config) VALUES
  (org_id, 'Supply Chain Manager', 'SCM_MANAGER', 'End-to-end supply chain oversight and control', 
   '["inventory.read", "inventory.write", "warehouses.read", "analytics.read", "procurement.read", "dashboard.scm"]'::jsonb,
   '{"widgets": ["inventory_status", "low_stock_alerts", "warehouse_utilization", "supplier_performance"], "layout": "executive"}'::jsonb),
  
  (org_id, 'Procurement Officer', 'PROCUREMENT', 'Purchase orders, supplier management, and fraud detection',
   '["procurement.read", "procurement.write", "suppliers.read", "suppliers.write", "analytics.procurement"]'::jsonb,
   '{"widgets": ["pending_pos", "supplier_scores", "fraud_alerts", "spend_analysis"], "layout": "operational"}'::jsonb),
   
  (org_id, 'Warehouse Supervisor', 'WMS_SUPERVISOR', 'Warehouse operations, capacity planning, and IoT monitoring',
   '["warehouses.read", "warehouses.write", "inventory.read", "inventory.write", "iot.read"]'::jsonb,
   '{"widgets": ["warehouse_capacity", "inbound_outbound", "picking_efficiency", "iot_sensors"], "layout": "operational"}'::jsonb),
   
  (org_id, 'Logistics Coordinator', 'LOGISTICS', 'Transportation, route planning, and delivery tracking',
   '["logistics.read", "logistics.write", "routes.read", "tracking.read"]'::jsonb,
   '{"widgets": ["active_shipments", "route_optimization", "carrier_performance", "delivery_status"], "layout": "operational"}'::jsonb),
   
  (org_id, 'Finance Team Member', 'FINANCE', 'Cost reconciliation, freight audits, and payment compliance',
   '["finance.read", "finance.write", "audit.read", "compliance.read"]'::jsonb,
   '{"widgets": ["cost_analysis", "invoice_matching", "payment_status", "budget_variance"], "layout": "analytical"}'::jsonb),
   
  (org_id, 'Ethics & Compliance Officer', 'ETHICS_COMPLIANCE', 'Bias monitoring, blockchain audits, and regulatory compliance',
   '["ethics.read", "compliance.read", "audit.read", "blockchain.read"]'::jsonb,
   '{"widgets": ["bias_monitoring", "compliance_status", "audit_logs", "whistleblower_reports"], "layout": "compliance"}'::jsonb)
  
  ON CONFLICT (organization_id, code) DO NOTHING;

END $$;