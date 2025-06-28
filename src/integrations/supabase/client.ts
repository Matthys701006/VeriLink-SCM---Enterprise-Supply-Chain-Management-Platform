import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key exists:', !!supabaseAnonKey);

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!', { 
    url: supabaseUrl,
    keyExists: !!supabaseAnonKey
  });
}

// Create a single instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export a helper to check connection
export const checkConnection = async () => {
  try {
    console.log('Testing connection to Supabase...');
    // Use a more basic query that doesn't depend on application tables
    const { data, error } = await supabase.rpc('version');
    
    if (error) {
      console.error('Supabase connection test error:', error);
      return { connected: false, error: error.message };
    }
    
    console.log('Successfully connected to Supabase');
    return { connected: true, data };
  } catch (err) {
    console.error('Unexpected error testing Supabase connection:', err);
    return { connected: false, error: err?.message || 'Unknown error' };
  }
};

// Log connection status on load
checkConnection().then(status => {
  console.log('Initial connection check:', status);
});