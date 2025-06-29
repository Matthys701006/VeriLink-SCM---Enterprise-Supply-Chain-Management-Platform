import { useEffect, useState } from 'react';
import { checkConnection } from '@/integrations/supabase/client';

export function useSupabaseInit() {
  const [isReady, setIsReady] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
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