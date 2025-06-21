import { supabase } from '../supabase/client';
import { dataCache } from '../cache/DataCache';

// Permission levels (used for fine-grained access control)
export enum PermissionLevel {
  NONE = 0,
  READ = 1,
  WRITE = 2,
  ADMIN = 3,
}

// Permission object structure
export interface Permission {
  resource: string;
  level: PermissionLevel;
  conditions?: Record<string, any>; // Optional conditions (e.g., only own records)
}

// Cache permissions for 5 minutes to reduce database load
const PERMISSIONS_CACHE_TTL = 5 * 60 * 1000; 

class RBACService {
  private static instance: RBACService;
  
  private constructor() {}
  
  static getInstance(): RBACService {
    if (!RBACService.instance) {
      RBACService.instance = new RBACService();
    }
    return RBACService.instance;
  }
  
  /**
   * Check if user has permission for a specific action
   */
  async hasPermission(
    userId: string,
    resource: string,
    requiredLevel: PermissionLevel = PermissionLevel.READ,
    context: Record<string, any> = {}
  ): Promise<boolean> {
    // Get user permissions from cache or database
    const permissions = await this.getUserPermissions(userId);
    
    // Check for wildcard permission first (superuser)
    if (permissions.some(p => p.resource === '*' && p.level >= requiredLevel)) {
      return true;
    }
    
    // Check specific resource permissions
    const resourcePermissions = permissions.filter(p => 
      p.resource === resource || 
      (resource.includes('.') && p.resource === resource.split('.')[0])
    );
    
    if (resourcePermissions.length === 0) {
      return false;
    }
    
    // Check if any permission satisfies the required level and conditions
    return resourcePermissions.some(p => {
      // Check permission level
      if (p.level < requiredLevel) {
        return false;
      }
      
      // If there are conditions, check them against the context
      if (p.conditions && Object.keys(p.conditions).length > 0) {
        return this.evaluateConditions(p.conditions, context);
      }
      
      return true;
    });
  }
  
  /**
   * Evaluate permission conditions against context
   */
  private evaluateConditions(
    conditions: Record<string, any>,
    context: Record<string, any>
  ): boolean {
    // Simple condition evaluation - in a real system this would be more sophisticated
    for (const [key, value] of Object.entries(conditions)) {
      if (context[key] !== value) {
        return false;
      }
    }
    return true;
  }
  
  /**
   * Get all permissions for a user
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const cacheKey = `user_permissions_${userId}`;
    
    // Try to get from cache first
    const cachedPermissions = dataCache.get<Permission[]>(cacheKey);
    if (cachedPermissions) {
      return cachedPermissions;
    }
    
    try {
      // First, get user's persona
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('persona_id, role')
        .eq('id', userId)
        .single();
      
      if (userError) throw userError;
      
      // Then get persona's permissions
      const { data: personaData, error: personaError } = await supabase
        .from('personas')
        .select('permissions')
        .eq('id', userData.persona_id)
        .single();
      
      if (personaError) throw personaError;
      
      // Transform permissions array to Permission objects
      const permissions: Permission[] = (personaData.permissions || []).map((permission: string) => {
        // Handle simple string permissions (legacy format)
        if (typeof permission === 'string') {
          const [resource, level = 'read'] = permission.split('.');
          return {
            resource,
            level: this.stringToPermissionLevel(level)
          };
        }
        
        // Handle structured permission objects
        return {
          resource: permission.resource,
          level: this.stringToPermissionLevel(permission.level || 'read'),
          conditions: permission.conditions
        };
      });
      
      // Add role-based permissions
      if (userData.role === 'admin' || userData.role === 'superuser') {
        permissions.push({
          resource: '*',
          level: PermissionLevel.ADMIN
        });
      } else if (userData.role === 'manager') {
        permissions.push({
          resource: '*',
          level: PermissionLevel.WRITE,
          conditions: {
            // Managers can only access their own department's resources
            departmentOnly: true
          }
        });
      }
      
      // Cache the permissions
      dataCache.set(cacheKey, permissions, PERMISSIONS_CACHE_TTL);
      
      return permissions;
    } catch (error) {
      console.error('Error fetching user permissions:', error);
      return [];
    }
  }
  
  /**
   * Convert string permission level to enum
   */
  private stringToPermissionLevel(level: string): PermissionLevel {
    switch (level.toLowerCase()) {
      case 'admin':
        return PermissionLevel.ADMIN;
      case 'write':
        return PermissionLevel.WRITE;
      case 'read':
        return PermissionLevel.READ;
      default:
        return PermissionLevel.NONE;
    }
  }
  
  /**
   * Check if user is in required role
   */
  async userHasRole(userId: string, requiredRole: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      return data.role === requiredRole;
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  }
  
  /**
   * Check if user requires MFA (based on role)
   */
  async userRequiresMFA(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      // Admin roles require MFA as per requirements
      return ['admin', 'security_admin', 'compliance_admin'].includes(data.role);
    } catch (error) {
      console.error('Error checking MFA requirement:', error);
      return false;
    }
  }
  
  /**
   * Clear permissions cache for a user
   */
  clearPermissionsCache(userId: string): void {
    dataCache.remove(`user_permissions_${userId}`);
  }
}

export const rbacService = RBACService.getInstance();
export default RBACService;