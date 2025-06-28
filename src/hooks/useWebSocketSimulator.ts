import { useState, useEffect, useCallback } from 'react'

interface WebSocketOptions {
  simulateUpdates?: boolean
  updateInterval?: number
  connectionDelay?: number
}

interface WebSocketUpdate {
  item_id: string
  changes: Record<string, any>
  timestamp: string
}

/**
 * A hook that simulates WebSocket behavior for real-time updates
 * This is used when actual WebSockets aren't available
 */
export function useWebSocketSimulator(
  options: WebSocketOptions = {}
) {
  const {
    simulateUpdates = true,
    updateInterval = 10000, // 10 seconds
    connectionDelay = 1500, // 1.5 seconds
  } = options

  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')
  const [updateCount, setUpdateCount] = useState(0)

  // Simulate connection establishment
  useEffect(() => {
    const timer = setTimeout(() => {
      setConnectionStatus('connected')
    }, connectionDelay)
    
    return () => clearTimeout(timer)
  }, [connectionDelay])

  // Function to subscribe to inventory updates
  const subscribeToInventoryUpdates = useCallback((callback: (update: WebSocketUpdate) => void) => {
    if (!simulateUpdates) return () => {}
    
    // Mock list of item IDs that might change
    const mockItemIds = [
      'item-1', 'item-2', 'item-3', 'item-4', 'item-5',
      'item-6', 'item-7', 'item-8', 'item-9', 'item-10'
    ]
    
    // Simulate periodic updates
    const intervalId = setInterval(() => {
      // Only send updates if connected
      if (connectionStatus === 'connected') {
        // 30% chance of an update
        if (Math.random() < 0.3) {
          const randomItem = mockItemIds[Math.floor(Math.random() * mockItemIds.length)]
          
          // Generate a random update
          const update: WebSocketUpdate = {
            item_id: randomItem,
            changes: {
              on_hand: Math.floor(Math.random() * 100),
              reserved: Math.floor(Math.random() * 20),
              status: Math.random() < 0.2 ? 'low_stock' : 'available'
            },
            timestamp: new Date().toISOString()
          }
          
          // Call the callback with the update
          callback(update)
          
          // Update the count
          setUpdateCount(prev => prev + 1)
        }
      }
    }, updateInterval)
    
    // Return unsubscribe function
    return () => clearInterval(intervalId)
  }, [connectionStatus, simulateUpdates, updateInterval])

  return {
    connectionStatus,
    updateCount,
    subscribeToInventoryUpdates
  }
}

// Alias for backward compatibility with the referenced hook
export const useInventoryWebSocket = useWebSocketSimulator