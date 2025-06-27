
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ShoppingCart, Truck, FileText } from "lucide-react"

interface ActivityItem {
  id: string
  type: "inventory" | "purchase" | "shipment" | "invoice"
  title: string
  description: string
  timestamp: string
  status: "success" | "warning" | "error" | "info"
}

const recentActivities: ActivityItem[] = [
  {
    id: "1",
    type: "purchase",
    title: "PO-2024-156 Approved",
    description: "Purchase order for TechComponents Inc approved",
    timestamp: "2 minutes ago",
    status: "success"
  },
  {
    id: "2",
    type: "inventory",
    title: "Low Stock Alert",
    description: "Ethernet Cable Cat6 below reorder point",
    timestamp: "15 minutes ago",
    status: "warning"
  },
  {
    id: "3",
    type: "shipment",
    title: "SH-2024-089 Delivered",
    description: "Shipment delivered to Chicago Distribution Center",
    timestamp: "1 hour ago",
    status: "success"
  },
  {
    id: "4",
    type: "invoice",
    title: "Invoice INV-2024-234",
    description: "New invoice received from Global Materials Co",
    timestamp: "2 hours ago",
    status: "info"
  },
  {
    id: "5",
    type: "shipment",
    title: "SH-2024-090 Delayed",
    description: "Shipment delayed due to weather conditions",
    timestamp: "3 hours ago",
    status: "error"
  }
]

const getIcon = (type: ActivityItem["type"]) => {
  switch (type) {
    case "inventory":
      return <Package className="w-4 h-4" />
    case "purchase":
      return <ShoppingCart className="w-4 h-4" />
    case "shipment":
      return <Truck className="w-4 h-4" />
    case "invoice":
      return <FileText className="w-4 h-4" />
    default:
      return <Package className="w-4 h-4" />
  }
}

const getStatusColor = (status: ActivityItem["status"]) => {
  switch (status) {
    case "success":
      return "bg-green-100 text-green-800"
    case "warning":
      return "bg-yellow-100 text-yellow-800"
    case "error":
      return "bg-red-100 text-red-800"
    case "info":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="p-2 rounded-full bg-muted">
                  {getIcon(activity.type)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <Badge variant="outline" className={getStatusColor(activity.status)}>
                    {activity.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
