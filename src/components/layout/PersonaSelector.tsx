import React, { useState, useEffect } from 'react';
import { ChevronDown, User, Shield, Eye } from 'lucide-react';
import { useOrchestrix } from '../../contexts/OrchestrixContext';
import { supabase } from '../../services/supabase/client';
import { Persona } from '../../types/orchestrix';

export const PersonaSelector: React.FC = () => {
  const { persona, organization, switchPersona, enhancedUser } = useOrchestrix();
  const [isOpen, setIsOpen] = useState(false);
  const [availablePersonas, setAvailablePersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (organization?.id) {
      loadAvailablePersonas();
    }
  }, [organization?.id]);

  const loadAvailablePersonas = async () => {
    try {
      const { data, error } = await supabase
        .from('personas')
        .select('*')
        .eq('organization_id', organization?.id)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setAvailablePersonas(data || []);
    } catch (error) {
      console.error('Error loading personas:', error);
    }
  };

  const handlePersonaSwitch = async (personaId: string) => {
    if (personaId === persona?.id) {
      setIsOpen(false);
      return;
    }

    try {
      setLoading(true);
      await switchPersona(personaId);
      setIsOpen(false);
    } catch (error) {
      console.error('Error switching persona:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPersonaIcon = (code: string) => {
    switch (code) {
      case 'SCM_MANAGER':
        return Shield;
      case 'PROCUREMENT':
        return User;
      case 'WMS_SUPERVISOR':
        return Eye;
      case 'LOGISTICS':
        return User;
      case 'FINANCE':
        return User;
      case 'ETHICS_COMPLIANCE':
        return Shield;
      default:
        return User;
    }
  };

  const getBadgeColor = (code: string) => {
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

  if (!persona || availablePersonas.length <= 1) {
    return null;
  }

  const PersonaIcon = getPersonaIcon(persona.code);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        <PersonaIcon className="w-4 h-4" />
        <span className="hidden md:inline">{persona.name}</span>
        <span className={`md:hidden px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(persona.code)}`}>
          {persona.code.replace('_', ' ')}
        </span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 w-64 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="p-3 border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">Switch Persona</p>
              <p className="text-xs text-gray-500">
                Current: {enhancedUser?.full_name || enhancedUser?.email}
              </p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {availablePersonas.map((availablePersona) => {
                const Icon = getPersonaIcon(availablePersona.code);
                const isActive = availablePersona.id === persona.id;
                
                return (
                  <button
                    key={availablePersona.id}
                    onClick={() => handlePersonaSwitch(availablePersona.id)}
                    disabled={loading || isActive}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                      isActive ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                    }`}
                  >
                    <Icon className="w-4 h-4 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${isActive ? 'text-blue-900' : 'text-gray-900'}`}>
                        {availablePersona.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {availablePersona.description}
                      </p>
                    </div>
                    {isActive && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};