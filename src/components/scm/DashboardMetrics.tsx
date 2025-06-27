
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Package, ShoppingCart, Truck, AlertTriangle } from "lucide-react"
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

interface InventoryItem {
  unit_cost: number
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
  const { data: inventoryItems } = useSupabaseData<InventoryItem>(
    "inventory_items",
    "unit_cost, on_hand, reorder_point"
  )

  const { data: purchaseOrders } = useSupabaseData<PurchaseOrder>(
    "purchase_orders",
    "id"
  )

  const { data: shipments } = useSupabaseData<Shipment>(
    "shipments",
    "status"
  )

  // Calculate metrics from real data
  const totalInventoryValue = inventoryItems.reduce((sum, item) => 
    sum + (item.unit_cost || 0) * (item.on_hand || 0), 0)
  
  const activePurchaseOrders = purchaseOrders.length
  
  const shipmentsInTransit = shipments.filter(shipment => 
    shipment.status === 'in_transit' ||  
    shipment.status === 'pending'
  ).length
  
  const lowStockItems = inventoryItems.filter(item => 
    item.on_hand <= item.reorder_point
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
