@@ .. @@
 import PurchaseOrders from "./pages/PurchaseOrders";
 import Shipments from "./pages/Shipments";
 import Warehouses from "./pages/Warehouses";
+import Forecasting from "./pages/Forecasting";
 import Invoices from "./pages/Invoices";
 import Payments from "./pages/Payments";
 import Analytics from "./pages/Analytics";
+import Compliance from "./pages/Compliance";
 import Settings from "./pages/Settings";
 import SystemDashboard from "./pages/SystemDashboard";
@@ .. @@
                   <Layout>
                     <Shipments />
                   </Layout>
+                </ProtectedRoute>
+              } />
+              <Route path="/forecasting" element={
+                <ProtectedRoute>
+                  <Layout>
+                    <Forecasting />
+                  </Layout>
+                </ProtectedRoute>
+              } />
+              <Route path="/compliance" element={
+                <ProtectedRoute>
+                  <Layout>
+                    <Compliance />
+                  </Layout>
                 </ProtectedRoute>
               } />
               <Route path="/warehouses" element={