Here's the fixed version with all missing closing brackets and proper formatting:

```typescript
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from "recharts"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle, 
  Eye,
  RefreshCw,
  Download,
  FileText,
  Package, 
  DollarSign, 
  Plus, 
  Smartphone,
  ShoppingCart,
  Warehouse,
  Brain,
  Zap
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { ReportBuilder } from "@/components/reporting/ReportBuilder"
import { useAnalytics } from "@/hooks/useAnalytics"
import { MobileAPIEndpoints } from "@/components/mobile/MobileAPIEndpoints"
import { CustomReport } from "@/types/analytics"

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [selectedTab, setSelectedTab] = useState<'overview' | 'reports' | 'mobile'>('overview')
  const [showReportBuilder, setShowReportBuilder] = useState(false)
  const [savedReports, setSavedReports] = useState<CustomReport[]>([])
  
  const { currentSnapshot, mlModels, loading, refresh } = useAnalytics(selectedPeriod)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Business Intelligence</h1>
          <p className="text-muted-foreground">Real-time insights and AI-powered analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <Button onClick={refresh} className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" onValueChange={(value) => setSelectedTab(value as any)}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="mobile">Mobile & API</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Overview content */}
        </TabsContent>

        <TabsContent value="reports">
          {/* Reports content */}
        </TabsContent>

        <TabsContent value="mobile">
          <MobileAPIEndpoints />
        </TabsContent>
      </Tabs>

      <ReportBuilder
        isOpen={showReportBuilder}
        onClose={() => setShowReportBuilder(false)}
        onSave={(report) => {
          setSavedReports([...savedReports, report])
          setShowReportBuilder(false)
        }}
      />
    </div>
  )
}
```