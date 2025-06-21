import React from 'react'
import ReactDOM from 'react-dom/client'
import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals'
import './index.css'
import App from './App.tsx'

// Report web vitals for performance monitoring
const reportWebVitalsCallback = (metric) => {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log(metric);
  }
  
  // In production, send to analytics endpoint
  if (process.env.NODE_ENV === 'production' && import.meta.env.VITE_PERFORMANCE_MONITORING === 'true') {
    // Send to analytics endpoint - would implement actual reporting in production
    const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
    if (analyticsEndpoint) {
      const data = {
        name: metric.name,
        value: metric.value,
        id: metric.id,
        timestamp: Date.now(),
      };
      
      try {
        // Use Navigator.sendBeacon for better reliability during page unload
        if (navigator.sendBeacon) {
          navigator.sendBeacon(analyticsEndpoint, JSON.stringify(data));
        } else {
          fetch(analyticsEndpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            keepalive: true,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
      } catch (e) {
        console.error('Failed to send web vitals:', e);
      }
    }
  }
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Measure and report web vitals
// Custom function to report all web vitals
function reportWebVitals(onPerfEntry: any) {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getLCP(onPerfEntry);
    getFCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
}

reportWebVitals(reportWebVitalsCallback);