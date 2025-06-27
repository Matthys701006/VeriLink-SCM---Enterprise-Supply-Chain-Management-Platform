
import { supabase } from '@/integrations/supabase/client'

interface ScheduledTask {
  id: string
  name: string
  description: string
  cronExpression: string
  lastRun?: Date
  nextRun?: Date
  enabled: boolean
  handler: () => Promise<void>
}

class ScheduledTaskManager {
  private tasks: Map<string, ScheduledTask> = new Map()
  private intervals: Map<string, NodeJS.Timeout> = new Map()

  constructor() {
    this.initializeTasks()
  }

  private initializeTasks() {
    // Nightly data reconciliation
    this.registerTask({
      id: 'data-reconciliation',
      name: 'Data Reconciliation',
      description: 'Reconcile data between cache and database',
      cronExpression: '0 2 * * *', // 2 AM daily
      enabled: true,
      handler: this.dataReconciliation
    })

    // Cache warming
    this.registerTask({
      id: 'cache-warming',
      name: 'Cache Warming',
      description: 'Pre-populate hot dashboard data',
      cronExpression: '0 * * * *', // Every hour
      enabled: true,
      handler: this.cacheWarming
    })

    // Analytics snapshot
    this.registerTask({
      id: 'analytics-snapshot',
      name: 'Analytics Snapshot',
      description: 'Generate daily analytics snapshots',
      cronExpression: '0 3 * * *', // 3 AM daily
      enabled: true,
      handler: this.analyticsSnapshot
    })

    // Inventory status sync
    this.registerTask({
      id: 'inventory-sync',
      name: 'Inventory Status Sync',
      description: 'Sync inventory status and alerts',
      cronExpression: '*/30 * * * *', // Every 30 minutes
      enabled: true,
      handler: this.inventorySync
    })
  }

  registerTask(task: ScheduledTask) {
    this.tasks.set(task.id, task)
    if (task.enabled) {
      this.scheduleTask(task.id)
    }
  }

  private scheduleTask(taskId: string) {
    const task = this.tasks.get(taskId)
    if (!task) return

    // For browser environment, we'll simulate with intervals
    // In production, this would use proper cron scheduling
    const interval = this.cronToInterval(task.cronExpression)
    
    const timeoutId = setTimeout(async () => {
      try {
        await task.handler()
        task.lastRun = new Date()
        task.nextRun = new Date(Date.now() + interval)
        
        // Reschedule
        this.scheduleTask(taskId)
      } catch (error) {
        console.error(`Scheduled task ${task.name} failed:`, error)
      }
    }, interval)

    this.intervals.set(taskId, timeoutId)
  }

  private cronToInterval(cronExpression: string): number {
    // Simplified cron parsing for demo
    // In production, use a proper cron library
    if (cronExpression === '0 2 * * *') return 24 * 60 * 60 * 1000 // Daily
    if (cronExpression === '0 * * * *') return 60 * 60 * 1000 // Hourly
    if (cronExpression === '*/30 * * * *') return 30 * 60 * 1000 // 30 minutes
    return 60 * 60 * 1000 // Default to hourly
  }

  private dataReconciliation = async () => {
    console.log('Running data reconciliation...')
    
    // Reconcile inventory data
    const { data: inventoryItems } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('is_active', true)

    if (inventoryItems) {
      for (const item of inventoryItems) {
        // Check for data inconsistencies and fix them
        const calculatedStatus = this.calculateInventoryStatus(item)
        if (item.status !== calculatedStatus) {
          await supabase
            .from('inventory_items')
            .update({ status: calculatedStatus })
            .eq('id', item.id)
        }
      }
    }

    console.log('Data reconciliation completed')
  }

  private cacheWarming = async () => {
    console.log('Running cache warming...')
    
    // Pre-fetch dashboard metrics
    await supabase.from('inventory_items').select('unit_cost, on_hand')
    await supabase.from('purchase_orders').select('id')
    await supabase.from('shipments').select('status')
    
    console.log('Cache warming completed')
  }

  private analyticsSnapshot = async () => {
    console.log('Running analytics snapshot...')
    
    // Generate daily analytics snapshot
    const today = new Date().toISOString().split('T')[0]
    
    const metrics = {
      total_inventory_value: await this.calculateTotalInventoryValue(),
      active_purchase_orders: await this.countActivePurchaseOrders(),
      shipments_in_transit: await this.countShipmentsInTransit(),
      low_stock_alerts: await this.countLowStockItems()
    }

    await supabase.from('analytics_snapshots').insert({
      snapshot_date: today,
      snapshot_type: 'daily',
      metrics,
      organization_id: '550e8400-e29b-41d4-a716-446655440000' // Default org
    })

    console.log('Analytics snapshot completed')
  }

  private inventorySync = async () => {
    console.log('Running inventory sync...')
    
    // Check for low stock items using direct comparison instead of RPC
    const { data: lowStockItems } = await supabase
      .from('inventory_items')
      .select('id, name, on_hand, reorder_point')
      .lt('on_hand', 'reorder_point')

    if (lowStockItems?.length) {
      // Create notifications for low stock
      for (const item of lowStockItems) {
        await supabase.from('notifications').insert({
          type: 'low_stock',
          title: 'Low Stock Alert',
          message: `${item.name} is running low (${item.on_hand} remaining)`,
          recipient_id: '550e8400-e29b-41d4-a716-446655440000',
          organization_id: '550e8400-e29b-41d4-a716-446655440000'
        })
      }
    }

    console.log('Inventory sync completed')
  }

  private calculateInventoryStatus(item: any): string {
    if (item.on_hand <= 0) return 'out_of_stock'
    if (item.on_hand <= item.reorder_point) return 'low_stock'
    return 'available'
  }

  private async calculateTotalInventoryValue(): Promise<number> {
    const { data } = await supabase
      .from('inventory_items')
      .select('unit_cost, on_hand')
    
    return data?.reduce((sum, item) => sum + (item.unit_cost || 0) * (item.on_hand || 0), 0) || 0
  }

  private async countActivePurchaseOrders(): Promise<number> {
    const { count } = await supabase
      .from('purchase_orders')
      .select('id', { count: 'exact' })
      .in('status', ['pending', 'approved', 'in_progress'])
    
    return count || 0
  }

  private async countShipmentsInTransit(): Promise<number> {
    const { count } = await supabase
      .from('shipments')
      .select('id', { count: 'exact' })
      .in('status', ['in_transit', 'pending'])
    
    return count || 0
  }

  private async countLowStockItems(): Promise<number> {
    // Use direct comparison instead of RPC function
    const { count } = await supabase
      .from('inventory_items')
      .select('id', { count: 'exact' })
      .lt('on_hand', 'reorder_point')
    
    return count || 0
  }

  getTasks() {
    return Array.from(this.tasks.values())
  }

  enableTask(taskId: string) {
    const task = this.tasks.get(taskId)
    if (task) {
      task.enabled = true
      this.scheduleTask(taskId)
    }
  }

  disableTask(taskId: string) {
    const task = this.tasks.get(taskId)
    if (task) {
      task.enabled = false
      const interval = this.intervals.get(taskId)
      if (interval) {
        clearTimeout(interval)
        this.intervals.delete(taskId)
      }
    }
  }
}

export const scheduledTaskManager = new ScheduledTaskManager()
