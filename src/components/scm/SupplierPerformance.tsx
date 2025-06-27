
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

const performanceData = [
  { month: "Jan", onTimeDelivery: 95, qualityScore: 88, responseTime: 92 },
  { month: "Feb", onTimeDelivery: 93, qualityScore: 91, responseTime: 89 },
  { month: "Mar", onTimeDelivery: 97, qualityScore: 93, responseTime: 94 },
  { month: "Apr", onTimeDelivery: 94, qualityScore: 89, responseTime: 91 },
  { month: "May", onTimeDelivery: 96, qualityScore: 95, responseTime: 93 },
  { month: "Jun", onTimeDelivery: 98, qualityScore: 94, responseTime: 96 },
]

export function SupplierPerformance() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Supplier Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="onTimeDelivery" stroke="#3b82f6" name="On-Time Delivery %" />
            <Line type="monotone" dataKey="qualityScore" stroke="#10b981" name="Quality Score %" />
            <Line type="monotone" dataKey="responseTime" stroke="#f59e0b" name="Response Time %" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
