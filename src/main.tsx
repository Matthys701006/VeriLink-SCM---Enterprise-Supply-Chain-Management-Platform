import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log('main.tsx is executing')

// Report web vitals for performance monitoring - only in browser environment
const reportWebVitalsCallback = (metric: any) => {
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

console.log('Creating root element and rendering App')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

console.log('App has been rendered to the DOM')

// Only load and execute web-vitals in browser environment
if (typeof window !== 'undefined') {
  // Dynamic import to avoid loading during server-side execution
  import('web-vitals').then((webVitals) => {
    // Custom function to report all web vitals
    function reportWebVitals(onPerfEntry: any) {
      if (onPerfEntry && typeof onPerfEntry === 'function') {
        webVitals.getCLS(onPerfEntry);
        webVitals.getFID(onPerfEntry);
        webVitals.getLCP(onPerfEntry);
        webVitals.getFCP(onPerfEntry);
        webVitals.getTTFB(onPerfEntry);
      }
    }

    reportWebVitals(reportWebVitalsCallback);
  }).catch((error) => {
    console.warn('Failed to load web-vitals:', error);
  });
}

// Verify the root element exists
console.log('Root element:', document.getElementById('root'))