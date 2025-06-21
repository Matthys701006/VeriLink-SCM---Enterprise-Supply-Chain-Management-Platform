import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  DollarSign, 
  CreditCard, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Calculator,
  PieChart
} from 'lucide-react';
import { useOrchestrix } from '../contexts/OrchestrixContext';
import { supabase } from '../services/supabase/client';
import { Invoice, Payment, CostCenter } from '../types/orchestrix';

export const Finance: React.FC = () => {
  const { hasPermission, organization } = useOrchestrix();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'invoices' | 'payments' | 'budget'>('invoices');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (organization?.id) {
      loadFinanceData();
    }
  }, [organization?.id]);

  const loadFinanceData = async () => {
    try {
      setLoading(true);
      
      // Load invoices
      const { data: invoiceData, error: invoiceError } = await supabase
        .from('invoices')
        .select('*')
        .eq('organization_id', organization?.id)
        .order('invoice_date', { ascending: false });

      if (invoiceError) throw invoiceError;
      setInvoices(invoiceData || []);

      // Load payments
      const { data: paymentData, error: paymentError } = await supabase
        .from('payments')
        .select('*')
        .eq('organization_id', organization?.id)
        .order('payment_date', { ascending: false });

      if (paymentError) throw paymentError;
      setPayments(paymentData || []);

      // Load cost centers
      const { data: costCenterData, error: costCenterError } = await supabase
        .from('cost_centers')
        .select('*')
        .eq('organization_id', organization?.id)
        .eq('is_active', true)
        .order('name');

      if (costCenterError) throw costCenterError;
      setCostCenters(costCenterData || []);

    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInvoiceStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return CheckCircle;
      case 'approved':
        return Clock;
      case 'overdue':
        return AlertTriangle;
      case 'disputed':
        return AlertTriangle;
      default:
        return FileText;
    }
  };

  const getInvoiceStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'disputed':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateFinancialMetrics = () => {
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.total_amount, 0);
    const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, pay) => sum + pay.amount, 0);
    const pendingPayments = invoices.filter(inv => inv.status === 'approved').reduce((sum, inv) => sum + inv.total_amount, 0);
    const overdueAmount = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total_amount, 0);
    
    return {
      totalInvoiced,
      totalPaid,
      pendingPayments,
      overdueAmount,
      paymentRate: totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0
    };
  };

  const metrics = calculateFinancialMetrics();

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const invoiceStatuses = [...new Set(invoices.map(inv => inv.status))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasPermission('finance.read')) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-500">You don't have permission to access finance data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance & Accounting</h1>
          <p className="text-gray-600">Manage invoices, payments, and financial controls</p>
        </div>
        {hasPermission('finance.write') && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        )}
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoiced</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.totalInvoiced.toLocaleString()}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.totalPaid.toLocaleString()}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.pendingPayments.toLocaleString()}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">${metrics.overdueAmount.toLocaleString()}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Payment Rate</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.paymentRate.toFixed(1)}%</p>
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
              onClick={() => setSelectedTab('invoices')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'invoices'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Invoices ({invoices.length})
            </button>
            <button
              onClick={() => setSelectedTab('payments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Payments ({payments.length})
            </button>
            <button
              onClick={() => setSelectedTab('budget')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'budget'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Budget & Cost Centers ({costCenters.length})
            </button>
          </nav>
        </div>

        {selectedTab === 'invoices' ? (
          <div className="p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search invoices..."
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
                {invoiceStatuses.map(status => (
                  <option key={status} value={status}>{status.toUpperCase()}</option>
                ))}
              </select>
              <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                More Filters
              </button>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      AI Fraud Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => {
                    const StatusIcon = getInvoiceStatusIcon(invoice.status);
                    const isOverdue = invoice.due_date && new Date(invoice.due_date) < new Date() && invoice.status !== 'paid';
                    
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{invoice.invoice_number}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(invoice.invoice_date).toLocaleDateString()}
                            </div>
                            {invoice.blockchain_verified && (
                              <div className="text-xs text-green-600">✓ Blockchain Verified</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {invoice.invoice_type.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getInvoiceStatusColor(invoice.status)}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {invoice.status.toUpperCase()}
                            {isOverdue && <AlertTriangle className="w-3 h-3 ml-1 text-red-500" />}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${invoice.total_amount.toLocaleString()} {invoice.currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invoice.due_date 
                            ? new Date(invoice.due_date).toLocaleDateString()
                            : 'No due date'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {invoice.ai_fraud_score ? (
                            <div className={`text-sm font-medium ${
                              invoice.ai_fraud_score >= 4 ? 'text-red-600' :
                              invoice.ai_fraud_score >= 3 ? 'text-orange-600' :
                              invoice.ai_fraud_score >= 2 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {invoice.ai_fraud_score.toFixed(1)}/5.0
                              {invoice.ai_fraud_score >= 3 && <AlertTriangle className="w-3 h-3 inline ml-1" />}
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
        ) : selectedTab === 'payments' ? (
          <div className="p-6">
            {/* Payments Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Reference
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reconciliation
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.payment_reference}</div>
                          <div className="text-sm text-gray-500">{payment.transaction_id}</div>
                          {payment.blockchain_verified && (
                            <div className="text-xs text-green-600">✓ Blockchain Verified</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm text-gray-900">{payment.payment_method}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(payment.status)}`}>
                          {payment.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${payment.amount.toLocaleString()} {payment.currency}
                        {payment.fees > 0 && (
                          <div className="text-xs text-gray-500">Fee: ${payment.fees.toLocaleString()}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.payment_date 
                          ? new Date(payment.payment_date).toLocaleDateString()
                          : 'Pending'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.reconciliation_status === 'reconciled' ? 'bg-green-100 text-green-800' : 
                          payment.reconciliation_status === 'disputed' ? 'bg-red-100 text-red-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.reconciliation_status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {/* Budget & Cost Centers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {costCenters.map((costCenter) => {
                const utilizationPercentage = costCenter.budget_annual && costCenter.budget_remaining 
                  ? ((costCenter.budget_annual - costCenter.budget_remaining) / costCenter.budget_annual) * 100 
                  : 0;
                
                return (
                  <div key={costCenter.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{costCenter.name}</h3>
                        <p className="text-sm text-gray-500">{costCenter.code}</p>
                        <p className="text-sm text-gray-600 mt-1">{costCenter.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        costCenter.cost_center_type === 'operational' ? 'bg-blue-100 text-blue-800' :
                        costCenter.cost_center_type === 'project' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {costCenter.cost_center_type.toUpperCase()}
                      </span>
                    </div>

                    {costCenter.budget_annual && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Budget Utilization</span>
                          <span className="font-medium">{utilizationPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${
                              utilizationPercentage >= 90 ? 'bg-red-500' :
                              utilizationPercentage >= 75 ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Spent: ${(costCenter.budget_annual - costCenter.budget_remaining).toLocaleString()}</span>
                          <span>Remaining: ${costCenter.budget_remaining.toLocaleString()}</span>
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          Total Budget: ${costCenter.budget_annual.toLocaleString()}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        View Details
                      </button>
                      {hasPermission('finance.write') && (
                        <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                          Adjust Budget
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {costCenters.length === 0 && (
              <div className="text-center py-12">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No cost centers configured</p>
                <p className="text-sm text-gray-400 mt-1">Set up cost centers to track budget allocation</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};