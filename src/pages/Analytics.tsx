
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { BarChart3, TrendingUp, DollarSign, Package } from "lucide-react"
import { useSupabaseData } from "@/hooks/useSupabaseData"
import { PredictiveAnalytics } from "@/components/analytics/PredictiveAnalytics"
import { ComparativeAnalytics } from "@/components/analytics/ComparativeAnalytics"
import { useTranslation } from "@/hooks/useTranslation"

interface InventoryItem {
  category: string
  on_hand: number
  unit_cost: number
}

interface PurchaseOrder {
  status: string
  total_amount: number
  order_date: string
}

interface Shipment {
  status: string
  shipping_cost: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Analytics() {
  const { t } = useTranslation()
  const { data: inventoryItems } = useSupabaseData<InventoryItem>(
    "inventory_items",
    "category, on_hand, unit_cost"
  )

  const { data: purchaseOrders } = useSupabaseData<PurchaseOrder>(
    "purchase_orders",
    "status, total_amount, order_date"
  )

  const { data: shipments } = useSupabaseData<Shipment>(
    "shipments",
    "status, shipping_cost"
  )

  // Process inventory data by category
  const inventoryByCategory = inventoryItems.reduce((acc, item) => {
    const existing = acc.find(cat => cat.category === item.category)
    if (existing) {
      existing.quantity += item.on_hand
      existing.value += item.on_hand * (item.unit_cost || 0)
    } else {
      acc.push({
        category: item.category,
        quantity: item.on_hand,
        value: item.on_hand * (item.unit_cost || 0)
      })
    }
    return acc
  }, [] as Array<{category: string, quantity: number, value: number}>)

  // Process purchase orders by status
  const ordersByStatus = purchaseOrders.reduce((acc, order) => {
    const existing = acc.find(status => status.status === order.status)
    if (existing) {
      existing.count += 1
      existing.value += order.total_amount || 0
    } else {
      acc.push({
        status: order.status,
        count: 1,
        value: order.total_amount || 0
      })
    }
    return acc
  }, [] as Array<{status: string, count: number, value: number}>)

  // Process shipments by status
  const shipmentsByStatus = shipments.reduce((acc, shipment) => {
    const existing = acc.find(status => status.status === shipment.status)
    if (existing) {
      existing.count += 1
      existing.cost += shipment.shipping_cost || 0
    } else {
      acc.push({
        status: shipment.status.replace('_', ' '),
        count: 1,
        cost: shipment.shipping_cost || 0
      })
    }
    return acc
  }, [] as Array<{status: string, count: number, cost: number}>)

  // Calculate key metrics
  const totalInventoryValue = inventoryByCategory.reduce((sum, cat) => sum + cat.value, 0)
  const totalPurchaseValue = purchaseOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
  const totalShippingCosts = shipments.reduce((sum, shipment) => sum + (shipment.shipping_cost || 0), 0)
  const totalInventoryQuantity = inventoryByCategory.reduce((sum, cat) => sum + cat.quantity, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('analytics.title')}</h1>
        <p className="text-muted-foreground">
          {t('analytics.subtitle')}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictive">{t('analytics.predictive')}</TabsTrigger>
          <TabsTrigger value="comparative">{t('analytics.comparative')}</TabsTrigger>
          <TabsTrigger value="detailed">Detailed</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('dashboard.total-inventory-value')}</CardTitle>
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
                <CardTitle className="text-sm font-medium">{t('nav.purchase-orders')}</CardTitle>
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

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inventoryByCategory.length}</div>
                <p className="text-xs text-muted-foreground">
                  Distinct product categories
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inventoryByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantity" fill="#3b82f6" name="Quantity" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Purchase Orders by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={ordersByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ status, count }) => `${status}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {ordersByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictive">
          <PredictiveAnalytics />
        </TabsContent>

        <TabsContent value="comparative">
          <ComparativeAnalytics />
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Value Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inventoryByCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#10b981" name="Value ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipment Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={shipmentsByStatus}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#f59e0b" name="Count" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
