import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.');
}

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: fetch.bind(globalThis)
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Export a helper to check connection
export const checkConnection = async () => {
  try {
    const { data, error } = await supabase.from('organizations').select('id').limit(1);
    
    if (error) {
      console.error('Supabase connection test error:', error);
      return { connected: false, error: error.message };
    }
    
    return { connected: true, data };
  } catch (err) {
    console.error('Unexpected error testing Supabase connection:', err);
    return { connected: false, error: err.message };
  }
};