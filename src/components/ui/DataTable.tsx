import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, Download } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  searchable?: boolean;
  filterable?: boolean;
  exportable?: boolean;
  onRowClick?: (row: any) => void;
  className?: string;
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  searchable = true,
  filterable = true,
  exportable = true,
  onRowClick,
  className = ''
}) => {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return columns.some(column => {
      const value = row[column.key];
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleExport = () => {
    const csvContent = [
      columns.map(col => col.label).join(','),
      ...sortedData.map(row => 
        columns.map(col => {
          const value = row[col.key];
          return typeof value === 'string' && value.includes(',') 
            ? `"${value}"` 
            : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
      {/* Header Controls */}
      {(searchable || filterable || exportable) && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              {searchable && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  />
                </div>
              )}
              {filterable && (
                <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              )}
            </div>
            {exportable && (
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-1">
                    {column.label}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`w-3 h-3 ${
                            sortColumn === column.key && sortDirection === 'asc' 
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`} 
                        />
                        <ChevronDown 
                          className={`w-3 h-3 -mt-1 ${
                            sortColumn === column.key && sortDirection === 'desc' 
                              ? 'text-blue-600' 
                              : 'text-gray-400'
                          }`} 
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`hover:bg-gray-50 ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-blue-600 text-white rounded">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* No Data State */}
      {paginatedData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No data found</p>
        </div>
      )}
    </div>
  );
};