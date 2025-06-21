import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Warehouse } from 'lucide-react';
import { supabase } from '../services/supabase/client';
import { PickPackWorkflow } from '../components/warehouse/PickPackWorkflow';
import { SensorDashboard } from '../components/iot/SensorDashboard';

interface WarehouseData {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  country: string;
  total_capacity: number;
  used_capacity: number;
  is_active: boolean;
}

export const Warehouses: React.FC = () => {
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'warehouses' | 'operations' | 'iot'>('warehouses');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    try {
      const { data, error } = await supabase
        .from('warehouses')
        .select('*')
        .eq('is_deleted', false)
        .order('name');

      if (error) throw error;
      setWarehouses(data || []);
    } catch (error) {
      console.error('Error loading warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUtilizationPercentage = (used: number, total: number) => {
    if (!total) return 0;
    return Math.round((used / total) * 100);
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Management</h1>
          <p className="text-gray-600">Manage locations and operations</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedView('warehouses')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'warehouses'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Locations
            </button>
            <button
              onClick={() => setSelectedView('operations')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'operations'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Operations
            </button>
            <button
              onClick={() => setSelectedView('iot')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedView === 'iot'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              IoT Sensors
            </button>
          </div>
          {selectedView === 'warehouses' && (
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Warehouse
            </button>
          )}
        </div>
      </div>

      {selectedView === 'warehouses' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse) => {
          const utilizationPercentage = getUtilizationPercentage(
            warehouse.used_capacity,
            warehouse.total_capacity
          );
          
          return (
            <div
              key={warehouse.id}
              className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${
                warehouse.is_active ? '' : 'opacity-60'
              }`}
              onClick={() => setSelectedWarehouse(warehouse.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Warehouse className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{warehouse.name}</h3>
                    <p className="text-sm text-gray-500">{warehouse.code}</p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  warehouse.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {warehouse.is_active ? 'Active' : 'Inactive'}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>
                    {warehouse.address && `${warehouse.address}, `}
                    {warehouse.city}, {warehouse.country}
                  </span>
                </div>

                {warehouse.total_capacity && (
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Capacity Utilization</span>
                      <span>{utilizationPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getUtilizationColor(utilizationPercentage)}`}
                        style={{ width: `${utilizationPercentage}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{warehouse.used_capacity.toLocaleString()} m³</span>
                      <span>{warehouse.total_capacity.toLocaleString()} m³</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          );
        })}

      ) : selectedView === 'operations' ? (
        selectedView === 'operations' ? (
          <PickPackWorkflow />
        ) : (
          <SensorDashboard warehouseId={selectedWarehouse || undefined} />
        )
      }

      {selectedView === 'warehouses' && warehouses.length === 0 && (
        <div className="text-center py-12">
          <Warehouse className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No warehouses found</p>
          <p className="text-sm text-gray-400 mt-1">Add your first warehouse to get started</p>
        </div>
      )}
    </div>
  );
};