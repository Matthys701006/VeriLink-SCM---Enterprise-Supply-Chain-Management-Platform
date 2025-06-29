
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/scm/Layout";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { ConnectionPrompt } from "@/components/ConnectionPrompt";
import { useEffect, useState } from "react";
import { checkConnection } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Suppliers from "./pages/Suppliers";
import PurchaseOrders from "./pages/PurchaseOrders";
import Shipments from "./pages/Shipments";
import Warehouses from "./pages/Warehouses";
import Forecasting from "./pages/Forecasting";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Analytics from "./pages/Analytics";
import Compliance from "./pages/Compliance";
import Settings from "./pages/Settings";
import SystemDashboard from "./pages/SystemDashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { EthicsAndBias } from "@/components/system/EthicsAndBias";
import { Legal } from "@/components/system/Legal";
import { FraudDetection } from "@/components/system/FraudDetection";
import { ReturnsRefunds } from "@/components/scm/ReturnsRefunds";

const queryClient = new QueryClient();

const App = () => {
  const [showConnectionPrompt, setShowConnectionPrompt] = useState(false);
  
  // Check if Supabase connection is set up
  useEffect(() => {
    const checkSupabaseConnection = async () => {
      // First check if env vars are set
      if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
        console.log('Supabase credentials missing, prompting for connection');
        setShowConnectionPrompt(true);
        return;
      }
      
      // Then check if connection works
      const result = await checkConnection();
      if (!result.connected) {
        console.warn('Supabase connection failed:', result.error);
        setShowConnectionPrompt(true);
      }
    };
    
    checkSupabaseConnection();
  }, []);
  
  const handleConnect = (url: string, key: string) => {
    // We'll need to reload the page for env vars to take effect
    // Set temporary localStorage values
    localStorage.setItem('supabase-url', url);
    localStorage.setItem('supabase-key', key);
    
    // Show toast before reloading
    toast({
      title: "Connecting to Supabase",
      description: "Reloading the application with new connection settings"
    });
    
    // Give toast time to show, then reload
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
  
  return (
    <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ErrorBoundary>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <ErrorBoundary>
                        <Dashboard />
                      </ErrorBoundary>
                    </Layout>
                  </ProtectedRoute>
                } />
              <Route path="/inventory" element={
                <ProtectedRoute>
                  <Layout>
                    <Inventory />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/suppliers" element={
                <ProtectedRoute>
                  <Layout>
                    <Suppliers />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/purchase-orders" element={
                <ProtectedRoute>
                  <Layout>
                    <PurchaseOrders />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/shipments" element={
                <ProtectedRoute>
                  <Layout>
                    <Shipments />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/forecasting" element={
                <ProtectedRoute>
                  <Layout>
                    <Forecasting />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/compliance" element={
                <ProtectedRoute>
                  <Layout>
                    <Compliance />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/warehouses" element={
                <ProtectedRoute>
                  <Layout>
                    <Warehouses />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/invoices" element={
                <ProtectedRoute>
                  <Layout>
                    <Invoices />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/payments" element={
                <ProtectedRoute>
                  <Layout>
                    <Payments />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Layout>
                    <ErrorBoundary>
                      <Analytics />
                    </ErrorBoundary>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <ErrorBoundary>
                      <Settings />
                    </ErrorBoundary>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/system" element={
                <ProtectedRoute>
                  <Layout>
                    <ErrorBoundary>
                      <SystemDashboard />
                    </ErrorBoundary>
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/system/ethics" element={
                <ProtectedRoute>
                  <Layout>
                    <EthicsAndBias />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/system/legal" element={
                <ProtectedRoute>
                  <Layout>
                    <Legal />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/system/fraud" element={
                <ProtectedRoute>
                  <Layout>
                    <FraudDetection />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/returns" element={
                <ProtectedRoute>
                  <Layout>
                    <ReturnsRefunds />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
        </TooltipProvider>
        
        {/* Connection Prompt */}
        <ConnectionPrompt
          isOpen={showConnectionPrompt}
          onConnect={handleConnect}
        />
      </ErrorBoundary>
    </ThemeProvider>
  </QueryClientProvider>
  );
}

export default App;
