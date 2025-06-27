
interface SystemHealth {
  responseTime: number
  memoryUsage: number
  cpuUsage: number
  uptime: number
}

class MonitoringService {
  getSystemHealth(): SystemHealth {
    return {
      responseTime: Math.floor(Math.random() * 100) + 50, // Simulated 50-150ms
      memoryUsage: Math.floor(Math.random() * 30) + 40, // Simulated 40-70%
      cpuUsage: Math.floor(Math.random() * 20) + 10, // Simulated 10-30%
      uptime: Date.now() - (Math.random() * 86400000) // Random uptime up to 24h
    }
  }

  logEvent(event: string, data?: any) {
    console.log(`[Monitoring] ${event}:`, data)
  }

  logError(error: string, details?: any) {
    console.error(`[Monitoring] Error - ${error}:`, details)
  }

  trackPerformance(operation: string, duration: number) {
    console.log(`[Performance] ${operation}: ${duration}ms`)
  }
}

export const monitoringService = new MonitoringService()
