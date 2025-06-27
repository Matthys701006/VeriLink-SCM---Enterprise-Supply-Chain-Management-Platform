
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Download, Upload, Database, Calendar, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface BackupRecord {
  id: string
  name: string
  size: string
  date: Date
  status: 'completed' | 'failed' | 'in_progress'
  tables: string[]
}

export function BackupManager() {
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true)
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const { toast } = useToast()

  const mockBackups: BackupRecord[] = [
    {
      id: '1',
      name: 'Daily Backup - 2024-01-15',
      size: '45.2 MB',
      date: new Date('2024-01-15'),
      status: 'completed',
      tables: ['inventory_items', 'suppliers', 'purchase_orders', 'warehouses']
    },
    {
      id: '2',
      name: 'Weekly Backup - 2024-01-14',
      size: '42.8 MB',
      date: new Date('2024-01-14'),
      status: 'completed',
      tables: ['all_tables']
    }
  ]

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true)
    try {
      // Mock backup creation - in real implementation would call Supabase functions
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Backup Created",
        description: "Full database backup has been created successfully",
      })
    } catch (error) {
      toast({
        title: "Backup Failed",
        description: "Failed to create backup",
        variant: "destructive",
      })
    } finally {
      setIsCreatingBackup(false)
    }
  }

  const handleRestoreBackup = (backup: BackupRecord) => {
    toast({
      title: "Restore Initiated",
      description: `Restoring from ${backup.name}...`,
    })
  }

  const handleDownloadBackup = (backup: BackupRecord) => {
    toast({
      title: "Download Started",
      description: `Downloading ${backup.name}...`,
    })
  }

  const getStatusIcon = (status: BackupRecord['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case 'in_progress':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    }
  }

  const getStatusColor = (status: BackupRecord['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Backup Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Automatic Backups</h3>
              <p className="text-sm text-muted-foreground">
                Daily automated backups at 2:00 AM UTC
              </p>
            </div>
            <Switch
              checked={autoBackupEnabled}
              onCheckedChange={setAutoBackupEnabled}
            />
          </div>
          
          <div className="flex gap-4">
            <Button
              onClick={handleCreateBackup}
              disabled={isCreatingBackup}
              className="flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              {isCreatingBackup ? "Creating..." : "Create Backup Now"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Backup History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockBackups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(backup.status)}
                  <div>
                    <h4 className="font-medium">{backup.name}</h4>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{backup.size}</span>
                      <span>{backup.date.toLocaleDateString()}</span>
                      <Badge variant="outline" className={getStatusColor(backup.status)}>
                        {backup.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadBackup(backup)}
                    disabled={backup.status !== 'completed'}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreBackup(backup)}
                    disabled={backup.status !== 'completed'}
                  >
                    <Upload className="w-4 h-4" />
                    Restore
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
