import { supabase } from './supabase/client';
import { Organization, Persona, Supplier, PurchaseOrder } from '../types/orchestrix';

export const seedSampleData = async (organizationId: string, userId: string) => {
  try {
    console.log('Starting sample data seeding...');

    // Create sample personas
    await seedPersonas(organizationId);
    
    // Create sample suppliers
    await seedSuppliers(organizationId, userId);
    
    // Create sample purchase orders
    await seedPurchaseOrders(organizationId, userId);
    
    console.log('Sample data seeding completed successfully!');
    return { success: true };
    
  } catch (error) {
    console.error('Error seeding sample data:', error);
    return { success: false, error };
  }
};

const seedPersonas = async (organizationId: string) => {
  const personas = [
    {
      organization_id: organizationId,
      name: 'Supply Chain Manager',
      code: 'SCM_MANAGER',
      description: 'Overall supply chain oversight and strategic planning',
      permissions: ['*'], // Full access
      dashboard_config: {
        theme: 'executive',
        layout: 'dashboard',
        widgets: ['kpi_overview', 'risk_alerts', 'performance_metrics']
      },
      workflow_access: ['approval', 'review', 'strategic_planning']
    },
    {
      organization_id: organizationId,
      name: 'Procurement Specialist',
      code: 'PROCUREMENT',
      description: 'Purchase order management and supplier relations',
      permissions: ['procurement.*', 'suppliers.*', 'dashboard.read', 'analytics.read'],
      dashboard_config: {
        theme: 'operational',
        layout: 'procurement',
        widgets: ['po_status', 'supplier_performance', 'cost_analysis']
      },
      workflow_access: ['po_approval', 'supplier_evaluation']
    },
    {
      organization_id: organizationId,
      name: 'Warehouse Supervisor',
      code: 'WMS_SUPERVISOR',
      description: 'Warehouse operations and inventory management',
      permissions: ['inventory.*', 'warehouses.*', 'returns.*', 'dashboard.read'],
      dashboard_config: {
        theme: 'operational',
        layout: 'warehouse',
        widgets: ['inventory_levels', 'movement_activity', 'capacity_utilization']
      },
      workflow_access: ['inventory_adjustment', 'return_processing']
    },
    {
      organization_id: organizationId,
      name: 'Logistics Coordinator',
      code: 'LOGISTICS',
      description: 'Transportation and delivery management',
      permissions: ['logistics.*', 'shipments.*', 'carriers.*', 'dashboard.read'],
      dashboard_config: {
        theme: 'operational',
        layout: 'logistics',
        widgets: ['shipment_tracking', 'carrier_performance', 'route_optimization']
      },
      workflow_access: ['shipment_scheduling', 'route_planning']
    },
    {
      organization_id: organizationId,
      name: 'Finance Controller',
      code: 'FINANCE',
      description: 'Financial oversight and budget management',
      permissions: ['finance.*', 'invoices.*', 'payments.*', 'analytics.read'],
      dashboard_config: {
        theme: 'financial',
        layout: 'finance',
        widgets: ['financial_overview', 'budget_tracking', 'cost_analysis']
      },
      workflow_access: ['payment_approval', 'budget_review']
    },
    {
      organization_id: organizationId,
      name: 'Ethics & Compliance Officer',
      code: 'ETHICS_COMPLIANCE',
      description: 'Regulatory compliance and ethics monitoring',
      permissions: ['compliance.*', 'audit.*', 'hr.*', 'dashboard.read'],
      dashboard_config: {
        theme: 'compliance',
        layout: 'compliance',
        widgets: ['compliance_status', 'audit_schedule', 'ethics_alerts']
      },
      workflow_access: ['compliance_review', 'audit_management']
    }
  ];

  for (const persona of personas) {
    const { error } = await supabase
      .from('personas')
      .upsert(persona, { onConflict: 'organization_id,code' });
    
    if (error) {
      console.error('Error creating persona:', persona.code, error);
    }
  }
};

const seedSuppliers = async (organizationId: string, userId: string) => {
  const suppliers = [
    {
      organization_id: organizationId,
      code: 'SUP-001',
      name: 'Global Industrial Supply Co.',
      description: 'Leading supplier of industrial components and materials',
      contact_person: 'John Anderson',
      email: 'john.anderson@globalsupply.com',
      phone: '+1-555-0123',
      address: '123 Industrial Blvd',
      city: 'Chicago',
      state: 'IL',
      country: 'United States',
      postal_code: '60601',
      currency: 'USD',
      ai_performance_score: 4.2,
      ai_risk_score: 1.8,
      performance_metrics: {
        on_time_delivery: 0.94,
        quality_score: 0.96,
        invoice_accuracy: 0.98,
        response_time: 2.3
      },
      certifications: ['ISO 9001', 'ISO 14001', 'OHSAS 18001'],
      blockchain_verified: true,
      created_by: userId
    },
    {
      organization_id: organizationId,
      code: 'SUP-002',
      name: 'TechFlow Solutions Ltd.',
      description: 'Technology and automation equipment supplier',
      contact_person: 'Sarah Chen',
      email: 'sarah.chen@techflow.com',
      phone: '+1-555-0456',
      address: '456 Tech Park Drive',
      city: 'Austin',
      state: 'TX',
      country: 'United States',
      postal_code: '73301',
      currency: 'USD',
      ai_performance_score: 4.7,
      ai_risk_score: 1.2,
      performance_metrics: {
        on_time_delivery: 0.97,
        quality_score: 0.99,
        invoice_accuracy: 0.95,
        response_time: 1.8
      },
      certifications: ['ISO 9001', 'CE Marking', 'FCC'],
      blockchain_verified: true,
      created_by: userId
    },
    {
      organization_id: organizationId,
      code: 'SUP-003',
      name: 'Precision Materials Inc.',
      description: 'High-quality raw materials and components',
      contact_person: 'Michael Rodriguez',
      email: 'michael.rodriguez@precisionmat.com',
      phone: '+1-555-0789',
      address: '789 Materials Way',
      city: 'Detroit',
      state: 'MI',
      country: 'United States',
      postal_code: '48201',
      currency: 'USD',
      ai_performance_score: 3.9,
      ai_risk_score: 2.1,
      performance_metrics: {
        on_time_delivery: 0.89,
        quality_score: 0.94,
        invoice_accuracy: 0.97,
        response_time: 3.1
      },
      certifications: ['ISO 9001', 'IATF 16949'],
      blockchain_verified: false,
      created_by: userId
    }
  ];

  for (const supplier of suppliers) {
    const { error } = await supabase
      .from('suppliers')
      .upsert(supplier, { onConflict: 'organization_id,code' });
    
    if (error) {
      console.error('Error creating supplier:', supplier.code, error);
    }
  }
};

const seedPurchaseOrders = async (organizationId: string, userId: string) => {
  // First get suppliers to link POs
  const { data: suppliers } = await supabase
    .from('suppliers')
    .select('id, code')
    .eq('organization_id', organizationId);

  if (!suppliers || suppliers.length === 0) {
    console.log('No suppliers found, skipping PO creation');
    return;
  }

  const purchaseOrders = [
    {
      organization_id: organizationId,
      po_number: 'PO-2024-0001',
      supplier_id: suppliers[0].id,
      status: 'approved',
      priority: 'normal',
      currency: 'USD',
      subtotal: 15420.00,
      tax_amount: 1234.56,
      shipping_amount: 250.00,
      total_amount: 16904.56,
      order_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      expected_delivery_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      payment_terms: 'Net 30',
      notes: 'Expedited delivery required for production schedule',
      approval_workflow: [
        { step: 1, approver: 'Procurement Manager', status: 'approved', date: new Date().toISOString() }
      ],
      approved_by: userId,
      approved_at: new Date().toISOString(),
      blockchain_verified: true,
      ai_fraud_score: 1.2,
      created_by: userId
    },
    {
      organization_id: organizationId,
      po_number: 'PO-2024-0002',
      supplier_id: suppliers[1]?.id || suppliers[0].id,
      status: 'pending',
      priority: 'high',
      currency: 'USD',
      subtotal: 28750.00,
      tax_amount: 2300.00,
      shipping_amount: 500.00,
      total_amount: 31550.00,
      order_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      expected_delivery_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      payment_terms: 'Net 45',
      notes: 'Technology upgrade for automation systems',
      approval_workflow: [
        { step: 1, approver: 'Department Head', status: 'pending', date: null }
      ],
      ai_fraud_score: 0.8,
      created_by: userId
    }
  ];

  for (const po of purchaseOrders) {
    const { error } = await supabase
      .from('purchase_orders')
      .upsert(po, { onConflict: 'po_number' });
    
    if (error) {
      console.error('Error creating purchase order:', po.po_number, error);
    }
  }
};

export const generateSampleNotifications = async (organizationId: string, userId: string) => {
  const notifications = [
    {
      organization_id: organizationId,
      recipient_id: userId,
      type: 'inventory_alert',
      priority: 'high',
      title: 'Low Stock Alert',
      message: 'Multiple items have fallen below reorder point. Immediate action required.',
      action_url: '/inventory',
      is_read: false
    },
    {
      organization_id: organizationId,
      recipient_id: userId,
      type: 'approval_required',
      priority: 'urgent',
      title: 'Purchase Order Approval Required',
      message: 'PO-2024-0003 for $45,230 requires your approval.',
      action_url: '/procurement',
      is_read: false
    },
    {
      organization_id: organizationId,
      recipient_id: userId,
      type: 'compliance_reminder',
      priority: 'normal',
      title: 'Compliance Review Due',
      message: 'Annual ISO 27001 review is due within 30 days.',
      action_url: '/compliance',
      is_read: false
    }
  ];

  for (const notification of notifications) {
    const { error } = await supabase
      .from('notifications')
      .insert(notification);
    
    if (error) {
      console.error('Error creating notification:', error);
    }
  }
};