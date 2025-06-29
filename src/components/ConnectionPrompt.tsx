import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Database, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { checkConnection } from '@/integrations/supabase/client';

interface ConnectionPromptProps {
  onConnect: (url: string, key: string) => void;
  isOpen: boolean;
}

export function ConnectionPrompt({ onConnect, isOpen }: ConnectionPromptProps) {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleConnect = async () => {
    if (!url.trim() || !key.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both the Supabase URL and anon key",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);

    try {
      // Save to localStorage first for immediate use
      localStorage.setItem('supabase-url', url);
      localStorage.setItem('supabase-key', key);

      // Update the .env variables and reload
      onConnect(url, key);

      toast({
        title: "Connection Saved",
        description: "Supabase connection details have been saved.",
      });
    } catch (error) {
      console.error('Error saving connection:', error);
      toast({
        title: "Error",
        description: "Failed to save connection details",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Connect to Supabase
          </CardTitle>
          <CardDescription>
            Enter your Supabase project URL and anon key to connect
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Supabase URL</Label>
            <Input
              id="url"
              placeholder="https://your-project.supabase.co"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Find this in your Supabase project dashboard under Project Settings > API
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="key">Supabase Anon Key</Label>
            <Input
              id="key"
              placeholder="eyJ0eXAiOi..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Find this in your Supabase project dashboard under Project Settings > API > Project API keys
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleConnect}
            disabled={isConnecting}
            className="flex items-center gap-2"
          >
            {isConnecting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <Key className="h-4 w-4" />
                <span>Connect</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}