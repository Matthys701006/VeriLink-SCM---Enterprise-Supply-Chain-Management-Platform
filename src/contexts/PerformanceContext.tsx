import React, { createContext, useContext, useEffect, useState } from 'react';

interface PerformanceMetrics {
  apiLatency: Record<string, number[]>;
  pageLoadTime: number;
  renderTime: number;
  networkRequests: number;
  cacheHitRate: number;
}

interface PerformanceContextType {
  metrics: PerformanceMetrics;
  recordApiCall: (endpoint: string, duration: number) => void;
  recordPageLoad: (duration: number) => void;
  recordRender: (duration: number) => void;
  recordNetworkRequest: () => void;
  recordCacheHit: (hit: boolean) => void;
  clearMetrics: () => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    apiLatency: {},
    pageLoadTime: 0,
    renderTime: 0,
    networkRequests: 0,
    cacheHitRate: 0
  });

  const [cacheHits, setCacheHits] = useState(0);
  const [cacheMisses, setCacheMisses] = useState(0);

  // Measure initial page load time
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Use Performance API to get accurate load time
      const pageLoadTime = 
        window.performance.timing.loadEventEnd - 
        window.performance.timing.navigationStart;
      
      setMetrics(prev => ({
        ...prev,
        pageLoadTime: pageLoadTime > 0 ? pageLoadTime : 0
      }));

      // Setup observer for long tasks
      if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.log(`Long task detected: ${entry.duration}ms`);
            // Log to monitoring system in production
          }
        });
        
        observer.observe({ entryTypes: ['longtask'] });
        
        return () => observer.disconnect();
      }
    }
  }, []);

  const recordApiCall = (endpoint: string, duration: number) => {
    setMetrics(prev => {
      const updatedLatencies = { ...prev.apiLatency };
      if (!updatedLatencies[endpoint]) {
        updatedLatencies[endpoint] = [];
      }
      
      // Keep last 50 measurements
      const latencies = [...updatedLatencies[endpoint], duration].slice(-50);
      updatedLatencies[endpoint] = latencies;
      
      // In production, you would send this to monitoring service
      if (duration > 300) {
        console.warn(`API call to ${endpoint} exceeded latency threshold: ${duration}ms`);
      }
      
      return {
        ...prev,
        apiLatency: updatedLatencies
      };
    });
  };

  const recordPageLoad = (duration: number) => {
    setMetrics(prev => ({
      ...prev,
      pageLoadTime: duration
    }));
    
    // Log to monitoring system if exceeds threshold
    if (duration > 1500) {
      console.warn(`Page load time exceeded threshold: ${duration}ms`);
    }
  };

  const recordRender = (duration: number) => {
    setMetrics(prev => ({
      ...prev,
      renderTime: duration
    }));
  };

  const recordNetworkRequest = () => {
    setMetrics(prev => ({
      ...prev,
      networkRequests: prev.networkRequests + 1
    }));
  };

  const recordCacheHit = (hit: boolean) => {
    if (hit) {
      setCacheHits(prev => prev + 1);
    } else {
      setCacheMisses(prev => prev + 1);
    }
    
    const hitRate = cacheHits / (cacheHits + cacheMisses);
    setMetrics(prev => ({
      ...prev,
      cacheHitRate: hitRate
    }));
  };

  const clearMetrics = () => {
    setMetrics({
      apiLatency: {},
      pageLoadTime: 0,
      renderTime: 0,
      networkRequests: 0,
      cacheHitRate: 0
    });
    setCacheHits(0);
    setCacheMisses(0);
  };

  return (
    <PerformanceContext.Provider
      value={{
        metrics,
        recordApiCall,
        recordPageLoad,
        recordRender,
        recordNetworkRequest,
        recordCacheHit,
        clearMetrics
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};