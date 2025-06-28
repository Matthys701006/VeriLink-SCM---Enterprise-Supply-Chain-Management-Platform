import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { PanelRight, BarChart3, BarChart, LineChart, PieChart, Table, Save, X, Plus, ListFilter, Columns } from "lucide-react"

interface ReportBuilderProps {
  isOpen: boolean
  onClose: () => void
  onSave: (report: any) => void
}

export function ReportBuilder({ isOpen, onClose, onSave }: ReportBuilderProps) {
  const [activeTab, setActiveTab] = useState("metrics")
  const [reportName, setReportName] = useState("New Report")
  const [reportDescription, setReportDescription] = useState("")
  const [chartType, setChartType] = useState<string>("bar")
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const resetForm = () => {
    setReportName("New Report")
    setReportDescription("")
    setChartType("bar")
    setSelectedMetrics([])
    setSelectedFilters([])
    setActiveTab("metrics")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSave = () => {
    const report = {
      id: `report-${Date.now()}`,
      name: reportName,
      description: reportDescription,
      chart_type: chartType,
      metrics: selectedMetrics,
      filters: selectedFilters,
      created_at: new Date().toISOString(),
    }
    
    onSave(report)
    resetForm()
  }

  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric) 
        : [...prev, metric]
    )
  }

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    )
  }

  const metrics = [
    { id: "inventory_value", name: "Inventory Value", category: "Inventory" },
    { id: "inventory_turnover", name: "Inventory Turnover", category: "Inventory" },
    { id: "stockout_rate", name: "Stockout Rate", category: "Inventory" },
    { id: "order_fill_rate", name: "Order Fill Rate", category: "Orders" },
    { id: "order_cycle_time", name: "Order Cycle Time", category: "Orders" },
    { id: "supplier_on_time", name: "Supplier On-Time Delivery", category: "Suppliers" },
    { id: "supplier_quality", name: "Supplier Quality", category: "Suppliers" },
    { id: "warehouse_utilization", name: "Warehouse Utilization", category: "Warehouse" },
    { id: "picking_accuracy", name: "Picking Accuracy", category: "Warehouse" },
    { id: "transportation_cost", name: "Transportation Cost", category: "Logistics" },
    { id: "delivery_performance", name: "Delivery Performance", category: "Logistics" },
    { id: "carbon_emissions", name: "Carbon Emissions", category: "Sustainability" },
  ]

  const filters = [
    { id: "date_range", name: "Date Range", type: "date" },
    { id: "warehouse", name: "Warehouse", type: "select" },
    { id: "category", name: "Category", type: "select" },
    { id: "supplier", name: "Supplier", type: "select" },
    { id: "status", name: "Status", type: "select" },
    { id: "priority", name: "Priority", type: "select" },
  ]

  const metricsByCategory = metrics.reduce((acc, metric) => {
    if (!acc[metric.category]) {
      acc[metric.category] = []
    }
    acc[metric.category].push(metric)
    return acc
  }, {} as Record<string, typeof metrics>)

  const chartIcons = {
    bar: <BarChart className="h-4 w-4" />,
    line: <LineChart className="h-4 w-4" />,
    pie: <PieChart className="h-4 w-4" />,
    table: <Table className="h-4 w-4" />,
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Report Builder</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r p-4">
            <Tabs defaultValue="metrics" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="metrics">
                  <Columns className="h-4 w-4 mr-1" />
                  Metrics
                </TabsTrigger>
                <TabsTrigger value="filters">
                  <ListFilter className="h-4 w-4 mr-1" />
                  Filters
                </TabsTrigger>
                <TabsTrigger value="preview">
                  <BarChart3 className="h-4 w-4 mr-1" />
                  Preview
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="mt-4">
              {activeTab === "metrics" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Metrics</Label>
                    <div className="h-[calc(100vh-400px)] overflow-auto pr-2 space-y-4">
                      {Object.entries(metricsByCategory).map(([category, categoryMetrics]) => (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">{category}</h4>
                          <div className="space-y-2">
                            {categoryMetrics.map((metric) => (
                              <div 
                                key={metric.id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={metric.id}
                                  checked={selectedMetrics.includes(metric.id)}
                                  onCheckedChange={() => toggleMetric(metric.id)}
                                />
                                <label 
                                  htmlFor={metric.id}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                  {metric.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === "filters" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Filters</Label>
                    <div className="h-[calc(100vh-400px)] overflow-auto pr-2 space-y-2">
                      {filters.map((filter) => (
                        <div 
                          key={filter.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`filter-${filter.id}`}
                            checked={selectedFilters.includes(filter.id)}
                            onCheckedChange={() => toggleFilter(filter.id)}
                          />
                          <label 
                            htmlFor={`filter-${filter.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {filter.name}
                          </label>
                          <Badge variant="outline" className="ml-auto">
                            {filter.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "preview" && (
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Chart Type</h4>
                    <Select value={chartType} onValueChange={setChartType}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bar">
                          <div className="flex items-center">
                            <BarChart className="h-4 w-4 mr-2" />
                            Bar Chart
                          </div>
                        </SelectItem>
                        <SelectItem value="line">
                          <div className="flex items-center">
                            <LineChart className="h-4 w-4 mr-2" />
                            Line Chart
                          </div>
                        </SelectItem>
                        <SelectItem value="pie">
                          <div className="flex items-center">
                            <PieChart className="h-4 w-4 mr-2" />
                            Pie Chart
                          </div>
                        </SelectItem>
                        <SelectItem value="table">
                          <div className="flex items-center">
                            <Table className="h-4 w-4 mr-2" />
                            Table
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-name">Report Name</Label>
                    <Input
                      id="report-name"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="report-description">Description</Label>
                    <Textarea
                      id="report-description"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">{reportName || "New Report"}</h3>
                {reportDescription && <p className="text-sm text-muted-foreground">{reportDescription}</p>}
              </div>
              <div className="flex items-center gap-2">
                {chartType && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    {chartIcons[chartType as keyof typeof chartIcons]}
                    {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
                  </Badge>
                )}
                <Badge variant="outline" className="flex items-center gap-1">
                  <Columns className="h-4 w-4 mr-1" />
                  {selectedMetrics.length} metrics
                </Badge>
                {selectedFilters.length > 0 && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <ListFilter className="h-4 w-4 mr-1" />
                    {selectedFilters.length} filters
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex-1 border rounded-lg p-4 bg-slate-50 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground" />
                
                {selectedMetrics.length > 0 ? (
                  <div>
                    <h3 className="mt-4 font-medium">Selected Metrics</h3>
                    <div className="flex flex-wrap gap-2 mt-2 justify-center">
                      {selectedMetrics.map((metricId) => (
                        <Badge key={metricId} variant="secondary">
                          {metrics.find(m => m.id === metricId)?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-muted-foreground">Select metrics to build your report</p>
                )}
                
                {selectedFilters.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-medium">Filters</h3>
                    <div className="flex flex-wrap gap-2 mt-2 justify-center">
                      {selectedFilters.map((filterId) => (
                        <Badge key={filterId} variant="outline">
                          {filters.find(f => f.id === filterId)?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={handleClose}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={selectedMetrics.length === 0 || !reportName}
              >
                <Save className="h-4 w-4 mr-2" />
                Save Report
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}