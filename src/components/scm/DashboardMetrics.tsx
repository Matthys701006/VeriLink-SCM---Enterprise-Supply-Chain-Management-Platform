import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, ShoppingCart, Truck, AlertTriangle, Loader2 } from "lucide-react"
import { useSupabaseData } from "@/hooks/useSupabaseData"
import { ErrorBoundary } from "@/components/ui/ErrorBoundary"

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
  isLoading?: boolean
}

function MetricCard({ title, value, change, trend, icon, isLoading = false }: MetricCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="text-muted-foreground">{icon}</div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-10">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`text-xs flex items-center mt-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
          {change}
        </div>
      </CardContent>
    </Card>
  )
}

interface InventoryItem {
  unit_cost?: number | null
  on_hand?: number | null
  reorder_point?: number | null
}

interface PurchaseOrder {
  id: string
  status?: string
}

interface Shipment {
  status?: string | null
}

export function DashboardMetrics() {
  try {
    const { data: inventoryItems, loading: loadingInventory, error: inventoryError } = useSupabaseData<InventoryItem>(
      "inventory_items",
      "unit_cost, on_hand, reorder_point"
    )

    const { data: purchaseOrders, loading: loadingPO, error: poError } = useSupabaseData<PurchaseOrder>(
      "purchase_orders",
      "id, status"
    )

    const { data: shipments, loading: loadingShipments, error: shipmentsError } = useSupabaseData<Shipment>(
      "shipments",
      "status"
    )

    const isLoading = loadingInventory || loadingPO || loadingShipments
    const hasError = !!(inventoryError || poError || shipmentsError)

    // Safe versions of data to prevent errors
    const safeInventoryItems = Array.isArray(inventoryItems) ? inventoryItems : []
    const safePurchaseOrders = Array.isArray(purchaseOrders) ? purchaseOrders : []
    const safeShipments = Array.isArray(shipments) ? shipments : []

    // Calculate metrics with proper safeguards
    const totalInventoryValue = safeInventoryItems.reduce((sum, item) => {
      const cost = typeof item?.unit_cost === 'number' ? item.unit_cost : 0
      const quantity = typeof item?.on_hand === 'number' ? item.on_hand : 0
      return sum + (cost * quantity)
    }, 0)
    
    const activePurchaseOrders = safePurchaseOrders.filter(order => 
      order?.status === 'pending' || order?.status === 'approved' || !order?.status
    ).length
    
    const shipmentsInTransit = safeShipments.filter(shipment => 
      shipment?.status === 'in_transit' || shipment?.status === 'pending'
    ).length
    
    const lowStockItems = safeInventoryItems.filter(item => {
      const onHand = typeof item?.on_hand === 'number' ? item.on_hand : 0
      const reorderPoint = typeof item?.reorder_point === 'number' ? item.reorder_point : 0
      return onHand > 0 && onHand <= reorderPoint
    }).length

    // If there's an error, display error cards
    if (hasError && !isLoading) {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="md:col-span-2 lg:col-span-4">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center text-center space-y-2 py-4">
                <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-lg font-medium">Error loading dashboard metrics</p>
                <p className="text-sm text-muted-foreground max-w-md">
                  There was a problem connecting to the database. Please check your connection and try again.
                </p>
                <div className="text-xs text-red-500 bg-red-50 p-2 rounded mt-2 max-w-md overflow-auto">
                  {(inventoryError || poError || shipmentsError || "Unknown error")}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    const metrics = [
      {
        title: "Total Inventory Value",
        value: `$${totalInventoryValue.toLocaleString()}`,
        change: "+12.5% from last month",
        trend: "up" as const,
        icon: <Package className="w-4 h-4" />
      },
      {
        title: "Active Purchase Orders",
        value: activePurchaseOrders.toString(),
        change: "+8.2% from last week",
        trend: "up" as const,
        icon: <ShoppingCart className="w-4 h-4" />
      },
      {
        title: "Shipments In Transit",
        value: shipmentsInTransit.toString(),
        change: "-3.1% from yesterday",
        trend: "down" as const,
        icon: <Truck className="w-4 h-4" />
      },
      {
        title: "Low Stock Alerts",
        value: lowStockItems.toString(),
        change: lowStockItems > 0 ? "+20% from last week" : "-20% from last week",
        trend: lowStockItems > 0 ? "up" as const : "down" as const,
        icon: <AlertTriangle className="w-4 h-4" />
      }
    ]

    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <MetricCard 
            key={index} 
            {...metric} 
            isLoading={isLoading}
          />
        ))}
      </div>
    )
  } catch (err) {
    console.error("Error in DashboardMetrics:", err);
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="md:col-span-2 lg:col-span-4">
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center space-y-2 py-4">
              <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
              <p className="text-lg font-medium">Unexpected error</p>
              <p className="text-sm text-muted-foreground">
                An unexpected error occurred while loading the dashboard metrics.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}

// Wrap the component with an error boundary
export default function DashboardMetricsWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <DashboardMetrics />
    </ErrorBoundary>
  );
}