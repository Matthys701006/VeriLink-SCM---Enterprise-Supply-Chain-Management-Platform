import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, ShoppingCart, Truck, AlertTriangle, Loader2 } from "lucide-react"
import { useSupabaseData } from "@/hooks/useSupabaseData"

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
  isLoading?: boolean
}

function MetricCard({ title, value, change, trend, icon, isLoading }: MetricCardProps) {
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
}

interface Shipment {
  status?: string | null
}

export function DashboardMetrics() {
  const { data: inventoryItems, loading: loadingInventory, error: inventoryError } = useSupabaseData<InventoryItem>(
    "inventory_items",
    "unit_cost, on_hand, reorder_point"
  )

  const { data: purchaseOrders, loading: loadingPO, error: poError } = useSupabaseData<PurchaseOrder>(
    "purchase_orders",
    "id"
  )

  const { data: shipments, loading: loadingShipments, error: shipmentsError } = useSupabaseData<Shipment>(
    "shipments",
    "status"
  )

  const isLoading = loadingInventory || loadingPO || loadingShipments
  const hasError = !!inventoryError || !!poError || !!shipmentsError

  // Calculate metrics from real data (with null checks)
  const safeInventoryItems = Array.isArray(inventoryItems) ? inventoryItems : []
  const safePurchaseOrders = Array.isArray(purchaseOrders) ? purchaseOrders : []
  const safeShipments = Array.isArray(shipments) ? shipments : []

  // Safe calculation for total inventory value
  const totalInventoryValue = safeInventoryItems.reduce((sum, item) => 
    sum + ((item?.unit_cost || 0) * (item?.on_hand || 0)), 0)
  
  // Safe calculation for active purchase orders count
  const activePurchaseOrders = safePurchaseOrders.length
  
  // Safe calculation for shipments in transit
  const shipmentsInTransit = safeShipments.filter(shipment => 
    shipment?.status === 'in_transit' || 
    shipment?.status === 'pending'
  ).length
  
  // Safe calculation for low stock items
  const lowStockItems = safeInventoryItems.filter(item => 
    (item?.on_hand || 0) <= (item?.reorder_point || 0) && 
    (item?.on_hand || 0) > 0
  ).length

  // If there's an error, display error cards
  if (hasError) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <p className="text-sm text-muted-foreground">Error loading dashboard metrics</p>
              <p className="text-xs text-red-500">
                {inventoryError || poError || shipmentsError || "Unknown error"}
              </p>
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
}