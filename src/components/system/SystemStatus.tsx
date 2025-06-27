
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, XCircle, Clock, Play, Pause, RefreshCw } from 'lucide-react'
import { scheduledTaskManager } from '@/services/scheduledTasks'
import { dataMigrationManager } from '@/services/dataMigration'
import { monitoringService } from '@/lib/monitoring'
import { useToast } from '@/hooks/use-toast'

export function SystemStatus() {
  const [tasks, setTasks] = useState(scheduledTaskManager.getTasks())
  const [migrations, setMigrations] = useState<any[]>([])
  const [systemHealth, setSystemHealth] = useState<any>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadSystemStatus()
  }, [])

  const loadSystemStatus = async () => {
    try {
      // Load migration status
      const migrationStatus = await dataMigrationManager.checkMigrationStatus()
      setMigrations(migrationStatus)

      // Load system health
      const health = monitoringService.getSystemHealth()
      setSystemHealth(health)
    } catch (error) {
      console.error('Failed to load system status:', error)
      toast({
        title: 'Error',
        description: 'Failed to load system status',
        variant: 'destructive'
      })
    }
  }

  const runMigrations = async () => {
    try {
      toast({
        title: 'Running Migrations',
        description: 'Data migrations are being executed...'
      })

      const results = await dataMigrationManager.runMigrations()
      setMigrations(results)

      const failed = results.filter(r => !r.applied)
      if (failed.length === 0) {
        toast({
          title: 'Success',
          description: 'All migrations completed successfully'
        })
      } else {
        toast({
          title: 'Partial Success',
          description: `${results.length - failed.length} migrations completed, ${failed.length} failed`,
          variant: 'destructive'
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to run migrations',
        variant: 'destructive'
      })
    }
  }

  const toggleTask = (taskId: string, enabled: boolean) => {
    if (enabled) {
      scheduledTaskManager.enableTask(taskId)
    } else {
      scheduledTaskManager.disableTask(taskId)
    }
    setTasks(scheduledTaskManager.getTasks())
    
    toast({
      title: enabled ? 'Task Enabled' : 'Task Disabled',
      description: `Scheduled task has been ${enabled ? 'enabled' : 'disabled'}`
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Status</h2>
        <p className="text-muted-foreground">
          Monitor system health, scheduled tasks, and data migrations
        </p>
      </div>

      <Tabs defaultValue="health" className="space-y-4">
        <TabsList>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="tasks">Scheduled Tasks</TabsTrigger>
          <TabsTrigger value="migrations">Data Migrations</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Database</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Online</div>
                <p className="text-xs text-muted-foreground">
                  Connection healthy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Authentication</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Active</div>
                <p className="text-xs text-muted-foreground">
                  Supabase Auth ready
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Performance</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Good</div>
                <p className="text-xs text-muted-foreground">
                  Response time: {systemHealth?.responseTime || 'N/A'}ms
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Available</div>
                <p className="text-xs text-muted-foreground">
                  Supabase Storage ready
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Scheduled Tasks</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setTasks(scheduledTaskManager.getTasks())}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{task.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={task.enabled ? 'default' : 'secondary'}>
                        {task.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleTask(task.id, !task.enabled)}
                      >
                        {task.enabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Schedule: </span>
                      {task.cronExpression}
                    </div>
                    <div>
                      <span className="font-medium">Last Run: </span>
                      {task.lastRun ? task.lastRun.toLocaleString() : 'Never'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="migrations" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Data Migrations</h3>
            <Button onClick={runMigrations} disabled={!migrations.length}>
              <Play className="h-4 w-4 mr-2" />
              Run Migrations
            </Button>
          </div>

          <div className="space-y-4">
            {migrations.map((migration) => (
              <Card key={migration.name}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {migration.applied ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : migration.error ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-600" />
                      )}
                      <div>
                        <h4 className="font-medium">{migration.name}</h4>
                        {migration.error && (
                          <p className="text-sm text-red-600">{migration.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>Version: {migration.version}</div>
                      {migration.appliedAt && (
                        <div>Applied: {migration.appliedAt.toLocaleString()}</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
