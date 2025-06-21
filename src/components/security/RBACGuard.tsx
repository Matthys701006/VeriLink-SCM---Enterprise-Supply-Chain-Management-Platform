import React, { useEffect, useState } from 'react';
import { AlertTriangle, Lock } from 'lucide-react';
import { rbacService, PermissionLevel } from '../../services/security/RBACService';
import { useAuth } from '../../contexts/AuthContext';
import { usePerformance } from '../../contexts/PerformanceContext';

interface RBACGuardProps {
  resource: string;
  requiredLevel?: PermissionLevel;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  context?: Record<string, any>;
}

/**
 * Component that guards its children based on user permissions
 */
export const RBACGuard: React.FC<RBACGuardProps> = ({
  resource,
  requiredLevel = PermissionLevel.READ,
  children,
  fallback,
  context = {}
}) => {
  const { user } = useAuth();
  const { recordApiCall } = usePerformance();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPermission = async () => {
      if (!user) {
        setHasPermission(false);
        setLoading(false);
        return;
      }

      try {
        const startTime = performance.now();
        const permitted = await rbacService.hasPermission(
          user.id,
          resource,
          requiredLevel,
          context
        );
        recordApiCall('rbac-permission-check', performance.now() - startTime);
        
        setHasPermission(permitted);
      } catch (error) {
        console.error('Error checking permission:', error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };

    checkPermission();
  }, [user, resource, requiredLevel, JSON.stringify(context)]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (hasPermission === false) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Lock className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Access Denied</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                You don't have permission to access this {resource.replace('.', ' ')}.
                Please contact your administrator if you need access.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Higher-order component (HOC) version of RBACGuard
 */
export const withRBAC = (
  Component: React.ComponentType<any>,
  resource: string,
  requiredLevel: PermissionLevel = PermissionLevel.READ,
  fallbackComponent?: React.ComponentType<any>
) => {
  return (props: any) => (
    <RBACGuard 
      resource={resource} 
      requiredLevel={requiredLevel}
      fallback={fallbackComponent ? <fallbackComponent {...props} /> : undefined}
      context={props.rbacContext || {}}
    >
      <Component {...props} />
    </RBACGuard>
  );
};

export default RBACGuard;