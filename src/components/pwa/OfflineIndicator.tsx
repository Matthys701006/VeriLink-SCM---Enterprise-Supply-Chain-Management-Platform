import { Alert, AlertDescription } from "@/components/ui/alert"
import { WifiOff, Wifi } from "lucide-react"
import { usePWA } from "@/hooks/usePWA"

export function OfflineIndicator() {
  const { isOnline } = usePWA()

  if (isOnline) return null

  return (
    <Alert className="fixed top-16 left-1/2 transform -translate-x-1/2 w-auto z-50 bg-orange-50 border-orange-200">
      <WifiOff className="h-4 w-4 text-orange-600" />
      <AlertDescription className="text-orange-800">
        You're currently offline. Some features may be limited.
      </AlertDescription>
    </Alert>
  )
}
