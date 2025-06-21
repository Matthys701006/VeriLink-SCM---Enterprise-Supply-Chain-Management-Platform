import React from 'react';
import { Smartphone, Code, Database, Wifi, Shield, Zap } from 'lucide-react';

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  auth_required: boolean;
  parameters?: string[];
  response_format: string;
}

export const MobileAPIEndpoints: React.FC = () => {
  const apiEndpoints: APIEndpoint[] = [
    // Authentication
    {
      method: 'POST',
      path: '/api/mobile/auth/login',
      description: 'Authenticate user with email/password',
      auth_required: false,
      parameters: ['email', 'password'],
      response_format: '{ token, user, permissions }'
    },
    {
      method: 'POST',
      path: '/api/mobile/auth/refresh',
      description: 'Refresh authentication token',
      auth_required: true,
      response_format: '{ token, expires_at }'
    },
    
    // Inventory
    {
      method: 'GET',
      path: '/api/mobile/inventory',
      description: 'Get inventory items with pagination',
      auth_required: true,
      parameters: ['page', 'limit', 'search', 'warehouse_id'],
      response_format: '{ items[], total, pagination }'
    },
    {
      method: 'GET',
      path: '/api/mobile/inventory/:id',
      description: 'Get detailed inventory item information',
      auth_required: true,
      response_format: '{ item, location, lots[], movements[] }'
    },
    {
      method: 'POST',
      path: '/api/mobile/inventory/scan',
      description: 'Process barcode/QR code scan',
      auth_required: true,
      parameters: ['barcode', 'scan_type', 'location'],
      response_format: '{ item, actions[], suggestions[] }'
    },
    
    // Warehouse Operations
    {
      method: 'GET',
      path: '/api/mobile/pick-tickets',
      description: 'Get assigned pick tickets for user',
      auth_required: true,
      parameters: ['status', 'priority'],
      response_format: '{ tickets[], active_ticket }'
    },
    {
      method: 'POST',
      path: '/api/mobile/pick-tickets/:id/start',
      description: 'Start picking process for ticket',
      auth_required: true,
      response_format: '{ ticket, route, current_location }'
    },
    {
      method: 'POST',
      path: '/api/mobile/pick-tickets/:id/pick',
      description: 'Record item pick with quantity',
      auth_required: true,
      parameters: ['item_id', 'quantity', 'location', 'lot_number'],
      response_format: '{ success, next_item, remaining_items }'
    },
    {
      method: 'POST',
      path: '/api/mobile/pick-tickets/:id/complete',
      description: 'Complete picking and move to packing',
      auth_required: true,
      response_format: '{ packing_instructions, label_data }'
    },
    
    // Receiving
    {
      method: 'GET',
      path: '/api/mobile/receiving/orders',
      description: 'Get pending receiving orders',
      auth_required: true,
      response_format: '{ orders[], urgent_orders[] }'
    },
    {
      method: 'POST',
      path: '/api/mobile/receiving/scan',
      description: 'Scan received item and record quantity',
      auth_required: true,
      parameters: ['po_id', 'item_sku', 'quantity', 'condition'],
      response_format: '{ item, expected_qty, received_qty, discrepancy }'
    },
    
    // Cycle Counts
    {
      method: 'GET',
      path: '/api/mobile/cycle-counts',
      description: 'Get assigned cycle count tasks',
      auth_required: true,
      response_format: '{ tasks[], priority_items[] }'
    },
    {
      method: 'POST',
      path: '/api/mobile/cycle-counts/:id/count',
      description: 'Record cycle count for location',
      auth_required: true,
      parameters: ['location', 'items[]', 'count_method'],
      response_format: '{ variances[], adjustments_needed }'
    },
    
    // Shipments
    {
      method: 'GET',
      path: '/api/mobile/shipments',
      description: 'Get shipments for loading/delivery',
      auth_required: true,
      parameters: ['status', 'route_id', 'vehicle_id'],
      response_format: '{ shipments[], route_info }'
    },
    {
      method: 'POST',
      path: '/api/mobile/shipments/:id/scan',
      description: 'Scan package for loading verification',
      auth_required: true,
      parameters: ['package_barcode', 'action'],
      response_format: '{ verified, package_info, loading_sequence }'
    },
    {
      method: 'POST',
      path: '/api/mobile/shipments/:id/proof-of-delivery',
      description: 'Submit delivery proof with signature',
      auth_required: true,
      parameters: ['signature_data', 'photo', 'recipient_name', 'notes'],
      response_format: '{ delivery_confirmed, next_stop }'
    },
    
    // Locations & Navigation
    {
      method: 'GET',
      path: '/api/mobile/locations/search',
      description: 'Search warehouse locations',
      auth_required: true,
      parameters: ['query', 'zone', 'type'],
      response_format: '{ locations[], suggestions[] }'
    },
    {
      method: 'GET',
      path: '/api/mobile/locations/:id/items',
      description: 'Get items at specific location',
      auth_required: true,
      response_format: '{ items[], location_info, capacity }'
    },
    
    // Real-time Updates
    {
      method: 'GET',
      path: '/api/mobile/sync',
      description: 'Sync offline changes and get updates',
      auth_required: true,
      parameters: ['last_sync', 'offline_actions[]'],
      response_format: '{ updates[], conflicts[], sync_timestamp }'
    },
    {
      method: 'GET',
      path: '/api/mobile/notifications',
      description: 'Get real-time notifications',
      auth_required: true,
      parameters: ['since', 'types[]'],
      response_format: '{ notifications[], unread_count }'
    },
    
    // Reports & Analytics
    {
      method: 'GET',
      path: '/api/mobile/productivity',
      description: 'Get user productivity metrics',
      auth_required: true,
      parameters: ['period', 'metrics[]'],
      response_format: '{ picks_per_hour, accuracy_rate, daily_stats }'
    },
    {
      method: 'GET',
      path: '/api/mobile/dashboard',
      description: 'Get mobile dashboard data',
      auth_required: true,
      response_format: '{ tasks[], alerts[], performance, announcements[] }'
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800';
      case 'POST':
        return 'bg-blue-100 text-blue-800';
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smartphone className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Mobile API Endpoints</h2>
            <p className="text-gray-600">RESTful API for React Native mobile applications</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Wifi className="w-4 h-4 text-green-500" />
            <span>Real-time sync</span>
          </div>
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>JWT Auth</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span>Offline support</span>
          </div>
        </div>
      </div>

      {/* API Base Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">API Configuration</h3>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Base URL:</span> <code className="bg-white px-2 py-1 rounded">https://api.verilink-scm.com</code></div>
              <div><span className="font-medium">Version:</span> v1</div>
              <div><span className="font-medium">Authentication:</span> Bearer Token (JWT)</div>
              <div><span className="font-medium">Content-Type:</span> application/json</div>
              <div><span className="font-medium">Rate Limit:</span> 1000 requests/hour</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Mobile Features</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Offline-first architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Real-time synchronization</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Barcode/QR scanning</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                <span>GPS location tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span>Push notifications</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Available Endpoints</h3>
        
        <div className="grid grid-cols-1 gap-4">
          {apiEndpoints.map((endpoint, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getMethodColor(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {endpoint.path}
                  </code>
                  {endpoint.auth_required && (
                    <Shield className="w-4 h-4 text-orange-500" title="Authentication required" />
                  )}
                </div>
              </div>
              
              <p className="text-gray-700 mb-3">{endpoint.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {endpoint.parameters && (
                  <div>
                    <span className="font-medium text-gray-700">Parameters:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {endpoint.parameters.map((param, i) => (
                        <code key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">
                          {param}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <span className="font-medium text-gray-700">Response:</span>
                  <code className="block mt-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs">
                    {endpoint.response_format}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SDK Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Code className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 mb-2">React Native SDK</h3>
            <p className="text-blue-800 mb-4">
              A comprehensive SDK is available for React Native development with built-in offline support,
              automatic synchronization, and optimized data structures for mobile performance.
            </p>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-blue-900">Installation:</span>
                <code className="block mt-1 bg-white px-3 py-2 rounded text-sm">
                  npm install @verilink/mobile-sdk
                </code>
              </div>
              
              <div>
                <span className="font-medium text-blue-900">Basic Usage:</span>
                <code className="block mt-1 bg-white px-3 py-2 rounded text-sm">
                  {`import { VeriLinkSDK } from '@verilink/mobile-sdk';
const sdk = new VeriLinkSDK({ apiUrl, apiKey });`}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WebSocket Information */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Wifi className="w-6 h-6 text-green-600 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-green-900 mb-2">Real-time WebSocket</h3>
            <p className="text-green-800 mb-4">
              WebSocket connection for real-time updates, live notifications, and instant data synchronization.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-900">WebSocket URL:</span>
                <code className="block mt-1 bg-white px-2 py-1 rounded">
                  wss://ws.verilink-scm.com/mobile
                </code>
              </div>
              
              <div>
                <span className="font-medium text-green-900">Supported Events:</span>
                <div className="mt-1 space-y-1">
                  <code className="block bg-white px-2 py-1 rounded text-xs">inventory_update</code>
                  <code className="block bg-white px-2 py-1 rounded text-xs">task_assignment</code>
                  <code className="block bg-white px-2 py-1 rounded text-xs">notification</code>
                  <code className="block bg-white px-2 py-1 rounded text-xs">location_update</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};