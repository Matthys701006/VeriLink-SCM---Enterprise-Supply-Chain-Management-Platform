
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, X } from "lucide-react"
import { usePWA } from "@/hooks/usePWA"
import { useAppStore } from "@/stores/appStore"
import { useState } from "react"

export function PWAInstallPrompt() {
  const { canInstall, installApp } = usePWA()
  const { addNotification } = useAppStore()
  const [isDismissed, setIsDismissed] = useState(false)

  if (!canInstall || isDismissed) return null

  const handleInstall = async () => {
    const success = await installApp()
    if (success) {
      addNotification({
        type: 'success',
        title: 'App Installed',
        message: 'VeriLink SCM has been installed on your device'
      })
    }
    setIsDismissed(true)
  }

  const handleDismiss = () => {
    setIsDismissed(true)
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            <CardTitle className="text-sm">Install VeriLink SCM</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <CardDescription className="text-xs">
          Install the app for a better experience with offline access
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button size="sm" onClick={handleInstall} className="flex-1">
            Install
          </Button>
          <Button variant="outline" size="sm" onClick={handleDismiss}>
            Later
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
