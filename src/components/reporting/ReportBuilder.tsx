import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter, 
  Settings, 
  Save,
  Play,
  FileText,
  PieChart,
  TrendingUp,
  Database,
  Columns
} from 'lucide-react';
import { useOrchestrix } from '../../contexts/OrchestrixContext';
import { supabase } from '../../services/supabase/client';
import { Modal } from '../ui/Modal';

interface ReportConfig {
  id?: string;
  name: string;
  description: string;
  data_source: string;
  chart_type: 'table' | 'bar' | 'line' | 'pie' | 'area';
  filters: ReportFilter[];
  columns: ReportColumn[];
  aggregations: ReportAggregation[];
  date_range: {
    start: string;
    end: string;
  };
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
}

interface ReportFilter {
  field: string;
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'between';
  value: any;
  label: string;
}

interface ReportColumn {
  field: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean';
  visible: boolean;
  sortable: boolean;
}

interface ReportAggregation {
  field: string;
  function: 'sum' | 'avg' | 'count' | 'min' | 'max';
  label: string;
}

interface ReportBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (report: ReportConfig) => void;
  existingReport?: ReportConfig;
}

export const ReportBuilder: React.FC<ReportBuilderProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  existingReport 
}) => {
  const { organization, hasPermission } = useOrchestrix();
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    description: '',
    data_source: 'inventory_items',
    chart_type: 'table',
    filters: [],
    columns: [],
    aggregations: [],
    date_range: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    }
  });
  
  const [availableDataSources] = useState([
    { value: 'inventory_items', label: 'Inventory Items', table: 'inventory_items' },
    { value: 'purchase_orders', label: 'Purchase Orders', table: 'purchase_orders' },
    { value: 'suppliers', label: 'Suppliers', table: 'suppliers' },
    { value: 'shipments', label: 'Shipments', table: 'shipments' },
    { value: 'invoices', label: 'Invoices', table: 'invoices' },
    { value: 'warehouse_utilization', label: 'Warehouse Utilization', table: 'warehouse_utilization_view' }
  ]);
  
  const [availableFields, setAvailableFields] = useState<Record<string, any[]>>({});
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'config' | 'fields' | 'filters' | 'preview'>('config');

  useEffect(() => {
    if (existingReport) {
      setReportConfig(existingReport);
    }
  }, [existingReport]);

  useEffect(() => {
    loadAvailableFields();
  }, [reportConfig.data_source]);

  const loadAvailableFields = async () => {
    const dataSource = availableDataSources.find(ds => ds.value === reportConfig.data_source);
    if (!dataSource) return;

    try {
      // Get table schema
      const { data, error } = await supabase
        .from(dataSource.table)
        .select('*')
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const sampleRow = data[0];
        const fields = Object.keys(sampleRow).map(key => ({
          field: key,
          label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          type: typeof sampleRow[key] === 'number' ? 'number' : 
                typeof sampleRow[key] === 'boolean' ? 'boolean' :
                key.includes('date') || key.includes('time') ? 'date' : 'string'
        }));
        
        setAvailableFields(prev => ({
          ...prev,
          [reportConfig.data_source]: fields
        }));
        
        // Set default columns
        if (reportConfig.columns.length === 0) {
          setReportConfig(prev => ({
            ...prev,
            columns: fields.slice(0, 5).map(field => ({
              ...field,
              visible: true,
              sortable: true
            }))
          }));
        }
      }
    } catch (error) {
      console.error('Error loading fields:', error);
    }
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      
      const dataSource = availableDataSources.find(ds => ds.value === reportConfig.data_source);
      if (!dataSource) return;

      let query = supabase.from(dataSource.table);
      
      // Select columns
      const selectColumns = reportConfig.columns
        .filter(col => col.visible)
        .map(col => col.field)
        .join(', ');
      
      if (selectColumns) {
        query = query.select(selectColumns);
      } else {
        query = query.select('*');
      }
      
      // Apply filters
      reportConfig.filters.forEach(filter => {
        switch (filter.operator) {
          case 'equals':
            query = query.eq(filter.field, filter.value);
            break;
          case 'not_equals':
            query = query.neq(filter.field, filter.value);
            break;
          case 'greater_than':
            query = query.gt(filter.field, filter.value);
            break;
          case 'less_than':
            query = query.lt(filter.field, filter.value);
            break;
          case 'contains':
            query = query.ilike(filter.field, `%${filter.value}%`);
            break;
        }
      });
      
      // Date range filter
      if (reportConfig.date_range.start && reportConfig.date_range.end) {
        query = query
          .gte('created_at', reportConfig.date_range.start)
          .lte('created_at', reportConfig.date_range.end);
      }
      
      // Limit for preview
      query = query.limit(100);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setPreviewData(data || []);
      
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFilter = () => {
    const fields = availableFields[reportConfig.data_source] || [];
    if (fields.length === 0) return;
    
    const newFilter: ReportFilter = {
      field: fields[0].field,
      operator: 'equals',
      value: '',
      label: fields[0].label
    };
    
    setReportConfig(prev => ({
      ...prev,
      filters: [...prev.filters, newFilter]
    }));
  };

  const updateFilter = (index: number, updates: Partial<ReportFilter>) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.map((filter, i) => 
        i === index ? { ...filter, ...updates } : filter
      )
    }));
  };

  const removeFilter = (index: number) => {
    setReportConfig(prev => ({
      ...prev,
      filters: prev.filters.filter((_, i) => i !== index)
    }));
  };

  const exportReport = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      setLoading(true);
      
      // Generate full dataset for export
      await generateReport();
      
      if (format === 'csv') {
        exportToCSV();
      } else if (format === 'pdf') {
        exportToPDF();
      } else if (format === 'excel') {
        exportToExcel();
      }
      
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = reportConfig.columns
      .filter(col => col.visible)
      .map(col => col.label);
    
    const rows = previewData.map(row => 
      reportConfig.columns
        .filter(col => col.visible)
        .map(col => row[col.field])
    );
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => 
        typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
      ).join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportConfig.name.replace(/\s+/g, '_').toLowerCase()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Mock PDF export - in real app would use jsPDF or similar
    alert('PDF export would be implemented with jsPDF library');
  };

  const exportToExcel = () => {
    // Mock Excel export - in real app would use xlsx library
    alert('Excel export would be implemented with xlsx library');
  };

  const saveReport = async () => {
    try {
      setLoading(true);
      
      const reportData = {
        ...reportConfig,
        organization_id: organization?.id,
        created_at: new Date().toISOString()
      };
      
      // In a real app, would save to database
      console.log('Saving report:', reportData);
      
      onSave(reportConfig);
      onClose();
      
    } catch (error) {
      console.error('Error saving report:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'config':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Report Name *
              </label>
              <input
                type="text"
                value={reportConfig.name}
                onChange={(e) => setReportConfig(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="My Custom Report"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={reportConfig.description}
                onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe what this report shows..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Source *
                </label>
                <select
                  value={reportConfig.data_source}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, data_source: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {availableDataSources.map(source => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chart Type
                </label>
                <select
                  value={reportConfig.chart_type}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, chart_type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="table">Table</option>
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                  <option value="pie">Pie Chart</option>
                  <option value="area">Area Chart</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={reportConfig.date_range.start}
                  onChange={(e) => setReportConfig(prev => ({ 
                    ...prev, 
                    date_range: { ...prev.date_range, start: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={reportConfig.date_range.end}
                  onChange={(e) => setReportConfig(prev => ({ 
                    ...prev, 
                    date_range: { ...prev.date_range, end: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        );
        
      case 'fields':
        const fields = availableFields[reportConfig.data_source] || [];
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Select Fields</h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setReportConfig(prev => ({
                    ...prev,
                    columns: fields.map(field => ({ ...field, visible: true, sortable: true }))
                  }))}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setReportConfig(prev => ({
                    ...prev,
                    columns: []
                  }))}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Clear All
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {fields.map(field => {
                const isSelected = reportConfig.columns.some(col => col.field === field.field);
                return (
                  <label key={field.field} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setReportConfig(prev => ({
                            ...prev,
                            columns: [...prev.columns, { ...field, visible: true, sortable: true }]
                          }));
                        } else {
                          setReportConfig(prev => ({
                            ...prev,
                            columns: prev.columns.filter(col => col.field !== field.field)
                          }));
                        }
                      }}
                      className="mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{field.label}</div>
                      <div className="text-sm text-gray-500">{field.type} • {field.field}</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        );
        
      case 'filters':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Report Filters</h3>
              <button
                type="button"
                onClick={addFilter}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Filter className="w-4 h-4" />
                Add Filter
              </button>
            </div>
            
            <div className="space-y-3">
              {reportConfig.filters.map((filter, index) => {
                const fields = availableFields[reportConfig.data_source] || [];
                const selectedField = fields.find(f => f.field === filter.field);
                
                return (
                  <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-lg">
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Field</label>
                      <select
                        value={filter.field}
                        onChange={(e) => {
                          const field = fields.find(f => f.field === e.target.value);
                          updateFilter(index, { 
                            field: e.target.value, 
                            label: field?.label || e.target.value 
                          });
                        }}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {fields.map(field => (
                          <option key={field.field} value={field.field}>
                            {field.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-span-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Operator</label>
                      <select
                        value={filter.operator}
                        onChange={(e) => updateFilter(index, { operator: e.target.value as any })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="equals">Equals</option>
                        <option value="not_equals">Not Equals</option>
                        <option value="greater_than">Greater Than</option>
                        <option value="less_than">Less Than</option>
                        <option value="contains">Contains</option>
                      </select>
                    </div>
                    
                    <div className="col-span-4">
                      <label className="block text-xs font-medium text-gray-700 mb-1">Value</label>
                      <input
                        type={selectedField?.type === 'number' ? 'number' : 
                              selectedField?.type === 'date' ? 'date' : 'text'}
                        value={filter.value}
                        onChange={(e) => updateFilter(index, { value: e.target.value })}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Enter value..."
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={() => removeFilter(index)}
                        className="w-full px-2 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {reportConfig.filters.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No filters added. Click "Add Filter" to filter your data.
              </div>
            )}
          </div>
        );
        
      case 'preview':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Report Preview</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={generateReport}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  {loading ? 'Generating...' : 'Run Report'}
                </button>
                <div className="relative">
                  <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden">
                    <button onClick={() => exportReport('csv')} className="w-full px-3 py-2 text-left hover:bg-gray-50">CSV</button>
                    <button onClick={() => exportReport('pdf')} className="w-full px-3 py-2 text-left hover:bg-gray-50">PDF</button>
                    <button onClick={() => exportReport('excel')} className="w-full px-3 py-2 text-left hover:bg-gray-50">Excel</button>
                  </div>
                </div>
              </div>
            </div>
            
            {previewData.length > 0 ? (
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {reportConfig.columns.filter(col => col.visible).map(column => (
                        <th key={column.field} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {previewData.slice(0, 10).map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {reportConfig.columns.filter(col => col.visible).map(column => (
                          <td key={column.field} className="px-4 py-2 text-sm text-gray-900">
                            {typeof row[column.field] === 'object' 
                              ? JSON.stringify(row[column.field]) 
                              : String(row[column.field] || '')
                            }
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Click "Run Report" to generate preview data
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  if (!hasPermission('analytics.read')) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Access Denied">
        <div className="text-center py-6">
          <FileText className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-500">You don't have permission to create reports</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Builder" size="xl">
      <div className="space-y-6">
        {/* Step Navigation */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <div className="flex space-x-8">
            {[
              { key: 'config', label: 'Configuration', icon: Settings },
              { key: 'fields', label: 'Fields', icon: Columns },
              { key: 'filters', label: 'Filters', icon: Filter },
              { key: 'preview', label: 'Preview', icon: BarChart3 }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCurrentStep(key as any)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  currentStep === key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-96">
          {renderStepContent()}
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          
          <div className="flex space-x-3">
            {currentStep !== 'config' && (
              <button
                onClick={() => {
                  const steps = ['config', 'fields', 'filters', 'preview'];
                  const currentIndex = steps.indexOf(currentStep);
                  if (currentIndex > 0) {
                    setCurrentStep(steps[currentIndex - 1] as any);
                  }
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            
            {currentStep !== 'preview' ? (
              <button
                onClick={() => {
                  const steps = ['config', 'fields', 'filters', 'preview'];
                  const currentIndex = steps.indexOf(currentStep);
                  if (currentIndex < steps.length - 1) {
                    setCurrentStep(steps[currentIndex + 1] as any);
                  }
                }}
                disabled={currentStep === 'config' && !reportConfig.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            ) : (
              <button
                onClick={saveReport}
                disabled={loading || !reportConfig.name}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Report'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};