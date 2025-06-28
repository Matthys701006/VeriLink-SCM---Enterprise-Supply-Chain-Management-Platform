// Define types for analytics data

export interface AnalyticsSnapshot {
  id: string;
  organization_id: string;
  snapshot_type: 'daily' | 'weekly' | 'monthly';
  snapshot_date: string;
  metrics: {
    inventory_turnover: number;
    order_fulfillment_rate: number;
    supplier_performance: number;
    cost_variance: number;
    delivery_performance: number;
    quality_score: number;
    carbon_footprint: number;
    total_transactions: number;
    revenue: number;
    profit_margin: number;
  };
  kpis: {
    inventory_accuracy: number;
    stockout_rate: number;
    carrying_cost_ratio: number;
    perfect_order_rate: number;
    supplier_lead_time: number;
    transportation_cost_per_unit: number;
  };
  trends: {
    inventory_trend: string;
    cost_trend: string;
    efficiency_trend: string;
    quality_trend: string;
  };
  forecasts: {
    demand_forecast_accuracy: number;
    predicted_stockouts: number;
    seasonal_adjustment: number;
    next_month_volume: number;
  };
  alerts: Array<{
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high';
    count: number;
  }>;
  ai_insights: {
    top_insight: string;
    efficiency_recommendation: string;
    risk_assessment: string;
    opportunity: string;
  };
  computation_time_ms: number;
  data_quality_score: number;
  created_at: string;
}

export interface MLModel {
  id: string;
  organization_id: string;
  model_name: string;
  model_type: string;
  version: string;
  framework?: string;
  algorithm?: string;
  status: 'training' | 'deployed' | 'deprecated';
  accuracy_score?: number;
  prediction_count?: number;
  last_prediction_at?: string;
  performance_metrics?: Record<string, any>;
  created_at: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  chart_type: 'bar' | 'line' | 'pie' | 'table';
  metrics: string[];
  filters?: Record<string, any>;
  created_at: string;
  last_run?: string;
}

export interface CustomReport extends ReportTemplate {
  data?: any[];
  visualization_options?: Record<string, any>;
}