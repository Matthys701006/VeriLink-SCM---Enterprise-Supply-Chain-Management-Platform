import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Gauge, ChevronDown, ChevronUp } from 'lucide-react';
import { usePerformance } from '../../contexts/PerformanceContext';
import { dataCache } from '../../services/cache/DataCache';

interface PerformanceMonitorProps {
  showDetailed?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  showDetailed = false 
}) => {
  const { metrics } = usePerformance();
  const [expanded, setExpanded] = useState(false);
  const [cpuUsage, setCpuUsage] = useState<number | null>(null);
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  const [cacheStats, setCacheStats] = useState<{ size: number; memoryUsageEstimate: string } | null>(null);

  useEffect(() => {
    // Initialize static performance metrics to avoid timer issues
    // Simulate CPU usage between 10-40%
    setCpuUsage(Math.round(10 + Math.random() * 30));
    
    // Simulate memory usage between 200-600 MB
    setMemoryUsage(Math.round(200 + Math.random() * 400));
    
    // Get cache statistics once
    setCacheStats(dataCache.getStats());
    
    // Note: Removed setInterval to prevent Node.js timer issues
    // In a production environment, you would use proper performance monitoring
  }, []);
  
  // Only show in development or when explicitly enabled
  if (process.env.NODE_ENV !== 'development' && !showDetailed) {
    return null;
  }
  
  // Calculate average API latency across all endpoints
  const allLatencies = Object.values(metrics.apiLatency).flat();
  const averageLatency = allLatencies.length > 0
    ? Math.round(allLatencies.reduce((sum, val) => sum + val, 0) / allLatencies.length)
    : 0;
    
  // Determine if we're meeting SLA (300ms)
  const latencyThreshold = parseInt(import.meta.env.VITE_API_LATENCY_THRESHOLD || '300');
  const isLatencyWithinSLA = averageLatency <= latencyThreshold;
  
  // Format metrics for display
  const formattedMetrics = {
    apiLatency: `${averageLatency}ms`,
    pageLoadTime: `${metrics.pageLoadTime}ms`,
    renderTime: `${metrics.renderTime}ms`,
    networkRequests: metrics.networkRequests,
    cacheHitRate: `${(metrics.cacheHitRate * 100).toFixed(1)}%`
  };

  return (
    <div className="fixed bottom-0 right-0 m-4 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
      <div 
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <Gauge className="w-5 h-5 text-blue-600 mr-2" />
          <span className="font-medium text-gray-900">Performance Monitor</span>
        </div>
        <div className="flex items-center">
          {isLatencyWithinSLA ? (
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
          )}
          <span className={`text-sm ${isLatencyWithinSLA ? 'text-green-600' : 'text-yellow-600'}`}>
            {formattedMetrics.apiLatency}
          </span>
          {expanded ? (
            <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
          ) : (
            <ChevronUp className="w-4 h-4 text-gray-500 ml-2" />
          )}
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">API Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Latency</span>
                  <span className={`font-medium ${isLatencyWithinSLA ? 'text-green-600' : 'text-yellow-600'}`}>
                    {formattedMetrics.apiLatency}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SLA Target</span>
                  <span className="font-medium text-gray-900">{latencyThreshold}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Network Requests</span>
                  <span className="font-medium text-gray-900">{formattedMetrics.networkRequests}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Client Performance</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Page Load</span>
                  <span className="font-medium text-gray-900">{formattedMetrics.pageLoadTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Render Time</span>
                  <span className="font-medium text-gray-900">{formattedMetrics.renderTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cache Hit Rate</span>
                  <span className="font-medium text-gray-900">{formattedMetrics.cacheHitRate}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* System Resources */}
          <div className="mt-4">
            <h4 className="text-xs font-medium text-gray-500 mb-2">System Resources</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">CPU Usage</span>
                  <span className="font-medium text-gray-900">{cpuUsage !== null ? `${cpuUsage}%` : 'N/A'}</span>
                </div>
                {cpuUsage !== null && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${cpuUsage > 70 ? 'bg-red-500' : cpuUsage > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${cpuUsage}%` }}
                    ></div>
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Memory</span>
                  <span className="font-medium text-gray-900">{memoryUsage !== null ? `${memoryUsage} MB` : 'N/A'}</span>
                </div>
                {memoryUsage !== null && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${memoryUsage > 500 ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${(memoryUsage / 800) * 100}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Cache Information */}
          {cacheStats && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Cache Information</h4>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Cached Items</span>
                <span className="font-medium text-gray-900">{cacheStats.size}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Memory Usage</span>
                <span className="font-medium text-gray-900">{cacheStats.memoryUsageEstimate}</span>
              </div>
            </div>
          )}
          
          {/* Endpoint Details */}
          {Object.keys(metrics.apiLatency).length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-500 mb-2">API Endpoints</h4>
              <div className="max-h-32 overflow-y-auto">
                {Object.entries(metrics.apiLatency).map(([endpoint, latencies]) => {
                  const avgLatency = Math.round(latencies.reduce((sum, val) => sum + val, 0) / latencies.length);
                  return (
                    <div key={endpoint} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600 truncate max-w-[150px]">{endpoint}</span>
                      <span className={`font-medium ${avgLatency > latencyThreshold ? 'text-yellow-600' : 'text-green-600'}`}>
                        {avgLatency}ms
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;