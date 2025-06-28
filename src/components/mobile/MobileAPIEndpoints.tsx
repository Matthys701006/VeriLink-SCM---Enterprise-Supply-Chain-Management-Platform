import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Smartphone, 
  Server, 
  Shield, 
  Code, 
  CheckCircle,
  Copy,
  Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export function MobileAPIEndpoints() {
  const { toast } = useToast()
  
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "API endpoint copied successfully",
    })
  }

  const apiEndpoints = [
    {
      name: "Authentication",
      description: "User authentication and session management",
      endpoint: "/api/auth",
      method: "POST",
      version: "v1",
      status: "stable"
    },
    {
      name: "Inventory Status",
      description: "Get current inventory levels and status",
      endpoint: "/api/inventory/status",
      method: "GET",
      version: "v1",
      status: "stable"
    },
    {
      name: "Order Management",
      description: "Create and track purchase orders",
      endpoint: "/api/orders",
      method: "POST",
      version: "v1",
      status: "stable"
    },
    {
      name: "Shipment Tracking",
      description: "Real-time shipment location updates",
      endpoint: "/api/shipments/tracking",
      method: "GET",
      version: "v2",
      status: "beta"
    },
    {
      name: "Analytics Dashboard",
      description: "Key metrics and performance indicators",
      endpoint: "/api/analytics/dashboard",
      method: "GET",
      version: "v1",
      status: "stable"
    },
    {
      name: "Barcode Scanning",
      description: "Scan and look up inventory items",
      endpoint: "/api/inventory/scan",
      method: "POST",
      version: "v2",
      status: "beta"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Mobile Apps Info */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold">Mobile Applications</h3>
          <p className="text-sm text-gray-500">Native mobile apps and API documentation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Android App
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            iOS App
          </Button>
        </div>
      </div>

      {/* Mobile Apps Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Mobile Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Barcode Scanning</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Offline Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Push Notifications</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Location Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Digital Signatures</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Photo Documentation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Biometric Auth</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              API Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 border rounded-md bg-gray-50">
              <p className="text-sm font-mono">Authorization: Bearer [YOUR_TOKEN]</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Supported Authentication Methods:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>JWT Tokens</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>API Keys</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>OAuth 2.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-600" />
                  <span>TOTP 2FA</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints */}
      <div>
        <h3 className="text-xl font-semibold mb-4">API Endpoints</h3>
        
        <div className="space-y-4">
          {apiEndpoints.map((endpoint) => (
            <Card key={endpoint.name}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{endpoint.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{endpoint.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-100 text-blue-800">{endpoint.method}</Badge>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800">{endpoint.version}</Badge>
                    <Badge variant={endpoint.status === 'stable' ? 'default' : 'secondary'} className={endpoint.status === 'stable' ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {endpoint.status}
                    </Badge>
                  </div>
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {endpoint.endpoint}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleCopy(endpoint.endpoint)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Documentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Documentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <Server className="w-6 h-6 mb-2 text-blue-600" />
              <h4 className="font-medium">API Reference</h4>
              <p className="text-sm text-gray-500 mt-1">Complete API documentation</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <Smartphone className="w-6 h-6 mb-2 text-green-600" />
              <h4 className="font-medium">SDK Documentation</h4>
              <p className="text-sm text-gray-500 mt-1">Mobile SDK integration guide</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
              <Code className="w-6 h-6 mb-2 text-purple-600" />
              <h4 className="font-medium">Code Examples</h4>
              <p className="text-sm text-gray-500 mt-1">Sample code in multiple languages</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}