// OrchestrixSCM Type Definitions
export interface Organization {
  id: string;
  name: string;
  code: string;
  description?: string;
  industry?: string;
  headquarters_address?: string;
  compliance_certifications: string[];
  blockchain_node_id?: string;
  ai_ethics_settings: {
    bias_monitoring: boolean;
    human_oversight_required: boolean;
    transparency_level: 'low' | 'medium' | 'high';
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface Persona {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  description?: string;
  permissions: string[];
  dashboard_config: {
    widgets: string[];
    layout: 'executive' | 'operational' | 'analytical' | 'compliance';
    theme?: string;
  };
  workflow_access: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EnhancedUser {
  id: string;
  email: string;
  name: string;
  organization_id?: string;
  persona_id?: string;
  full_name?: string;
  phone?: string;
  timezone: string;
  language_preference: string;
  accessibility_settings: {
    low_stimulus_mode: boolean;
    high_contrast: boolean;
    screen_reader: boolean;
  };
  role: string;
  permissions?: Record<string, any>;
  is_active: boolean;
  is_verified: boolean;
  last_login?: string;
  last_active_at?: string;
  mfa_enabled: boolean;
  created_at: string;
  updated_at: string;
  organization?: Organization;
  persona?: Persona;
}

export interface Supplier {
  id: string;
  organization_id: string;
  code: string;
  name: string;
  description?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  tax_id?: string;
  payment_terms?: string;
  credit_limit?: number;
  currency: string;
  ai_performance_score: number;
  ai_risk_score: number;
  ai_model_version?: string;
  last_ai_evaluation?: string;
  performance_metrics: {
    on_time_delivery: number;
    quality_score: number;
    invoice_accuracy: number;
    response_time: number;
  };
  certifications: string[];
  blockchain_verified: boolean;
  blockchain_hash?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  metadata?: Record<string, any>;
}

export interface PurchaseOrder {
  id: string;
  organization_id: string;
  po_number: string;
  supplier_id: string;
  status: 'draft' | 'pending' | 'approved' | 'sent' | 'received' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  currency: string;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  order_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  payment_terms?: string;
  shipping_address?: string;
  billing_address?: string;
  notes?: string;
  approval_workflow: any[];
  approved_by?: string;
  approved_at?: string;
  blockchain_tx_hash?: string;
  blockchain_verified: boolean;
  ai_fraud_score?: number;
  ai_risk_assessment?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  metadata?: Record<string, any>;
  supplier?: Supplier;
  items?: PurchaseOrderItem[];
}

export interface PurchaseOrderItem {
  id: string;
  po_id: string;
  item_id?: string;
  sku: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  received_quantity: number;
  quality_score?: number;
  inspection_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BlockchainTransaction {
  id: string;
  organization_id: string;
  transaction_hash: string;
  block_number?: number;
  transaction_type: string;
  entity_type: string;
  entity_id: string;
  payload: Record<string, any>;
  gas_used?: number;
  gas_price?: number;
  timestamp: string;
  verified: boolean;
  verification_attempts: number;
  metadata?: Record<string, any>;
}

export interface AIModel {
  id: string;
  organization_id: string;
  name: string;
  version: string;
  model_type: string;
  description?: string;
  training_data_hash?: string;
  accuracy_metrics?: Record<string, any>;
  bias_audit_results?: Record<string, any>;
  ethical_review_status: 'pending' | 'approved' | 'rejected' | 'requires_review';
  deployment_status: 'inactive' | 'active' | 'deprecated';
  endpoint_url?: string;
  last_retrained_at?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface AuditTrailEntry {
  id: string;
  organization_id?: string;
  trace_id?: string;
  session_id?: string;
  user_id?: string;
  persona?: string;
  action: string;
  entity_type?: string;
  entity_id?: string;
  ip_address?: string;
  user_agent?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  risk_score?: number;
  compliance_flags: string[];
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Notification {
  id: string;
  organization_id: string;
  recipient_id: string;
  sender_id?: string;
  type: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  title: string;
  message: string;
  action_url?: string;
  action_data?: Record<string, any>;
  is_read: boolean;
  read_at?: string;
  expires_at?: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface WorkflowTemplate {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_conditions?: Record<string, any>;
  workflow_steps: any[];
  approval_matrix?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  metadata?: Record<string, any>;
}

export interface ComplianceRecord {
  id: string;
  organization_id: string;
  regulation_type: string;
  entity_type: string;
  entity_id: string;
  compliance_status: 'pending' | 'compliant' | 'non_compliant' | 'requires_action';
  assessment_date: string;
  expiry_date?: string;
  assessor_id?: string;
  evidence_documents: string[];
  violations: any[];
  remediation_plan?: string;
  next_review_date?: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

// Transportation & Logistics Types
export interface Carrier {
  id: string;
  organization_id: string;
  code: string;
  name: string;
  carrier_type: 'ground' | 'air' | 'sea' | 'rail';
  contact_info: Record<string, any>;
  service_areas: string[];
  capabilities: Record<string, any>;
  performance_metrics: {
    on_time_percentage: number;
    damage_rate: number;
    cost_efficiency: number;
    customer_satisfaction: number;
  };
  ai_performance_score: number;
  ai_risk_score: number;
  contract_terms: Record<string, any>;
  insurance_info: Record<string, any>;
  certifications: string[];
  blockchain_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  metadata?: Record<string, any>;
}

export interface Vehicle {
  id: string;
  organization_id: string;
  carrier_id?: string;
  vehicle_id: string;
  vehicle_type: string;
  make_model?: string;
  year?: number;
  capacity_weight?: number;
  capacity_volume?: number;
  fuel_type?: string;
  current_location?: {
    lat: number;
    lng: number;
    timestamp: string;
  };
  status: 'available' | 'in_transit' | 'maintenance' | 'offline';
  iot_device_id?: string;
  maintenance_schedule: Record<string, any>;
  certifications: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface Route {
  id: string;
  organization_id: string;
  route_name: string;
  origin_address?: string;
  destination_address?: string;
  waypoints: any[];
  distance_km?: number;
  estimated_duration?: number;
  optimization_params: Record<string, any>;
  ai_optimized: boolean;
  carbon_footprint?: number;
  cost_estimate?: number;
  traffic_pattern: Record<string, any>;
  weather_considerations: Record<string, any>;
  restrictions: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  metadata?: Record<string, any>;
}

export interface Shipment {
  id: string;
  organization_id: string;
  shipment_number: string;
  po_id?: string;
  carrier_id?: string;
  vehicle_id?: string;
  route_id?: string;
  status: 'pending' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  shipment_type: 'inbound' | 'outbound' | 'internal';
  origin_warehouse_id?: string;
  destination_address?: string;
  destination_coordinates?: { lat: number; lng: number };
  tracking_number?: string;
  planned_pickup_date?: string;
  actual_pickup_date?: string;
  planned_delivery_date?: string;
  actual_delivery_date?: string;
  total_weight?: number;
  total_volume?: number;
  package_count: number;
  special_instructions?: string;
  temperature_requirements?: Record<string, any>;
  handling_requirements: string[];
  insurance_value?: number;
  shipping_cost?: number;
  fuel_surcharge?: number;
  additional_charges: Record<string, any>;
  proof_of_delivery?: Record<string, any>;
  delivery_issues: any[];
  gps_tracking: any[];
  blockchain_hash?: string;
  ai_risk_assessment?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  metadata?: Record<string, any>;
  carrier?: Carrier;
  vehicle?: Vehicle;
  route?: Route;
}

// Finance & Accounting Types
export interface Invoice {
  id: string;
  organization_id: string;
  invoice_number: string;
  invoice_type: 'supplier' | 'customer' | 'carrier';
  supplier_id?: string;
  carrier_id?: string;
  po_id?: string;
  shipment_id?: string;
  status: 'pending' | 'approved' | 'paid' | 'overdue' | 'disputed';
  currency: string;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  shipping_amount: number;
  total_amount: number;
  invoice_date: string;
  due_date?: string;
  payment_terms?: string;
  line_items: any[];
  tax_breakdown: Record<string, any>;
  payment_method?: string;
  payment_reference?: string;
  ai_fraud_score?: number;
  ai_audit_flags: string[];
  approval_workflow: any[];
  approved_by?: string;
  approved_at?: string;
  blockchain_verified: boolean;
  blockchain_hash?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  metadata?: Record<string, any>;
}

export interface Payment {
  id: string;
  organization_id: string;
  payment_reference: string;
  invoice_id?: string;
  payment_method: string;
  payment_gateway?: string;
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  currency: string;
  amount: number;
  exchange_rate: number;
  base_amount?: number;
  fees: number;
  payment_date?: string;
  settlement_date?: string;
  bank_details?: Record<string, any>;
  reconciliation_status: 'pending' | 'reconciled' | 'disputed';
  reconciled_at?: string;
  reconciled_by?: string;
  blockchain_verified: boolean;
  blockchain_hash?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  metadata?: Record<string, any>;
}

export interface CostCenter {
  id: string;
  organization_id: string;
  code: string;
  name: string;
  description?: string;
  parent_id?: string;
  cost_center_type: 'operational' | 'project' | 'department';
  budget_annual?: number;
  budget_remaining?: number;
  manager_id?: string;
  accounting_codes: Record<string, any>;
  approval_limits: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface Contract {
  id: string;
  organization_id: string;
  contract_number: string;
  contract_type: 'supplier' | 'carrier' | 'customer' | 'service';
  counterparty_type: 'supplier' | 'carrier' | 'customer';
  counterparty_id?: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  auto_renewal: boolean;
  renewal_terms?: Record<string, any>;
  value_total?: number;
  currency: string;
  payment_terms?: string;
  sla_terms: Record<string, any>;
  penalty_clauses: any[];
  termination_clauses: any[];
  documents: any[];
  key_contacts: any[];
  renewal_notifications: any[];
  compliance_requirements: any[];
  risk_assessment?: Record<string, any>;
  ai_risk_score?: number;
  blockchain_verified: boolean;
  blockchain_hash?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
  metadata?: Record<string, any>;
}

// Analytics & ML Types
export interface AnalyticsSnapshot {
  id: string;
  organization_id: string;
  snapshot_type: 'daily' | 'weekly' | 'monthly';
  snapshot_date: string;
  metrics: Record<string, any>;
  kpis: Record<string, any>;
  trends: Record<string, any>;
  forecasts: Record<string, any>;
  alerts: any[];
  ai_insights: Record<string, any>;
  computation_time_ms?: number;
  data_quality_score?: number;
  created_at: string;
}

export interface MLModel {
  id: string;
  organization_id: string;
  model_name: string;
  model_type: 'demand_forecast' | 'anomaly_detection' | 'supplier_scoring' | 'route_optimization' | 'fraud_detection';
  version: string;
  framework?: string;
  algorithm?: string;
  training_data_hash?: string;
  hyperparameters: Record<string, any>;
  performance_metrics: Record<string, any>;
  feature_importance: Record<string, any>;
  training_date?: string;
  deployment_date?: string;
  status: 'training' | 'deployed' | 'deprecated';
  accuracy_score?: number;
  precision_score?: number;
  recall_score?: number;
  f1_score?: number;
  bias_audit_results?: Record<string, any>;
  ethical_review_status: 'pending' | 'approved' | 'rejected' | 'requires_review';
  model_artifacts?: Record<string, any>;
  prediction_count: number;
  last_prediction_at?: string;
  drift_detection: Record<string, any>;
  retraining_schedule?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  metadata?: Record<string, any>;
}

// IoT & Sensor Types
export interface IoTSensor {
  id: string;
  organization_id: string;
  sensor_id: string;
  sensor_type: 'temperature' | 'humidity' | 'pressure' | 'gps' | 'vibration' | 'light' | 'proximity';
  warehouse_id?: string;
  vehicle_id?: string;
  location_description?: string;
  coordinates?: { lat: number; lng: number; altitude?: number };
  manufacturer?: string;
  model?: string;
  firmware_version?: string;
  calibration_date?: string;
  last_maintenance?: string;
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  battery_level?: number;
  signal_strength?: number;
  data_format: Record<string, any>;
  alert_thresholds: Record<string, any>;
  sampling_rate: number;
  encryption_enabled: boolean;
  security_certificates: any[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface SensorReading {
  id: string;
  sensor_id: string;
  reading_timestamp: string;
  reading_value: number;
  reading_unit?: string;
  reading_quality: 'good' | 'poor' | 'error';
  additional_data: Record<string, any>;
  alert_triggered: boolean;
  alert_level?: 'low' | 'medium' | 'high' | 'critical';
  processed: boolean;
  anomaly_score?: number;
  created_at: string;
}

// Dashboard Widget Types
export interface DashboardWidget {
  id: string;
  type: string;
  title: string;
  data: any;
  config: Record<string, any>;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

// AI & Analytics Types
export interface SupplierScore {
  supplier_id: string;
  performance_score: number;
  risk_score: number;
  factors: {
    on_time_delivery: number;
    quality: number;
    compliance: number;
    financial_stability: number;
  };
  recommendations: string[];
  last_updated: string;
}

export interface DemandForecast {
  item_id: string;
  sku: string;
  predictions: {
    date: string;
    quantity: number;
    confidence: number;
  }[];
  seasonality_factors: Record<string, number>;
  model_accuracy: number;
  last_updated: string;
}

export interface AnomalyAlert {
  id: string;
  type: 'demand' | 'supplier' | 'inventory' | 'financial';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  entity_type: string;
  entity_id: string;
  detected_at: string;
  resolved_at?: string;
  ai_confidence: number;
  recommended_actions: string[];
}

// Blockchain Types
export interface SmartContractCall {
  contract_address: string;
  function_name: string;
  parameters: Record<string, any>;
  gas_limit: number;
  gas_price: number;
}

export interface ProvenanceRecord {
  entity_type: string;
  entity_id: string;
  action: string;
  actor_id: string;
  timestamp: string;
  previous_hash?: string;
  current_hash: string;
  metadata: Record<string, any>;
}

// IoT & Sensor Types
export interface SensorReading {
  sensor_id: string;
  warehouse_id: string;
  sensor_type: 'temperature' | 'humidity' | 'pressure' | 'vibration' | 'proximity';
  value: number;
  unit: string;
  timestamp: string;
  status: 'normal' | 'warning' | 'critical';
}

export interface WarehouseIoT {
  warehouse_id: string;
  sensors: {
    [sensor_id: string]: SensorReading[];
  };
  alerts: {
    id: string;
    sensor_id: string;
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    triggered_at: string;
    acknowledged_at?: string;
  }[];
}