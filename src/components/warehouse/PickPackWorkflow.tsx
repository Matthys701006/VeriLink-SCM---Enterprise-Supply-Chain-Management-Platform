import React, { useState, useEffect } from 'react';
import { 
  Package, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Scan, 
  Camera,
  Truck,
  AlertTriangle,
  Navigation,
  Weight,
  Printer
} from 'lucide-react';
import { useOrchestrix } from '../../contexts/OrchestrixContext';
import { supabase } from '../../services/supabase/client';

interface PickTicket {
  id: string;
  ticket_number: string;
  order_id: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'picked' | 'packed' | 'shipped';
  picker_id?: string;
  created_at: string;
  items: PickItem[];
  route?: OptimizedRoute;
}

interface PickItem {
  id: string;
  sku: string;
  item_name: string;
  quantity_required: number;
  quantity_picked: number;
  location_code: string;
  lot_number?: string;
  expiry_date?: string;
  picked: boolean;
}

interface OptimizedRoute {
  total_distance: number;
  estimated_time: number;
  stops: RouteStop[];
}

interface RouteStop {
  location_code: string;
  sequence: number;
  items: string[];
  coordinates: { x: number; y: number };
}

export const PickPackWorkflow: React.FC = () => {
  const { hasPermission, enhancedUser } = useOrchestrix();
  const [pickTickets, setPickTickets] = useState<PickTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<PickTicket | null>(null);
  const [currentStep, setCurrentStep] = useState<'selection' | 'picking' | 'packing'>('selection');
  const [scanMode, setScanMode] = useState(false);
  const [scannedCode, setScannedCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentStop, setCurrentStop] = useState(0);

  useEffect(() => {
    if (hasPermission('warehouse.read')) {
      loadPickTickets();
    }
  }, [hasPermission]);

  const loadPickTickets = async () => {
    try {
      setLoading(true);
      
      // Generate mock pick tickets
      const mockTickets = generateMockPickTickets();
      setPickTickets(mockTickets);
      
    } catch (error) {
      console.error('Error loading pick tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPickTickets = (): PickTicket[] => {
    const priorities: PickTicket['priority'][] = ['low', 'normal', 'high', 'urgent'];
    const locations = ['A1-01', 'A1-02', 'B2-15', 'C3-08', 'D1-12'];
    const items = [
      { sku: 'SKU-001', name: 'Industrial Bearing' },
      { sku: 'SKU-002', name: 'Steel Pipe' },
      { sku: 'SKU-003', name: 'Control Valve' },
      { sku: 'SKU-004', name: 'Safety Helmet' },
      { sku: 'SKU-005', name: 'Motor Assembly' }
    ];

    return Array.from({ length: 8 }, (_, i) => {
      const ticketItems: PickItem[] = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, j) => {
        const item = items[Math.floor(Math.random() * items.length)];
        return {
          id: `item-${i}-${j}`,
          sku: item.sku,
          item_name: item.name,
          quantity_required: Math.floor(Math.random() * 10) + 1,
          quantity_picked: 0,
          location_code: locations[Math.floor(Math.random() * locations.length)],
          lot_number: `LOT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          expiry_date: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          picked: false
        };
      });

      return {
        id: `ticket-${i + 1}`,
        ticket_number: `PICK-${String(i + 1).padStart(4, '0')}`,
        order_id: `ORD-${String(i + 1).padStart(4, '0')}`,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: 'pending',
        created_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        items: ticketItems,
        route: generateOptimizedRoute(ticketItems)
      };
    });
  };

  const generateOptimizedRoute = (items: PickItem[]): OptimizedRoute => {
    const uniqueLocations = [...new Set(items.map(item => item.location_code))];
    
    // Mock route optimization - in real system would use GraphHopper API
    const stops: RouteStop[] = uniqueLocations.map((location, index) => ({
      location_code: location,
      sequence: index + 1,
      items: items.filter(item => item.location_code === location).map(item => item.sku),
      coordinates: {
        x: Math.random() * 100,
        y: Math.random() * 100
      }
    })).sort(() => Math.random() - 0.5); // Random optimization

    return {
      total_distance: Math.round(stops.length * 50 + Math.random() * 100),
      estimated_time: Math.round(stops.length * 5 + Math.random() * 15),
      stops
    };
  };

  const startPicking = async (ticket: PickTicket) => {
    try {
      setSelectedTicket(ticket);
      setCurrentStep('picking');
      setCurrentStop(0);
      
      // Update ticket status
      const updatedTickets = pickTickets.map(t => 
        t.id === ticket.id 
          ? { ...t, status: 'in_progress' as const, picker_id: enhancedUser?.id }
          : t
      );
      setPickTickets(updatedTickets);
      
    } catch (error) {
      console.error('Error starting pick:', error);
    }
  };

  const handleScan = (code: string) => {
    if (!selectedTicket) return;
    
    setScannedCode(code);
    
    // Find item to pick at current location
    const currentLocation = selectedTicket.route?.stops[currentStop]?.location_code;
    const itemToPick = selectedTicket.items.find(
      item => item.location_code === currentLocation && 
              (item.sku === code || item.location_code === code) &&
              !item.picked
    );
    
    if (itemToPick) {
      // Mark item as picked
      const updatedTicket = {
        ...selectedTicket,
        items: selectedTicket.items.map(item =>
          item.id === itemToPick.id
            ? { ...item, picked: true, quantity_picked: item.quantity_required }
            : item
        )
      };
      
      setSelectedTicket(updatedTicket);
      
      // Check if all items at this location are picked
      const locationItems = updatedTicket.items.filter(item => item.location_code === currentLocation);
      const allLocationItemsPicked = locationItems.every(item => item.picked);
      
      if (allLocationItemsPicked && currentStop < (selectedTicket.route?.stops.length || 0) - 1) {
        // Move to next stop
        setCurrentStop(currentStop + 1);
      } else if (allLocationItemsPicked) {
        // All items picked, move to packing
        setCurrentStep('packing');
      }
      
    } else {
      alert(`No matching item found for scan: ${code}`);
    }
    
    setScannedCode('');
  };

  const completePicking = () => {
    if (!selectedTicket) return;
    
    const allItemsPicked = selectedTicket.items.every(item => item.picked);
    
    if (allItemsPicked) {
      setCurrentStep('packing');
    } else {
      alert('Please pick all items before proceeding to packing');
    }
  };

  const completePacking = async () => {
    if (!selectedTicket) return;
    
    try {
      // Update ticket status to completed
      const updatedTickets = pickTickets.map(t => 
        t.id === selectedTicket.id 
          ? { ...t, status: 'packed' as const }
          : t
      );
      setPickTickets(updatedTickets);
      
      // Generate shipping label (mock)
      generateShippingLabel(selectedTicket);
      
      // Reset to ticket selection
      setSelectedTicket(null);
      setCurrentStep('selection');
      setCurrentStop(0);
      
    } catch (error) {
      console.error('Error completing pack:', error);
    }
  };

  const generateShippingLabel = (ticket: PickTicket) => {
    // Mock shipping label generation
    const labelData = {
      ticketNumber: ticket.ticket_number,
      orderId: ticket.order_id,
      items: ticket.items.length,
      weight: ticket.items.reduce((sum, item) => sum + item.quantity_picked * 2.5, 0), // Mock weight
      timestamp: new Date().toISOString()
    };
    
    console.log('Generated shipping label:', labelData);
    alert(`Shipping label generated for ${ticket.ticket_number}`);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'picked':
        return 'bg-green-100 text-green-800';
      case 'packed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasPermission('warehouse.read')) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-500">You don't have permission to access warehouse operations</p>
      </div>
    );
  }

  if (currentStep === 'selection') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Pick Tickets</h2>
            <p className="text-gray-600">Select a pick ticket to start picking operations</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Connected Warehouse Operators: 3</span>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>

        {/* Pick Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pickTickets.filter(ticket => ticket.status === 'pending').map((ticket) => (
            <div key={ticket.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{ticket.ticket_number}</h3>
                  <p className="text-sm text-gray-500">Order: {ticket.order_id}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Items:</span>
                  <span className="font-medium">{ticket.items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Locations:</span>
                  <span className="font-medium">{ticket.route?.stops.length || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Est. Time:</span>
                  <span className="font-medium">{ticket.route?.estimated_time || 0} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{ticket.route?.total_distance || 0}m</span>
                </div>
              </div>

              <button
                onClick={() => startPicking(ticket)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4" />
                Start Picking
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (currentStep === 'picking' && selectedTicket) {
    const currentLocation = selectedTicket.route?.stops[currentStop];
    const locationItems = selectedTicket.items.filter(item => item.location_code === currentLocation?.location_code);
    const pickedCount = selectedTicket.items.filter(item => item.picked).length;
    const totalItems = selectedTicket.items.length;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Picking: {selectedTicket.ticket_number}</h2>
            <p className="text-gray-600">Progress: {pickedCount}/{totalItems} items picked</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setScanMode(!scanMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                scanMode ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Scan className="w-4 h-4" />
              {scanMode ? 'Scanning...' : 'Enable Scanner'}
            </button>
            <button
              onClick={completePicking}
              disabled={pickedCount < totalItems}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete Picking
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(pickedCount / totalItems) * 100}%` }}
          />
        </div>

        {/* Current Location */}
        {currentLocation && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">
                    Location: {currentLocation.location_code}
                  </h3>
                  <p className="text-blue-700">Stop {currentLocation.sequence} of {selectedTicket.route?.stops.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <Navigation className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {selectedTicket.route?.total_distance}m total route
                </span>
              </div>
            </div>

            {/* Items at Current Location */}
            <div className="space-y-3">
              {locationItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    item.picked ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.picked ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">{item.item_name}</div>
                      <div className="text-sm text-gray-500">
                        SKU: {item.sku} • Qty: {item.quantity_required}
                      </div>
                      {item.lot_number && (
                        <div className="text-xs text-gray-400">
                          Lot: {item.lot_number} • Exp: {item.expiry_date}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!item.picked && (
                    <button
                      onClick={() => handleScan(item.sku)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Pick Item
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scanner Input */}
        {scanMode && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Camera className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <input
                  type="text"
                  value={scannedCode}
                  onChange={(e) => setScannedCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleScan(scannedCode)}
                  placeholder="Scan or enter SKU/Location code..."
                  className="w-full px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  autoFocus
                />
              </div>
              <button
                onClick={() => handleScan(scannedCode)}
                disabled={!scannedCode}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (currentStep === 'packing' && selectedTicket) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Packing: {selectedTicket.ticket_number}</h2>
            <p className="text-gray-600">Validate and pack all picked items</p>
          </div>
          <button
            onClick={completePacking}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Complete & Print Label
          </button>
        </div>

        {/* Packing Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Picked Items</h3>
            <div className="space-y-3">
              {selectedTicket.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-900">{item.item_name}</div>
                    <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-green-600">{item.quantity_picked} picked</div>
                    <div className="text-sm text-gray-500">of {item.quantity_required} required</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Packing Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Carton Type
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Small Box (12x8x6)</option>
                  <option>Medium Box (16x12x8)</option>
                  <option>Large Box (20x16x12)</option>
                  <option>Custom Size</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight Verification
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-600">kg</span>
                  <Weight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Special Handling
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Fragile</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Keep Upright</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Temperature Sensitive</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Truck className="w-6 h-6 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Order ID:</span>
              <span className="ml-2 font-medium">{selectedTicket.order_id}</span>
            </div>
            <div>
              <span className="text-gray-600">Items:</span>
              <span className="ml-2 font-medium">{selectedTicket.items.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Priority:</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                {selectedTicket.priority.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};