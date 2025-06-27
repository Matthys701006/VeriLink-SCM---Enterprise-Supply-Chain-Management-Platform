
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts"
import { Calendar, TrendingUp, TrendingDown } from "lucide-react"
import { useSupabaseData } from "@/hooks/useSupabaseData"

interface InventoryItem {
  category: string
  on_hand: number
  unit_cost: number
}

interface PurchaseOrder {
  order_date: string
  total_amount: number
  status: string
}

interface Shipment {
  status: string
  shipping_cost: number
}

export function ComparativeAnalytics() {
  const { data: inventoryItems } = useSupabaseData<InventoryItem>(
    "inventory_items",
    "category, on_hand, unit_cost"
  )

  const { data: purchaseOrders } = useSupabaseData<PurchaseOrder>(
    "purchase_orders",
    "order_date, total_amount, status"
  )

  const { data: shipments } = useSupabaseData<Shipment>(
    "shipments",
    "status, shipping_cost"
  )

  // Generate comparison data for different time periods
  const generateTimeComparison = () => {
    const periods = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024']
    const currentTotal = purchaseOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    
    return periods.map((period, index) => {
      const variance = (Math.random() - 0.5) * 0.3
      const baseValue = currentTotal * (0.7 + index * 0.1)
      
      return {
        period,
        purchases: Math.floor(baseValue * (1 + variance)),
        inventory: Math.floor(baseValue * 0.8 * (1 + variance * 0.5)),
        shipping: Math.floor(baseValue * 0.1 * (1 + variance * 1.5))
      }
    })
  }

  // Calculate category performance comparison
  const categoryPerformance = inventoryItems.reduce((acc, item) => {
    const existing = acc.find(cat => cat.category === item.category)
    const value = item.on_hand * (item.unit_cost || 0)
    
    if (existing) {
      existing.currentValue += value
      existing.items += 1
    } else {
      acc.push({
        category: item.category,
        currentValue: value,
        items: 1,
        // Simulate previous period data
        previousValue: value * (0.8 + Math.random() * 0.4),
        trend: Math.random() > 0.5 ? 'up' : 'down'
      })
    }
    return acc
  }, [] as Array<{
    category: string
    currentValue: number
    previousValue: number
    items: number
    trend: 'up' | 'down'
  }>)

  const timeComparisonData = generateTimeComparison()

  // Calculate key metrics
  const totalCurrentValue = categoryPerformance.reduce((sum, cat) => sum + cat.currentValue, 0)
  const totalPreviousValue = categoryPerformance.reduce((sum, cat) => sum + cat.previousValue, 0)
  const overallChange = ((totalCurrentValue - totalPreviousValue) / totalPreviousValue) * 100

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Period Change</CardTitle>
            {overallChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${overallChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {overallChange >= 0 ? '+' : ''}{overallChange.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">vs previous period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Category</CardTitle>
            <Calendar className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {categoryPerformance.length > 0 ? 
                categoryPerformance.reduce((best, cat) => 
                  cat.currentValue > best.currentValue ? cat : best
                ).category : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">highest value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Items</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {categoryPerformance.filter(cat => cat.trend === 'up').length}
            </div>
            <p className="text-xs text-muted-foreground">categories growing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Declining Items</CardTitle>
            <TrendingDown className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {categoryPerformance.filter(cat => cat.trend === 'down').length}
            </div>
            <p className="text-xs text-muted-foreground">categories declining</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quarterly Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeComparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                <Legend />
                <Bar dataKey="purchases" fill="#3b82f6" name="Purchases" />
                <Bar dataKey="inventory" fill="#10b981" name="Inventory" />
                <Bar dataKey="shipping" fill="#f59e0b" name="Shipping" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryPerformance.map((category, index) => {
                const change = ((category.currentValue - category.previousValue) / category.previousValue) * 100
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{category.category}</div>
                      <div className="text-sm text-muted-foreground">
                        {category.items} items • ${category.currentValue.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium flex items-center ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {change >= 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">vs previous</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
