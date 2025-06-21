import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, ShoppingCart, AlertTriangle, TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { useOrchestrix } from '../contexts/OrchestrixContext';
import { supabase } from '../services/supabase/client';
import { PurchaseOrder, Supplier } from '../types/orchestrix';
import { POCreationForm } from '../components/procurement/POCreationForm';
import { ApprovalWorkflow } from '../components/procurement/ApprovalWorkflow';

export const Procurement: React.FC = () => {
  const { hasPermission, organization } = useOrchestrix();
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'orders' | 'suppliers'>('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  useEffect(() => {
    if (organization?.id) {
      loadData();
    }
  }, [organization?.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load purchase orders
      const { data: poData, error: poError } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          suppliers (*)
        `)
        .eq('organization_id', organization?.id)
        .order('created_at', { ascending: false });

      if (poError) throw poError;
      setPurchaseOrders(poData || []);

      // Load suppliers
      const { data: supplierData, error: supplierError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('organization_id', organization?.id)
        .eq('is_active', true)
        .order('ai_performance_score', { ascending: false });

      if (supplierError) throw supplierError;
      setSuppliers(supplierData || []);

    } catch (error) {
      console.error('Error loading procurement data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return CheckCircle;
      case 'pending':
        return Clock;
      case 'cancelled':
        return XCircle;
      case 'completed':
        return CheckCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 4) return 'text-red-600';
    if (score >= 3) return 'text-orange-600';
    if (score >= 2) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getPerformanceScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-blue-600';
    if (score >= 2) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredPOs = purchaseOrders.filter(po => {
    const matchesSearch = po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.suppliers?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSuppliers = suppliers.filter(supplier => {
    return supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           supplier.code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const poStatuses = [...new Set(purchaseOrders.map(po => po.status))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasPermission('procurement.read')) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-500">You don't have permission to access procurement data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Procurement</h1>
          <p className="text-gray-600">Manage purchase orders and supplier relationships</p>
        </div>
        {hasPermission('procurement.write') && (
          <button 
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create PO
          </button>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total POs</p>
              <p className="text-2xl font-bold text-gray-900">{purchaseOrders.length}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">
                {purchaseOrders.filter(po => po.status === 'pending').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${purchaseOrders.reduce((sum, po) => sum + po.total_amount, 0).toLocaleString()}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('orders')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Purchase Orders ({purchaseOrders.length})
            </button>
            <button
              onClick={() => setSelectedTab('suppliers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'suppliers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Suppliers ({suppliers.length})
            </button>
          </nav>
        </div>

        {selectedTab === 'orders' ? (
          <div className="p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search POs..."
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
                {poStatuses.map(status => (
                  <option key={status} value={status}>{status.toUpperCase()}</option>
                ))}
              </select>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>

            {/* Purchase Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PO Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Supplier
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI Risk Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPOs.map((po) => {
                    const StatusIcon = getStatusIcon(po.status);
                    return (
                      <tr key={po.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{po.po_number}</div>
                          {po.blockchain_verified && (
                            <div className="text-xs text-green-600">✓ Blockchain Verified</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{po.suppliers?.name}</div>
                          <div className="text-sm text-gray-500">{po.suppliers?.code}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedPO(po);
                              setShowApprovalModal(true);
                            }}
                            className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full hover:opacity-80 ${getStatusColor(po.status)}`}
                          >
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {po.status.toUpperCase()}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${po.total_amount.toLocaleString()} {po.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(po.order_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {po.ai_fraud_score ? (
                            <div className={`text-sm font-medium ${getRiskScoreColor(po.ai_fraud_score)}`}>
                              {po.ai_fraud_score.toFixed(1)}/5.0
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Suppliers Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Suppliers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSuppliers.map((supplier) => (
                <div key={supplier.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                      <p className="text-sm text-gray-500">{supplier.code}</p>
                    </div>
                    {supplier.blockchain_verified && (
                      <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                        ✓ Verified
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Performance Score</span>
                      <span className={`text-sm font-medium ${getPerformanceScoreColor(supplier.ai_performance_score)}`}>
                        {supplier.ai_performance_score.toFixed(1)}/5.0
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Risk Score</span>
                      <span className={`text-sm font-medium ${getRiskScoreColor(supplier.ai_risk_score)}`}>
                        {supplier.ai_risk_score.toFixed(1)}/5.0
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">On-Time Delivery</span>
                      <span className="text-sm font-medium text-gray-900">
                        {(supplier.performance_metrics.on_time_delivery * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Quality Score</span>
                      <span className="text-sm font-medium text-gray-900">
                        {(supplier.performance_metrics.quality_score * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                    {hasPermission('suppliers.write') && (
                      <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {(selectedTab === 'orders' ? filteredPOs : filteredSuppliers).length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No {selectedTab} found matching your criteria</p>
        </div>
      )}

      {/* PO Creation Form */}
      <POCreationForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSuccess={() => {
          setShowCreateForm(false);
          loadData();
        }}
      />

      {/* Approval Workflow Modal */}
      <ApprovalWorkflow
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        purchaseOrder={selectedPO}
        onApprovalComplete={() => {
          setShowApprovalModal(false);
          loadData();
        }}
      />
    </div>
  );
};