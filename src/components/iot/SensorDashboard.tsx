import React, { useState, useEffect } from 'react';
import { 
  Thermometer, 
  Droplets, 
  Gauge, 
  MapPin, 
  Wifi, 
  Battery, 
  AlertTriangle,
  RefreshCw,
  Clock,
  Zap,
  BarChart3,
  Settings
} from 'lucide-react';
import { useOrchestrix } from '../../contexts/OrchestrixContext';
import { supabase } from '../../services/supabase/client';
import { sensorProcessor } from '../../services/iot/SensorDataProcessor';
import { IoTSensor } from '../../types/orchestrix';

interface SensorDashboardProps {
  warehouseId?: string;
  vehicleId?: string;
}

export const SensorDashboard: React.FC<SensorDashboardProps> = ({ warehouseId, vehicleId }) => {
  const { organization, hasPermission } = useOrchestrix();
  const [sensors, setSensors] = useState<IoTSensor[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<IoTSensor | null>(null);
  const [sensorData, setSensorData] = useState<any>(null);
  const [sensorStats, setSensorStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  useEffect(() => {
    if (organization?.id) {
      loadSensors();
    }
  }, [organization?.id, warehouseId, vehicleId]);

  useEffect(() => {
    if (selectedSensor) {
      loadSensorData(selectedSensor.sensor_id);
      loadSensorStats(selectedSensor.sensor_id);
    }
  }, [selectedSensor, timeRange]);

  const loadSensors = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('iot_sensors')
        .select('*')
        .eq('organization_id', organization?.id)
        .eq('is_active', true);
      
      if (warehouseId) {
        query = query.eq('warehouse_id', warehouseId);
      } else if (vehicleId) {
        query = query.eq('vehicle_id', vehicleId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setSensors(data);
        setSelectedSensor(data[0]);
      } else {
        // Generate mock sensors if none exist
        const mockSensors = generateMockSensors();
        setSensors(mockSensors);
        setSelectedSensor(mockSensors[0]);
      }
      
    } catch (error) {
      console.error('Error loading sensors:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockSensors = (): IoTSensor[] => {
    const sensorTypes: IoTSensor['sensor_type'][] = ['temperature', 'humidity', 'pressure', 'gps', 'vibration'];
    
    return Array.from({ length: 5 }, (_, i) => {
      const sensorType = sensorTypes[i % sensorTypes.length];
      
      return {
        id: `sensor-${i + 1}`,
        organization_id: organization?.id || '',
        sensor_id: `${sensorType}-sensor-${i + 1}`,
        sensor_type: sensorType,
        warehouse_id: warehouseId,
        vehicle_id: vehicleId,
        location_description: warehouseId ? `Zone ${String.fromCharCode(65 + i)}, Aisle ${i + 1}` : `Vehicle Compartment ${i + 1}`,
        alert_thresholds: {
          critical_max: sensorType === 'temperature' ? 30 : sensorType === 'humidity' ? 90 : 100,
          critical_min: sensorType === 'temperature' ? 0 : sensorType === 'humidity' ? 10 : 0,
          high_max: sensorType === 'temperature' ? 25 : sensorType === 'humidity' ? 80 : 90,
          high_min: sensorType === 'temperature' ? 5 : sensorType === 'humidity' ? 20 : 10
        },
        sampling_rate: 60,
        status: Math.random() > 0.1 ? 'active' : 'inactive',
        is_active: true,
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      } as IoTSensor;
    });
  };

  const loadSensorData = async (sensorId: string) => {
    try {
      const data = await sensorProcessor.getIoTSensorData(sensorId);
      setSensorData(data);
    } catch (error) {
      console.error('Error loading sensor data:', error);
    }
  };

  const loadSensorStats = async (sensorId: string) => {
    try {
      const stats = await sensorProcessor.getSensorStatistics(sensorId, timeRange);
      setSensorStats(stats);
    } catch (error) {
      console.error('Error loading sensor statistics:', error);
    }
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature':
        return Thermometer;
      case 'humidity':
        return Droplets;
      case 'pressure':
        return Gauge;
      case 'gps':
        return MapPin;
      case 'vibration':
        return Zap;
      default:
        return Wifi;
    }
  };

  const getSensorStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSensorUnit = (type: string) => {
    switch (type) {
      case 'temperature':
        return '°C';
      case 'humidity':
        return '%';
      case 'pressure':
        return 'hPa';
      case 'vibration':
        return 'Hz';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasPermission('iot.read')) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-500">You don't have permission to access IoT sensor data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">IoT Sensor Dashboard</h2>
          <p className="text-gray-600">
            {warehouseId ? 'Warehouse environmental monitoring' : 
             vehicleId ? 'Vehicle telemetry and tracking' : 
             'IoT sensor network overview'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button
            onClick={() => {
              if (selectedSensor) {
                loadSensorData(selectedSensor.sensor_id);
                loadSensorStats(selectedSensor.sensor_id);
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sensor List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">Sensors</h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {sensors.map((sensor) => {
                const Icon = getSensorIcon(sensor.sensor_type);
                const isSelected = selectedSensor?.id === sensor.id;
                
                return (
                  <div
                    key={sensor.id}
                    onClick={() => setSelectedSensor(sensor)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <Icon className={`w-5 h-5 ${
                            isSelected ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {sensor.sensor_type.charAt(0).toUpperCase() + sensor.sensor_type.slice(1)}
                          </div>
                          <div className="text-xs text-gray-500">{sensor.location_description}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSensorStatusColor(sensor.status)}`}>
                        {sensor.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sensor Details */}
        <div className="lg:col-span-3">
          {selectedSensor ? (
            <div className="space-y-6">
              {/* Sensor Header */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      {React.createElement(getSensorIcon(selectedSensor.sensor_type), { 
                        className: "w-8 h-8 text-blue-600" 
                      })}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {selectedSensor.sensor_type.charAt(0).toUpperCase() + selectedSensor.sensor_type.slice(1)} Sensor
                      </h3>
                      <p className="text-gray-600">{selectedSensor.sensor_id}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSensorStatusColor(selectedSensor.status)}`}>
                          {selectedSensor.status.toUpperCase()}
                        </span>
                        {sensorData?.battery_level && (
                          <div className="flex items-center gap-1 text-xs">
                            <Battery className={`w-3 h-3 ${
                              sensorData.battery_level > 20 ? 'text-green-500' : 'text-red-500'
                            }`} />
                            <span>{sensorData.battery_level}%</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Updates every {selectedSensor.sampling_rate}s</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Readings */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {sensorData?.readings?.slice(0, 1).map((reading: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Current Value</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {reading.value} {getSensorUnit(selectedSensor.sensor_type)}
                        </p>
                      </div>
                      {React.createElement(getSensorIcon(selectedSensor.sensor_type), { 
                        className: "w-8 h-8 text-blue-600" 
                      })}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Last updated: {new Date(reading.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                
                {sensorStats && (
                  <>
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Average</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {sensorStats.average} {getSensorUnit(selectedSensor.sensor_type)}
                          </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Based on {sensorStats.readings_count} readings
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Min/Max</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {sensorStats.minimum}/{sensorStats.maximum}
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Range: {sensorStats.maximum - sensorStats.minimum} {getSensorUnit(selectedSensor.sensor_type)}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Alerts</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {sensorStats.alert_count}
                          </p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-orange-600" />
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        {sensorStats.anomaly_count} anomalies detected
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Readings History */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Recent Readings</h3>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timestamp
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quality
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Anomaly Score
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Alert
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {sensorData?.readings?.map((reading: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {new Date(reading.timestamp).toLocaleString()}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {reading.value} {reading.unit}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                reading.quality === 'good' ? 'bg-green-100 text-green-800' :
                                reading.quality === 'poor' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {reading.quality.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {reading.anomaly_score ? (
                                <div className={`${
                                  reading.anomaly_score > 0.7 ? 'text-red-600' :
                                  reading.anomaly_score > 0.3 ? 'text-yellow-600' :
                                  'text-green-600'
                                }`}>
                                  {reading.anomaly_score.toFixed(2)}
                                </div>
                              ) : (
                                <span className="text-gray-400">N/A</span>
                              )}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              {reading.alert_triggered ? (
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Thresholds */}
              <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Alert Thresholds</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Critical Thresholds</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Maximum</span>
                          <span className="font-medium text-red-600">
                            {selectedSensor.alert_thresholds.critical_max} {getSensorUnit(selectedSensor.sensor_type)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Minimum</span>
                          <span className="font-medium text-red-600">
                            {selectedSensor.alert_thresholds.critical_min} {getSensorUnit(selectedSensor.sensor_type)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Warning Thresholds</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Maximum</span>
                          <span className="font-medium text-yellow-600">
                            {selectedSensor.alert_thresholds.high_max} {getSensorUnit(selectedSensor.sensor_type)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Minimum</span>
                          <span className="font-medium text-yellow-600">
                            {selectedSensor.alert_thresholds.high_min} {getSensorUnit(selectedSensor.sensor_type)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
              <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a sensor to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};