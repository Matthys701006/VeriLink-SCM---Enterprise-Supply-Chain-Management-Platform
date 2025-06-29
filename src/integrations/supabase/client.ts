// This file handles the Supabase client setup
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Initializing Supabase client with URL:', supabaseUrl ? 'Set' : 'Not set');

// Create a single instance of the Supabase client
export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || '',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  }
);

// Export a helper to check connection
export const checkConnection = async () => {
  try {
    console.log('Testing connection to Supabase...');

    // Check basic connection first
    if (!supabaseUrl || !supabaseAnonKey) {
      return { 
        connected: false, 
        error: 'Missing Supabase URL or API key. Please connect to Supabase using the button in the UI.' 
      };
    }
    
    // Try version first, then fall back to a simple query
    try {
      const { data, error } = await supabase.rpc('version');
      
      if (error) {
        console.error('Supabase RPC error:', error);
        // Fall through to try another method
      } else {
        console.log('Successfully connected to Supabase:', data);
        return { connected: true, data };
      }
    } catch (rpcError) {
      console.warn('RPC method may not be available yet, trying a simple query');
    }
    
    // Fallback to a simple query
    const { data, error } = await supabase.from('profiles').select('count');
    
    if (error && !error.message.includes('does not exist')) {
      // Only treat as error if it's not just missing tables
      console.error('Supabase query error:', error);
      return { connected: false, error: error.message };
    }
    
    console.log('Successfully connected to Supabase');
    return { connected: true, data: 'Connected successfully' };
    
  } catch (err) {
    console.error('Unexpected error testing Supabase connection:', err);
    return { 
      connected: false, 
      error: err instanceof Error ? err.message : 'Unknown error connecting to Supabase'
    };
  }
};

// Run initial connection check on load
checkConnection().then(result => {
  if (!result.connected) {
    console.warn('⚠️ Initial Supabase connection check failed:', result.error);
    console.log('Please connect to Supabase using the button in the UI');
  } else {
    console.log('✅ Initial Supabase connection successful');
  }
}).catch(err => {
  console.error('Error in initial connection check:', err);
});