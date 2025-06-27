
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Server, Database, Cloud, Shield, Zap, Globe } from 'lucide-react'

export function SystemInfo() {
  const systemInfo = {
    version: '1.0.0',
    environment: 'Production',
    buildDate: new Date().toLocaleDateString(),
    nodeVersion: '18.17.0',
    database: 'PostgreSQL 15',
    hosting: 'Supabase',
    region: 'US East',
    uptime: '99.9%'
  }

  const features = [
    'Real-time Data Sync',
    'Multi-tenant Architecture', 
    'Row Level Security',
    'Automated Backups',
    'CDN Distribution',
    'SSL Encryption'
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Information</h2>
        <p className="text-muted-foreground">
          Technical details and system specifications
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Application Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Version</span>
              <Badge variant="outline">{systemInfo.version}</Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm font-medium">Environment</span>
              <Badge className="bg-green-100 text-green-800">{systemInfo.environment}</Badge>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm font-medium">Build Date</span>
              <span className="text-sm">{systemInfo.buildDate}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm font-medium">Node.js</span>
              <span className="text-sm">{systemInfo.nodeVersion}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Infrastructure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Database</span>
              <span className="text-sm">{systemInfo.database}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm font-medium">Hosting</span>
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4" />
                <span className="text-sm">{systemInfo.hosting}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm font-medium">Region</span>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm">{systemInfo.region}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-sm font-medium">Uptime</span>
              <Badge className="bg-green-100 text-green-800">{systemInfo.uptime}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Platform Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <code className="text-sm font-mono">https://ndgnqiwdhqmviharrqqr.supabase.co</code>
                  <p className="text-xs text-muted-foreground mt-1">Main API Endpoint</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <code className="text-sm font-mono">wss://ndgnqiwdhqmviharrqqr.supabase.co</code>
                  <p className="text-xs text-muted-foreground mt-1">Real-time WebSocket</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
