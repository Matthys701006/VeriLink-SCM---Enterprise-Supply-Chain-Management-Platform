import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  Eye,
  RefreshCw,
  Download,
  FileText,
  Package, 
  DollarSign, 
  Plus, 
  Smartphone,
  ShoppingCart,
  Warehouse,
  Brain,
  Zap
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, TrendingDown, Target, AlertTriangle, Eye, RefreshCw, Download, Brain, Zap, Plus, FileText, Smartphone, Package, ShoppingCart, Warehouse, DollarSign } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { ReportBuilder } from "@/components/reporting/ReportBuilder"
import { useAnalytics } from "@/hooks/useAnalytics"
import { ReportBuilder } from "@/components/reporting/ReportBuilder"
import { MobileAPIEndpoints } from "@/components/mobile/MobileAPIEndpoints"
import { CustomReport } from "@/types/analytics"

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [selectedTab, setSelectedTab] = useState<'overview' | 'reports' | 'mobile'>('overview')
  const [showReportBuilder, setShowReportBuilder] = useState(false)
  const [savedReports, setSavedReports] = useState<CustomReport[]>([])
  
  const { currentSnapshot, mlModels, loading, refresh } = useAnalytics(selectedPeriod)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
      })
    }
    return acc
  }, [] as Array<{ status: string; count: number }>)

  // Calculate totals
  const totalInventoryValue = inventoryByCategory.reduce((sum, cat) => sum + cat.value, 0)
  const totalPurchaseValue = purchaseOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  const totalShippingCosts = shipments.reduce((sum, shipment) => sum + (shipment.shipping_cost || 0), 0)
  const totalInventoryQuantity = inventoryByCategory.reduce((sum, cat) => sum + cat.quantity, 0) 

  const handleRefreshData = () => {
    refreshAnalytics();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {selectedTab === 'overview' ? 'Analytics & Business Intelligence' : 
             selectedTab === 'reports' ? 'Advanced Reporting' : 'Mobile & API'}
          </h1>
          <p className="text-muted-foreground">
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
                <Button 
                  onClick={() => refresh()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </>
            )}
            
            {selectedTab === 'reports' && (
              <Button
                onClick={() => setShowReportBuilder(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Report
              </Button>
            )}
          </div>
        </div>
             selectedTab === 'comparative' ? 'Comparative Analytics' :
             selectedTab === 'reports' ? 'Advanced Reporting' : 
             'Mobile & API'}
          </h1>
          <p className="text-muted-foreground">
            {selectedTab === 'overview' ? 'Real-time insights and AI-powered analytics' : 
             selectedTab === 'predictive' ? 'Forecasting and predictive analytics' :
             selectedTab === 'comparative' ? 'Performance benchmarking and comparison' :
             selectedTab === 'reports' ? 'Custom reports and data exports' : 
             'Mobile app integration and API documentation'}
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
                <Button 
                  onClick={handleRefreshData}
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </>
            )}
            
            {selectedTab === 'reports' && (
              <Button 
                onClick={() => setShowReportBuilder(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Report
              </Button>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" onValueChange={(value) => setSelectedTab(value as any)}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="mobile">
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile & API
          </TabsTrigger>
          <TabsTrigger value="predictive">
            <Target className="w-4 h-4 mr-2" />
            Predictive
          </TabsTrigger>
          <TabsTrigger value="comparative">
            <TrendingUp className="w-4 h-4 mr-2" />
            Comparative
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileText className="w-4 h-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="mobile">
            <Smartphone className="w-4 h-4 mr-2" />
            Mobile & API
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* AI Insights Banner */}
          {displaySnapshot && (
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
          )}

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            {displaySnapshot && (
              <>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displaySnapshot.metrics.inventory_turnover}</div>
                    <p className="text-xs text-muted-foreground">
                      +12.3% vs last period
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Order Fulfillment</CardTitle>
                    <Target className="w-4 h-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displaySnapshot.metrics.order_fulfillment_rate}%</div>
                    <p className="text-xs text-muted-foreground">
                      +2.1% vs last period
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Supplier Performance</CardTitle>
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{displaySnapshot.metrics.supplier_performance}%</div>
                    <p className="text-xs text-muted-foreground">
                      +0.8% vs last period
                    </p>
                  </CardContent>
                </Card>
              </>
            )}

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalInventoryValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {totalInventoryQuantity.toLocaleString()} total items
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Purchase Orders</CardTitle>
                <BarChart3 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{purchaseOrders.length}</div>
                <p className="text-xs text-muted-foreground">
                  ${totalPurchaseValue.toLocaleString()} total value
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
                <Package className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{shipments.length}</div>
                <p className="text-xs text-muted-foreground">
                  ${totalShippingCosts.toLocaleString()} shipping costs
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Alerts & Recommendations */}
          {displaySnapshot && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Real-time Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {displaySnapshot.alerts.map((alert, index) => (
                    <div key={index} className={`flex items-start p-4 rounded-lg ${
        <div className="p-4">
          <TabsContent value="overview" className="space-y-6 mt-0">
            {/* AI Insights Banner */}
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <Brain className="w-8 h-8 mr-3" />
                  <div>
                    <h3 className="text-lg font-semibold">AI-Powered Insights</h3>
                    <p className="text-purple-100 mt-1">{currentSnapshot.ai_insights.top_insight}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-purple-200">Data Quality Score</div>
                  <div className="text-2xl font-bold">{currentSnapshot.data_quality_score?.toFixed(1)}%</div>
                </div>
              </div>
            </div>

            {/* Key Performance Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inventory Turnover</CardTitle>
                  <TrendingUp className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentSnapshot.metrics.inventory_turnover}</div>
                  <p className="text-xs text-green-600">+12.3% vs last period</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Order Fulfillment</CardTitle>
                  <Target className="w-4 h-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentSnapshot.metrics.order_fulfillment_rate}%</div>
                  <p className="text-xs text-green-600">+2.1% vs last period</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Supplier Performance</CardTitle>
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentSnapshot.metrics.supplier_performance}%</div>
                  <p className="text-xs text-green-600">+0.8% vs last period</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cost Variance</CardTitle>
                  <TrendingDown className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentSnapshot.metrics.cost_variance}%</div>
                  <p className="text-xs text-green-600">Improved by 5.2%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Quality Score</CardTitle>
                  <Eye className="w-4 h-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentSnapshot.metrics.quality_score}%</div>
                  <p className="text-xs text-green-600">+0.3% vs last period</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Perfect Orders</CardTitle>
                  <Target className="w-4 h-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentSnapshot.kpis.perfect_order_rate}%</div>
                  <p className="text-xs text-green-600">+1.7% vs last period</p>
                </CardContent>
              </Card>
            </div>
          {/* ML Models */}
          {displaySnapshot && mlModels && mlModels.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>AI/ML Models Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mlModels.slice(0, 3).map((model) => (
                    <div key={model.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{model.model_name}</h4>
                          <p className="text-sm text-gray-500">{model.model_type.replace('_', ' ')}</p>
                        </div>
                        <Badge variant="outline" className={
                          model.status === 'deployed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          model.status === 'training' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }>
                          {model.status}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                          <span className="font-medium">{((model.accuracy_score || 0) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Predictions</span>
                          <span className="font-medium">{model.prediction_count?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Last Used</span>
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
              </CardContent>
            </Card>
          )}
        </TabsContent>

            {/* Alerts & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Real-time Alerts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentSnapshot.alerts.map((alert, index) => (
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
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.severity.toUpperCase()} • {alert.count} items affected
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">AI Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start p-4 bg-green-50 border border-green-200 rounded-lg">
                    <Zap className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Efficiency Opportunity</p>
                      <p className="text-sm text-gray-600 mt-1">{currentSnapshot.ai_insights.efficiency_recommendation}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <Brain className="w-5 h-5 text-purple-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Strategic Insight</p>
                      <p className="text-sm text-gray-600 mt-1">{currentSnapshot.ai_insights.opportunity}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Risk Assessment</p>
                      <p className="text-sm text-gray-600 mt-1">{currentSnapshot.ai_insights.risk_assessment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

        <TabsContent value="reports" className="space-y-6">
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
              ...savedReports
            ].map(report => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{report.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                    </div>
                    <Badge variant="outline" className={
                      report.chart_type === 'bar' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      report.chart_type === 'line' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      report.chart_type === 'pie' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                    }>
                      {report.chart_type.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Last run: {new Date(report.last_run).toLocaleDateString()}
                    </div>
                <TabsContent value="predictive">
                  <PredictiveAnalytics />
                </TabsContent>

                <TabsContent value="comparative">
                  <ComparativeAnalytics />
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          
          <TabsContent value="reports" className="space-y-6 mt-0">
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
                ...savedReports
              ].map(report => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{report.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant="outline" className={
                          report.chart_type === 'bar' ? 'bg-blue-100 text-blue-800' :
                          report.chart_type === 'line' ? 'bg-green-100 text-green-800' :
                          report.chart_type === 'pie' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {report.chart_type.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground mt-1">
                          Last run: {new Date(report.last_run).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between pt-2 border-t">
                      <Button variant="link" className="px-0 text-sm">Run Report</Button>
                      <div className="flex items-center gap-2">
                        <Button variant="link" className="px-1 text-sm">Edit</Button>
                        <Button variant="link" className="px-1 text-sm">Export</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Create New Report Card */}
              <Card onClick={() => setShowReportBuilder(true)} className="hover:shadow-md transition-shadow border-2 border-dashed border-gray-300 hover:border-primary">
                <CardContent className="flex flex-col items-center justify-center text-center py-10">
                  <FileText className="w-12 h-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">Create New Report</h3>
                  <p className="text-sm text-muted-foreground mt-1">Build a custom report with your selected metrics</p>
                </CardContent>
              </Card>
            </div>
            
            {/* Report Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Report Templates</CardTitle>
              </CardHeader>
              <CardContent>
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
                    const Icon = template.icon
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
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="mobile" className="mt-0">
            <MobileAPIEndpoints />
          </TabsContent>
        </div>
      </Tabs>
          
          {/* Report Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
            </CardHeader>
            <CardContent>
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
                      className="border border-muted rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <h4 className="font-medium">{template.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile">
          <MobileAPIEndpoints />
      {/* Report Builder Modal */}
      <ReportBuilder
        isOpen={showReportBuilder}
        onClose={() => setShowReportBuilder(false)}
        onSave={(report) => {
          setSavedReports([...savedReports, report])
          setShowReportBuilder(false)
        }}
      />
      
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
}