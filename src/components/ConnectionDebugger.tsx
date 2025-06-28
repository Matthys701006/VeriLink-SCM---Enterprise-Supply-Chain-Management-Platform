import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, XCircle, RefreshCw, Database, Key } from "lucide-react";
import { checkConnection, supabase } from '@/integrations/supabase/client';

export function ConnectionDebugger() {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'success' | 'error'>('unknown');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dbVersion, setDbVersion] = useState<string | null>(null);
  
  const url = import.meta.env.VITE_SUPABASE_URL || 'Not set';
  const keyProvided = !!import.meta.env.VITE_SUPABASE_ANON_KEY;

  const testConnection = async () => {
    setIsChecking(true);
    setErrorMessage(null);
    
    try {
      const result = await checkConnection();
      
      if (result.connected) {
        setConnectionStatus('success');
        setDbVersion(typeof result.data === 'string' ? result.data : 'Connected');
      } else {
        setConnectionStatus('error');
        setErrorMessage(result.error || 'Unknown error');
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsChecking(false);
    }
  };

  // Test direct sign-up to see if auth is working
  const testSignUp = async () => {
    setIsChecking(true);
    setErrorMessage(null);
    
    try {
      const testEmail = `test${Date.now()}@example.com`;
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'password123!',
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      });
      
      if (error) {
        setConnectionStatus('error');
        setErrorMessage(`Auth error: ${error.message}`);
      } else {
        setConnectionStatus('success');
        setDbVersion(`Auth working! User ${testEmail} created (won't be confirmed)`);
      }
    } catch (error) {
      setConnectionStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 bg-white shadow-md hover:bg-gray-100"
          onClick={() => setIsOpen(true)}
        >
          <Database className="h-3.5 w-3.5 text-gray-500" />
          <span>Debug Connection</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Supabase Connection Debugger</span>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>×</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-sm">
                <Database className="h-4 w-4 text-gray-500" />
                <span>URL:</span>
              </div>
              <div>
                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                  {url.length > 30 ? `${url.substring(0, 30)}...` : url}
                </code>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 text-sm">
                <Key className="h-4 w-4 text-gray-500" />
                <span>API Key:</span>
              </div>
              <Badge variant={keyProvided ? "default" : "destructive"}>
                {keyProvided ? "Provided" : "Missing"}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm">Connection Status:</span>
              {isChecking ? (
                <div className="flex items-center gap-1.5">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                  <span className="text-sm">Checking...</span>
                </div>
              ) : connectionStatus === 'unknown' ? (
                <Badge variant="outline">Not Tested</Badge>
              ) : connectionStatus === 'success' ? (
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Connected</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">Failed</span>
                </div>
              )}
            </div>
          </div>
          
          {connectionStatus === 'success' && dbVersion && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <AlertDescription>
                {dbVersion}
              </AlertDescription>
            </Alert>
          )}
          
          {connectionStatus === 'error' && errorMessage && (
            <Alert className="bg-red-50 text-red-800 border-red-200">
              <AlertDescription>
                <div className="font-medium">Connection Error:</div>
                <div className="text-xs mt-1 bg-white/50 p-1.5 rounded overflow-auto">
                  {errorMessage}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testConnection}
              disabled={isChecking}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
              Test Connection
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={testSignUp}
              disabled={isChecking}
            >
              Test Auth
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsOpen(false)}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  );
}