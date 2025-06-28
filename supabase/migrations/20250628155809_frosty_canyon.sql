/*
  # Create forecast-related tables

  1. New Tables
    - `ml_model_training_logs` - Tracks model training history with performance metrics
    - `demand_forecasts` - Stores actual forecast data by item with confidence intervals
    - `forecast_accuracy_metrics` - Tracks forecast accuracy over time

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create model training logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS ml_model_training_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  model_id uuid NOT NULL REFERENCES ml_models(id),
  training_start timestamp with time zone NOT NULL,
  training_end timestamp with time zone,
  status varchar(20) NOT NULL DEFAULT 'in_progress',
  parameters jsonb,
  metrics jsonb,
  error_message text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create demand forecasts table if it doesn't exist
CREATE TABLE IF NOT EXISTS demand_forecasts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  item_id uuid REFERENCES inventory_items(id),
  sku varchar(50) NOT NULL,
  model_id uuid REFERENCES ml_models(id),
  forecast_date date NOT NULL,
  forecast_period varchar(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
  quantity integer NOT NULL,
  lower_bound integer,
  upper_bound integer,
  confidence numeric(5,4),
  external_factors jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(organization_id, sku, forecast_date, forecast_period)
);

-- Create forecast accuracy metrics table if it doesn't exist
CREATE TABLE IF NOT EXISTS forecast_accuracy_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  model_id uuid REFERENCES ml_models(id),
  forecast_period varchar(20) NOT NULL, -- 'daily', 'weekly', 'monthly'
  start_date date NOT NULL,
  end_date date NOT NULL,
  mape numeric(7,4), -- Mean Absolute Percentage Error
  rmse numeric(10,2), -- Root Mean Square Error
  mae numeric(10,2), -- Mean Absolute Error
  r2_score numeric(5,4), -- R-squared score
  item_count integer, -- Number of items in the evaluation
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE ml_model_training_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE demand_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecast_accuracy_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can read organization ml_model_training_logs" 
  ON ml_model_training_logs 
  FOR SELECT 
  TO authenticated 
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can read organization demand_forecasts" 
  ON demand_forecasts 
  FOR SELECT 
  TO authenticated 
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can read organization forecast_accuracy_metrics" 
  ON forecast_accuracy_metrics 
  FOR SELECT 
  TO authenticated 
  USING (organization_id = (SELECT organization_id FROM users WHERE id = auth.uid()));

-- Insert sample data for default organization
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
('550e8400-e29b-41d4-a716-446655440000', 'Prophet Forecasting Engine', 'demand_forecast', '1.0.0', 'deployed', 0.873, 15847, now()),
('550e8400-e29b-41d4-a716-446655440000', 'ARIMA Time Series Model', 'demand_forecast', '1.0.0', 'deployed', 0.842, 10254, now()),
('550e8400-e29b-41d4-a716-446655440000', 'XGBoost Multi-factor Model', 'demand_forecast', '1.0.0', 'deployed', 0.901, 7832, now())
ON CONFLICT DO NOTHING;