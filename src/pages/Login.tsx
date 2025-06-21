import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { GitHubSSO } from '../components/auth/GitHubSSO';
import { EnhancedAuth } from '../components/auth/EnhancedAuth';
import { Package, Eye, EyeOff } from 'lucide-react';
import { usePerformance } from '../contexts/PerformanceContext';
import { useTranslation } from 'react-i18next';

export const Login: React.FC = () => {
  const { user, loading } = useAuth();
  const { recordPageLoad } = usePerformance();
  const { t } = useTranslation();
  
  // Record page load time once components are mounted
  useEffect(() => {
    if (!loading) {
      const loadTime = performance.now();
      recordPageLoad(loadTime);
    }
  }, [loading, recordPageLoad]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Package className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">VeriLink SCM</h2>
          <p className="mt-2 text-sm text-gray-600">{t('common.platformName')}</p>
        </div>

        <div className="space-y-6">
          <GitHubSSO />
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">{t('auth.orContinueWith')}</span>
            </div>
          </div>

          <EnhancedAuth />
        </div>
      </div>
    </div>
  );
};