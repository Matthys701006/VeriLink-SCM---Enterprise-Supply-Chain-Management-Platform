import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useOrchestrix } from '../../contexts/OrchestrixContext';
import { PersonaSelector } from './PersonaSelector';
import { 
  Home, 
  Package, 
  Warehouse, 
  ShoppingCart,
  TruckIcon,
  DollarSign,
  BarChart3,
  TrendingUp,
  RotateCcw,
  Users,
  Shield,
  LogOut, 
  User,
  Menu,
  X,
  Bell,
  Settings,
  Moon,
  Sun,
  Search
} from 'lucide-react';
import { NotificationCenter } from '../notifications/NotificationCenter';

interface EnhancedLayoutProps {
  children: React.ReactNode;
}

export const EnhancedLayout: React.FC<EnhancedLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { persona, hasPermission, enhancedUser } = useOrchestrix();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [lowStimulusMode, setLowStimulusMode] = React.useState(
    enhancedUser?.accessibility_settings?.low_stimulus_mode || false
  );

  // Navigation items based on persona permissions
  const allNavigationItems = [
    { 
      name: 'Dashboard', 
      href: '/', 
      icon: Home, 
      permission: 'dashboard.read',
      personas: ['SCM_MANAGER', 'PROCUREMENT', 'WMS_SUPERVISOR', 'LOGISTICS', 'FINANCE', 'ETHICS_COMPLIANCE']
    },
    { 
      name: 'Inventory', 
      href: '/inventory', 
      icon: Package, 
      permission: 'inventory.read',
      personas: ['SCM_MANAGER', 'WMS_SUPERVISOR']
    },
    { 
      name: 'Warehouses', 
      href: '/warehouses', 
      icon: Warehouse, 
      permission: 'warehouses.read',
      personas: ['SCM_MANAGER', 'WMS_SUPERVISOR']
    },
    {
      name: 'Procurement',
      href: '/procurement',
      icon: ShoppingCart,
      permission: 'procurement.read',
      personas: ['SCM_MANAGER', 'PROCUREMENT']
    },
    {
      name: 'Logistics',
      href: '/logistics',
      icon: TruckIcon,
      permission: 'logistics.read',
      personas: ['SCM_MANAGER', 'LOGISTICS']
    },
    {
      name: 'Finance',
      href: '/finance',
      icon: DollarSign,
      permission: 'finance.read',
      personas: ['SCM_MANAGER', 'FINANCE']
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      permission: 'analytics.read',
      personas: ['SCM_MANAGER', 'PROCUREMENT', 'FINANCE']
    },
    {
      name: 'Forecasting',
      href: '/forecasting',
      icon: TrendingUp,
      permission: 'forecasting.read',
      personas: ['SCM_MANAGER', 'PROCUREMENT']
    },
    {
      name: 'Returns',
      href: '/returns',
      icon: RotateCcw,
      permission: 'returns.read',
      personas: ['SCM_MANAGER', 'WMS_SUPERVISOR']
    },
    {
      name: 'HR',
      href: '/hr',
      icon: Users,
      permission: 'hr.read',
      personas: ['SCM_MANAGER']
    },
    {
      name: 'Compliance',
      href: '/compliance',
      icon: Shield,
      permission: 'compliance.read',
      personas: ['SCM_MANAGER', 'ETHICS_COMPLIANCE']
    },
  ];

  // Filter navigation based on persona and permissions
  const navigation = allNavigationItems.filter(item => {
    const hasPersonaAccess = !persona || item.personas.includes(persona.code);
    const hasPermissionAccess = hasPermission(item.permission) || hasPermission('*');
    return hasPersonaAccess && hasPermissionAccess;
  });

  const handleSignOut = async () => {
    await signOut();
  };

  const toggleLowStimulusMode = () => {
    const newMode = !lowStimulusMode;
    setLowStimulusMode(newMode);
    
    // Apply/remove CSS class for low stimulus mode
    if (newMode) {
      document.body.classList.add('low-stimulus-mode');
    } else {
      document.body.classList.remove('low-stimulus-mode');
    }

    // Save preference (you might want to update user settings)
    // updateUserAccessibilitySettings({ low_stimulus_mode: newMode });
  };

  const getPersonaBadgeColor = (code?: string) => {
    switch (code) {
      case 'SCM_MANAGER':
        return 'bg-purple-100 text-purple-800';
      case 'PROCUREMENT':
        return 'bg-blue-100 text-blue-800';
      case 'WMS_SUPERVISOR':
        return 'bg-green-100 text-green-800';
      case 'LOGISTICS':
        return 'bg-orange-100 text-orange-800';
      case 'FINANCE':
        return 'bg-yellow-100 text-yellow-800';
      case 'ETHICS_COMPLIANCE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${lowStimulusMode ? 'low-stimulus-mode' : ''}`}>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex flex-col w-72 h-full bg-white shadow-xl">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-gray-900">OrchestrixSCM</h1>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Persona Badge */}
          {persona && (
            <div className="px-4 py-2 border-b bg-gray-50">
              <div className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPersonaBadgeColor(persona.code)}`}>
                {persona.name}
              </div>
            </div>
          )}

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center mb-3">
              <User className="w-8 h-8 p-1 text-gray-600 bg-gray-200 rounded-full" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {enhancedUser?.full_name || enhancedUser?.email}
                </p>
                <p className="text-xs text-gray-500">{persona?.name}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-1 bg-white shadow-lg">
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">OrchestrixSCM</h1>
            <div className="flex items-center gap-2">
              <NotificationCenter />
              <PersonaSelector />
            </div>
          </div>

          {/* Persona Badge */}
          {persona && (
            <div className="px-6 py-3 border-b bg-gray-50">
              <div className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getPersonaBadgeColor(persona.code)}`}>
                <Shield className="w-4 h-4 mr-2" />
                {persona.name}
              </div>
            </div>
          )}

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            {/* Accessibility Controls */}
            <div className="mb-4">
              <button
                onClick={toggleLowStimulusMode}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                title="Toggle Low-Stimulus Mode for neuro-inclusive design"
              >
                {lowStimulusMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="text-xs">
                  {lowStimulusMode ? 'Normal Mode' : 'Low-Stimulus Mode'}
                </span>
              </button>
            </div>

            <div className="flex items-center mb-3">
              <User className="w-8 h-8 p-1 text-gray-600 bg-gray-200 rounded-full" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {enhancedUser?.full_name || enhancedUser?.email}
                </p>
                <p className="text-xs text-gray-500">{persona?.name}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:ml-72">
        {/* Mobile header */}
        <div className="flex items-center justify-between h-16 px-4 bg-white shadow-sm lg:hidden">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">OrchestrixSCM</h1>
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <PersonaSelector />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};