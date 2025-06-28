import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2, XCircle, Loader2, AlertTriangle, RefreshCw } from "lucide-react";
import { checkConnection } from '@/integrations/supabase/client';

export function StatusBanner() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [visible, setVisible] = useState(true);

  const checkConnectionStatus = async () => {
    setStatus('checking');
    setError(null);
    
    try {
      const result = await checkConnection();
      
      if (result.connected) {
        setStatus('connected');
        console.log('StatusBanner: Connection successful');
      } else {
        setStatus('disconnected');
        setError(result.error || 'Could not connect to the database');
        console.error('StatusBanner: Connection failed:', result.error);
      }
    } catch (err) {
      console.error('StatusBanner: Error checking connection:', err);
      setStatus('disconnected');
      setError('Unexpected error checking connection');
    }
  };

  useEffect(() => {
    checkConnectionStatus();
    
    // Hide the banner after 8 seconds if connected
    let timeoutId: number;
    if (status === 'connected') {
      timeoutId = window.setTimeout(() => {
        setVisible(false);
      }, 8000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!visible) return null;

  return (
    <Alert 
      className={`
        fixed top-16 left-1/2 transform -translate-x-1/2 w-auto max-w-md z-50 shadow-lg
        ${status === 'connected' ? 'bg-green-50 border-green-300 text-green-800' : 
          status === 'disconnected' ? 'bg-red-50 border-red-300 text-red-800' :
          'bg-blue-50 border-blue-300 text-blue-800'
        }
      `}
    >
      {status === 'checking' ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <AlertTitle>Checking Connection</AlertTitle>
          <AlertDescription>
            Verifying connection to Supabase...
          </AlertDescription>
        </>
      ) : status === 'connected' ? (
        <>
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <AlertTitle>Connected</AlertTitle>
          <AlertDescription className="flex flex-col gap-1">
            <span>Successfully connected to Supabase</span>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 self-end text-green-700 border-green-300 hover:bg-green-100 hover:text-green-800"
              onClick={() => setVisible(false)}
            >
              Dismiss
            </Button>
          </AlertDescription>
        </>
      ) : (
        <>
          <XCircle className="h-5 w-5 text-red-500" />
          <AlertTitle>Connection Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-1">
            <span>Failed to connect to Supabase:</span>
            <div className="text-xs bg-red-100 p-2 rounded mt-1 break-all">{error}</div>
            <div className="mt-1 text-xs">
              Check your .env file and make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set correctly.
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-700 border-red-300 hover:bg-red-100 hover:text-red-800"
                onClick={checkConnectionStatus}
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Retry
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-red-700 border-red-300 hover:bg-red-100 hover:text-red-800"
                onClick={() => setVisible(false)}
              >
                Dismiss
              </Button>
            </div>
          </AlertDescription>
        </>
      )}
    </Alert>
  );
}