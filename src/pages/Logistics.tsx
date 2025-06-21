import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  TruckIcon, 
  MapPin, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Package,
  Navigation,
  Fuel,
  Thermometer,
  Cloud,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useOrchestrix } from '../contexts/OrchestrixContext';
import { supabase } from '../services/supabase/client';
import { Shipment, Carrier, Vehicle } from '../types/orchestrix';
import { externalAPI } from '../services/api/ExternalAPIService';
import { sensorProcessor } from '../services/iot/SensorDataProcessor';

export const Logistics: React.FC = () => {
  const { hasPermission, organization } = useOrchestrix();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'shipments' | 'fleet' | 'routes'>('shipments');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [weatherData, setWeatherData] = useState<any>(null);
  const [sensorAlerts, setSensorAlerts] = useState<any[]>([]);
  const [optimizedRoutes, setOptimizedRoutes] = useState<any[]>([]);

  useEffect(() => {
    if (organization?.id) {
      loadLogisticsData();
      loadWeatherData();
      setupSensorAlerts();
      loadOptimizedRoutes();
    }
  }, [organization?.id]);

  const loadWeatherData = async () => {
    try {
      const weather = await externalAPI.getWeatherData('Chicago');
      setWeatherData(weather);
    } catch (error) {
      console.error('Error loading weather data:', error);
    }
  };

  const setupSensorAlerts = () => {
    // Subscribe to IoT sensor alerts
    sensorProcessor.onAlert((alert) => {
      if (alert.sensor_id.startsWith('vehicle-') || alert.sensor_id.startsWith('gps-')) {
        setSensorAlerts(prev => [alert, ...prev].slice(0, 5));
      }
    });
    
    // Add some mock alerts for demonstration
    const mockAlerts = [
      {
        id: 'alert-1',
        sensor_id: 'vehicle-temp-001',
        alert_type: 'temperature_threshold',
        severity: 'high',
        message: 'Temperature exceeds threshold in refrigerated vehicle TRK-001',
        triggered_at: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: 'alert-2',
        sensor_id: 'gps-tracker-003',
        alert_type: 'route_deviation',
        severity: 'medium',
        message: 'Vehicle TRK-003 has deviated from planned route',
        triggered_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ];
    
    setSensorAlerts(mockAlerts);
  };

  const loadOptimizedRoutes = async () => {
    try {
      // Mock optimized routes
      const mockRoutes = [
        {
          id: 'route-1',
          name: 'Chicago Metro Delivery',
          stops: 12,
          distance: 78.5,
          duration: 210,
          ai_optimized: true,
          carbon_reduction: 18.2,
          cost_savings: 215.50
        },
        {
          id: 'route-2',
          name: 'Milwaukee Distribution',
          stops: 8,
          distance: 142.3,
          duration: 180,
          ai_optimized: true,
          carbon_reduction: 22.5,
          cost_savings: 347.80
        },
        {
          id: 'route-3',
          name: 'Indianapolis Delivery',
          stops: 15,
          distance: 210.7,
          duration: 285,
          ai_optimized: true,
          carbon_reduction: 31.4,
          cost_savings: 512.25
        }
      ];
      
      setOptimizedRoutes(mockRoutes);
    } catch (error) {
      console.error('Error loading optimized routes:', error);
    }
  };

  const loadLogisticsData = async () => {
    try {
      setLoading(true);
      
      // Load shipments with related data
      const { data: shipmentData, error: shipmentError } = await supabase
        .from('shipments')
        .select(`
          *,
          carriers (*),
          vehicles (*),
          routes (*)
        `)
        .eq('organization_id', organization?.id)
        .order('created_at', { ascending: false });

      if (shipmentError) throw shipmentError;
      setShipments(shipmentData || []);

      // Load carriers
      const { data: carrierData, error: carrierError } = await supabase
        .from('carriers')
        .select('*')
        .eq('organization_id', organization?.id)
        .eq('is_active', true)
        .order('ai_performance_score', { ascending: false });

      if (carrierError) throw carrierError;
      setCarriers(carrierData || []);

      // Load vehicles
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .select('*')
        .eq('organization_id', organization?.id)
        .eq('is_active', true)
        .order('status');

      if (vehicleError) throw vehicleError;
      setVehicles(vehicleData || []);

    } catch (error) {
      console.error('Error loading logistics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return CheckCircle;
      case 'in_transit':
        return TruckIcon;
      case 'picked_up':
        return Package;
      case 'cancelled':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'picked_up':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in_transit':
        return 'bg-blue-100 text-blue-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.shipment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.carriers?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || shipment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const shipmentStatuses = [...new Set(shipments.map(s => s.status))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasPermission('logistics.read')) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-500">You don't have permission to access logistics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transportation & Logistics</h1>
          <p className="text-gray-600">Manage shipments, carriers, and fleet operations</p>
        </div>
        {hasPermission('logistics.write') && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Shipment
          </button>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Shipments</p>
              <p className="text-2xl font-bold text-gray-900">
                {shipments.filter(s => ['pending', 'picked_up', 'in_transit'].includes(s.status)).length}
              </p>
            </div>
            <TruckIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On-Time Delivery</p>
              <p className="text-2xl font-bold text-gray-900">94.2%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fleet Utilization</p>
              <p className="text-2xl font-bold text-gray-900">78.5%</p>
            </div>
            <Navigation className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Fuel Efficiency</p>
              <p className="text-2xl font-bold text-gray-900">12.8 MPG</p>
            </div>
            <Fuel className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('shipments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'shipments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Shipments ({shipments.length})
            </button>
            <button
              onClick={() => setSelectedTab('fleet')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'fleet'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Fleet ({vehicles.length})
            </button>
            <button
              onClick={() => setSelectedTab('routes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'routes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Route Optimization
            </button>
          </nav>
        </div>

        {selectedTab === 'shipments' ? (
          <div className="p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search shipments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Statuses</option>
                {shipmentStatuses.map(status => (
                  <option key={status} value={status}>{status.replace('_', ' ').toUpperCase()}</option>
                ))}
              </select>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>

            {/* Shipments Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shipment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Carrier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Route
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredShipments.map((shipment) => {
                    const StatusIcon = getStatusIcon(shipment.status);
                    return (
                      <tr key={shipment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{shipment.shipment_number}</div>
                            <div className="text-sm text-gray-500">
                              {shipment.tracking_number && `Tracking: ${shipment.tracking_number}`}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{shipment.carriers?.name}</div>
                          <div className="text-sm text-gray-500">{shipment.carriers?.carrier_type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shipment.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {shipment.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {shipment.destination_address?.split(',')[0] || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {shipment.planned_delivery_date 
                            ? new Date(shipment.planned_delivery_date).toLocaleDateString()
                            : 'TBD'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${shipment.shipping_cost?.toLocaleString() || '0'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : selectedTab === 'fleet' ? (
          <div className="p-6">
            {/* Fleet Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{vehicle.vehicle_id}</h3>
                      <p className="text-sm text-gray-500">{vehicle.make_model}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getVehicleStatusColor(vehicle.status)}`}>
                      {vehicle.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Type</span>
                      <span className="text-sm font-medium text-gray-900">{vehicle.vehicle_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Capacity</span>
                      <span className="text-sm font-medium text-gray-900">
                        {vehicle.capacity_weight ? `${vehicle.capacity_weight}kg` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fuel Type</span>
                      <span className="text-sm font-medium text-gray-900">{vehicle.fuel_type || 'N/A'}</span>
                    </div>
                    {vehicle.current_location && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>Live Location Available</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Track Live
                    </button>
                    {hasPermission('logistics.write') && (
                      <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                        Assign Route
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="space-y-6">
              {/* Route Optimization */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Route Optimization</h3>
                    <p className="text-gray-600">Optimize delivery routes using machine learning algorithms</p>
                  </div>
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
                    <div className="text-sm text-gray-500">Daily Savings</div>
                    <div className="text-xl font-bold text-green-600">$2,847</div>
                  </div>
                </div>
              </div>

              {/* Weather & IoT Data */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weather Data */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Cloud className="w-6 h-6 text-blue-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Weather Conditions</h4>
                  </div>
                  
                  {weatherData ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Location</span>
                        <span className="font-medium">{weatherData.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Condition</span>
                        <span className="font-medium">{weatherData.condition}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Temperature</span>
                        <span className="font-medium">{weatherData.temperature}°C</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Visibility</span>
                        <span className="font-medium">{weatherData.visibility} km</span>
                      </div>
                      
                      {weatherData.alerts.length > 0 && (
                        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <div className="flex items-center gap-2 text-yellow-800">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="font-medium">{weatherData.alerts[0]}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </div>

                {/* IoT Sensor Alerts */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-6 h-6 text-orange-600" />
                    <h4 className="text-lg font-semibold text-gray-900">IoT Sensor Alerts</h4>
                  </div>
                  
                  <div className="space-y-3">
                    {sensorAlerts.length > 0 ? (
                      sensorAlerts.map((alert, index) => (
                        <div 
                          key={alert.id || index}
                          className={`p-3 rounded-lg border ${
                            alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                            alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                            'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                              alert.severity === 'high' ? 'text-red-500' :
                              alert.severity === 'medium' ? 'text-yellow-500' :
                              'text-blue-500'
                            }`} />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(alert.triggered_at).toLocaleTimeString()} • {alert.sensor_id}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        No active sensor alerts
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Route Analytics */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <h4 className="text-lg font-semibold text-gray-900">Route Analytics</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Average Route Efficiency</span>
                      <span className="font-semibold text-green-600">92.3%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Fuel Savings</span>
                      <span className="font-semibold text-blue-600">18.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Time Reduction</span>
                      <span className="font-semibold text-purple-600">24.7%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Carbon Footprint</span>
                      <span className="font-semibold text-green-600">-31.2%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Optimized Routes */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-900">AI-Optimized Routes</h4>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {optimizedRoutes.map(route => (
                      <div key={route.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-medium text-gray-900">{route.name}</h5>
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                              <Navigation className="w-3 h-3" />
                              <span>{route.stops} stops • {route.distance.toFixed(1)} km</span>
                            </div>
                          </div>
                          <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            AI Optimized
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration</span>
                            <span className="font-medium">{Math.floor(route.duration / 60)}h {route.duration % 60}m</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Carbon Reduction</span>
                            <span className="font-medium text-green-600">{route.carbon_reduction}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Cost Savings</span>
                            <span className="font-medium text-green-600">${route.cost_savings.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
                          </button>
                          <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                            Assign Driver
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {filteredShipments.length === 0 && selectedTab === 'shipments' && (
        <div className="text-center py-12">
          <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No shipments found matching your criteria</p>
        </div>
      )}
    </div>
  );
};