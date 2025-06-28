import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AnalyticsSnapshot, MLModel } from '@/types/analytics';
import { useToast } from '@/hooks/use-toast';

export function useAnalytics(period: 'daily' | 'weekly' | 'monthly' = 'daily') {
  const [snapshots, setSnapshots] = useState<AnalyticsSnapshot[]>([]);
  const [currentSnapshot, setCurrentSnapshot] = useState<AnalyticsSnapshot | null>(null);
  const [mlModels, setMlModels] = useState<MLModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load analytics snapshots
      const { data: snapshotData, error: snapshotError } = await supabase
        .from('analytics_snapshots')
        .select('*')
        .eq('snapshot_type', period)
        .order('snapshot_date', { ascending: false })
        .limit(30);

      if (snapshotError) {
        throw snapshotError;
      }
      
      setSnapshots(snapshotData || []);
      setCurrentSnapshot(snapshotData?.[0] || null);

      // Load ML models
      const { data: modelData, error: modelError } = await supabase
        .from('ml_models')
        .select('*')
        .order('created_at', { ascending: false });

      if (modelError) {
        throw modelError;
      }
      
      setMlModels(modelData || []);
    } catch (err: any) {
      console.error('Error loading analytics data:', err);
      setError(err.message || 'Failed to load analytics data');
      
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const generateMockSnapshot = (): AnalyticsSnapshot => {
    return {
      id: 'mock',
      organization_id: '',
      snapshot_type: period,
      snapshot_date: new Date().toISOString().split('T')[0],
      metrics: {
        inventory_turnover: 8.4,
        order_fulfillment_rate: 96.2,
        supplier_performance: 92.1,
        cost_variance: -3.2,
        delivery_performance: 94.7,
        quality_score: 98.1,
        carbon_footprint: 2847.3,
        total_transactions: 15847,
        revenue: 2847392,
        profit_margin: 18.4
      },
      kpis: {
        inventory_accuracy: 99.2,
        stockout_rate: 0.8,
        carrying_cost_ratio: 15.3,
        perfect_order_rate: 94.1,
        supplier_lead_time: 8.5,
        transportation_cost_per_unit: 12.47
      },
      trends: {
        inventory_trend: 'increasing',
        cost_trend: 'decreasing',
        efficiency_trend: 'improving',
        quality_trend: 'stable'
      },
      forecasts: {
        demand_forecast_accuracy: 87.3,
        predicted_stockouts: 12,
        seasonal_adjustment: 1.15,
        next_month_volume: 18200
      },
      alerts: [
        {
          type: 'inventory_low',
          message: 'Low stock alert for 15 items',
          severity: 'medium',
          count: 15
        },
        {
          type: 'delivery_delay',
          message: 'Potential delivery delays due to weather',
          severity: 'low',
          count: 3
        },
        {
          type: 'cost_variance',
          message: 'Transportation costs 12% above budget',
          severity: 'high',
          count: 1
        }
      ],
      ai_insights: {
        top_insight: 'Inventory optimization could reduce carrying costs by 8.2%',
        efficiency_recommendation: 'Consider consolidating shipments to reduce transportation costs',
        risk_assessment: 'Supplier concentration risk detected in electronics category',
        opportunity: 'Seasonal demand pattern suggests increasing safety stock for Q4'
      },
      computation_time_ms: 234,
      data_quality_score: 94.7,
      created_at: new Date().toISOString()
    };
  };

  const displaySnapshot = currentSnapshot || generateMockSnapshot();

  return {
    snapshots,
    currentSnapshot: displaySnapshot,
    mlModels,
    loading,
    error,
    refresh: fetchAnalyticsData
  };
}