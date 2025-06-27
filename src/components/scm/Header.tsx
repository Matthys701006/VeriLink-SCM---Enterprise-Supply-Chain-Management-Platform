
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationCenter } from "@/components/ui/notification-center"
import { UserProfile } from "./UserProfile"

export function Header() {
  return (
    <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div>
            <h1 className="text-lg font-semibold">VeriLink SCM</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <UserProfile />
        </div>
      </div>
    </header>
  )
}
