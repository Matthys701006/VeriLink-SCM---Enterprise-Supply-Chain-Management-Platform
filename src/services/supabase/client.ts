import { createClient } from '@supabase/supabase-js';
import { usePerformance } from '../../contexts/PerformanceContext';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

// Create client with performance monitoring
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (...args) => {
      // Record start time for performance tracking
      const startTime = performance.now();
      
      // Make the request
      return fetch(...args).then(response => {
        // Calculate duration
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        // Get the endpoint from the URL
        const url = args[0] as string;
        const endpoint = url.replace(supabaseUrl, '').split('?')[0];
        
        // Log performance data
        // In components this would use usePerformance().recordApiCall
        if (duration > 300) {
          console.warn(`Supabase API call to ${endpoint} took ${duration}ms`);
        }
        
        return response;
      });
    }
  },
  realtime: {
    timeout: 10000,
    params: {
      eventsPerSecond: 10
    }
  }
});