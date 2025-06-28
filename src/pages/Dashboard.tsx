import { DashboardMetrics } from "@/components/scm/DashboardMetrics"
import { SupplierPerformance } from "@/components/scm/SupplierPerformance"
import { RecentActivity } from "@/components/scm/RecentActivity"
import { InventoryChart } from "@/components/scm/InventoryChart"
import { useSupabaseData } from "@/hooks/useSupabaseData"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"
import { Loader2 } from "lucide-react"

export default function Dashboard() {
  const { data: inventoryItems, loading: loadingInventory, error: inventoryError } = useSupabaseData(
    "inventory_items",
    "id, sku, on_hand, reorder_point, status, unit_cost"
  )
  
  const { data: warehouses, loading: loadingWarehouses, error: warehousesError } = useSupabaseData(
    "warehouses",
    "id, name, code"
  )
  
  const isLoading = loadingInventory || loadingWarehouses
  const hasError = !!(inventoryError || warehousesError)
  
  // Calculate dashboard stats safely
  const dashboardStats = {
    totalItems: Array.isArray(inventoryItems) ? inventoryItems.length : 0,
    lowStockItems: Array.isArray(inventoryItems) ? 
      inventoryItems.filter(item => 
        typeof item?.on_hand === 'number' && 
        typeof item?.reorder_point === 'number' && 
        item.on_hand <= item.reorder_point
      ).length : 0,
    totalWarehouses: Array.isArray(warehouses) ? warehouses.length : 0,
    totalValue: Array.isArray(inventoryItems) ? 
      inventoryItems.reduce((sum, item) => {
        const cost = typeof item?.unit_cost === 'number' ? item.unit_cost : 0
        const quantity = typeof item?.on_hand === 'number' ? item.on_hand : 0
        return sum + (cost * quantity)
      }, 0) : 0
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading dashboard data...</span>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Supply Chain Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage your supply chain operations in real-time
          </p>
        </div>
        
        <div className="flex items-center p-4 mb-4 text-red-800 border border-red-300 rounded-lg bg-red-50">
          <div className="inline-flex items-center justify-center w-8 h-8 text-red-500 bg-red-100 rounded-lg mr-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
            </svg>
          </div>
          <div>
            <span className="font-medium">Error loading data</span>
            <p className="mt-1 text-sm">
              {inventoryError || warehousesError || "Failed to load dashboard data"}
            </p>
          </div>
        </div>
        
        {/* Show static content so dashboard isn't empty */}
        <DashboardMetrics />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Supply Chain Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your supply chain operations in real-time
        </p>
      </div>

      <ErrorBoundary>
        <DashboardMetrics />
      </ErrorBoundary>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ErrorBoundary>
          <SupplierPerformance />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <InventoryChart />
        </ErrorBoundary>
        
        <ErrorBoundary>
          <RecentActivity />
        </ErrorBoundary>
      </div>
    </div>
  )
}