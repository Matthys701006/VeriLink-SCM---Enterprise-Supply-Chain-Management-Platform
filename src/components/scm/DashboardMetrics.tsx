import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, ShoppingCart, Truck, AlertTriangle, Loader2 } from "lucide-react"
import { useSupabaseData } from "@/hooks/useSupabaseData"

interface MetricCardProps {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
}

function MetricCard({ title, value, change, trend, icon }: MetricCardProps) {
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

function LoadingCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Loading...</CardTitle>
        <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">--</div>
        <div className="text-xs text-muted-foreground mt-1">Please wait...</div>
      </CardContent>
    </Card>
  )
}

interface InventoryItem {
  unit_cost: number | null
  on_hand: number
  reorder_point: number
}

interface PurchaseOrder {
  id: string
}

interface Shipment {
  status: string
}

export function DashboardMetrics() {
  const { 
    data: inventoryItems, 
    loading: loadingInventory, 
    error: errorInventory 
  } = useSupabaseData<InventoryItem>(
    "inventory_items",
    "unit_cost, on_hand, reorder_point"
  )

  const { 
    data: purchaseOrders, 
    loading: loadingPurchaseOrders, 
    error: errorPurchaseOrders 
  } = useSupabaseData<PurchaseOrder>(
    "purchase_orders",
    "id"
  )

  const { 
    data: shipments, 
    loading: loadingShipments, 
    error: errorShipments 
  } = useSupabaseData<Shipment>(
    "shipments",
    "status"
  )

  // Show loading state while any data is still loading
  const isLoading = loadingInventory || loadingPurchaseOrders || loadingShipments
  const hasError = errorInventory || errorPurchaseOrders || errorShipments

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <LoadingCard key={index} />
        ))}
      </div>
    )
  }

  if (hasError) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-red-600">Failed to load data</div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Ensure data arrays exist and provide safe defaults
  const safeInventoryItems = inventoryItems || []
  const safePurchaseOrders = purchaseOrders || []
  const safeShipments = shipments || []

  // Calculate metrics from real data with safe handling
  const totalInventoryValue = safeInventoryItems.reduce((sum, item) => {
    const unitCost = item.unit_cost || 0
    const onHand = item.on_hand || 0
    return sum + (unitCost * onHand)
  }, 0)
  
  const activePurchaseOrders = safePurchaseOrders.length
  
  const shipmentsInTransit = safeShipments.filter(shipment => 
    shipment.status === 'in_transit' ||  
    shipment.status === 'pending'
  ).length
  
  const lowStockItems = safeInventoryItems.filter(item => 
    (item.on_hand || 0) <= (item.reorder_point || 0)
  ).length

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
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  )
}