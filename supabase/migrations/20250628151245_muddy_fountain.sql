/*
  # Define Analytics Types Schema

  This migration adds type definitions for analytics-related database schema.
  It ensures the database has the proper structure to store analytics data.

  1. New Tables
    - `analytics_snapshots` table for storing periodic analytics data
    - `ml_models` table for tracking machine learning models

  2. Security
    - Enable RLS on all tables
    - Add organization-scoped policies

  3. Features
    - Support for daily, weekly, and monthly analytics snapshots
    - ML model registry with performance tracking
    - Predictive analytics data storage
*/

-- Create analytics_types table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_type WHERE typname = 'analytics_snapshot_type') THEN
        CREATE TYPE analytics_snapshot_type AS ENUM ('daily', 'weekly', 'monthly');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_type WHERE typname = 'ml_model_status') THEN
        CREATE TYPE ml_model_status AS ENUM ('training', 'deployed', 'deprecated');
    END IF;
    
    IF NOT EXISTS (SELECT FROM pg_type WHERE typname = 'ml_model_type') THEN
        CREATE TYPE ml_model_type AS ENUM ('demand_forecast', 'anomaly_detection', 'supplier_scoring', 'route_optimization');
    END IF;
END $$;

-- Create analytics_snapshots table if it doesn't exist
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  snapshot_type text NOT NULL,
  snapshot_date date NOT NULL,
  metrics jsonb NOT NULL,
  kpis jsonb DEFAULT '{}'::jsonb,
  trends jsonb DEFAULT '{}'::jsonb,
  forecasts jsonb DEFAULT '{}'::jsonb,
  alerts jsonb DEFAULT '[]'::jsonb,
  ai_insights jsonb DEFAULT '{}'::jsonb,
  computation_time_ms integer,
  data_quality_score numeric(5,2),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT analytics_snapshots_unique UNIQUE(organization_id, snapshot_type, snapshot_date)
);

-- Create ml_models table if it doesn't exist
CREATE TABLE IF NOT EXISTS ml_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  model_name varchar(255) NOT NULL,
  model_type varchar(50) NOT NULL,
  version varchar(50) NOT NULL,
  framework varchar(50),
  algorithm varchar(100),
  training_data_hash varchar(64),
  hyperparameters jsonb DEFAULT '{}'::jsonb,
  performance_metrics jsonb DEFAULT '{}'::jsonb,
  feature_importance jsonb DEFAULT '{}'::jsonb,
  training_date timestamptz,
  deployment_date timestamptz,
  status varchar(20) DEFAULT 'training',
  accuracy_score numeric(5,4),
  precision_score numeric(5,4),
  recall_score numeric(5,4),
  f1_score numeric(5,4),
  bias_audit_results jsonb,
  ethical_review_status varchar(20) DEFAULT 'pending',
  model_artifacts jsonb,
  prediction_count bigint DEFAULT 0,
  last_prediction_at timestamptz,
  drift_detection jsonb DEFAULT '{}'::jsonb,
  retraining_schedule varchar(100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id),
  metadata jsonb DEFAULT NULL,
  CONSTRAINT ml_models_unique UNIQUE(organization_id, model_name, version)
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_date ON analytics_snapshots(organization_id, snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_ml_models_type ON ml_models(organization_id, model_type, status);

-- Enable RLS
ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_models ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
CREATE POLICY "Users can view organization analytics"
  ON analytics_snapshots FOR SELECT
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can manage organization ML models"
  ON ml_models FOR ALL
  TO authenticated
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

-- Insert sample analytics data
INSERT INTO analytics_snapshots (
  organization_id, 
  snapshot_type, 
  snapshot_date, 
  metrics, 
  kpis, 
  trends, 
  forecasts, 
  alerts, 
  ai_insights, 
  computation_time_ms, 
  data_quality_score
)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'daily',
  CURRENT_DATE,
  '{
    "inventory_turnover": 8.4,
    "order_fulfillment_rate": 96.2,
    "supplier_performance": 92.1,
    "cost_variance": -3.2,
    "delivery_performance": 94.7,
    "quality_score": 98.1,
    "carbon_footprint": 2847.3,
    "total_transactions": 15847,
    "revenue": 2847392,
    "profit_margin": 18.4
  }'::jsonb,
  '{
    "inventory_accuracy": 99.2,
    "stockout_rate": 0.8,
    "carrying_cost_ratio": 15.3,
    "perfect_order_rate": 94.1,
    "supplier_lead_time": 8.5,
    "transportation_cost_per_unit": 12.47
  }'::jsonb,
  '{
    "inventory_trend": "increasing",
    "cost_trend": "decreasing",
    "efficiency_trend": "improving",
    "quality_trend": "stable"
  }'::jsonb,
  '{
    "demand_forecast_accuracy": 87.3,
    "predicted_stockouts": 12,
    "seasonal_adjustment": 1.15,
    "next_month_volume": 18200
  }'::jsonb,
  '[
    {
      "type": "inventory_low",
      "message": "Low stock alert for 15 items",
      "severity": "medium",
      "count": 15
    },
    {
      "type": "delivery_delay",
      "message": "Potential delivery delays due to weather",
      "severity": "low",
      "count": 3
    },
    {
      "type": "cost_variance",
      "message": "Transportation costs 12% above budget",
      "severity": "high",
      "count": 1
    }
  ]'::jsonb,
  '{
    "top_insight": "Inventory optimization could reduce carrying costs by 8.2%",
    "efficiency_recommendation": "Consider consolidating shipments to reduce transportation costs",
    "risk_assessment": "Supplier concentration risk detected in electronics category",
    "opportunity": "Seasonal demand pattern suggests increasing safety stock for Q4"
  }'::jsonb,
  234,
  94.7
) ON CONFLICT (organization_id, snapshot_type, snapshot_date) DO NOTHING;

-- Insert sample ML models
INSERT INTO ml_models (
  organization_id,
  model_name,
  model_type,
  version,
  status,
  accuracy_score,
  prediction_count,
  last_prediction_at
)
VALUES 
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Demand Forecasting',
  'demand_forecast',
  '1.0.0',
  'deployed',
  0.873,
  15847,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Supplier Risk Assessment',
  'supplier_scoring',
  '1.0.0',
  'deployed',
  0.921,
  2340,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Route Optimization',
  'route_optimization',
  '1.0.0',
  'deployed',
  0.845,
  8923,
  NOW()
) ON CONFLICT (organization_id, model_name, version) DO NOTHING;