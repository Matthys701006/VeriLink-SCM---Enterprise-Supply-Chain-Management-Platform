
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Shield, AlertTriangle, Eye, Zap, Lock, Activity } from 'lucide-react'

export function FraudDetection() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Fraud Detection & Prevention</h2>
          <p className="text-muted-foreground">
            AI-powered fraud detection and prevention systems
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* VeriLink Fraud Prevention Logo */}
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden">
            <Shield className="w-6 h-6 text-white z-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-bold text-sm bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
              VeriLink Shield
            </h3>
            <p className="text-xs text-muted-foreground">Fraud Prevention</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Real-time Detection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 
              CONTENT AREA: Paste your real-time detection content here
              Replace the placeholder content below with your actual detection metrics
            */}
            <div className="prose prose-sm max-w-none">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">AI Detection Rate</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">99.7%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">False Positive Rate</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">0.3%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Response Time</span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">&lt; 100ms</Badge>
                </div>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                [Paste your real-time fraud detection metrics and algorithms here]
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* 
              CONTENT AREA: Paste your risk assessment content here
              Replace the placeholder content below with your actual risk data
            */}
            <div className="prose prose-sm max-w-none">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">High Risk Transactions</span>
                  <Badge variant="outline" className="bg-red-50 text-red-700">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Medium Risk</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700">47</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Low Risk</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">2,341</Badge>
                </div>
              </div>
              <Separator />
              <p className="text-sm text-muted-foreground">
                [Paste your risk assessment data and scoring methodology here]
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Monitoring Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 
              CONTENT AREA: Paste your monitoring dashboard content here
              Replace the placeholder content below with your actual monitoring data
            */}
            <div className="prose prose-sm max-w-none">
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Activity className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <h4 className="font-bold text-lg">127</h4>
                  <p className="text-sm text-muted-foreground">Blocked Attempts</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Lock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-bold text-lg">$2.4M</h4>
                  <p className="text-sm text-muted-foreground">Prevented Losses</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-bold text-lg">99.9%</h4>
                  <p className="text-sm text-muted-foreground">System Uptime</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                [Paste your detailed monitoring dashboard content and visualizations here]
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Prevention Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* 
              CONTENT AREA: Paste your prevention strategies content here
              Replace the placeholder content below with your actual prevention methods
            */}
            <div className="prose prose-sm max-w-none">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Payment Fraud Prevention</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Multi-factor authentication</li>
                    <li>• Behavioral pattern analysis</li>
                    <li>• Velocity checking</li>
                    <li>• Device fingerprinting</li>
                    <li>• Geographic anomaly detection</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Supply Chain Fraud</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Supplier verification protocols</li>
                    <li>• Invoice duplicate detection</li>
                    <li>• Price manipulation alerts</li>
                    <li>• Phantom vendor screening</li>
                    <li>• Contract compliance monitoring</li>
                  </ul>
                </div>
              </div>
              <Separator className="my-4" />
              <p className="text-sm text-muted-foreground">
                [Paste your comprehensive fraud prevention strategies and protocols here]
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
