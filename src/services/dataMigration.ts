
import { supabase } from '@/integrations/supabase/client'

interface MigrationStatus {
  name: string
  version: string
  applied: boolean
  appliedAt?: Date
  error?: string
}

class DataMigrationManager {
  private migrations: Map<string, () => Promise<void>> = new Map()

  constructor() {
    this.initializeMigrations()
  }

  private initializeMigrations() {
    // Seed default organization
    this.registerMigration('001_seed_organization', this.seedOrganization)
    
    // Seed default personas
    this.registerMigration('002_seed_personas', this.seedPersonas)
    
    // Seed sample data
    this.registerMigration('003_seed_sample_data', this.seedSampleData)
    
    // Seed admin user profile
    this.registerMigration('004_seed_admin_profile', this.seedAdminProfile)
  }

  registerMigration(name: string, handler: () => Promise<void>) {
    this.migrations.set(name, handler)
  }

  async runMigrations(): Promise<MigrationStatus[]> {
    const results: MigrationStatus[] = []

    for (const [name, handler] of this.migrations) {
      try {
        console.log(`Running migration: ${name}`)
        await handler()
        
        results.push({
          name,
          version: '1.0.0',
          applied: true,
          appliedAt: new Date()
        })
        
        console.log(`Migration completed: ${name}`)
      } catch (error) {
        console.error(`Migration failed: ${name}`, error)
        results.push({
          name,
          version: '1.0.0',
          applied: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return results
  }

  private seedOrganization = async () => {
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('code', 'DEMO')
      .single()

    if (!existingOrg) {
      await supabase.from('organizations').insert({
        id: '550e8400-e29b-41d4-a716-446655440000',
        code: 'DEMO',
        name: 'Demo Organization',
        description: 'Demo organization for VeriLink SCM',
        industry: 'Manufacturing',
        is_active: true,
        headquarters_address: '123 Supply Chain Ave, Enterprise City, EC 12345'
      })
    }
  }

  private seedPersonas = async () => {
    const personas = [
      {
        code: 'SCM_MANAGER',
        name: 'Supply Chain Manager',
        description: 'Full access to supply chain operations',
        permissions: ['read:all', 'write:all', 'delete:inventory', 'approve:orders'],
        workflow_access: ['inventory', 'orders', 'shipments', 'analytics'],
        organization_id: '550e8400-e29b-41d4-a716-446655440000'
      },
      {
        code: 'WAREHOUSE_OPERATOR',
        name: 'Warehouse Operator',
        description: 'Access to warehouse and inventory operations',
        permissions: ['read:inventory', 'write:inventory', 'read:shipments'],
        workflow_access: ['inventory', 'shipments'],
        organization_id: '550e8400-e29b-41d4-a716-446655440000'
      },
      {
        code: 'ANALYST',
        name: 'Business Analyst',
        description: 'Read-only access with analytics capabilities',
        permissions: ['read:all', 'analytics:view'],
        workflow_access: ['analytics', 'reports'],
        organization_id: '550e8400-e29b-41d4-a716-446655440000'
      }
    ]

    for (const persona of personas) {
      const { data: existing } = await supabase
        .from('personas')
        .select('id')
        .eq('code', persona.code)
        .single()

      if (!existing) {
        await supabase.from('personas').insert(persona)
      }
    }
  }

  private seedSampleData = async () => {
    // Seed sample warehouses
    const warehouses = [
      {
        code: 'WH001',
        name: 'Main Warehouse',
        address: '123 Storage St, Warehouse District, WD 12345',
        total_capacity: 10000,
        used_capacity: 3500,
        is_active: true,
        organization_id: '550e8400-e29b-41d4-a716-446655440000'
      },
      {
        code: 'WH002',
        name: 'Secondary Warehouse',
        address: '456 Distribution Ave, Logistics Park, LP 67890',
        total_capacity: 5000,
        used_capacity: 2000,
        is_active: true,
        organization_id: '550e8400-e29b-41d4-a716-446655440000'
      }
    ]

    for (const warehouse of warehouses) {
      const { data: existing } = await supabase
        .from('warehouses')
        .select('id')
        .eq('code', warehouse.code)
        .single()

      if (!existing) {
        await supabase.from('warehouses').insert(warehouse)
      }
    }

    // Seed sample suppliers
    const suppliers = [
      {
        code: 'SUP001',
        name: 'Acme Manufacturing',
        contact_person: 'John Smith',
        email: 'john@acme-mfg.com',
        phone: '+1-555-0123',
        address: '789 Industry Blvd, Manufacturing City, MC 11111',
        city: 'Manufacturing City',
        state: 'MC',
        country: 'USA',
        postal_code: '11111',
        is_active: true,
        organization_id: '550e8400-e29b-41d4-a716-446655440000'
      },
      {
        code: 'SUP002',
        name: 'Global Components Inc',
        contact_person: 'Sarah Johnson',
        email: 'sarah@globalcomp.com',
        phone: '+1-555-0456',
        address: '321 Component Way, Parts Valley, PV 22222',
        city: 'Parts Valley',
        state: 'PV',
        country: 'USA',
        postal_code: '22222',
        is_active: true,
        organization_id: '550e8400-e29b-41d4-a716-446655440000'
      }
    ]

    for (const supplier of suppliers) {
      const { data: existing } = await supabase
        .from('suppliers')
        .select('id')
        .eq('code', supplier.code)
        .single()

      if (!existing) {
        await supabase.from('suppliers').insert(supplier)
      }
    }
  }

  private seedAdminProfile = async () => {
    // This would typically be called after a user signs up
    // For now, we'll create a placeholder that can be updated later
    console.log('Admin profile seeding placeholder - will be created on first user signup')
  }

  async checkMigrationStatus(): Promise<MigrationStatus[]> {
    const results: MigrationStatus[] = []

    for (const [name] of this.migrations) {
      // In a real system, this would check a migrations table
      // For now, we'll assume all migrations need to run
      results.push({
        name,
        version: '1.0.0',
        applied: false
      })
    }

    return results
  }
}

export const dataMigrationManager = new DataMigrationManager()
