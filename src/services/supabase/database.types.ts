// Auto-generated TypeScript types for Supabase database schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          code: string
          description: string | null
          industry: string | null
          headquarters_address: string | null
          compliance_certifications: Json
          blockchain_node_id: string | null
          ai_ethics_settings: Json
          is_active: boolean
          created_at: string
          updated_at: string
          metadata: Json | null
        }
        Insert: {
          id?: string
          name: string
          code: string
          description?: string | null
          industry?: string | null
          headquarters_address?: string | null
          compliance_certifications?: Json
          blockchain_node_id?: string | null
          ai_ethics_settings?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          name?: string
          code?: string
          description?: string | null
          industry?: string | null
          headquarters_address?: string | null
          compliance_certifications?: Json
          blockchain_node_id?: string | null
          ai_ethics_settings?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
      }
      personas: {
        Row: {
          id: string
          organization_id: string
          name: string
          code: string
          description: string | null
          permissions: Json
          dashboard_config: Json
          workflow_access: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          code: string
          description?: string | null
          permissions?: Json
          dashboard_config?: Json
          workflow_access?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          code?: string
          description?: string | null
          permissions?: Json
          dashboard_config?: Json
          workflow_access?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          organization_id: string
          code: string
          name: string
          description: string | null
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          country: string | null
          postal_code: string | null
          tax_id: string | null
          payment_terms: string | null
          credit_limit: number | null
          currency: string
          ai_performance_score: number
          ai_risk_score: number
          ai_model_version: string | null
          last_ai_evaluation: string | null
          performance_metrics: Json
          certifications: Json
          blockchain_verified: boolean
          blockchain_hash: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          organization_id: string
          code: string
          name: string
          description?: string | null
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          tax_id?: string | null
          payment_terms?: string | null
          credit_limit?: number | null
          currency?: string
          ai_performance_score?: number
          ai_risk_score?: number
          ai_model_version?: string | null
          last_ai_evaluation?: string | null
          performance_metrics?: Json
          certifications?: Json
          blockchain_verified?: boolean
          blockchain_hash?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          organization_id?: string
          code?: string
          name?: string
          description?: string | null
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          tax_id?: string | null
          payment_terms?: string | null
          credit_limit?: number | null
          currency?: string
          ai_performance_score?: number
          ai_risk_score?: number
          ai_model_version?: string | null
          last_ai_evaluation?: string | null
          performance_metrics?: Json
          certifications?: Json
          blockchain_verified?: boolean
          blockchain_hash?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
          metadata?: Json | null
        }
      }
      purchase_orders: {
        Row: {
          id: string
          organization_id: string
          po_number: string
          supplier_id: string
          status: string
          priority: string
          currency: string
          subtotal: number
          tax_amount: number
          shipping_amount: number
          total_amount: number
          order_date: string
          expected_delivery_date: string | null
          actual_delivery_date: string | null
          payment_terms: string | null
          shipping_address: string | null
          billing_address: string | null
          notes: string | null
          approval_workflow: Json
          approved_by: string | null
          approved_at: string | null
          blockchain_tx_hash: string | null
          blockchain_verified: boolean
          ai_fraud_score: number | null
          ai_risk_assessment: Json | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          organization_id: string
          po_number: string
          supplier_id: string
          status?: string
          priority?: string
          currency?: string
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          total_amount?: number
          order_date?: string
          expected_delivery_date?: string | null
          actual_delivery_date?: string | null
          payment_terms?: string | null
          shipping_address?: string | null
          billing_address?: string | null
          notes?: string | null
          approval_workflow?: Json
          approved_by?: string | null
          approved_at?: string | null
          blockchain_tx_hash?: string | null
          blockchain_verified?: boolean
          ai_fraud_score?: number | null
          ai_risk_assessment?: Json | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          organization_id?: string
          po_number?: string
          supplier_id?: string
          status?: string
          priority?: string
          currency?: string
          subtotal?: number
          tax_amount?: number
          shipping_amount?: number
          total_amount?: number
          order_date?: string
          expected_delivery_date?: string | null
          actual_delivery_date?: string | null
          payment_terms?: string | null
          shipping_address?: string | null
          billing_address?: string | null
          notes?: string | null
          approval_workflow?: Json
          approved_by?: string | null
          approved_at?: string | null
          blockchain_tx_hash?: string | null
          blockchain_verified?: boolean
          ai_fraud_score?: number | null
          ai_risk_assessment?: Json | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
          metadata?: Json | null
        }
      }
      purchase_order_items: {
        Row: {
          id: string
          po_id: string
          item_id: string | null
          sku: string
          description: string
          quantity: number
          unit_price: number
          total_price: number
          received_quantity: number
          quality_score: number | null
          inspection_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          po_id: string
          item_id?: string | null
          sku: string
          description: string
          quantity: number
          unit_price: number
          total_price: number
          received_quantity?: number
          quality_score?: number | null
          inspection_notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          po_id?: string
          item_id?: string | null
          sku?: string
          description?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          received_quantity?: number
          quality_score?: number | null
          inspection_notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blockchain_transactions: {
        Row: {
          id: string
          organization_id: string
          transaction_hash: string
          block_number: number | null
          transaction_type: string
          entity_type: string
          entity_id: string
          payload: Json
          gas_used: number | null
          gas_price: number | null
          timestamp: string
          verified: boolean
          verification_attempts: number
          metadata: Json | null
        }
        Insert: {
          id?: string
          organization_id: string
          transaction_hash: string
          block_number?: number | null
          transaction_type: string
          entity_type: string
          entity_id: string
          payload: Json
          gas_used?: number | null
          gas_price?: number | null
          timestamp?: string
          verified?: boolean
          verification_attempts?: number
          metadata?: Json | null
        }
        Update: {
          id?: string
          organization_id?: string
          transaction_hash?: string
          block_number?: number | null
          transaction_type?: string
          entity_type?: string
          entity_id?: string
          payload?: Json
          gas_used?: number | null
          gas_price?: number | null
          timestamp?: string
          verified?: boolean
          verification_attempts?: number
          metadata?: Json | null
        }
      }
      // ... other existing tables from the original schema
    }
    Views: {
      // Existing views remain the same
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}