
import { useState } from "react"
import { NavLink, useLocation } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  BarChart3,
  Package,
  TrendingUp,
  Users,
  ShoppingCart,
  Truck,
  Warehouse,
  FileText,
  CreditCard,
  Settings,
  Home,
  Shield,
  Scale,
  AlertTriangle,
  RotateCcw,
} from "lucide-react"

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Inventory", url: "/inventory", icon: Package },
  { title: "Forecasting", url: "/forecasting", icon: TrendingUp },
  { title: "Suppliers", url: "/suppliers", icon: Users },
  { title: "Purchase Orders", url: "/purchase-orders", icon: ShoppingCart },
  { title: "Shipments", url: "/shipments", icon: Truck },
  { title: "Warehouses", url: "/warehouses", icon: Warehouse },
  { title: "Invoices", url: "/invoices", icon: FileText },
  { title: "Payments", url: "/payments", icon: CreditCard },
  { title: "Returns & Refunds", url: "/returns", icon: RotateCcw },
  { title: "Compliance", url: "/compliance", icon: Scale },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
]

const systemItems = [
  { title: "System Dashboard", url: "/system", icon: Settings },
  { title: "Ethics & Bias", url: "/system/ethics", icon: Shield },
  { title: "Legal", url: "/system/legal", icon: Scale },
  { title: "Fraud Detection", url: "/system/fraud", icon: AlertTriangle },
]

export function Navigation() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const isCollapsed = state === "collapsed"

  const isActive = (path: string) => currentPath === path
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50"

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-lg flex items-center justify-content shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center relative overflow-hidden">
              <Package className="w-4 h-4 text-white z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
            </div>
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
                VeriLink
              </h1>
              <p className="text-xs text-muted-foreground font-medium">SCM Platform</p>
            </div>
          )}
        </div>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="w-4 h-4 mr-2" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System & Compliance</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="w-4 h-4 mr-2" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
