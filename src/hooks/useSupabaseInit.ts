import { useEffect, useState } from 'react';
import { checkConnection } from '@/integrations/supabase/client';

export function useSupabaseInit() {
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Check if we have stored credentials from a manual connection
    const storedUrl = localStorage.getItem('supabase-url');
    const storedKey = localStorage.getItem('supabase-key');
    
    if (storedUrl && storedKey) {
      // Apply stored credentials to the page if they exist
      console.log('Found stored Supabase credentials, applying them');
      
      // Inject the values into process.env
      if (import.meta && import.meta.env) {
        // @ts-ignore - This is a hack to set environment variables at runtime
        import.meta.env.VITE_SUPABASE_URL = storedUrl;
        // @ts-ignore
        import.meta.env.VITE_SUPABASE_ANON_KEY = storedKey;
      }
    }
    
    // Now check connection
    const init = async () => {
      try {
        const result = await checkConnection();
        setIsConnected(result.connected);
        setError(result.connected ? null : (result.error || 'Unknown connection error'));
      } catch (err) {
        setIsConnected(false);
        setError(err instanceof Error ? err.message : 'Unexpected error initializing Supabase');
      } finally {
        setIsReady(true);
      }
    };
    
    init();
  }, []);
  
  return {
    isReady,
    isConnected,
    error
  };
}