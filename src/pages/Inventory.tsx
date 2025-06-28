import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, Package, AlertTriangle, FileText, Edit, Filter, TrendingDown, TrendingUp, Warehouse } from "lucide-react"
import { useSupabaseData } from "@/hooks/useSupabaseData"
import { InventoryItemForm } from "@/components/forms/InventoryItemForm"
import { useAppStore } from "@/stores/appStore"
import { useWebSocketSimulator } from "@/hooks/useWebSocketSimulator"

interface InventoryItem {
  id: string
  sku: string
  name: string
  description: string
  category: string
  on_hand: number
  reserved: number
  reorder_point: number
  unit_cost: number
  status: string
  warehouse_id: string
  warehouses?: {
    name: string
    code: string
  }
}

export default function Inventory() {
  const { searchTerm: globalSearchTerm, setSearchTerm: setGlobalSearchTerm } = useAppStore()
  const [localSearchTerm, setLocalSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [realTimeUpdates, setRealTimeUpdates] = useState(0)
  
  // WebSocket simulator for real-time updates
  const { connectionStatus, updateCount, subscribeToInventoryUpdates } = useWebSocketSimulator({
    simulateUpdates: true,
    updateInterval: 15000 // 15 seconds
  })
  
  // Get inventory items with related warehouse data
  const { data: inventoryItems, loading, error, refetch } = useSupabaseData<InventoryItem>(
    "inventory_items",
    `id, sku, name, description, category, on_hand, reserved, reorder_point, unit_cost, status, warehouse_id, 
     warehouses (name, code)`,
    { column: "name", ascending: true },
    true // Enable real-time updates
  )

  // Subscribe to real-time inventory updates
  useEffect(() => {
    const unsubscribe = subscribeToInventoryUpdates((update) => {
      console.log("Received update:", update)
      setRealTimeUpdates(prev => prev + 1)
    })
    return unsubscribe
  }, [subscribeToInventoryUpdates])

  // Sync local and global search
  useEffect(() => {
    if (globalSearchTerm !== localSearchTerm) {
      setLocalSearchTerm(globalSearchTerm)
    }
  }, [globalSearchTerm])

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value)
    setGlobalSearchTerm(value)
  }

  // Filter items based on search and filters
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = 
      item.name?.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
      item.sku?.toLowerCase().includes(localSearchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(localSearchTerm.toLowerCase())
    
    const matchesCategory = !categoryFilter || item.category === categoryFilter
    const matchesStatus = !statusFilter || item.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Extract all categories and statuses for filters
  const categories = [...new Set(inventoryItems.filter(i => i.category).map(item => item.category))]
  const statuses = [...new Set(inventoryItems.filter(i => i.status).map(item => item.status))]

  const getStatusColor = (status: string = "") => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800"
      case "low_stock":
        return "bg-yellow-100 text-yellow-800"
      case "out_of_stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStockIcon = (item: InventoryItem) => {
    if (item.on_hand <= 0) return <TrendingDown className="w-4 h-4 text-red-600" />
    if (item.on_hand <= item.reorder_point) return <AlertTriangle className="w-4 h-4 text-yellow-600" />
    return <TrendingUp className="w-4 h-4 text-green-600" />
  }

  const handleFormSuccess = () => {
    setDialogOpen(false)
    setEditingItem(null)
    refetch()
  }

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setDialogOpen(true)
  }

  // Calculate inventory metrics
  const totalItems = inventoryItems.length
  const lowStockItems = inventoryItems.filter(item => item.on_hand > 0 && item.on_hand <= item.reorder_point).length
  const outOfStockItems = inventoryItems.filter(item => item.on_hand <= 0).length
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.unit_cost || 0) * (item.on_hand || 0), 0)

  // Show skeleton loading state
  if (loading && inventoryItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Inventory Management</h1>
            <p className="text-muted-foreground">
              Track and manage your inventory levels with real-time updates
            </p>
          </div>
          <Button disabled>
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input placeholder="Loading inventory..." className="pl-10" disabled />
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 flex flex-col space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Handle error state with fallback UI
  if (error) {
    console.error("Error loading inventory:", error)
    // Continue with UI even with error to prevent flash
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground">
              Track and manage your inventory levels with real-time updates
            </p>
            {updateCount > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  Real-time updates
                </div>
              </Badge>
            )}
          </div>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={() => setEditingItem(null)}>
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
              </DialogTitle>
            </DialogHeader>
            <InventoryItemForm
              onSuccess={handleFormSuccess}
              onCancel={() => setDialogOpen(false)}
              initialData={editingItem || undefined}
              itemId={editingItem?.id}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search inventory..."
            className="pl-10"
            value={localSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex flex-1 gap-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {statuses.map(status => (
              <option key={status} value={status}>
                {status.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Items</h3>
              <div className="text-2xl font-bold">{totalItems}</div>
            </div>
            <Package className="w-8 h-8 text-primary opacity-70" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Low Stock</h3>
              <div className="text-2xl font-bold text-yellow-600">
                {lowStockItems}
              </div>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600 opacity-70" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Out of Stock</h3>
              <div className="text-2xl font-bold text-red-600">
                {outOfStockItems}
              </div>
            </div>
            <Package className="w-8 h-8 text-red-600 opacity-70" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Value</h3>
              <div className="text-2xl font-bold">
                ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
            </div>
            <FileText className="w-8 h-8 text-primary opacity-70" />
          </CardContent>
        </Card>
      </div>

      {/* Inventory Items Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredItems.map((item) => {
          const availableStock = (item.on_hand || 0) - (item.reserved || 0);
          const isLowStock = item.on_hand > 0 && item.on_hand <= item.reorder_point;
          const isOutOfStock = item.on_hand <= 0;
          
          return (
            <Card key={item.id} className={`hover:shadow-md transition-shadow border-l-4 ${
              isOutOfStock ? 'border-l-red-500' : 
              isLowStock ? 'border-l-yellow-500' : 
              'border-l-green-500'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        isOutOfStock ? 'bg-red-100' : 
                        isLowStock ? 'bg-yellow-100' : 
                        'bg-green-100'
                      }`}>
                        <Package className={`w-5 h-5 ${
                          isOutOfStock ? 'text-red-600' : 
                          isLowStock ? 'text-yellow-600' : 
                          'text-green-600'
                        }`} />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-base">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.sku}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Category</span>
                    <span>{item.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Warehouse</span>
                    <div className="flex items-center">
                      <Warehouse className="w-3.5 h-3.5 mr-1 text-muted-foreground" />
                      <span>{item.warehouses?.name || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Unit Cost</span>
                    <span className="font-medium">${item.unit_cost?.toFixed(2) || '0.00'}</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Stock Status</span>
                    <Badge variant="outline" className={getStatusColor(item.status)}>
                      {item.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="border rounded-md p-2 text-center">
                      <div className="text-xs text-muted-foreground">On Hand</div>
                      <div className="text-lg font-bold flex items-center justify-center">
                        {item.on_hand} {getStockIcon(item)}
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-2 text-center">
                      <div className="text-xs text-muted-foreground">Available</div>
                      <div className="text-lg font-bold">{availableStock}</div>
                    </div>
                    
                    <div className="border rounded-md p-2 text-center">
                      <div className="text-xs text-muted-foreground">Reorder At</div>
                      <div className="text-lg font-bold">{item.reorder_point}</div>
                    </div>
                  </div>
                </div>
                
                {(isLowStock || isOutOfStock) && (
                  <div className={`mt-4 p-2 text-sm rounded-md flex items-center ${
                    isOutOfStock ? 'bg-red-50 text-red-800' : 'bg-yellow-50 text-yellow-800'
                  }`}>
                    <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>
                      {isOutOfStock ? 'Out of stock! Order immediately.' : 'Low stock level. Consider reordering soon.'}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12 border rounded-lg bg-white">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No inventory items found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {localSearchTerm || categoryFilter || statusFilter 
              ? "Try adjusting your filters or search term"
              : "Start by adding your first inventory item"}
          </p>
          {!localSearchTerm && !categoryFilter && !statusFilter ? (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Item
            </Button>
          ) : (
            <Button variant="outline" onClick={() => {
              setLocalSearchTerm("")
              setGlobalSearchTerm("")
              setCategoryFilter("")
              setStatusFilter("")
            }}>
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      )}
    </div>
  )
}