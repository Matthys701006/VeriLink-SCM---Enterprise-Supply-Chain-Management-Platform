
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SystemStatus } from '@/components/system/SystemStatus'
import { IntegrationVerification } from '@/components/system/IntegrationVerification'
import { SystemInfo } from '@/components/system/SystemInfo'
import { EthicsAndBias } from '@/components/system/EthicsAndBias'
import { Legal } from '@/components/system/Legal'
import { FraudDetection } from '@/components/system/FraudDetection'

export default function SystemDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">System Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive system monitoring and integration verification
        </p>
      </div>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">System Status</TabsTrigger>
          <TabsTrigger value="integration">Integration Tests</TabsTrigger>
          <TabsTrigger value="info">System Info</TabsTrigger>
          <TabsTrigger value="ethics">Ethics and Bias</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
          <TabsTrigger value="fraud">Fraud Detection</TabsTrigger>
        </TabsList>

        <TabsContent value="status">
          <SystemStatus />
        </TabsContent>

        <TabsContent value="integration">
          <IntegrationVerification />
        </TabsContent>

        <TabsContent value="info">
          <SystemInfo />
        </TabsContent>

        <TabsContent value="ethics">
          <EthicsAndBias />
        </TabsContent>

        <TabsContent value="legal">
          <Legal />
        </TabsContent>

        <TabsContent value="fraud">
          <FraudDetection />
        </TabsContent>
      </Tabs>
    </div>
  )
}
