
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const inventoryData = [
  { category: "Electronics", onHand: 1250, reorderPoint: 300, value: 125000 },
  { category: "Cables", onHand: 890, reorderPoint: 200, value: 45000 },
  { category: "Hardware", onHand: 450, reorderPoint: 150, value: 78000 },
  { category: "Software", onHand: 120, reorderPoint: 50, value: 95000 },
  { category: "Accessories", onHand: 680, reorderPoint: 100, value: 32000 },
]

export function InventoryChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Inventory Levels by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="onHand" fill="#3b82f6" name="On Hand" />
            <Bar dataKey="reorderPoint" fill="#ef4444" name="Reorder Point" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
