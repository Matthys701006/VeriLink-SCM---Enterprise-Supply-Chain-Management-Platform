import React, { useState } from 'react';
import { 
  X, 
  BarChart, 
  LineChart, 
  PieChart, 
  Table, 
  ChevronDown,
  Filter,
  Save,
  RefreshCw,
  Download
} from 'lucide-react';
import { CustomReport } from '@/types/analytics';

interface ReportBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: CustomReport) => void;
}

export function ReportBuilder({ isOpen, onClose, onSave }: ReportBuilderProps) {
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'table'>('bar');
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const metricCategories = [
    {
      name: 'Inventory',
      metrics: [
        'inventory_turnover',
        'inventory_value',
        'on_hand_quantity',
        'inventory_accuracy',
        'stockout_rate',
        'safety_stock_level',
      ]
    },
    {
      name: 'Suppliers',
      metrics: [
        'supplier_on_time_delivery',
        'supplier_quality_score',
        'supplier_lead_time',
        'supplier_cost_variance',
        'supplier_responsiveness',
      ]
    },
    {
      name: 'Warehousing',
      metrics: [
        'warehouse_utilization',
        'picking_accuracy',
        'order_processing_time',
        'put_away_time',
        'dock_to_stock_time',
      ]
    },
    {
      name: 'Transportation',
      metrics: [
        'on_time_delivery',
        'transportation_cost',
        'carbon_footprint',
        'miles_per_shipment',
        'fuel_efficiency',
      ]
    },
    {
      name: 'Financial',
      metrics: [
        'revenue',
        'cost_of_goods_sold',
        'gross_margin',
        'inventory_carrying_cost',
        'total_supply_chain_cost',
      ]
    },
  ];

  const formatMetricName = (metric: string) => {
    return metric
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleMetricToggle = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  const handleSave = () => {
    if (!reportName || selectedMetrics.length === 0) {
      alert('Please provide a report name and select at least one metric');
      return;
    }

    const report: CustomReport = {
      id: `report-${Date.now()}`,
      name: reportName,
      description: reportDescription,
      chart_type: chartType,
      metrics: selectedMetrics,
      created_at: new Date().toISOString(),
      last_run: new Date().toISOString()
    };

    onSave(report);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
        <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Build Custom Report</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Report Configuration - Left Panel */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Report Name</label>
                    <input
                      type="text"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      placeholder="Enter report name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      placeholder="Enter report description"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Chart Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chart Type</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { type: 'bar' as const, icon: BarChart, label: 'Bar Chart' },
                      { type: 'line' as const, icon: LineChart, label: 'Line Chart' },
                      { type: 'pie' as const, icon: PieChart, label: 'Pie Chart' },
                      { type: 'table' as const, icon: Table, label: 'Table View' },
                    ].map((chart) => {
                      const Icon = chart.icon;
                      const isSelected = chartType === chart.type;
                      return (
                        <div
                          key={chart.type}
                          onClick={() => setChartType(chart.type)}
                          className={`p-3 border rounded-lg cursor-pointer flex flex-col items-center justify-center gap-2 ${
                            isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-500' : 'text-gray-600'}`} />
                          <span className={`text-sm ${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                            {chart.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Metrics Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Metrics ({selectedMetrics.length} selected)
                  </label>
                  <div className="space-y-3 p-4 border rounded-lg max-h-64 overflow-y-auto">
                    {metricCategories.map((category) => (
                      <div key={category.name} className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">{category.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {category.metrics.map((metric) => (
                            <div 
                              key={metric}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                id={`metric-${metric}`}
                                checked={selectedMetrics.includes(metric)}
                                onChange={() => handleMetricToggle(metric)}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <label htmlFor={`metric-${metric}`} className="text-sm text-gray-700">
                                {formatMetricName(metric)}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Preview Panel */}
              <div className="lg:col-span-1 border rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Report Preview</h3>
                
                {selectedMetrics.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BarChart className="w-12 h-12 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Select metrics to see a preview</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-100 rounded-lg p-3 text-center text-sm text-gray-500 flex flex-col items-center justify-center h-48">
                      {chartType === 'bar' && <BarChart className="w-10 h-10 mb-2 text-blue-600" />}
                      {chartType === 'line' && <LineChart className="w-10 h-10 mb-2 text-green-600" />}
                      {chartType === 'pie' && <PieChart className="w-10 h-10 mb-2 text-purple-600" />}
                      {chartType === 'table' && <Table className="w-10 h-10 mb-2 text-gray-600" />}
                      <p className="font-medium">{reportName || 'Unnamed Report'}</p>
                      <p className="text-xs mt-1">{selectedMetrics.length} metrics selected</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Selected Metrics:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedMetrics.map(metric => (
                          <li key={metric} className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            {formatMetricName(metric)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                <div className="pt-4 mt-4 border-t">
                  <div className="space-y-3">
                    <button 
                      onClick={handleSave}
                      disabled={!reportName || selectedMetrics.length === 0}
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      <Save className="w-4 h-4" />
                      Save Report
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <RefreshCw className="w-4 h-4" />
                        <span className="text-sm">Refresh</span>
                      </button>
                      <button className="flex items-center justify-center gap-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">Export</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}