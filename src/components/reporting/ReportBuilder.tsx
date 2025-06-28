import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  LineChart, 
  PieChart, 
  TableProperties, 
  Save,
  Plus,
  Trash2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ReportBuilderProps {
  isOpen: boolean
  onClose: () => void
  onSave: (report: any) => void
}

export function ReportBuilder({ isOpen, onClose, onSave }: ReportBuilderProps) {
  const { toast } = useToast()
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [chartType, setChartType] = useState("bar")
  const [activeTab, setActiveTab] = useState("data")
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [groupBy, setGroupBy] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("")
  const [filters, setFilters] = useState<{field: string, operator: string, value: string}[]>([
    { field: "", operator: "equals", value: "" }
  ])

  const availableTables = [
    "inventory_items",
    "suppliers",
    "purchase_orders",
    "warehouses",
    "shipments"
  ]

  const availableMetrics = {
    "inventory_items": [
      "count", "avg_unit_cost", "total_value", "avg_on_hand", "reorder_point"
    ],
    "suppliers": [
      "count", "avg_performance_score", "avg_risk_score", "total_orders"
    ],
    "purchase_orders": [
      "count", "avg_total", "sum_total", "avg_approval_time", "fulfillment_rate"
    ],
    "warehouses": [
      "count", "avg_capacity", "total_capacity", "utilization_rate"
    ],
    "shipments": [
      "count", "avg_cost", "total_cost", "on_time_rate", "avg_transit_time"
    ]
  }

  const handleAddFilter = () => {
    setFilters([...filters, { field: "", operator: "equals", value: "" }])
  }

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const handleUpdateFilter = (index: number, field: keyof (typeof filters)[0], value: string) => {
    const newFilters = [...filters]
    newFilters[index] = { ...newFilters[index], [field]: value }
    setFilters(newFilters)
  }

  const handleSave = () => {
    if (!reportName) {
      toast({
        title: "Error",
        description: "Please enter a report name",
        variant: "destructive",
      })
      return
    }
    
    if (selectedTables.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one data source",
        variant: "destructive",
      })
      return
    }

    if (selectedMetrics.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one metric",
        variant: "destructive",
      })
      return
    }

    const report = {
      id: `report-${Date.now()}`,
      name: reportName,
      description: reportDescription,
      chart_type: chartType,
      created_at: new Date().toISOString(),
      last_run: new Date().toISOString(),
      config: {
        tables: selectedTables,
        metrics: selectedMetrics,
        group_by: groupBy,
        sort_by: sortBy,
        filters: filters.filter(f => f.field && f.value)
      }
    }

    onSave(report)
    toast({
      title: "Success",
      description: "Report has been created",
    })

    // Reset form
    setReportName("")
    setReportDescription("")
    setChartType("bar")
    setSelectedTables([])
    setSelectedMetrics([])
    setGroupBy([])
    setSortBy("")
    setFilters([{ field: "", operator: "equals", value: "" }])
    setActiveTab("data")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report Builder</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="reportName" className="text-sm font-medium">Report Name</label>
              <Input
                id="reportName"
                placeholder="Enter report name"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="chartType" className="text-sm font-medium">Chart Type</label>
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">
                    <div className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Bar Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="line">
                    <div className="flex items-center">
                      <LineChart className="w-4 h-4 mr-2" />
                      Line Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="pie">
                    <div className="flex items-center">
                      <PieChart className="w-4 h-4 mr-2" />
                      Pie Chart
                    </div>
                  </SelectItem>
                  <SelectItem value="table">
                    <div className="flex items-center">
                      <TableProperties className="w-4 h-4 mr-2" />
                      Table View
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="reportDescription" className="text-sm font-medium">Description</label>
            <Textarea
              id="reportDescription"
              placeholder="Enter report description"
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              rows={2}
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="pt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="data">Data Sources</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
            </TabsList>
            
            <TabsContent value="data" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Sources</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableTables.map(table => (
                    <div 
                      key={table}
                      className={`p-3 border rounded-lg cursor-pointer ${
                        selectedTables.includes(table) 
                          ? "bg-blue-50 border-blue-300" 
                          : "bg-white hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        if (selectedTables.includes(table)) {
                          setSelectedTables(selectedTables.filter(t => t !== table))
                        } else {
                          setSelectedTables([...selectedTables, table])
                        }
                      }}
                    >
                      <div className="text-sm font-medium">{table.replace("_", " ")}</div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Available Metrics</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedTables.flatMap(table => 
                    (availableMetrics[table as keyof typeof availableMetrics] || []).map(metric => (
                      <div 
                        key={`${table}.${metric}`}
                        className={`p-3 border rounded-lg cursor-pointer ${
                          selectedMetrics.includes(`${table}.${metric}`) 
                            ? "bg-blue-50 border-blue-300" 
                            : "bg-white hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          const metricKey = `${table}.${metric}`
                          if (selectedMetrics.includes(metricKey)) {
                            setSelectedMetrics(selectedMetrics.filter(m => m !== metricKey))
                          } else {
                            setSelectedMetrics([...selectedMetrics, metricKey])
                          }
                        }}
                      >
                        <div className="text-sm font-medium">{metric.replace("_", " ")}</div>
                        <div className="text-xs text-gray-500">{table.replace("_", " ")}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {selectedTables.length === 0 && (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Please select data sources first</p>
                </div>
              )}
              
              {selectedTables.length > 0 && selectedMetrics.length > 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Group By (Optional)</label>
                    <Select value={groupBy[0] || ""} onValueChange={(value) => setGroupBy([value])}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group by field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                        <SelectItem value="supplier">Supplier</SelectItem>
                        <SelectItem value="warehouse">Warehouse</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By (Optional)</label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sort by field" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {selectedMetrics.map(metric => (
                          <SelectItem key={metric} value={metric}>{metric.split('.')[1].replace("_", " ")}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="filters" className="space-y-4 pt-4">
              {filters.map((filter, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Select
                    value={filter.field}
                    onValueChange={(value) => handleUpdateFilter(index, 'field', value)}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="supplier">Supplier</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="date">Date</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select
                    value={filter.operator}
                    onValueChange={(value) => handleUpdateFilter(index, 'operator', value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="greater_than">Greater than</SelectItem>
                      <SelectItem value="less_than">Less than</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Value"
                    value={filter.value}
                    onChange={(e) => handleUpdateFilter(index, 'value', e.target.value)}
                    className="flex-1"
                  />
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveFilter(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddFilter}
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Filter
              </Button>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-1">
            <Save className="w-4 h-4" />
            Create Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}