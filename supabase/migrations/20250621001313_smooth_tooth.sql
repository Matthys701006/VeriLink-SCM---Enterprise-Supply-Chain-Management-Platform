/*
  # VeriLink SCM - Logistics & Finance Modules

  1. New Tables
    - `shipments` - Track all shipments and deliveries
    - `carriers` - Transportation companies and services
    - `routes` - Optimized delivery routes
    - `vehicles` - Fleet management
    - `invoices` - Financial transactions
    - `payments` - Payment processing
    - `cost_centers` - Budget and cost tracking
    - `contracts` - Supplier and carrier contracts
    - `analytics_snapshots` - Cached analytics data
    - `ml_models` - AI model metadata
    - `iot_sensors` - IoT device management
    - `sensor_readings` - Real-time sensor data

  2. Security
    - Enable RLS on all tables
    - Add organization-scoped policies
    - Add persona-based access policies

  3. Features
    - Real-time tracking
    - Route optimization
    - Financial controls
    - IoT integration
*/

-- Carriers and Transportation
CREATE TABLE IF NOT EXISTS carriers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  code varchar(50) NOT NULL,
  name varchar(255) NOT NULL,
  carrier_type varchar(50) NOT NULL DEFAULT 'ground', -- ground, air, sea, rail
  contact_info jsonb DEFAULT '{}',
  service_areas jsonb DEFAULT '[]',
  capabilities jsonb DEFAULT '{}', -- weight limits, special handling
  performance_metrics jsonb DEFAULT '{
    "on_time_percentage": 0,
    "damage_rate": 0,
    "cost_efficiency": 0,
    "customer_satisfaction": 0
  }',
  ai_performance_score numeric(5,2) DEFAULT 0,
  ai_risk_score numeric(5,2) DEFAULT 0,
  contract_terms jsonb DEFAULT '{}',
  insurance_info jsonb DEFAULT '{}',
  certifications jsonb DEFAULT '[]',
  blockchain_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id),
  metadata jsonb DEFAULT NULL,
  CONSTRAINT carriers_organization_code_key UNIQUE(organization_id, code)
);

-- Vehicles and Fleet
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  carrier_id uuid REFERENCES carriers(id),
  vehicle_id varchar(50) NOT NULL,
  vehicle_type varchar(50) NOT NULL, -- truck, van, drone, ship, etc.
  make_model varchar(255),
  year integer,
  capacity_weight numeric(10,2),
  capacity_volume numeric(10,2),
  fuel_type varchar(50),
  current_location jsonb, -- {lat, lng, timestamp}
  status varchar(20) DEFAULT 'available', -- available, in_transit, maintenance, offline
  iot_device_id varchar(100),
  maintenance_schedule jsonb DEFAULT '{}',
  certifications jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT NULL
);

-- Routes and Optimization
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  route_name varchar(255) NOT NULL,
  origin_address text,
  destination_address text,
  waypoints jsonb DEFAULT '[]', -- intermediate stops
  distance_km numeric(10,2),
  estimated_duration integer, -- minutes
  optimization_params jsonb DEFAULT '{}',
  ai_optimized boolean DEFAULT false,
  carbon_footprint numeric(10,4), -- kg CO2
  cost_estimate numeric(12,2),
  traffic_pattern jsonb DEFAULT '{}',
  weather_considerations jsonb DEFAULT '{}',
  restrictions jsonb DEFAULT '{}', -- time windows, vehicle restrictions
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  metadata jsonb DEFAULT NULL
);

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  shipment_number varchar(50) NOT NULL,
  po_id uuid REFERENCES purchase_orders(id),
  carrier_id uuid REFERENCES carriers(id),
  vehicle_id uuid REFERENCES vehicles(id),
  route_id uuid REFERENCES routes(id),
  status varchar(20) DEFAULT 'pending', -- pending, picked_up, in_transit, delivered, cancelled
  priority varchar(10) DEFAULT 'normal',
  shipment_type varchar(50) DEFAULT 'outbound', -- inbound, outbound, internal
  origin_warehouse_id uuid REFERENCES warehouses(id),
  destination_address text,
  destination_coordinates jsonb, -- {lat, lng}
  tracking_number varchar(100),
  planned_pickup_date timestamptz,
  actual_pickup_date timestamptz,
  planned_delivery_date timestamptz,
  actual_delivery_date timestamptz,
  total_weight numeric(10,2),
  total_volume numeric(10,2),
  package_count integer DEFAULT 1,
  special_instructions text,
  temperature_requirements jsonb, -- {min, max, unit}
  handling_requirements jsonb DEFAULT '[]',
  insurance_value numeric(12,2),
  shipping_cost numeric(12,2),
  fuel_surcharge numeric(12,2),
  additional_charges jsonb DEFAULT '{}',
  proof_of_delivery jsonb, -- signatures, photos, timestamps
  delivery_issues jsonb DEFAULT '[]',
  gps_tracking jsonb DEFAULT '[]', -- real-time location updates
  blockchain_hash varchar(64),
  ai_risk_assessment jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id),
  metadata jsonb DEFAULT NULL,
  CONSTRAINT shipments_number_key UNIQUE(shipment_number)
);

-- Invoices and Financial Management
CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  invoice_number varchar(50) NOT NULL,
  invoice_type varchar(20) DEFAULT 'supplier', -- supplier, customer, carrier
  supplier_id uuid REFERENCES suppliers(id),
  carrier_id uuid REFERENCES carriers(id),
  po_id uuid REFERENCES purchase_orders(id),
  shipment_id uuid REFERENCES shipments(id),
  status varchar(20) DEFAULT 'pending', -- pending, approved, paid, overdue, disputed
  currency varchar(3) DEFAULT 'USD',
  subtotal numeric(12,2) DEFAULT 0,
  tax_amount numeric(12,2) DEFAULT 0,
  discount_amount numeric(12,2) DEFAULT 0,
  shipping_amount numeric(12,2) DEFAULT 0,
  total_amount numeric(12,2) DEFAULT 0,
  invoice_date timestamptz DEFAULT now(),
  due_date timestamptz,
  payment_terms varchar(100),
  line_items jsonb DEFAULT '[]',
  tax_breakdown jsonb DEFAULT '{}',
  payment_method varchar(50),
  payment_reference varchar(100),
  ai_fraud_score numeric(5,2),
  ai_audit_flags jsonb DEFAULT '[]',
  approval_workflow jsonb DEFAULT '[]',
  approved_by uuid REFERENCES users(id),
  approved_at timestamptz,
  blockchain_verified boolean DEFAULT false,
  blockchain_hash varchar(64),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id),
  metadata jsonb DEFAULT NULL,
  CONSTRAINT invoices_number_key UNIQUE(invoice_number)
);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  payment_reference varchar(100) NOT NULL,
  invoice_id uuid REFERENCES invoices(id),
  payment_method varchar(50) NOT NULL, -- bank_transfer, credit_card, check, etc.
  payment_gateway varchar(50),
  transaction_id varchar(100),
  status varchar(20) DEFAULT 'pending', -- pending, completed, failed, cancelled
  currency varchar(3) DEFAULT 'USD',
  amount numeric(12,2) NOT NULL,
  exchange_rate numeric(10,6) DEFAULT 1.0,
  base_amount numeric(12,2), -- amount in organization's base currency
  fees numeric(12,2) DEFAULT 0,
  payment_date timestamptz,
  settlement_date timestamptz,
  bank_details jsonb,
  reconciliation_status varchar(20) DEFAULT 'pending',
  reconciled_at timestamptz,
  reconciled_by uuid REFERENCES users(id),
  blockchain_verified boolean DEFAULT false,
  blockchain_hash varchar(64),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  metadata jsonb DEFAULT NULL
);

-- Cost Centers for Budget Management
CREATE TABLE IF NOT EXISTS cost_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  code varchar(50) NOT NULL,
  name varchar(255) NOT NULL,
  description text,
  parent_id uuid REFERENCES cost_centers(id),
  cost_center_type varchar(50) DEFAULT 'operational', -- operational, project, department
  budget_annual numeric(15,2),
  budget_remaining numeric(15,2),
  manager_id uuid REFERENCES users(id),
  accounting_codes jsonb DEFAULT '{}',
  approval_limits jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT NULL,
  CONSTRAINT cost_centers_organization_code_key UNIQUE(organization_id, code)
);

-- Contracts Management
CREATE TABLE IF NOT EXISTS contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  contract_number varchar(50) NOT NULL,
  contract_type varchar(50) NOT NULL, -- supplier, carrier, customer, service
  counterparty_type varchar(20) NOT NULL, -- supplier, carrier, customer
  counterparty_id uuid, -- references suppliers(id) or carriers(id)
  status varchar(20) DEFAULT 'draft', -- draft, active, expired, terminated
  title varchar(255) NOT NULL,
  description text,
  start_date date,
  end_date date,
  auto_renewal boolean DEFAULT false,
  renewal_terms jsonb,
  value_total numeric(15,2),
  currency varchar(3) DEFAULT 'USD',
  payment_terms varchar(255),
  sla_terms jsonb DEFAULT '{}',
  penalty_clauses jsonb DEFAULT '[]',
  termination_clauses jsonb DEFAULT '[]',
  documents jsonb DEFAULT '[]', -- file references
  key_contacts jsonb DEFAULT '[]',
  renewal_notifications jsonb DEFAULT '[]',
  compliance_requirements jsonb DEFAULT '[]',
  risk_assessment jsonb,
  ai_risk_score numeric(5,2),
  blockchain_verified boolean DEFAULT false,
  blockchain_hash varchar(64),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  updated_by uuid REFERENCES users(id),
  metadata jsonb DEFAULT NULL,
  CONSTRAINT contracts_number_key UNIQUE(contract_number)
);

-- Analytics Snapshots for Performance
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  snapshot_type varchar(50) NOT NULL, -- daily, weekly, monthly
  snapshot_date date NOT NULL,
  metrics jsonb NOT NULL, -- all computed metrics
  kpis jsonb DEFAULT '{}', -- key performance indicators
  trends jsonb DEFAULT '{}', -- trend analysis
  forecasts jsonb DEFAULT '{}', -- predictive data
  alerts jsonb DEFAULT '[]', -- generated alerts
  ai_insights jsonb DEFAULT '{}', -- AI-generated insights
  computation_time_ms integer,
  data_quality_score numeric(5,2),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT analytics_snapshots_unique UNIQUE(organization_id, snapshot_type, snapshot_date)
);

-- ML Models Registry
CREATE TABLE IF NOT EXISTS ml_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  model_name varchar(255) NOT NULL,
  model_type varchar(50) NOT NULL, -- demand_forecast, anomaly_detection, supplier_scoring
  version varchar(50) NOT NULL,
  framework varchar(50), -- sklearn, tensorflow, pytorch, etc.
  algorithm varchar(100),
  training_data_hash varchar(64),
  hyperparameters jsonb DEFAULT '{}',
  performance_metrics jsonb DEFAULT '{}',
  feature_importance jsonb DEFAULT '{}',
  training_date timestamptz,
  deployment_date timestamptz,
  status varchar(20) DEFAULT 'training', -- training, deployed, deprecated
  accuracy_score numeric(5,4),
  precision_score numeric(5,4),
  recall_score numeric(5,4),
  f1_score numeric(5,4),
  bias_audit_results jsonb,
  ethical_review_status varchar(20) DEFAULT 'pending',
  model_artifacts jsonb, -- file paths, endpoints
  prediction_count bigint DEFAULT 0,
  last_prediction_at timestamptz,
  drift_detection jsonb DEFAULT '{}',
  retraining_schedule varchar(100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  metadata jsonb DEFAULT NULL,
  CONSTRAINT ml_models_unique UNIQUE(organization_id, model_name, version)
);

-- IoT Sensors Management
CREATE TABLE IF NOT EXISTS iot_sensors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  sensor_id varchar(100) NOT NULL,
  sensor_type varchar(50) NOT NULL, -- temperature, humidity, pressure, gps, vibration
  warehouse_id uuid REFERENCES warehouses(id),
  vehicle_id uuid REFERENCES vehicles(id),
  location_description varchar(255),
  coordinates jsonb, -- {lat, lng, altitude}
  manufacturer varchar(100),
  model varchar(100),
  firmware_version varchar(50),
  calibration_date timestamptz,
  last_maintenance timestamptz,
  status varchar(20) DEFAULT 'active', -- active, inactive, maintenance, error
  battery_level numeric(5,2), -- percentage
  signal_strength numeric(5,2), -- dBm or percentage
  data_format jsonb DEFAULT '{}', -- expected data structure
  alert_thresholds jsonb DEFAULT '{}',
  sampling_rate integer DEFAULT 60, -- seconds
  encryption_enabled boolean DEFAULT true,
  security_certificates jsonb DEFAULT '[]',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  metadata jsonb DEFAULT NULL,
  CONSTRAINT iot_sensors_unique UNIQUE(sensor_id)
);

-- Sensor Readings (Time Series Data)
CREATE TABLE IF NOT EXISTS sensor_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id varchar(100) NOT NULL REFERENCES iot_sensors(sensor_id),
  reading_timestamp timestamptz NOT NULL,
  reading_value numeric(15,6) NOT NULL,
  reading_unit varchar(20),
  reading_quality varchar(20) DEFAULT 'good', -- good, poor, error
  additional_data jsonb DEFAULT '{}', -- extra sensor-specific data
  alert_triggered boolean DEFAULT false,
  alert_level varchar(10), -- low, medium, high, critical
  processed boolean DEFAULT false,
  anomaly_score numeric(5,4),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_shipments_status_date ON shipments(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_carrier_date ON shipments(carrier_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_status_due ON invoices(status, due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_supplier_date ON invoices(supplier_id, invoice_date DESC);
CREATE INDEX IF NOT EXISTS idx_payments_status_date ON payments(status, payment_date DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(sensor_id, reading_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_date ON analytics_snapshots(organization_id, snapshot_date DESC);

-- Enable RLS
ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage organization carriers"
  ON carriers FOR ALL TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE id = uid()));

CREATE POLICY "Users can manage organization vehicles"
  ON vehicles FOR ALL TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE id = uid()));

CREATE POLICY "Users can manage organization routes"
  ON routes FOR ALL TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE id = uid()));

CREATE POLICY "Users can manage organization shipments"
  ON shipments FOR ALL TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE id = uid()));

CREATE POLICY "Users can manage organization invoices"
  ON invoices FOR ALL TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE id = uid()));

CREATE POLICY "Users can manage organization payments"
  ON payments FOR ALL TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE id = uid()));

CREATE POLICY "Users can manage organization cost centers"
  ON cost_centers FOR ALL TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE id = uid()));

CREATE POLICY "Users can manage organization contracts"
  ON contracts FOR ALL TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE id = uid()));

CREATE POLICY "Users can view organization analytics"
  ON analytics_snapshots FOR SELECT TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE id = uid()));

CREATE POLICY "Users can manage organization ML models"
  ON ml_models FOR ALL TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE id = uid()));

CREATE POLICY "Users can manage organization IoT sensors"
  ON iot_sensors FOR ALL TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE id = uid()));

CREATE POLICY "Users can view organization sensor readings"
  ON sensor_readings FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM iot_sensors s 
    WHERE s.sensor_id = sensor_readings.sensor_id 
    AND s.organization_id = (SELECT organization_id FROM users WHERE id = uid())
  ));