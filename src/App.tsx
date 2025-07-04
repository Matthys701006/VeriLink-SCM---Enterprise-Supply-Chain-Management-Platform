import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Layout } from "@/components/scm/Layout";
import { ThemeProvider } from "@/components/common/ThemeProvider";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Suppliers from "./pages/Suppliers";
import PurchaseOrders from "./pages/PurchaseOrders";
import Shipments from "./pages/Shipments";
import Warehouses from "./pages/Warehouses";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import SystemDashboard from "./pages/SystemDashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { EthicsAndBias } from "@/components/system/EthicsAndBias";
import { Legal } from "@/components/system/Legal";
import { FraudDetection } from "@/components/system/FraudDetection";
import { ReturnsRefunds } from "@/components/scm/ReturnsRefunds";
import "./bolt-badge.css"; // Import the CSS if you place it in a separate file

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div style={{ paddingBottom: "7.5rem" /* ensures space for badge */ }}>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
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
                      <Analytics />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="/system" element={
                  <ProtectedRoute>
                    <Layout>
                      <SystemDashboard />
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

              {/* Bolt.new Badge */}
              <div className="fixed bottom-4 left-4 z-50">
                <a
                  href="https://bolt.new/?rid=os72mi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block transition-all duration-300 hover:shadow-2xl"
                >
                  <img
                    src="https://storage.bolt.army/black_circle_360x360.png"
                    alt="Built with Bolt.new badge"
                    className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-lg bolt-badge bolt-badge-intro"
                    onAnimationEnd={e => e.currentTarget.classList.add('animated')}
                  />
                </a>
              </div>
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
