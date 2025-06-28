
import { SidebarProvider } from "@/components/ui/sidebar"
import { Navigation } from "./Navigation"
import { Header } from "./Header"
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt"
import { OfflineIndicator } from "@/components/pwa/OfflineIndicator"
import { StatusBanner } from "@/components/StatusBanner"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Navigation />
        
        <div className="flex-1 flex flex-col">
          <Header />
          <OfflineIndicator />
          <StatusBanner />
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
        
        <PWAInstallPrompt />
      </div>
    </SidebarProvider>
  )
}
