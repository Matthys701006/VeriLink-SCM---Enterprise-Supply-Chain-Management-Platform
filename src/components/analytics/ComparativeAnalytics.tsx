import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts"
import {
  Calendar,
  TrendingUp,
  TrendingDown
} from "lucide-react"
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

export function ComparativeAnalytics() {
  // Fetch data with loading and error states
  const { data: inventoryItems, error: inventoryError, isLoading: inventoryLoading } = useSupabaseData<InventoryItem>(
    "inventory_items",
    "category, on_hand, unit_cost"
  )

  const { data: purchaseOrders, error: purchaseError, isLoading: purchaseLoading } = useSupabaseData<PurchaseOrder>(
    "purchase_orders",
    "order_date, total_amount, status"
  )

  // Loading state
  if (inventoryLoading || purchaseLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-muted-foreground">Loading data…</span>
      </div>
    )
  }

  // Error state
  if (inventoryError || purchaseError) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-red-600">
          {inventoryError?.message || purchaseError?.message || "Failed to load data"}
        </span>
      </div>
    )
  }

  // No data state
  if (!inventoryItems || inventoryItems.length === 0 || !purchaseOrders || purchaseOrders.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-muted-foreground">No data available.</span>
      </div>
    )
  }

  // Generate comparison data for different time periods
  const timeComparisonData = useMemo(() => {
    const periods = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024']
    const currentTotal = purchaseOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    return periods.map((period, index) => {
      // For a real app, replace this with actual per-period data
      const variance = (Math.random() - 0.5) * 0.3
      const baseValue = currentTotal * (0.7 + index * 0.1)
      return {
        period,
        purchases: Math.floor(baseValue * (1 + variance)),
        inventory: Math.floor(baseValue * 0.8 * (1 + variance * 0.5)),
        shipping: Math.floor(baseValue * 0.1 * (1 + variance * 1.5))
      }
    })
  }, [purchaseOrders])

  // Calculate category performance comparison
  const categoryPerformance = useMemo(() => {
    const acc: Array<{
      category: string
      currentValue: number
      previousValue: number
      items: number
      trend: 'up' | 'down'
    }> = []
    for (const item of inventoryItems) {
      const value = item.on_hand * (item.unit_cost || 0)
      let existing = acc.find(cat => cat.category === item.category)
      if (existing) {
        existing.currentValue += value
        existing.items += 1
      } else {
        // Simulate previous period data and trend
        const prevValue = value * (0.8 + Math.random() * 0.4)
        acc.push({
          category: item.category,
          currentValue: value,
          previousValue: prevValue,
          items: 1,
          trend: value >= prevValue ? 'up' : 'down'
        })
      }
    }
    return acc
  }, [inventoryItems])

  // Calculate key metrics
  const totalCurrentValue = categoryPerformance.reduce((sum, cat) => sum + cat.currentValue, 0)
  const totalPreviousValue = categoryPerformance.reduce((sum, cat) => sum + cat.previousValue, 0)
  const overallChange = totalPreviousValue === 0
    ? 0
    : ((totalCurrentValue - totalPreviousValue) / totalPreviousValue) * 100

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
              {overallChange >= 0 ? '+' : ''}
              {isFinite(overallChange) ? overallChange.toFixed(1) : "0"}%
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
              {categoryPerformance.length > 0
                ? categoryPerformance.reduce((best, cat) =>
                    cat.currentValue > best.currentValue ? cat : best
                  ).category
                : 'N/A'
              }
            </div>
            <p className="text-xs text-muted-foreground">highest value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Categories</CardTitle>
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
            <CardTitle className="text-sm font-medium">Declining Categories</CardTitle>
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
