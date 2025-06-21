import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../services/supabase/client';
import { Organization, Persona, EnhancedUser } from '../types/orchestrix';

interface OrchestrixContextType {
  organization: Organization | null;
  persona: Persona | null;
  enhancedUser: EnhancedUser | null;
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  loading: boolean;
  switchPersona: (personaId: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const OrchestrixContext = createContext<OrchestrixContextType | undefined>(undefined);

export const useOrchestrix = () => {
  const context = useContext(OrchestrixContext);
  if (context === undefined) {
    throw new Error('useOrchestrix must be used within an OrchestrixProvider');
  }
  return context;
};

export const OrchestrixProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [persona, setPersona] = useState<Persona | null>(null);
  const [enhancedUser, setEnhancedUser] = useState<EnhancedUser | null>(null);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      resetState();
    }
  }, [user]);

  const resetState = () => {
    setOrganization(null);
    setPersona(null);
    setEnhancedUser(null);
    setPermissions([]);
    setLoading(false);
  };

  const loadUserData = async () => {
    try {
      setLoading(true);

      // First, get enhanced user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          organizations (*),
          personas (*)
        `)
        .eq('id', user?.id)
        .single();

      if (userError) {
        console.error('Error loading user data:', userError);
        return;
      }

      const enhancedUserData = userData as EnhancedUser & {
        organizations: Organization;
        personas: Persona;
      };

      setEnhancedUser({
        ...enhancedUserData,
        organization: enhancedUserData.organizations,
        persona: enhancedUserData.personas
      });

      // Set organization
      if (enhancedUserData.organizations) {
        setOrganization(enhancedUserData.organizations);
      }

      // Set persona and permissions
      if (enhancedUserData.personas) {
        setPersona(enhancedUserData.personas);
        setPermissions(enhancedUserData.personas.permissions || []);
      } else if (enhancedUserData.organization_id) {
        // If no persona assigned, get default SCM Manager persona
        const { data: defaultPersona } = await supabase
          .from('personas')
          .select('*')
          .eq('organization_id', enhancedUserData.organization_id)
          .eq('code', 'SCM_MANAGER')
          .single();

        if (defaultPersona) {
          // Assign default persona to user
          await supabase
            .from('users')
            .update({ persona_id: defaultPersona.id })
            .eq('id', user?.id);
          
          setPersona(defaultPersona);
          setPermissions(defaultPersona.permissions || []);
        }
      }

    } catch (error) {
      console.error('Error in loadUserData:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    if (user) {
      await loadUserData();
    }
  };

  const switchPersona = async (personaId: string) => {
    try {
      // Update user's persona
      const { error } = await supabase
        .from('users')
        .update({ persona_id: personaId })
        .eq('id', user?.id);

      if (error) throw error;

      // Refresh user data to get new persona
      await refreshUserData();
    } catch (error) {
      console.error('Error switching persona:', error);
      throw error;
    }
  };

  const hasPermission = (permission: string): boolean => {
    return permissions.includes(permission) || permissions.includes('*');
  };

  const value = {
    organization,
    persona,
    enhancedUser,
    permissions,
    hasPermission,
    loading,
    switchPersona,
    refreshUserData,
  };

  return (
    <OrchestrixContext.Provider value={value}>
      {children}
    </OrchestrixContext.Provider>
  );
};