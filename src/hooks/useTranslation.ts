
import { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/appStore'

interface Translations {
  [key: string]: {
    [key: string]: string
  }
}

const translations: Translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.inventory': 'Inventory',
    'nav.suppliers': 'Suppliers',
    'nav.purchase-orders': 'Purchase Orders',
    'nav.shipments': 'Shipments',
    'nav.warehouses': 'Warehouses',
    'nav.invoices': 'Invoices',
    'nav.payments': 'Payments',
    'nav.analytics': 'Analytics',
    'nav.settings': 'Settings',
    
    // Dashboard
    'dashboard.title': 'Supply Chain Dashboard',
    'dashboard.subtitle': 'Monitor your supply chain operations in real-time',
    'dashboard.total-inventory-value': 'Total Inventory Value',
    'dashboard.active-purchase-orders': 'Active Purchase Orders',
    'dashboard.shipments-in-transit': 'Shipments In Transit',
    'dashboard.low-stock-alerts': 'Low Stock Alerts',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.export': 'Export',
    'common.import': 'Import',
    
    // Analytics
    'analytics.title': 'Supply Chain Analytics',
    'analytics.subtitle': 'Comprehensive insights into your supply chain performance',
    'analytics.predictive': 'Predictive Analytics',
    'analytics.comparative': 'Comparative Analytics',
    'analytics.demand-forecasting': 'Demand Forecasting',
    'analytics.stock-out-predictions': 'Stock Out Predictions',
    
    // Settings
    'settings.title': 'Settings',
    'settings.user-preferences': 'User Preferences',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications'
  },
  es: {
    // Navigation
    'nav.dashboard': 'Panel de Control',
    'nav.inventory': 'Inventario',
    'nav.suppliers': 'Proveedores',
    'nav.purchase-orders': 'Órdenes de Compra',
    'nav.shipments': 'Envíos',
    'nav.warehouses': 'Almacenes',
    'nav.invoices': 'Facturas',
    'nav.payments': 'Pagos',
    'nav.analytics': 'Análisis',
    'nav.settings': 'Configuración',
    
    // Dashboard
    'dashboard.title': 'Panel de Cadena de Suministro',
    'dashboard.subtitle': 'Supervise sus operaciones de cadena de suministro en tiempo real',
    'dashboard.total-inventory-value': 'Valor Total del Inventario',
    'dashboard.active-purchase-orders': 'Órdenes de Compra Activas',
    'dashboard.shipments-in-transit': 'Envíos en Tránsito',
    'dashboard.low-stock-alerts': 'Alertas de Bajo Stock',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Agregar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.export': 'Exportar',
    'common.import': 'Importar',
    
    // Analytics
    'analytics.title': 'Análisis de Cadena de Suministro',
    'analytics.subtitle': 'Información integral sobre el rendimiento de su cadena de suministro',
    'analytics.predictive': 'Análisis Predictivo',
    'analytics.comparative': 'Análisis Comparativo',
    'analytics.demand-forecasting': 'Pronóstico de Demanda',
    'analytics.stock-out-predictions': 'Predicciones de Agotamiento',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.user-preferences': 'Preferencias del Usuario',
    'settings.theme': 'Tema',
    'settings.language': 'Idioma',
    'settings.notifications': 'Notificaciones'
  },
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de Bord',
    'nav.inventory': 'Inventaire',
    'nav.suppliers': 'Fournisseurs',
    'nav.purchase-orders': 'Bons de Commande',
    'nav.shipments': 'Expéditions',
    'nav.warehouses': 'Entrepôts',
    'nav.invoices': 'Factures',
    'nav.payments': 'Paiements',
    'nav.analytics': 'Analyses',
    'nav.settings': 'Paramètres',
    
    // Dashboard
    'dashboard.title': 'Tableau de Bord Chaîne d\'Approvisionnement',
    'dashboard.subtitle': 'Surveillez vos opérations de chaîne d\'approvisionnement en temps réel',
    'dashboard.total-inventory-value': 'Valeur Totale de l\'Inventaire',
    'dashboard.active-purchase-orders': 'Bons de Commande Actifs',
    'dashboard.shipments-in-transit': 'Expéditions en Transit',
    'dashboard.low-stock-alerts': 'Alertes de Stock Faible',
    
    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.add': 'Ajouter',
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.export': 'Exporter',
    'common.import': 'Importer',
    
    // Analytics
    'analytics.title': 'Analyses de Chaîne d\'Approvisionnement',
    'analytics.subtitle': 'Aperçus complets sur les performances de votre chaîne d\'approvisionnement',
    'analytics.predictive': 'Analyses Prédictives',
    'analytics.comparative': 'Analyses Comparatives',
    'analytics.demand-forecasting': 'Prévision de la Demande',
    'analytics.stock-out-predictions': 'Prédictions de Rupture de Stock',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.user-preferences': 'Préférences Utilisateur',
    'settings.theme': 'Thème',
    'settings.language': 'Langue',
    'settings.notifications': 'Notifications'
  }
}

export function useTranslation() {
  const { language } = useAppStore()
  const [currentLanguage, setCurrentLanguage] = useState(language)

  useEffect(() => {
    setCurrentLanguage(language)
  }, [language])

  const t = (key: string): string => {
    const keys = key.split('.')
    let value: any = translations[currentLanguage]

    for (const k of keys) {
      if (value && typeof value === 'object' && value[k]) {
        value = value[k]
      } else {
        // Fallback to English if translation not found
        return translations.en[key] || key
      }
    }

    return typeof value === 'string' ? value : key
  }

  const getAvailableLanguages = () => {
    return [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Español' },
      { code: 'fr', name: 'Français' }
    ]
  }

  return {
    t,
    currentLanguage,
    getAvailableLanguages
  }
}
