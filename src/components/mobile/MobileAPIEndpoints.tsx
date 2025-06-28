import React from 'react';
import { Smartphone, Server, Code, Globe, Lock, KeyRound, RefreshCw, Repeat, BookOpen } from 'lucide-react';

export function MobileAPIEndpoints() {
  const apiEndpoints = [
    {
      name: 'Authentication',
      endpoint: '/api/auth',
      method: 'POST',
      description: 'Authenticate mobile users and retrieve access tokens',
      parameters: [
        { name: 'email', type: 'string', required: true },
        { name: 'password', type: 'string', required: true }
      ],
      responseExample: '{ "token": "jwt-token-here", "user": { ... } }',
      authentication: 'None'
    },
    {
      name: 'Inventory Summary',
      endpoint: '/api/inventory/summary',
      method: 'GET',
      description: 'Retrieve summarized inventory statistics',
      parameters: [
        { name: 'warehouse_id', type: 'string', required: false }
      ],
      responseExample: '{ "total_items": 1245, "low_stock": 15, "value": 1250000 }',
      authentication: 'Bearer Token'
    },
    {
      name: 'Scan Item',
      endpoint: '/api/inventory/scan',
      method: 'POST',
      description: 'Process barcode/QR code scans for inventory operations',
      parameters: [
        { name: 'barcode', type: 'string', required: true },
        { name: 'operation', type: 'string', required: true },
        { name: 'quantity', type: 'number', required: false }
      ],
      responseExample: '{ "item": { "id": "...", "sku": "...", ... }, "status": "success" }',
      authentication: 'Bearer Token'
    },
    {
      name: 'Shipment Tracking',
      endpoint: '/api/shipments/track',
      method: 'GET',
      description: 'Get real-time shipment tracking information',
      parameters: [
        { name: 'tracking_number', type: 'string', required: true }
      ],
      responseExample: '{ "status": "in_transit", "location": { "lat": 40.7128, "lng": -74.0060 }, ... }',
      authentication: 'Bearer Token'
    },
    {
      name: 'Approve Purchase Order',
      endpoint: '/api/purchase-orders/{id}/approve',
      method: 'POST',
      description: 'Approve pending purchase orders on the go',
      parameters: [
        { name: 'id', type: 'string', required: true },
        { name: 'comments', type: 'string', required: false }
      ],
      responseExample: '{ "status": "approved", "updated_at": "2025-06-25T15:30:45Z" }',
      authentication: 'Bearer Token'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Mobile API Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-start lg:items-center flex-col lg:flex-row gap-4">
          <div className="p-3 bg-white rounded-lg">
            <Smartphone className="w-10 h-10 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold">Mobile App & API Integration</h3>
            <p className="text-blue-100 mt-1">
              Securely connect mobile apps and external systems to VeriLink SCM with our comprehensive REST API.
            </p>
          </div>
          <div className="lg:text-right mt-4 lg:mt-0">
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-50">
              Download SDK
            </button>
          </div>
        </div>
      </div>

      {/* API Documentation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">API Endpoints</h3>
              <div className="flex items-center gap-2">
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Endpoints</option>
                  <option>Inventory</option>
                  <option>Shipments</option>
                  <option>Purchase Orders</option>
                  <option>Authentication</option>
                </select>
              </div>
            </div>
            <div className="divide-y">
              {apiEndpoints.map((endpoint, index) => (
                <div key={index} className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">{endpoint.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{endpoint.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                        endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                        endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                        endpoint.method === 'PUT' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                        {endpoint.endpoint}
                      </code>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Parameters</h5>
                      <div className="bg-gray-50 rounded-lg p-3">
                        {endpoint.parameters.length > 0 ? (
                          <ul className="space-y-2">
                            {endpoint.parameters.map((param, i) => (
                              <li key={i} className="text-sm">
                                <code className="font-mono">{param.name}</code>: <span className="text-gray-600">{param.type}</span>
                                {param.required && <span className="text-red-500 ml-1">*</span>}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm text-gray-500">No parameters required</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Response Example</h5>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <pre className="text-xs overflow-x-auto font-mono text-gray-800">{endpoint.responseExample}</pre>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authentication: {endpoint.authentication}</span>
                    </div>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                      Try it out
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Developer Resources</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Documentation</h4>
                  <p className="text-sm text-gray-600 mt-1">Comprehensive API documentation with examples and guides</p>
                  <a href="#" className="text-sm text-blue-600 font-medium mt-1 block hover:text-blue-800">
                    View Documentation
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Code className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">SDKs & Libraries</h4>
                  <p className="text-sm text-gray-600 mt-1">Client libraries for easy integration in multiple languages</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">JavaScript</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Python</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Java</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">C#</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <KeyRound className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">API Keys</h4>
                  <p className="text-sm text-gray-600 mt-1">Generate and manage API keys for secure access</p>
                  <a href="#" className="text-sm text-blue-600 font-medium mt-1 block hover:text-blue-800">
                    Manage API Keys
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <Repeat className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Webhooks</h4>
                  <p className="text-sm text-gray-600 mt-1">Configure real-time event notifications via webhooks</p>
                  <a href="#" className="text-sm text-blue-600 font-medium mt-1 block hover:text-blue-800">
                    Configure Webhooks
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">API Status</h3>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">System Status</span>
                <span className="flex items-center gap-1 text-green-600 text-sm">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Operational
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium">124 ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Uptime (30d)</span>
                  <span className="font-medium">99.99%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Rate Limit</span>
                  <span className="font-medium">1000 req/min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}