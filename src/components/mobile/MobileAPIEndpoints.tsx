import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Smartphone, Server, Globe, Code, Lock, ExternalLink } from "lucide-react"

export function MobileAPIEndpoints() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <Smartphone className="w-10 h-10 mr-4" />
            <div>
              <h2 className="text-xl font-bold">Mobile & API Integration</h2>
              <p className="text-blue-100 mt-1">
                Connect external applications and mobile devices to your supply chain data
              </p>
            </div>
          </div>
          <Badge className="bg-white text-blue-600 hover:bg-blue-50">
            v2.5.0
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="rest" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rest">REST API</TabsTrigger>
          <TabsTrigger value="mobile">Mobile SDK</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="rest" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                REST API Endpoints
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">GET</Badge>
                    <code className="text-sm font-mono">/api/v1/inventory</code>
                  </div>
                  <Badge variant="outline">Authentication Required</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-2">Retrieve inventory items with filters and pagination</p>
                <div className="text-xs text-slate-500">
                  <span>Rate limit: 60 req/min</span>
                  <span className="mx-2">•</span>
                  <span>Cache: 5 min</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">POST</Badge>
                    <code className="text-sm font-mono">/api/v1/orders</code>
                  </div>
                  <Badge variant="outline">Authentication Required</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-2">Create a new purchase order</p>
                <div className="text-xs text-slate-500">
                  <span>Rate limit: 30 req/min</span>
                  <span className="mx-2">•</span>
                  <span>Webhook: order.created</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">PUT</Badge>
                    <code className="text-sm font-mono">/api/v1/shipments/:id</code>
                  </div>
                  <Badge variant="outline">Authentication Required</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-2">Update shipment status and tracking information</p>
                <div className="text-xs text-slate-500">
                  <span>Rate limit: 30 req/min</span>
                  <span className="mx-2">•</span>
                  <span>Webhook: shipment.updated</span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">GET</Badge>
                    <code className="text-sm font-mono">/api/v1/analytics/dashboard</code>
                  </div>
                  <Badge variant="outline">Authentication Required</Badge>
                </div>
                <p className="text-sm text-slate-600 mb-2">Retrieve key metrics and analytics for dashboards</p>
                <div className="text-xs text-slate-500">
                  <span>Rate limit: 20 req/min</span>
                  <span className="mx-2">•</span>
                  <span>Cache: 15 min</span>
                </div>
              </div>

              <div className="flex justify-center">
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  <span>View full API documentation</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                All API endpoints require authentication using JWT tokens or API keys. Personal access tokens
                can be generated in your account settings.
              </p>

              <div className="bg-slate-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre>Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</pre>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Token Lifetimes</h4>
                <div className="text-sm space-y-1">
                  <p><span className="font-medium">Access tokens:</span> 1 hour</p>
                  <p><span className="font-medium">Refresh tokens:</span> 7 days</p>
                  <p><span className="font-medium">API keys:</span> Until revoked</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Mobile SDK
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 18.178l-4.62-1.256-.328-3.544h2.27l.158 1.773 2.52.56 2.52-.56.21-2.356h-7.54l-.42-4.31h10.96l-.156 1.566-1.07 11.026L12 18.178z"/>
                      <path d="M4.066 3l1.442 16.198L12 21l6.492-1.802L19.934 3H4.066z"/>
                    </svg>
                    iOS SDK
                  </h4>
                  <div className="text-sm space-y-2">
                    <p><span className="font-medium">Version:</span> 3.2.1</p>
                    <p><span className="font-medium">Swift Package:</span> VeriLinkSDK</p>
                    <p><span className="font-medium">Min iOS:</span> 14.0</p>
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-4">
                      Download SDK <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>

                <div className="flex-1 p-4 border rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#3DDC84" d="M17.523 15.343l1.476-2.52c.151-.245.151-.56 0-.8l-1.476-2.518c-.151-.245-.429-.393-.715-.393h-1.472L18.425 14l-3.089 4.887h1.472c.286 0 .564-.148.715-.397v.001zm-3.438 5.457c.522 0 .994-.314 1.192-.795l.598-1.221-1.091-1.728-1.795 3.744h1.096zM11.596 14l2.531-4-2.531-4H8.523L6.075 10h3.519l2.002 4-2.002 4H6l2.523 4h3.073l-2.531-4h2.531zm-3.626 7.254c.522.48.994-.314 1.192-.795l.598-1.221-1.091-1.728-1.795 3.744h1.096z"/>
                      <path fill="#3DDC84" d="M7.192 15.343l1.476-2.52c.15-.245.15-.56 0-.8L7.192 9.505c-.151-.245-.429-.393-.715-.393H5.005L8.094 14 5.005 18.887h1.472c.286 0 .564-.148.715-.397v.001z"/>
                    </svg>
                    Android SDK
                  </h4>
                  <div className="text-sm space-y-2">
                    <p><span className="font-medium">Version:</span> 3.1.0</p>
                    <p><span className="font-medium">Package:</span> com.verilink.sdk</p>
                    <p><span className="font-medium">Min Android:</span> API 21</p>
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center mt-4">
                      Download SDK <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Swift Example</h4>
                <pre className="text-xs overflow-x-auto text-slate-800">
{`import VeriLinkSDK

// Initialize the SDK
VeriLinkSDK.configure(apiKey: "YOUR_API_KEY")

// Fetch inventory items
VeriLinkSDK.inventory.getItems(limit: 10) { result in
    switch result {
    case .success(let items):
        print("Received \(items.count) items")
    case .failure(let error):
        print("Error: \(error)")
    }
}`}
                </pre>
              </div>

              <div className="bg-slate-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Kotlin Example</h4>
                <pre className="text-xs overflow-x-auto text-slate-800">
{`import com.verilink.sdk.VeriLinkSDK

// Initialize the SDK
VeriLinkSDK.configure("YOUR_API_KEY")

// Fetch inventory items
VeriLinkSDK.inventory.getItems(10) { result ->
    when (result) {
        is Success -> {
            val items = result.data
            Log.d("VeriLink", "Received ${items.size} items")
        }
        is Error -> {
            Log.e("VeriLink", "Error: ${result.exception.message}")
        }
    }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Offline Capabilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Our mobile SDKs support offline-first operations with automatic synchronization
                  when connectivity is restored.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Data Persistence</h4>
                    <p className="text-sm text-blue-600">Local database with encrypted storage for sensitive data</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2">Conflict Resolution</h4>
                    <p className="text-sm text-green-600">Smart merge strategies for handling data conflicts</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">Background Sync</h4>
                    <p className="text-sm text-purple-600">Efficient background synchronization with retry mechanisms</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Configure webhooks to receive real-time notifications when specific events occur in your supply chain.
              </p>
              
              <div className="bg-slate-50 p-4 rounded-md space-y-4">
                <h4 className="font-medium">Available Event Types</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium mb-2">Inventory Events</h5>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">inventory.created</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">inventory.updated</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">inventory.threshold_alert</Badge>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">Order Events</h5>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">order.created</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">order.status_changed</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">order.approved</Badge>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">Shipment Events</h5>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">shipment.created</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">shipment.status_changed</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">shipment.delivered</Badge>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium mb-2">Financial Events</h5>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">invoice.created</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">payment.received</Badge>
                      </li>
                      <li className="flex items-center gap-2">
                        <Badge variant="outline">invoice.overdue</Badge>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Webhook Payload Example</h4>
                <pre className="text-xs overflow-x-auto text-slate-800">
{`{
  "event_type": "inventory.threshold_alert",
  "timestamp": "2025-06-28T14:52:11Z",
  "object_id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
  "organization_id": "550e8400-e29b-41d4-a716-446655440000",
  "data": {
    "item_id": "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p",
    "sku": "SKU-123-456",
    "name": "Product Name",
    "current_quantity": 10,
    "reorder_point": 15,
    "alert_type": "below_reorder_point"
  }
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Code className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">API Reference</h3>
                <p className="text-sm text-center text-gray-600 mb-4">
                  Complete reference for all API endpoints, parameters, and responses
                </p>
                <div className="text-center">
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center">
                    View Documentation
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Smartphone className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">SDK Guides</h3>
                <p className="text-sm text-center text-gray-600 mb-4">
                  Implementation guides and tutorials for mobile integration
                </p>
                <div className="text-center">
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center">
                    View Guides
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <Globe className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">Webhooks Setup</h3>
                <p className="text-sm text-center text-gray-600 mb-4">
                  Configure and manage event-driven integrations
                </p>
                <div className="text-center">
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center justify-center">
                    Setup Guide
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <h4 className="font-medium mb-2">API Changelog</h4>
                  <p className="text-sm text-slate-600 mb-2">Stay updated with API changes and new features</p>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                    View Changelog
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <h4 className="font-medium mb-2">Code Examples</h4>
                  <p className="text-sm text-slate-600 mb-2">Implementation samples in multiple languages</p>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                    Browse Examples
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <h4 className="font-medium mb-2">Community Forum</h4>
                  <p className="text-sm text-slate-600 mb-2">Connect with other developers and get support</p>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                    Join Forum
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                
                <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                  <h4 className="font-medium mb-2">API Status</h4>
                  <p className="text-sm text-slate-600 mb-2">Check system status and incident reports</p>
                  <a href="#" className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                    View Status
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}