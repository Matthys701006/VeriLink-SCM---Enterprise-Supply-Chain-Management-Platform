import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { OrchestrixProvider } from './contexts/OrchestrixContext';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';
import { Inventory } from './pages/Inventory';
import { Warehouses } from './pages/Warehouses';
import { Procurement } from './pages/Procurement';
import { Logistics } from './pages/Logistics';
import { Finance } from './pages/Finance';
import { Analytics } from './pages/Analytics';
import { Forecasting } from './pages/Forecasting';
import { Returns } from './pages/Returns';
import { HR } from './pages/HR';
import { Compliance } from './pages/Compliance';
import { EnhancedLayout } from './components/layout/EnhancedLayout';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <OrchestrixProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <EnhancedLayout>
                  <Dashboard />
                </EnhancedLayout>
              </ProtectedRoute>
            } />
            <Route path="/inventory" element={
              <ProtectedRoute>
                <EnhancedLayout>
                  <Inventory />
                </EnhancedLayout>
              </ProtectedRoute>
            } />
            <Route path="/warehouses" element={
              <ProtectedRoute>
                <EnhancedLayout>
                  <Warehouses />
                </EnhancedLayout>
              </ProtectedRoute>
            } />
            <Route path="/procurement" element={
              <ProtectedRoute>
                <EnhancedLayout>
                  <Procurement />
                </EnhancedLayout>
              </ProtectedRoute>
            } />
            <Route path="/logistics" element={
              <ProtectedRoute>
                <EnhancedLayout>
                  <Logistics />
                </EnhancedLayout>
              </ProtectedRoute>
            } />
            <Route path="/finance" element={
              <ProtectedRoute>
                <EnhancedLayout>
                  <Finance />
                </EnhancedLayout>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <EnhancedLayout>
                  <Analytics />
                </EnhancedLayout>
              </ProtectedRoute>
            } />
            <Route path="/forecasting" element={
              <ProtectedRoute>
                <EnhancedLayout>
                  <Forecasting />
                </EnhancedLayout>
              </ProtectedRoute>
            } />
            <Route path="/returns" element={
              <ProtectedRoute>
                <EnhancedLayout>
                  <Returns />
                </EnhancedLayout>
              </ProtectedRoute>
            } />
            <Route path="/hr" element={
              <ProtectedRoute>
                <EnhancedLayout>
                  <HR />
                </EnhancedLayout>
              </ProtectedRoute>
            } />
            <Route path="/compliance" element={
              <ProtectedRoute>
                <EnhancedLayout>
                  <Compliance />
                </EnhancedLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </OrchestrixProvider>
    </AuthProvider>
  );
}

export default App;