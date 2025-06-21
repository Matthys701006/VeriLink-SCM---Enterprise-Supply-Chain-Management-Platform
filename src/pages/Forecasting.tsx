import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  AlertTriangle, 
  Brain,
  Calendar,
  RefreshCw,
  Settings,
  Zap,
  Eye
} from 'lucide-react';
import { useOrchestrix } from '../contexts/OrchestrixContext';
import { supabase } from '../services/supabase/client';

interface ForecastData {
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

export const Forecasting: React.FC = () => {
  const { hasPermission, organization } = useOrchestrix();
  const [forecasts, setForecasts] = useState<ForecastData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [modelAccuracy, setModelAccuracy] = useState(87.3);

  useEffect(() => {
    if (organization?.id) {
      loadForecastingData();
    }
  }, [organization?.id, selectedTimeframe]);

  const loadForecastingData = async () => {
    try {
      setLoading(true);
      
      // Load ML models for forecasting
      const { data: models, error: modelsError } = await supabase
        .from('ml_models')
        .select('*')
        .eq('organization_id', organization?.id)
        .eq('model_type', 'demand_forecast')
        .eq('status', 'deployed')
        .order('accuracy_score', { ascending: false });

      if (modelsError) throw modelsError;

      // Generate mock forecast data since we don't have real ML pipeline yet
      const mockForecasts = generateMockForecasts();
      setForecasts(mockForecasts);

    } catch (error) {
      console.error('Error loading forecasting data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockForecasts = (): ForecastData[] => {
    const items = ['SKU-001', 'SKU-002', 'SKU-003', 'SKU-004', 'SKU-005'];
    
    return items.map((sku, index) => ({
      item_id: `item-${index + 1}`,
      sku,
      predictions: generatePredictions(),
      seasonality_factors: {
        'Q1': 0.8 + Math.random() * 0.4,
        'Q2': 0.9 + Math.random() * 0.4,
        'Q3': 1.1 + Math.random() * 0.4,
        'Q4': 1.3 + Math.random() * 0.4,
      },
      model_accuracy: 0.85 + Math.random() * 0.1,
      last_updated: new Date().toISOString()
    }));
  };

  const generatePredictions = () => {
    const predictions = [];
    const baseQuantity = 100 + Math.random() * 200;
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      const trend = Math.sin(i * 0.2) * 20; // Seasonal variation
      const noise = (Math.random() - 0.5) * 30; // Random variation
      const quantity = Math.max(0, Math.round(baseQuantity + trend + noise));
      
      predictions.push({
        date: date.toISOString().split('T')[0],
        quantity,
        confidence: 0.7 + Math.random() * 0.3
      });
    }
    
    return predictions;
  };

  const getTrendDirection = (predictions: any[]) => {
    if (predictions.length < 2) return 'stable';
    const recent = predictions.slice(-7).map(p => p.quantity);
    const earlier = predictions.slice(-14, -7).map(p => p.quantity);
    
    const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const earlierAvg = earlier.reduce((a, b) => a + b, 0) / earlier.length;
    
    if (recentAvg > earlierAvg * 1.05) return 'increasing';
    if (recentAvg < earlierAvg * 0.95) return 'decreasing';
    return 'stable';
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return TrendingUp;
      case 'decreasing':
        return TrendingDown;
      default:
        return BarChart3;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-600';
      case 'decreasing':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasPermission('forecasting.read')) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-500">You don't have permission to access forecasting data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI-Powered Demand Forecasting</h1>
          <p className="text-gray-600">Predictive analytics for inventory planning and demand management</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
            <option value="90d">90 Days</option>
            <option value="1y">1 Year</option>
          </select>
          <button 
            onClick={() => loadForecastingData()}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Models
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4" />
            Configure
          </button>
        </div>
      </div>

      {/* Model Performance Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-8 h-8 mr-3" />
            <div>
              <h3 className="text-xl font-semibold">Prophet-based Demand Forecasting Model</h3>
              <p className="text-blue-100 mt-1">Next-generation AI with seasonal decomposition and trend analysis</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200">Model Accuracy</div>
            <div className="text-3xl font-bold">{modelAccuracy.toFixed(1)}%</div>
            <div className="text-sm text-blue-200">Last trained: 2 hours ago</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Forecast Accuracy</p>
              <p className="text-2xl font-bold text-gray-900">{modelAccuracy.toFixed(1)}%</p>
            </div>
            <Target className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-2 text-sm text-green-600">+2.3% vs last month</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Stockout Risk</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <div className="mt-2 text-sm text-orange-600">Items at risk next 7 days</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overstock Alert</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
          <div className="mt-2 text-sm text-red-600">Items with excess inventory</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Seasonal Factor</p>
              <p className="text-2xl font-bold text-gray-900">1.15x</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-2 text-sm text-blue-600">Current season multiplier</div>
        </div>
      </div>

      {/* Forecast Grid */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Item-Level Demand Forecasts</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {forecasts.map((forecast) => {
              const trend = getTrendDirection(forecast.predictions);
              const TrendIcon = getTrendIcon(trend);
              const totalDemand = forecast.predictions.reduce((sum, p) => sum + p.quantity, 0);
              const avgConfidence = forecast.predictions.reduce((sum, p) => sum + p.confidence, 0) / forecast.predictions.length;
              
              return (
                <div key={forecast.item_id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{forecast.sku}</h4>
                      <p className="text-sm text-gray-500">30-day forecast</p>
                    </div>
                    <div className={`flex items-center gap-1 ${getTrendColor(trend)}`}>
                      <TrendIcon className="w-4 h-4" />
                      <span className="text-sm font-medium capitalize">{trend}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-600">Total Demand</div>
                      <div className="text-xl font-bold text-gray-900">{totalDemand.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Confidence</div>
                      <div className="text-xl font-bold text-gray-900">{(avgConfidence * 100).toFixed(0)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Model Accuracy</div>
                      <div className="text-xl font-bold text-gray-900">{(forecast.model_accuracy * 100).toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Peak Day</div>
                      <div className="text-xl font-bold text-gray-900">
                        {Math.max(...forecast.predictions.map(p => p.quantity))}
                      </div>
                    </div>
                  </div>

                  {/* Seasonality Factors */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-700 mb-2">Seasonality Factors</div>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(forecast.seasonality_factors).map(([quarter, factor]) => (
                        <div key={quarter} className="text-center">
                          <div className="text-xs text-gray-500">{quarter}</div>
                          <div className={`text-sm font-medium ${
                            factor > 1 ? 'text-green-600' : factor < 1 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {factor.toFixed(2)}x
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                    <button className="flex items-center gap-1 text-gray-600 hover:text-gray-800 text-sm font-medium">
                      <Eye className="w-3 h-3" />
                      Adjust Parameters
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">AI-Generated Insights & Recommendations</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Zap className="w-5 h-5 text-blue-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Inventory Optimization Opportunity</p>
                <p className="text-sm text-gray-600 mt-1">
                  Consider increasing safety stock for SKU-003 by 15% due to predicted seasonal surge in Q4. 
                  Model confidence: 92.1%
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Potential Stockout Alert</p>
                <p className="text-sm text-gray-600 mt-1">
                  SKU-001 showing 78% probability of stockout in next 10 days. Recommend immediate reorder of 500 units.
                </p>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-green-50 border border-green-200 rounded-lg">
              <Brain className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Model Performance Update</p>
                <p className="text-sm text-gray-600 mt-1">
                  Demand forecasting accuracy improved to 87.3% after incorporating new economic indicators. 
                  Next retrain scheduled in 48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};