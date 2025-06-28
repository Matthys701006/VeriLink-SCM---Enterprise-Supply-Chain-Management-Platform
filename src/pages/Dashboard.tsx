import { DashboardMetrics } from "@/components/scm/DashboardMetrics"
import { SupplierPerformance } from "@/components/scm/SupplierPerformance"
import { RecentActivity } from "@/components/scm/RecentActivity"
import { InventoryChart } from "@/components/scm/InventoryChart"
import { useSupabaseData } from "@/hooks/useSupabaseData"

export default function Dashboard() {
  const { data: inventoryItems, loading: loadingInventory } = useSupabaseData(
    "inventory_items",
    "id, sku, on_hand, reorder_point, status"
  )
  
  const { data: warehouses, loading: loadingWarehouses } = useSupabaseData(
    "warehouses",
    "id, name, code"
  )
  
  // Calculate dashboard stats
  const dashboardStats = {
    totalItems: inventoryItems.length,
    lowStockItems: inventoryItems.filter(item => item.on_hand <= item.reorder_point).length,
    totalWarehouses: warehouses.length,
    totalValue: inventoryItems.reduce((sum, item) => sum + (item.unit_cost || 0) * (item.on_hand || 0), 0),
  }

  const isLoading = loadingInventory || loadingWarehouses

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

      <DashboardMetrics />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SupplierPerformance />
        <InventoryChart />
        <RecentActivity />
      </div>
    </div>
  )
}
