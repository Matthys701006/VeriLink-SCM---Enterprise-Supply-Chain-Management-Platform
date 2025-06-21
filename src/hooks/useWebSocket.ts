import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

interface UseWebSocketOptions {
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = (
  url: string, 
  options: UseWebSocketOptions = {}
) => {
  const { user } = useAuth();
  const {
    reconnectInterval = 3000,
    maxReconnectAttempts = 5,
    onConnect,
    onDisconnect,
    onError
  } = options;

  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);

  const connect = useCallback(() => {
    if (!user || ws.current?.readyState === WebSocket.OPEN) return;

    try {
      setConnectionStatus('connecting');
      
      // Include auth token in connection
      const wsUrl = `${url}?token=${user.access_token}`;
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        setConnectionStatus('connected');
        reconnectAttemptsRef.current = 0;
        onConnect?.();
      };

      ws.current.onclose = () => {
        setConnectionStatus('disconnected');
        onDisconnect?.();
        
        // Auto-reconnect if not manually closed
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (error) => {
        setConnectionStatus('error');
        onError?.(error);
      };

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

    } catch (error) {
      setConnectionStatus('error');
      console.error('WebSocket connection error:', error);
    }
  }, [url, user, maxReconnectAttempts, reconnectInterval, onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    
    setConnectionStatus('disconnected');
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        ...message,
        timestamp: new Date().toISOString()
      }));
      return true;
    }
    return false;
  }, []);

  // Subscribe to specific message types
  const subscribe = useCallback((
    messageType: string, 
    callback: (data: any) => void
  ) => {
    const handleMessage = (message: WebSocketMessage | null) => {
      if (message && message.type === messageType) {
        callback(message.data);
      }
    };

    // Return unsubscribe function
    return () => {
      // In a real implementation, you'd manage subscriptions properly
    };
  }, [lastMessage]);

  useEffect(() => {
    if (user) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [user, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      disconnect();
    };
  }, [disconnect]);

  return {
    connectionStatus,
    lastMessage,
    sendMessage,
    subscribe,
    connect,
    disconnect
  };
};

// Inventory-specific WebSocket hook
export const useInventoryWebSocket = () => {
  const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8080'}/inventory`;
  
  const { lastMessage, subscribe, connectionStatus } = useWebSocket(wsUrl, {
    onConnect: () => console.log('Connected to inventory WebSocket'),
    onDisconnect: () => console.log('Disconnected from inventory WebSocket'),
    onError: (error) => console.error('Inventory WebSocket error:', error)
  });

  const subscribeToInventoryUpdates = useCallback((callback: (update: any) => void) => {
    return subscribe('inventory_update', callback);
  }, [subscribe]);

  const subscribeToLowStockAlerts = useCallback((callback: (alert: any) => void) => {
    return subscribe('low_stock_alert', callback);
  }, [subscribe]);

  const subscribeToMovementEvents = useCallback((callback: (movement: any) => void) => {
    return subscribe('inventory_movement', callback);
  }, [subscribe]);

  return {
    connectionStatus,
    lastMessage,
    subscribeToInventoryUpdates,
    subscribeToLowStockAlerts,
    subscribeToMovementEvents
  };
};

// Real-time notifications hook
export const useNotificationWebSocket = () => {
  const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8080'}/notifications`;
  
  const { lastMessage, subscribe, connectionStatus } = useWebSocket(wsUrl);

  const subscribeToNotifications = useCallback((callback: (notification: any) => void) => {
    return subscribe('notification', callback);
  }, [subscribe]);

  return {
    connectionStatus,
    lastMessage,
    subscribeToNotifications
  };
};