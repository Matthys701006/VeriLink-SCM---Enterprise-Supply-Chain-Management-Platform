
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Settings as SettingsIcon, Users, Database, Shield, Bell, Moon, Sun, Monitor, Download, Upload } from "lucide-react"
import { useTheme } from "@/components/common/ThemeProvider"
import { BackupManager } from "@/components/system/BackupManager"

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)
  const [usersDialogOpen, setUsersDialogOpen] = useState(false)
  const [dbStatsDialogOpen, setDbStatsDialogOpen] = useState(false)
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false)
  const [alertsDialogOpen, setAlertsDialogOpen] = useState(false)

  const mockUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Manager', status: 'Active' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
  ]

  const mockDbStats = {
    totalRecords: 15420,
    tableStats: [
      { name: 'inventory_items', records: 5240, size: '12.4 MB' },
      { name: 'suppliers', records: 180, size: '2.1 MB' },
      { name: 'purchase_orders', records: 890, size: '8.7 MB' },
      { name: 'warehouses', records: 12, size: '0.8 MB' },
    ],
    lastBackup: new Date('2024-01-15T02:00:00Z'),
    dbSize: '45.2 MB'
  }

  const mockSecurityMetrics = {
    activeUsers: 24,
    failedLogins: 3,
    lastSecurityScan: new Date('2024-01-14T10:30:00Z'),
    vulnerabilities: 0,
    securityScore: 98
  }

  const mockAlerts = [
    { id: '1', type: 'Low Stock', message: 'Item ABC123 is below reorder point', severity: 'high', enabled: true },
    { id: '2', type: 'Overdue Invoice', message: 'Invoice INV-001 is overdue', severity: 'medium', enabled: true },
    { id: '3', type: 'Shipment Delay', message: 'Shipment SH-456 is delayed', severity: 'low', enabled: false },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
          System Settings
        </h1>
        <p className="text-muted-foreground">
          Configure your system preferences and manage users
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Theme</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred theme
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme("system")}
                  >
                    <Monitor className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive system notifications
                  </p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto Backup</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup data daily
                  </p>
                </div>
                <Switch
                  checked={autoBackup}
                  onCheckedChange={setAutoBackup}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Dialog open={usersDialogOpen} onOpenChange={setUsersDialogOpen}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-medium">Manage Users</h3>
                    <p className="text-sm text-muted-foreground">View and manage user accounts</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>User Management</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {mockUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{user.name}</h4>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{user.role}</Badge>
                        <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={dbStatsDialogOpen} onOpenChange={setDbStatsDialogOpen}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Database className="w-8 h-8 mx-auto mb-2 text-green-600" />
                    <h3 className="font-medium">Database Stats</h3>
                    <p className="text-sm text-muted-foreground">View database statistics</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Database Statistics</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{mockDbStats.totalRecords.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Total Records</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{mockDbStats.dbSize}</p>
                      <p className="text-sm text-muted-foreground">Database Size</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{mockDbStats.tableStats.length}</p>
                      <p className="text-sm text-muted-foreground">Tables</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-orange-600">
                        {Math.round((Date.now() - mockDbStats.lastBackup.getTime()) / (1000 * 60 * 60))}h
                      </p>
                      <p className="text-sm text-muted-foreground">Since Last Backup</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Table Statistics</h4>
                    {mockDbStats.tableStats.map((table) => (
                      <div key={table.name} className="flex justify-between items-center p-3 border rounded">
                        <span className="font-mono text-sm">{table.name}</span>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{table.records.toLocaleString()} records</span>
                          <span>{table.size}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={securityDialogOpen} onOpenChange={setSecurityDialogOpen}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-red-600" />
                    <h3 className="font-medium">Security Dashboard</h3>
                    <p className="text-sm text-muted-foreground">Monitor security metrics</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Security Dashboard</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-green-600">{mockSecurityMetrics.securityScore}%</p>
                      <p className="text-sm text-muted-foreground">Security Score</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{mockSecurityMetrics.activeUsers}</p>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold text-red-600">{mockSecurityMetrics.failedLogins}</p>
                      <p className="text-sm text-muted-foreground">Failed Logins (24h)</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Security Events</h4>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">System Secure</p>
                      <p className="text-sm text-green-600 dark:text-green-400">No security vulnerabilities detected</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm font-medium">Last Security Scan</p>
                      <p className="text-sm text-muted-foreground">{mockSecurityMetrics.lastSecurityScan.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={alertsDialogOpen} onOpenChange={setAlertsDialogOpen}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                    <h3 className="font-medium">Configure Alerts</h3>
                    <p className="text-sm text-muted-foreground">Manage alert settings</p>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>Alert Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{alert.type}</h4>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          alert.severity === 'high' ? 'destructive' : 
                          alert.severity === 'medium' ? 'default' : 'outline'
                        }>
                          {alert.severity}
                        </Badge>
                        <Switch checked={alert.enabled} onCheckedChange={() => {}} />
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{user.role}</Badge>
                      <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                        {user.status}
                      </Badge>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{mockSecurityMetrics.securityScore}%</p>
                    <p className="text-sm text-muted-foreground">Security Score</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{mockSecurityMetrics.activeUsers}</p>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <p className="text-2xl font-bold text-red-600">{mockSecurityMetrics.failedLogins}</p>
                    <p className="text-sm text-muted-foreground">Failed Logins (24h)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups">
          <BackupManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
