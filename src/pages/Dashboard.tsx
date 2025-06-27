import { DashboardMetrics } from "@/components/scm/DashboardMetrics"
import { SupplierPerformance } from "@/components/scm/SupplierPerformance"
import { RecentActivity } from "@/components/scm/RecentActivity"
import { InventoryChart } from "@/components/scm/InventoryChart"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Supply Chain Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage your supply chain operations
        </p>
      </div>

      <DashboardMetrics />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <SupplierPerformance />
        <InventoryChart />
      </div>

      <RecentActivity />
    </div>
  )
}
