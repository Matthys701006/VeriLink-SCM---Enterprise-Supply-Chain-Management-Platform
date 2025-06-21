import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  Eye,
  RefreshCw,
  Download,
  Calendar,
  Filter,
  Zap,
  Brain
} from 'lucide-react';
import { useOrchestrix } from '../contexts/OrchestrixContext';
import { supabase } from '../services/supabase/client';
import { AnalyticsSnapshot, MLModel } from '../types/orchestrix';
import { ReportBuilder } from '../components/reporting/ReportBuilder';
import { MobileAPIEndpoints } from '../components/mobile/MobileAPIEndpoints';

export const Analytics: React.FC = () => {
  const { hasPermission, organization } = useOrchestrix();
  const [snapshots, setSnapshots] = useState<AnalyticsSnapshot[]>([]);
  const [mlModels, setMLModels] = useState<MLModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [selectedTab, setSelectedTab] = useState<'overview' | 'reports' | 'mobile'>('overview');
  const [currentSnapshot, setCurrentSnapshot] = useState<AnalyticsSnapshot | null>(null);
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [savedReports, setSavedReports] = useState<any[]>([]);

  useEffect(() => {
    if (organization?.id) {
      loadAnalyticsData();
    }
  }, [organization?.id, selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load analytics snapshots
      const { data: snapshotData, error: snapshotError } = await supabase
        .from('analytics_snapshots')
        .select('*')
        .eq('organization_id', organization?.id)
        .eq('snapshot_type', selectedPeriod)
        .order('snapshot_date', { ascending: false })
        .limit(30);

      if (snapshotError) throw snapshotError;
      setSnapshots(snapshotData || []);
      setCurrentSnapshot(snapshotData?.[0] || null);

      // Load ML models
      const { data: modelData, error: modelError } = await supabase
        .from('ml_models')
        .select('*')
        .eq('organization_id', organization?.id)
        .order('created_at', { ascending: false });

      if (modelError) throw modelError;
      setMLModels(modelData || []);

    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockSnapshot = (): AnalyticsSnapshot => {
    return {
      id: 'mock',
      organization_id: organization?.id || '',
      snapshot_type: selectedPeriod,
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

  // Use mock data if no snapshots exist
  const displaySnapshot = currentSnapshot || generateMockSnapshot();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasPermission('analytics.read')) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-500">You don't have permission to access analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedTab === 'overview' ? 'Analytics & Business Intelligence' : 
             selectedTab === 'reports' ? 'Advanced Reporting' : 'Mobile & API'}
          </h1>
          <p className="text-gray-600">
            {selectedTab === 'overview' ? 'Real-time insights and AI-powered analytics' : 
             selectedTab === 'reports' ? 'Custom reports and data exports' : 'Mobile app integration and API documentation'}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-3">
            {selectedTab === 'overview' && (
              <>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <button 
                  onClick={() => loadAnalyticsData()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </>
            )}
            
            {selectedTab === 'reports' && (
              <button 
                onClick={() => setShowReportBuilder(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Create Report
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-1" />
              Analytics Overview
            </button>
            <button
              onClick={() => setSelectedTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-1" />
              Custom Reports
            </button>
            <button
              onClick={() => setSelectedTab('mobile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'mobile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Smartphone className="w-4 h-4 inline mr-1" />
              Mobile & API
            </button>
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* AI Insights Banner */}
              <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Brain className="w-8 h-8 mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
                      <p className="text-purple-100 mt-1">{displaySnapshot.ai_insights.top_insight}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-purple-200">Data Quality Score</div>
                    <div className="text-2xl font-bold">{displaySnapshot.data_quality_score?.toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Inventory Turnover</p>
                      <p className="text-2xl font-bold text-gray-900">{displaySnapshot.metrics.inventory_turnover}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="mt-2 text-sm text-green-600">+12.3% vs last period</div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Order Fulfillment</p>
                      <p className="text-2xl font-bold text-gray-900">{displaySnapshot.metrics.order_fulfillment_rate}%</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="mt-2 text-sm text-green-600">+2.1% vs last period</div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Supplier Performance</p>
                      <p className="text-2xl font-bold text-gray-900">{displaySnapshot.metrics.supplier_performance}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="mt-2 text-sm text-green-600">+0.8% vs last period</div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cost Variance</p>
                      <p className="text-2xl font-bold text-gray-900">{displaySnapshot.metrics.cost_variance}%</p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="mt-2 text-sm text-green-600">Improved by 5.2%</div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Quality Score</p>
                      <p className="text-2xl font-bold text-gray-900">{displaySnapshot.metrics.quality_score}%</p>
                    </div>
                    <Eye className="w-8 h-8 text-orange-600" />
                  </div>
                  <div className="mt-2 text-sm text-green-600">+0.3% vs last period</div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Perfect Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{displaySnapshot.kpis.perfect_order_rate}%</p>
                    </div>
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="mt-2 text-sm text-green-600">+1.7% vs last period</div>
                </div>
              </div>

              {/* Alerts & Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Alerts</h3>
                  <div className="space-y-4">
                    {displaySnapshot.alerts.map((alert, index) => (
                      <div key={index} className={`flex items-start p-4 rounded-lg ${
                        alert.severity === 'high' ? 'bg-red-50 border border-red-200' :
                        alert.severity === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
                        'bg-blue-50 border border-blue-200'
                      }`}>
                        <AlertTriangle className={`w-5 h-5 mr-3 mt-0.5 ${
                          alert.severity === 'high' ? 'text-red-500' :
                          alert.severity === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {alert.severity.toUpperCase()} • {alert.count} items affected
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
                  <div className="space-y-4">
                    <div className="flex items-start p-4 bg-green-50 border border-green-200 rounded-lg">
                      <Zap className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Efficiency Opportunity</p>
                        <p className="text-sm text-gray-600 mt-1">{displaySnapshot.ai_insights.efficiency_recommendation}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <Brain className="w-5 h-5 text-purple-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Strategic Insight</p>
                        <p className="text-sm text-gray-600 mt-1">{displaySnapshot.ai_insights.opportunity}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Risk Assessment</p>
                        <p className="text-sm text-gray-600 mt-1">{displaySnapshot.ai_insights.risk_assessment}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ML Models Status */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">AI/ML Models Performance</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Mock ML models if none exist */}
                    {(mlModels.length > 0 ? mlModels : [
                      {
                        id: 'mock-1',
                        model_name: 'Demand Forecasting',
                        model_type: 'demand_forecast',
                        status: 'deployed',
                        accuracy_score: 0.873,
                        prediction_count: 15847,
                        last_prediction_at: new Date().toISOString()
                      },
                      {
                        id: 'mock-2',
                        model_name: 'Supplier Risk Assessment',
                        model_type: 'supplier_scoring',
                        status: 'deployed',
                        accuracy_score: 0.921,
                        prediction_count: 2340,
                        last_prediction_at: new Date().toISOString()
                      },
                      {
                        id: 'mock-3',
                        model_name: 'Route Optimization',
                        model_type: 'route_optimization',
                        status: 'deployed',
                        accuracy_score: 0.845,
                        prediction_count: 8923,
                        last_prediction_at: new Date().toISOString()
                      }
                    ] as MLModel[]).slice(0, 6).map((model) => (
                      <div key={model.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{model.model_name}</h4>
                            <p className="text-sm text-gray-500">{model.model_type.replace('_', ' ')}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            model.status === 'deployed' ? 'bg-green-100 text-green-800' :
                            model.status === 'training' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {model.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Accuracy</span>
                            <span className="font-medium">{((model.accuracy_score || 0) * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Predictions</span>
                            <span className="font-medium">{model.prediction_count?.toLocaleString() || '0'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Last Used</span>
                            <span className="font-medium">
                              {model.last_prediction_at 
                                ? new Date(model.last_prediction_at).toLocaleDateString()
                                : 'Never'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Forecasting & Trends */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Forecasting & Predictive Analytics</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{displaySnapshot.forecasts.demand_forecast_accuracy}%</div>
                      <div className="text-sm text-gray-600 mt-1">Forecast Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-orange-600">{displaySnapshot.forecasts.predicted_stockouts}</div>
                      <div className="text-sm text-gray-600 mt-1">Predicted Stockouts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{displaySnapshot.forecasts.seasonal_adjustment}</div>
                      <div className="text-sm text-gray-600 mt-1">Seasonal Factor</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{displaySnapshot.forecasts.next_month_volume.toLocaleString()}</div>
                      <div className="text-sm text-gray-600 mt-1">Predicted Volume</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {selectedTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Saved Reports */}
                {[
                  {
                    id: 'report-1',
                    name: 'Inventory Valuation',
                    description: 'Total value of inventory by category and warehouse',
                    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    chart_type: 'bar',
                    last_run: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
                  },
                  {
                    id: 'report-2',
                    name: 'Supplier Performance',
                    description: 'On-time delivery and quality metrics by supplier',
                    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
                    chart_type: 'table',
                    last_run: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
                  },
                  {
                    id: 'report-3',
                    name: 'Warehouse Utilization',
                    description: 'Space utilization and capacity metrics by warehouse',
                    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                    chart_type: 'pie',
                    last_run: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
                  },
                  {
                    id: 'report-4',
                    name: 'Purchase Order Analysis',
                    description: 'PO volume, value and approval time analysis',
                    created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
                    chart_type: 'line',
                    last_run: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
                  },
                  {
                    id: 'report-5',
                    name: 'Shipping Cost Analysis',
                    description: 'Shipping costs by carrier, route and package type',
                    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
                    chart_type: 'bar',
                    last_run: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
                  }
                ].map(report => (
                  <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.chart_type === 'bar' ? 'bg-blue-100 text-blue-800' :
                          report.chart_type === 'line' ? 'bg-green-100 text-green-800' :
                          report.chart_type === 'pie' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {report.chart_type.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          Last run: {new Date(report.last_run).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between pt-4 border-t border-gray-200">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Run Report
                      </button>
                      <div className="flex items-center gap-2">
                        <button className="text-gray-600 hover:text-gray-800 text-sm">
                          Edit
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 text-sm">
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Create New Report Card */}
                <div 
                  onClick={() => setShowReportBuilder(true)}
                  className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer flex flex-col items-center justify-center text-center"
                >
                  <FileText className="w-12 h-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900">Create New Report</h3>
                  <p className="text-sm text-gray-500 mt-1">Build a custom report with your selected metrics</p>
                </div>
              </div>
              
              {/* Report Templates */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Report Templates</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                      {
                        id: 'template-1',
                        name: 'Inventory Status',
                        description: 'Current inventory levels and valuation',
                        icon: Package
                      },
                      {
                        id: 'template-2',
                        name: 'Procurement Analysis',
                        description: 'PO metrics and supplier performance',
                        icon: ShoppingCart
                      },
                      {
                        id: 'template-3',
                        name: 'Warehouse Efficiency',
                        description: 'Picking, packing and storage metrics',
                        icon: Warehouse
                      },
                      {
                        id: 'template-4',
                        name: 'Financial Overview',
                        description: 'Cost analysis and budget tracking',
                        icon: DollarSign
                      }
                    ].map(template => {
                      const Icon = template.icon;
                      return (
                        <div 
                          key={template.id}
                          onClick={() => setShowReportBuilder(true)}
                          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Icon className="w-5 h-5 text-blue-600" />
                            </div>
                            <h4 className="font-medium text-gray-900">{template.name}</h4>
                          </div>
                          <p className="text-sm text-gray-500">{template.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {selectedTab === 'mobile' && (
            <MobileAPIEndpoints />
          )}
        </div>
      </div>
      
      {/* Report Builder Modal */}
      <ReportBuilder
        isOpen={showReportBuilder}
        onClose={() => setShowReportBuilder(false)}
        onSave={(report) => {
          setSavedReports([...savedReports, report]);
          setShowReportBuilder(false);
        }}
      />
    </div>
  );
};