import React, { useEffect, useState } from 'react';
import { Package, Warehouse, AlertTriangle, TrendingUp, Settings, FileText } from 'lucide-react';
import { supabase } from '../services/supabase/client';
import { WorkflowManager } from '../components/workflow/WorkflowManager';
import { DocumentManager } from '../components/documents/DocumentManager';
import { seedSampleData } from '../services/sampleData';
import { useOrchestrix } from '../contexts/OrchestrixContext';
import { usePerformance } from '../contexts/PerformanceContext';
import { PerformanceMonitor } from '../components/monitoring/PerformanceMonitor';
import { useTranslation } from 'react-i18next';
import { RBACGuard, PermissionLevel } from '../components/security/RBACGuard';

interface DashboardStats {
  totalItems: number;
  lowStockItems: number;
  totalWarehouses: number;
  totalValue: number;
}

export const Dashboard: React.FC = () => {
  const { organization, enhancedUser } = useOrchestrix();
  const { recordPageLoad, recordRender } = usePerformance();
  const { t } = useTranslation();
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    lowStockItems: 0,
    totalWarehouses: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedWidget, setSelectedWidget] = useState<'overview' | 'workflows' | 'documents'>('overview');
  const [sampleDataLoaded, setSampleDataLoaded] = useState(false);

  // Record component rendering time
  const renderStartTime = performance.now();

  useEffect(() => {
    loadDashboardData();
    checkSampleData();
    
    // Record page load time
    const loadTime = performance.now() - renderStartTime;
    recordPageLoad(loadTime);
    
    return () => {
      // Record render time when component unmounts
      const renderTime = performance.now() - renderStartTime;
      recordRender(renderTime);
    };
  }, []);

  const checkSampleData = async () => {
    // Check if sample data exists
    const { count } = await supabase
      .from('suppliers')
      .select('*', { count: 'exact', head: true });
    
    setSampleDataLoaded((count || 0) > 0);
  };

  const handleLoadSampleData = async () => {
    if (!organization?.id || !enhancedUser?.id) return;
    
    try {
      await seedSampleData(organization.id, enhancedUser.id);
      setSampleDataLoaded(true);
      await loadDashboardData(); // Refresh dashboard data
    } catch (error) {
      console.error('Error loading sample data:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Get total items
      const { count: totalItems } = await supabase
        .from('inventory_items')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('is_deleted', false);

      // Get low stock items
      const { count: lowStockItems } = await supabase
        .from('inventory_items')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('is_deleted', false)
        .lt('on_hand', 'reorder_point');

      // Get total warehouses
      const { count: totalWarehouses } = await supabase
        .from('warehouses')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('is_deleted', false);

      // Calculate total value
      const { data: items } = await supabase
        .from('inventory_items')
        .select('on_hand, unit_cost')
        .eq('is_active', true)
        .eq('is_deleted', false)
        .not('unit_cost', 'is', null);

      const totalValue = items?.reduce((sum, item) => {
        return sum + (item.on_hand * (item.unit_cost || 0));
      }, 0) || 0;

      setStats({
        totalItems: totalItems || 0,
        lowStockItems: lowStockItems || 0,
        totalWarehouses: totalWarehouses || 0,
        totalValue,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Items',
      value: stats.totalItems.toLocaleString(),
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStockItems.toLocaleString(),
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Warehouses',
      value: stats.totalWarehouses.toLocaleString(),
      icon: Warehouse,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Value',
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">{t('common.dashboardOverview')}</p>
      </div>
      {!sampleDataLoaded && (
        <button
          onClick={handleLoadSampleData}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <Package className="w-4 h-4" />
          Load Sample Data
        </button>
      )}

      {/* Widget Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedWidget('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedWidget === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              System Overview
            </button>
            <button
              onClick={() => setSelectedWidget('workflows')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedWidget === 'workflows'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-1" />
              Workflows
            </button>
            <button
              onClick={() => setSelectedWidget('documents')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedWidget === 'documents'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-1" />
              Documents
            </button>
          </nav>
        </div>

        <div className="p-6">
          {selectedWidget === 'overview' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, index) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">{card.title}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                        </div>
                        <div className={`${card.bgColor} ${card.color} p-3 rounded-full`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.quickActions')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Add New Item</p>
                  </button>
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <Warehouse className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">Add Warehouse</p>
                  </button>
                  <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">View Alerts</p>
                  </button>
                </div>
              </div>
            </div>
          ) : selectedWidget === 'workflows' ? (
            <WorkflowManager />
          ) : (
            <DocumentManager />
          )}
        </div>
      </div>
      
      {/* Add Performance Monitor for admins and in development mode */}
      {(process.env.NODE_ENV === 'development' || enhancedUser?.role === 'admin') && (
        <PerformanceMonitor showDetailed={true} />
      )}
    </div>
  );
};