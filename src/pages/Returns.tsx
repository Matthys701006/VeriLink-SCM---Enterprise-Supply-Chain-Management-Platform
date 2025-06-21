import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  RotateCcw, 
  PackageX, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Truck,
  DollarSign,
  FileText
} from 'lucide-react';
import { useOrchestrix } from '../contexts/OrchestrixContext';
import { supabase } from '../services/supabase/client';

interface ReturnOrder {
  id: string;
  return_number: string;
  original_order_id?: string;
  customer_name: string;
  return_reason: string;
  status: 'initiated' | 'approved' | 'shipped' | 'received' | 'processed' | 'refunded' | 'rejected';
  return_type: 'defective' | 'damaged' | 'wrong_item' | 'not_needed' | 'warranty';
  quantity: number;
  item_sku: string;
  item_name: string;
  return_value: number;
  return_date: string;
  expected_return_date?: string;
  actual_return_date?: string;
  inspection_notes?: string;
  refund_amount?: number;
  restocking_fee?: number;
  condition_assessment?: string;
  disposition: 'restock' | 'repair' | 'liquidate' | 'dispose' | 'vendor_return';
  created_at: string;
}

export const Returns: React.FC = () => {
  const { hasPermission, organization } = useOrchestrix();
  const [returns, setReturns] = useState<ReturnOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    if (organization?.id) {
      loadReturnsData();
    }
  }, [organization?.id]);

  const loadReturnsData = async () => {
    try {
      setLoading(true);
      
      // Since we don't have a returns table yet, generate mock data
      const mockReturns = generateMockReturns();
      setReturns(mockReturns);

    } catch (error) {
      console.error('Error loading returns data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockReturns = (): ReturnOrder[] => {
    const reasons = ['Defective product', 'Damaged in shipping', 'Wrong item sent', 'No longer needed', 'Warranty claim'];
    const customers = ['ABC Corp', 'XYZ Industries', 'Global Supply Co', 'Tech Solutions Ltd', 'Manufacturing Plus'];
    const statuses: ReturnOrder['status'][] = ['initiated', 'approved', 'shipped', 'received', 'processed', 'refunded'];
    const types: ReturnOrder['return_type'][] = ['defective', 'damaged', 'wrong_item', 'not_needed', 'warranty'];
    const items = [
      { sku: 'SKU-001', name: 'Industrial Bearing' },
      { sku: 'SKU-002', name: 'Steel Pipe' },
      { sku: 'SKU-003', name: 'Control Valve' },
      { sku: 'SKU-004', name: 'Safety Helmet' },
      { sku: 'SKU-005', name: 'Motor Assembly' }
    ];

    return Array.from({ length: 25 }, (_, i) => {
      const item = items[Math.floor(Math.random() * items.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const returnType = types[Math.floor(Math.random() * types.length)];
      const quantity = Math.floor(Math.random() * 10) + 1;
      const unitValue = 50 + Math.random() * 500;
      const returnValue = quantity * unitValue;
      
      return {
        id: `return-${i + 1}`,
        return_number: `RET-${String(i + 1).padStart(4, '0')}`,
        original_order_id: `PO-${String(Math.floor(Math.random() * 1000)).padStart(4, '0')}`,
        customer_name: customers[Math.floor(Math.random() * customers.length)],
        return_reason: reasons[Math.floor(Math.random() * reasons.length)],
        status,
        return_type: returnType,
        quantity,
        item_sku: item.sku,
        item_name: item.name,
        return_value: Math.round(returnValue),
        return_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        expected_return_date: status !== 'initiated' ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        actual_return_date: ['received', 'processed', 'refunded'].includes(status) ? new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        inspection_notes: ['received', 'processed', 'refunded'].includes(status) ? 'Item inspected and found to be in good condition' : undefined,
        refund_amount: status === 'refunded' ? Math.round(returnValue * 0.9) : undefined,
        restocking_fee: status === 'refunded' ? Math.round(returnValue * 0.1) : undefined,
        condition_assessment: ['received', 'processed', 'refunded'].includes(status) ? ['Excellent', 'Good', 'Fair', 'Poor'][Math.floor(Math.random() * 4)] : undefined,
        disposition: ['restock', 'repair', 'liquidate', 'dispose', 'vendor_return'][Math.floor(Math.random() * 5)] as ReturnOrder['disposition'],
        created_at: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
      };
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'refunded':
        return CheckCircle;
      case 'processed':
        return CheckCircle;
      case 'received':
        return PackageX;
      case 'shipped':
        return Truck;
      case 'approved':
        return Clock;
      case 'rejected':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'refunded':
        return 'bg-green-100 text-green-800';
      case 'processed':
        return 'bg-blue-100 text-blue-800';
      case 'received':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-orange-100 text-orange-800';
      case 'approved':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'initiated':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'defective':
        return 'bg-red-100 text-red-800';
      case 'damaged':
        return 'bg-orange-100 text-orange-800';
      case 'wrong_item':
        return 'bg-yellow-100 text-yellow-800';
      case 'warranty':
        return 'bg-blue-100 text-blue-800';
      case 'not_needed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReturns = returns.filter(returnOrder => {
    const matchesSearch = returnOrder.return_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnOrder.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnOrder.item_sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || returnOrder.status === statusFilter;
    const matchesType = !typeFilter || returnOrder.return_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const returnStatuses = [...new Set(returns.map(r => r.status))];
  const returnTypes = [...new Set(returns.map(r => r.return_type))];

  // Calculate metrics
  const totalReturns = returns.length;
  const pendingReturns = returns.filter(r => ['initiated', 'approved', 'shipped'].includes(r.status)).length;
  const totalReturnValue = returns.reduce((sum, r) => sum + r.return_value, 0);
  const avgProcessingTime = 4.2; // Mock data

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasPermission('returns.read')) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-500">You don't have permission to access returns data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Returns & Reverse Logistics</h1>
          <p className="text-gray-600">Manage product returns, refunds, and reverse supply chain operations</p>
        </div>
        {hasPermission('returns.write') && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Process Return
          </button>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Returns</p>
              <p className="text-2xl font-bold text-gray-900">{totalReturns}</p>
            </div>
            <RotateCcw className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-2 text-sm text-gray-500">Last 30 days</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Processing</p>
              <p className="text-2xl font-bold text-gray-900">{pendingReturns}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
          </div>
          <div className="mt-2 text-sm text-orange-600">Requires attention</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Return Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalReturnValue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-2 text-sm text-gray-500">Total value processed</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Processing</p>
              <p className="text-2xl font-bold text-gray-900">{avgProcessingTime} days</p>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <div className="mt-2 text-sm text-green-600">-0.8 days vs last month</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search returns..."
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
            {returnStatuses.map(status => (
              <option key={status} value={status}>{status.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {returnTypes.map(type => (
              <option key={type} value={type}>{type.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Return #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Return Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReturns.map((returnOrder) => {
                const StatusIcon = getStatusIcon(returnOrder.status);
                return (
                  <tr key={returnOrder.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{returnOrder.return_number}</div>
                        <div className="text-sm text-gray-500">Orig: {returnOrder.original_order_id}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{returnOrder.customer_name}</div>
                      <div className="text-sm text-gray-500">{returnOrder.return_reason}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{returnOrder.item_name}</div>
                        <div className="text-sm text-gray-500">{returnOrder.item_sku} • Qty: {returnOrder.quantity}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(returnOrder.return_type)}`}>
                        {returnOrder.return_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(returnOrder.status)}`}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {returnOrder.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${returnOrder.return_value.toLocaleString()}
                      {returnOrder.refund_amount && (
                        <div className="text-xs text-green-600">
                          Refunded: ${returnOrder.refund_amount.toLocaleString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(returnOrder.return_date).toLocaleDateString()}
                      {returnOrder.actual_return_date && (
                        <div className="text-xs text-gray-400">
                          Received: {new Date(returnOrder.actual_return_date).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 font-medium">
                          View
                        </button>
                        {hasPermission('returns.write') && (
                          <button className="text-gray-600 hover:text-gray-800 font-medium">
                            Process
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredReturns.length === 0 && (
        <div className="text-center py-12">
          <RotateCcw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No returns found matching your criteria</p>
        </div>
      )}
    </div>
  );
};