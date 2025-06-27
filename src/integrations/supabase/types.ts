export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_models: {
        Row: {
          accuracy_metrics: Json | null
          bias_audit_results: Json | null
          created_at: string | null
          deployment_status: string | null
          description: string | null
          endpoint_url: string | null
          ethical_review_status: string | null
          id: string
          last_retrained_at: string | null
          metadata: Json | null
          model_type: string
          name: string
          organization_id: string
          training_data_hash: string | null
          updated_at: string | null
          version: string
        }
        Insert: {
          accuracy_metrics?: Json | null
          bias_audit_results?: Json | null
          created_at?: string | null
          deployment_status?: string | null
          description?: string | null
          endpoint_url?: string | null
          ethical_review_status?: string | null
          id?: string
          last_retrained_at?: string | null
          metadata?: Json | null
          model_type: string
          name: string
          organization_id: string
          training_data_hash?: string | null
          updated_at?: string | null
          version: string
        }
        Update: {
          accuracy_metrics?: Json | null
          bias_audit_results?: Json | null
          created_at?: string | null
          deployment_status?: string | null
          description?: string | null
          endpoint_url?: string | null
          ethical_review_status?: string | null
          id?: string
          last_retrained_at?: string | null
          metadata?: Json | null
          model_type?: string
          name?: string
          organization_id?: string
          training_data_hash?: string | null
          updated_at?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_models_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_snapshots: {
        Row: {
          ai_insights: Json | null
          alerts: Json | null
          computation_time_ms: number | null
          created_at: string | null
          data_quality_score: number | null
          forecasts: Json | null
          id: string
          kpis: Json | null
          metrics: Json
          organization_id: string
          snapshot_date: string
          snapshot_type: string
          trends: Json | null
        }
        Insert: {
          ai_insights?: Json | null
          alerts?: Json | null
          computation_time_ms?: number | null
          created_at?: string | null
          data_quality_score?: number | null
          forecasts?: Json | null
          id?: string
          kpis?: Json | null
          metrics: Json
          organization_id: string
          snapshot_date: string
          snapshot_type: string
          trends?: Json | null
        }
        Update: {
          ai_insights?: Json | null
          alerts?: Json | null
          computation_time_ms?: number | null
          created_at?: string | null
          data_quality_score?: number | null
          forecasts?: Json | null
          id?: string
          kpis?: Json | null
          metrics?: Json
          organization_id?: string
          snapshot_date?: string
          snapshot_type?: string
          trends?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_snapshots_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          changed_by: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          operation: string
          record_id: string
          table_name: string
          timestamp: string
        }
        Insert: {
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          record_id: string
          table_name: string
          timestamp?: string
        }
        Update: {
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          record_id?: string
          table_name?: string
          timestamp?: string
        }
        Relationships: []
      }
      audit_trail: {
        Row: {
          action: string
          compliance_flags: Json | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          organization_id: string | null
          persona: string | null
          risk_score: number | null
          session_id: string | null
          timestamp: string | null
          trace_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          compliance_flags?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          persona?: string | null
          risk_score?: number | null
          session_id?: string | null
          timestamp?: string | null
          trace_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          compliance_flags?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          organization_id?: string | null
          persona?: string | null
          risk_score?: number | null
          session_id?: string | null
          timestamp?: string | null
          trace_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_trail_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_trail_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      blockchain_transactions: {
        Row: {
          block_number: number | null
          entity_id: string
          entity_type: string
          gas_price: number | null
          gas_used: number | null
          id: string
          metadata: Json | null
          organization_id: string
          payload: Json
          timestamp: string | null
          transaction_hash: string
          transaction_type: string
          verification_attempts: number | null
          verified: boolean | null
        }
        Insert: {
          block_number?: number | null
          entity_id: string
          entity_type: string
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          metadata?: Json | null
          organization_id: string
          payload: Json
          timestamp?: string | null
          transaction_hash: string
          transaction_type: string
          verification_attempts?: number | null
          verified?: boolean | null
        }
        Update: {
          block_number?: number | null
          entity_id?: string
          entity_type?: string
          gas_price?: number | null
          gas_used?: number | null
          id?: string
          metadata?: Json | null
          organization_id?: string
          payload?: Json
          timestamp?: string | null
          transaction_hash?: string
          transaction_type?: string
          verification_attempts?: number | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "blockchain_transactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      carriers: {
        Row: {
          ai_performance_score: number | null
          ai_risk_score: number | null
          blockchain_verified: boolean | null
          capabilities: Json | null
          carrier_type: string
          certifications: Json | null
          code: string
          contact_info: Json | null
          contract_terms: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          insurance_info: Json | null
          is_active: boolean | null
          metadata: Json | null
          name: string
          organization_id: string
          performance_metrics: Json | null
          service_areas: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          ai_performance_score?: number | null
          ai_risk_score?: number | null
          blockchain_verified?: boolean | null
          capabilities?: Json | null
          carrier_type?: string
          certifications?: Json | null
          code: string
          contact_info?: Json | null
          contract_terms?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          insurance_info?: Json | null
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          organization_id: string
          performance_metrics?: Json | null
          service_areas?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          ai_performance_score?: number | null
          ai_risk_score?: number | null
          blockchain_verified?: boolean | null
          capabilities?: Json | null
          carrier_type?: string
          certifications?: Json | null
          code?: string
          contact_info?: Json | null
          contract_terms?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          insurance_info?: Json | null
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          organization_id?: string
          performance_metrics?: Json | null
          service_areas?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carriers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carriers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "carriers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_records: {
        Row: {
          assessment_date: string | null
          assessor_id: string | null
          compliance_status: string | null
          created_at: string | null
          entity_id: string
          entity_type: string
          evidence_documents: Json | null
          expiry_date: string | null
          id: string
          metadata: Json | null
          next_review_date: string | null
          organization_id: string
          regulation_type: string
          remediation_plan: string | null
          updated_at: string | null
          violations: Json | null
        }
        Insert: {
          assessment_date?: string | null
          assessor_id?: string | null
          compliance_status?: string | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          evidence_documents?: Json | null
          expiry_date?: string | null
          id?: string
          metadata?: Json | null
          next_review_date?: string | null
          organization_id: string
          regulation_type: string
          remediation_plan?: string | null
          updated_at?: string | null
          violations?: Json | null
        }
        Update: {
          assessment_date?: string | null
          assessor_id?: string | null
          compliance_status?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          evidence_documents?: Json | null
          expiry_date?: string | null
          id?: string
          metadata?: Json | null
          next_review_date?: string | null
          organization_id?: string
          regulation_type?: string
          remediation_plan?: string | null
          updated_at?: string | null
          violations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_records_assessor_id_fkey"
            columns: ["assessor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_records_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          ai_risk_score: number | null
          auto_renewal: boolean | null
          blockchain_hash: string | null
          blockchain_verified: boolean | null
          compliance_requirements: Json | null
          contract_number: string
          contract_type: string
          counterparty_id: string | null
          counterparty_type: string
          created_at: string | null
          created_by: string | null
          currency: string | null
          description: string | null
          documents: Json | null
          end_date: string | null
          id: string
          key_contacts: Json | null
          metadata: Json | null
          organization_id: string
          payment_terms: string | null
          penalty_clauses: Json | null
          renewal_notifications: Json | null
          renewal_terms: Json | null
          risk_assessment: Json | null
          sla_terms: Json | null
          start_date: string | null
          status: string | null
          termination_clauses: Json | null
          title: string
          updated_at: string | null
          updated_by: string | null
          value_total: number | null
        }
        Insert: {
          ai_risk_score?: number | null
          auto_renewal?: boolean | null
          blockchain_hash?: string | null
          blockchain_verified?: boolean | null
          compliance_requirements?: Json | null
          contract_number: string
          contract_type: string
          counterparty_id?: string | null
          counterparty_type: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          documents?: Json | null
          end_date?: string | null
          id?: string
          key_contacts?: Json | null
          metadata?: Json | null
          organization_id: string
          payment_terms?: string | null
          penalty_clauses?: Json | null
          renewal_notifications?: Json | null
          renewal_terms?: Json | null
          risk_assessment?: Json | null
          sla_terms?: Json | null
          start_date?: string | null
          status?: string | null
          termination_clauses?: Json | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
          value_total?: number | null
        }
        Update: {
          ai_risk_score?: number | null
          auto_renewal?: boolean | null
          blockchain_hash?: string | null
          blockchain_verified?: boolean | null
          compliance_requirements?: Json | null
          contract_number?: string
          contract_type?: string
          counterparty_id?: string | null
          counterparty_type?: string
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          description?: string | null
          documents?: Json | null
          end_date?: string | null
          id?: string
          key_contacts?: Json | null
          metadata?: Json | null
          organization_id?: string
          payment_terms?: string | null
          penalty_clauses?: Json | null
          renewal_notifications?: Json | null
          renewal_terms?: Json | null
          risk_assessment?: Json | null
          sla_terms?: Json | null
          start_date?: string | null
          status?: string | null
          termination_clauses?: Json | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          value_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_centers: {
        Row: {
          accounting_codes: Json | null
          approval_limits: Json | null
          budget_annual: number | null
          budget_remaining: number | null
          code: string
          cost_center_type: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          manager_id: string | null
          metadata: Json | null
          name: string
          organization_id: string
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          accounting_codes?: Json | null
          approval_limits?: Json | null
          budget_annual?: number | null
          budget_remaining?: number | null
          code: string
          cost_center_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          metadata?: Json | null
          name: string
          organization_id: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          accounting_codes?: Json | null
          approval_limits?: Json | null
          budget_annual?: number | null
          budget_remaining?: number | null
          code?: string
          cost_center_type?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          manager_id?: string | null
          metadata?: Json | null
          name?: string
          organization_id?: string
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cost_centers_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_centers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cost_centers_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          ai_predicted_demand: Json | null
          average_cost: number | null
          blockchain_hash: string | null
          category: string
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          id: string
          in_transit: number
          is_active: boolean
          is_deleted: boolean
          is_lot_tracked: boolean
          is_serialized: boolean
          last_blockchain_sync: string | null
          last_cost: number | null
          location_code: string | null
          max_stock_level: number | null
          metadata: Json | null
          name: string
          on_hand: number
          organization_id: string
          reorder_point: number
          reorder_quantity: number
          reserved: number
          sku: string
          status: string
          unit_cost: number | null
          updated_at: string
          updated_by: string | null
          version: string
          warehouse_id: string
        }
        Insert: {
          ai_predicted_demand?: Json | null
          average_cost?: number | null
          blockchain_hash?: string | null
          category: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          in_transit?: number
          is_active?: boolean
          is_deleted?: boolean
          is_lot_tracked?: boolean
          is_serialized?: boolean
          last_blockchain_sync?: string | null
          last_cost?: number | null
          location_code?: string | null
          max_stock_level?: number | null
          metadata?: Json | null
          name: string
          on_hand?: number
          organization_id: string
          reorder_point?: number
          reorder_quantity?: number
          reserved?: number
          sku: string
          status?: string
          unit_cost?: number | null
          updated_at?: string
          updated_by?: string | null
          version?: string
          warehouse_id: string
        }
        Update: {
          ai_predicted_demand?: Json | null
          average_cost?: number | null
          blockchain_hash?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          id?: string
          in_transit?: number
          is_active?: boolean
          is_deleted?: boolean
          is_lot_tracked?: boolean
          is_serialized?: boolean
          last_blockchain_sync?: string | null
          last_cost?: number | null
          location_code?: string | null
          max_stock_level?: number | null
          metadata?: Json | null
          name?: string
          on_hand?: number
          organization_id?: string
          reorder_point?: number
          reorder_quantity?: number
          reserved?: number
          sku?: string
          status?: string
          unit_cost?: number | null
          updated_at?: string
          updated_by?: string | null
          version?: string
          warehouse_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse_utilization_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_lots: {
        Row: {
          available_quantity: number
          compliance_certifications: Json | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          expiration_date: string | null
          id: string
          is_active: boolean
          is_deleted: boolean
          item_id: string
          lot_number: string
          manufactured_date: string | null
          metadata: Json | null
          quality_grade: string | null
          quantity: number
          received_date: string
          serial_numbers: Json | null
          unit_cost: number | null
          updated_at: string
          updated_by: string | null
          version: string
        }
        Insert: {
          available_quantity: number
          compliance_certifications?: Json | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          item_id: string
          lot_number: string
          manufactured_date?: string | null
          metadata?: Json | null
          quality_grade?: string | null
          quantity: number
          received_date?: string
          serial_numbers?: Json | null
          unit_cost?: number | null
          updated_at?: string
          updated_by?: string | null
          version?: string
        }
        Update: {
          available_quantity?: number
          compliance_certifications?: Json | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          expiration_date?: string | null
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          item_id?: string
          lot_number?: string
          manufactured_date?: string | null
          metadata?: Json | null
          quality_grade?: string | null
          quantity?: number
          received_date?: string
          serial_numbers?: Json | null
          unit_cost?: number | null
          updated_at?: string
          updated_by?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_lots_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_lots_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_status_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_lots_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "low_stock_alert_view"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          blockchain_transaction_hash: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          from_location: string | null
          id: string
          is_deleted: boolean
          item_id: string
          metadata: Json | null
          movement_type: string
          notes: string | null
          quantity: number
          quantity_after: number
          quantity_before: number
          reason: string | null
          reference_id: string | null
          reference_type: string | null
          to_location: string | null
          unit_cost: number | null
          updated_at: string
          updated_by: string | null
          version: string
        }
        Insert: {
          blockchain_transaction_hash?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          from_location?: string | null
          id?: string
          is_deleted?: boolean
          item_id: string
          metadata?: Json | null
          movement_type: string
          notes?: string | null
          quantity: number
          quantity_after: number
          quantity_before: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          to_location?: string | null
          unit_cost?: number | null
          updated_at?: string
          updated_by?: string | null
          version?: string
        }
        Update: {
          blockchain_transaction_hash?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          from_location?: string | null
          id?: string
          is_deleted?: boolean
          item_id?: string
          metadata?: Json | null
          movement_type?: string
          notes?: string | null
          quantity?: number
          quantity_after?: number
          quantity_before?: number
          reason?: string | null
          reference_id?: string | null
          reference_type?: string | null
          to_location?: string | null
          unit_cost?: number | null
          updated_at?: string
          updated_by?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_status_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "low_stock_alert_view"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          ai_audit_flags: Json | null
          ai_fraud_score: number | null
          approval_workflow: Json | null
          approved_at: string | null
          approved_by: string | null
          blockchain_hash: string | null
          blockchain_verified: boolean | null
          carrier_id: string | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_date: string | null
          invoice_number: string
          invoice_type: string | null
          line_items: Json | null
          metadata: Json | null
          organization_id: string
          payment_method: string | null
          payment_reference: string | null
          payment_terms: string | null
          po_id: string | null
          shipment_id: string | null
          shipping_amount: number | null
          status: string | null
          subtotal: number | null
          supplier_id: string | null
          tax_amount: number | null
          tax_breakdown: Json | null
          total_amount: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          ai_audit_flags?: Json | null
          ai_fraud_score?: number | null
          approval_workflow?: Json | null
          approved_at?: string | null
          approved_by?: string | null
          blockchain_hash?: string | null
          blockchain_verified?: boolean | null
          carrier_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number: string
          invoice_type?: string | null
          line_items?: Json | null
          metadata?: Json | null
          organization_id: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_terms?: string | null
          po_id?: string | null
          shipment_id?: string | null
          shipping_amount?: number | null
          status?: string | null
          subtotal?: number | null
          supplier_id?: string | null
          tax_amount?: number | null
          tax_breakdown?: Json | null
          total_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          ai_audit_flags?: Json | null
          ai_fraud_score?: number | null
          approval_workflow?: Json | null
          approved_at?: string | null
          approved_by?: string | null
          blockchain_hash?: string | null
          blockchain_verified?: boolean | null
          carrier_id?: string | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_date?: string | null
          invoice_number?: string
          invoice_type?: string | null
          line_items?: Json | null
          metadata?: Json | null
          organization_id?: string
          payment_method?: string | null
          payment_reference?: string | null
          payment_terms?: string | null
          po_id?: string | null
          shipment_id?: string | null
          shipping_amount?: number | null
          status?: string | null
          subtotal?: number | null
          supplier_id?: string | null
          tax_amount?: number | null
          tax_breakdown?: Json | null
          total_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_shipment_id_fkey"
            columns: ["shipment_id"]
            isOneToOne: false
            referencedRelation: "shipments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      iot_sensors: {
        Row: {
          alert_thresholds: Json | null
          battery_level: number | null
          calibration_date: string | null
          coordinates: Json | null
          created_at: string | null
          data_format: Json | null
          encryption_enabled: boolean | null
          firmware_version: string | null
          id: string
          is_active: boolean | null
          last_maintenance: string | null
          location_description: string | null
          manufacturer: string | null
          metadata: Json | null
          model: string | null
          organization_id: string
          sampling_rate: number | null
          security_certificates: Json | null
          sensor_id: string
          sensor_type: string
          signal_strength: number | null
          status: string | null
          updated_at: string | null
          vehicle_id: string | null
          warehouse_id: string | null
        }
        Insert: {
          alert_thresholds?: Json | null
          battery_level?: number | null
          calibration_date?: string | null
          coordinates?: Json | null
          created_at?: string | null
          data_format?: Json | null
          encryption_enabled?: boolean | null
          firmware_version?: string | null
          id?: string
          is_active?: boolean | null
          last_maintenance?: string | null
          location_description?: string | null
          manufacturer?: string | null
          metadata?: Json | null
          model?: string | null
          organization_id: string
          sampling_rate?: number | null
          security_certificates?: Json | null
          sensor_id: string
          sensor_type: string
          signal_strength?: number | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
          warehouse_id?: string | null
        }
        Update: {
          alert_thresholds?: Json | null
          battery_level?: number | null
          calibration_date?: string | null
          coordinates?: Json | null
          created_at?: string | null
          data_format?: Json | null
          encryption_enabled?: boolean | null
          firmware_version?: string | null
          id?: string
          is_active?: boolean | null
          last_maintenance?: string | null
          location_description?: string | null
          manufacturer?: string | null
          metadata?: Json | null
          model?: string | null
          organization_id?: string
          sampling_rate?: number | null
          security_certificates?: Json | null
          sensor_id?: string
          sensor_type?: string
          signal_strength?: number | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iot_sensors_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iot_sensors_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iot_sensors_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse_utilization_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iot_sensors_warehouse_id_fkey"
            columns: ["warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
        ]
      }
      ml_models: {
        Row: {
          accuracy_score: number | null
          algorithm: string | null
          bias_audit_results: Json | null
          created_at: string | null
          created_by: string | null
          deployment_date: string | null
          drift_detection: Json | null
          ethical_review_status: string | null
          f1_score: number | null
          feature_importance: Json | null
          framework: string | null
          hyperparameters: Json | null
          id: string
          last_prediction_at: string | null
          metadata: Json | null
          model_artifacts: Json | null
          model_name: string
          model_type: string
          organization_id: string
          performance_metrics: Json | null
          precision_score: number | null
          prediction_count: number | null
          recall_score: number | null
          retraining_schedule: string | null
          status: string | null
          training_data_hash: string | null
          training_date: string | null
          updated_at: string | null
          version: string
        }
        Insert: {
          accuracy_score?: number | null
          algorithm?: string | null
          bias_audit_results?: Json | null
          created_at?: string | null
          created_by?: string | null
          deployment_date?: string | null
          drift_detection?: Json | null
          ethical_review_status?: string | null
          f1_score?: number | null
          feature_importance?: Json | null
          framework?: string | null
          hyperparameters?: Json | null
          id?: string
          last_prediction_at?: string | null
          metadata?: Json | null
          model_artifacts?: Json | null
          model_name: string
          model_type: string
          organization_id: string
          performance_metrics?: Json | null
          precision_score?: number | null
          prediction_count?: number | null
          recall_score?: number | null
          retraining_schedule?: string | null
          status?: string | null
          training_data_hash?: string | null
          training_date?: string | null
          updated_at?: string | null
          version: string
        }
        Update: {
          accuracy_score?: number | null
          algorithm?: string | null
          bias_audit_results?: Json | null
          created_at?: string | null
          created_by?: string | null
          deployment_date?: string | null
          drift_detection?: Json | null
          ethical_review_status?: string | null
          f1_score?: number | null
          feature_importance?: Json | null
          framework?: string | null
          hyperparameters?: Json | null
          id?: string
          last_prediction_at?: string | null
          metadata?: Json | null
          model_artifacts?: Json | null
          model_name?: string
          model_type?: string
          organization_id?: string
          performance_metrics?: Json | null
          precision_score?: number | null
          prediction_count?: number | null
          recall_score?: number | null
          retraining_schedule?: string | null
          status?: string | null
          training_data_hash?: string | null
          training_date?: string | null
          updated_at?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "ml_models_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ml_models_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_data: Json | null
          action_url: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          organization_id: string
          priority: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string | null
          title: string
          type: string
        }
        Insert: {
          action_data?: Json | null
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          organization_id: string
          priority?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id?: string | null
          title: string
          type: string
        }
        Update: {
          action_data?: Json | null
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          organization_id?: string
          priority?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          ai_ethics_settings: Json | null
          blockchain_node_id: string | null
          code: string
          compliance_certifications: Json | null
          created_at: string | null
          description: string | null
          headquarters_address: string | null
          id: string
          industry: string | null
          is_active: boolean | null
          metadata: Json | null
          name: string
          updated_at: string | null
        }
        Insert: {
          ai_ethics_settings?: Json | null
          blockchain_node_id?: string | null
          code: string
          compliance_certifications?: Json | null
          created_at?: string | null
          description?: string | null
          headquarters_address?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          updated_at?: string | null
        }
        Update: {
          ai_ethics_settings?: Json | null
          blockchain_node_id?: string | null
          code?: string
          compliance_certifications?: Json | null
          created_at?: string | null
          description?: string | null
          headquarters_address?: string | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          bank_details: Json | null
          base_amount: number | null
          blockchain_hash: string | null
          blockchain_verified: boolean | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          exchange_rate: number | null
          fees: number | null
          id: string
          invoice_id: string | null
          metadata: Json | null
          organization_id: string
          payment_date: string | null
          payment_gateway: string | null
          payment_method: string
          payment_reference: string
          reconciled_at: string | null
          reconciled_by: string | null
          reconciliation_status: string | null
          settlement_date: string | null
          status: string | null
          transaction_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          bank_details?: Json | null
          base_amount?: number | null
          blockchain_hash?: string | null
          blockchain_verified?: boolean | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          exchange_rate?: number | null
          fees?: number | null
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          organization_id: string
          payment_date?: string | null
          payment_gateway?: string | null
          payment_method: string
          payment_reference: string
          reconciled_at?: string | null
          reconciled_by?: string | null
          reconciliation_status?: string | null
          settlement_date?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bank_details?: Json | null
          base_amount?: number | null
          blockchain_hash?: string | null
          blockchain_verified?: boolean | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          exchange_rate?: number | null
          fees?: number | null
          id?: string
          invoice_id?: string | null
          metadata?: Json | null
          organization_id?: string
          payment_date?: string | null
          payment_gateway?: string | null
          payment_method?: string
          payment_reference?: string
          reconciled_at?: string | null
          reconciled_by?: string | null
          reconciliation_status?: string | null
          settlement_date?: string | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_reconciled_by_fkey"
            columns: ["reconciled_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      personas: {
        Row: {
          code: string
          created_at: string | null
          dashboard_config: Json | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          organization_id: string
          permissions: Json
          updated_at: string | null
          workflow_access: Json | null
        }
        Insert: {
          code: string
          created_at?: string | null
          dashboard_config?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          organization_id: string
          permissions?: Json
          updated_at?: string | null
          workflow_access?: Json | null
        }
        Update: {
          code?: string
          created_at?: string | null
          dashboard_config?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          organization_id?: string
          permissions?: Json
          updated_at?: string | null
          workflow_access?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "personas_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          organization_id: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          organization_id?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          inspection_notes: string | null
          item_id: string | null
          po_id: string
          quality_score: number | null
          quantity: number
          received_quantity: number | null
          sku: string | null
          total_price: number
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          inspection_notes?: string | null
          item_id?: string | null
          po_id: string
          quality_score?: number | null
          quantity: number
          received_quantity?: number | null
          sku?: string | null
          total_price: number
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          inspection_notes?: string | null
          item_id?: string | null
          po_id?: string
          quality_score?: number | null
          quantity?: number
          received_quantity?: number | null
          sku?: string | null
          total_price?: number
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_status_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "low_stock_alert_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          actual_delivery_date: string | null
          ai_fraud_score: number | null
          ai_risk_assessment: Json | null
          approval_workflow: Json | null
          approved_at: string | null
          approved_by: string | null
          billing_address: string | null
          blockchain_tx_hash: string | null
          blockchain_verified: boolean | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          expected_delivery_date: string | null
          id: string
          metadata: Json | null
          notes: string | null
          order_date: string | null
          organization_id: string
          payment_terms: string | null
          po_number: string
          priority: string | null
          shipping_address: string | null
          shipping_amount: number | null
          status: string | null
          subtotal: number | null
          supplier_id: string
          tax_amount: number | null
          total_amount: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          actual_delivery_date?: string | null
          ai_fraud_score?: number | null
          ai_risk_assessment?: Json | null
          approval_workflow?: Json | null
          approved_at?: string | null
          approved_by?: string | null
          billing_address?: string | null
          blockchain_tx_hash?: string | null
          blockchain_verified?: boolean | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          expected_delivery_date?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_date?: string | null
          organization_id: string
          payment_terms?: string | null
          po_number: string
          priority?: string | null
          shipping_address?: string | null
          shipping_amount?: number | null
          status?: string | null
          subtotal?: number | null
          supplier_id: string
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          actual_delivery_date?: string | null
          ai_fraud_score?: number | null
          ai_risk_assessment?: Json | null
          approval_workflow?: Json | null
          approved_at?: string | null
          approved_by?: string | null
          billing_address?: string | null
          blockchain_tx_hash?: string | null
          blockchain_verified?: boolean | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          expected_delivery_date?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          order_date?: string | null
          organization_id?: string
          payment_terms?: string | null
          po_number?: string
          priority?: string | null
          shipping_address?: string | null
          shipping_amount?: number | null
          status?: string | null
          subtotal?: number | null
          supplier_id?: string
          tax_amount?: number | null
          total_amount?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          ai_optimized: boolean | null
          carbon_footprint: number | null
          cost_estimate: number | null
          created_at: string | null
          created_by: string | null
          destination_address: string | null
          distance_km: number | null
          estimated_duration: number | null
          id: string
          metadata: Json | null
          optimization_params: Json | null
          organization_id: string
          origin_address: string | null
          restrictions: Json | null
          route_name: string
          traffic_pattern: Json | null
          updated_at: string | null
          waypoints: Json | null
          weather_considerations: Json | null
        }
        Insert: {
          ai_optimized?: boolean | null
          carbon_footprint?: number | null
          cost_estimate?: number | null
          created_at?: string | null
          created_by?: string | null
          destination_address?: string | null
          distance_km?: number | null
          estimated_duration?: number | null
          id?: string
          metadata?: Json | null
          optimization_params?: Json | null
          organization_id: string
          origin_address?: string | null
          restrictions?: Json | null
          route_name: string
          traffic_pattern?: Json | null
          updated_at?: string | null
          waypoints?: Json | null
          weather_considerations?: Json | null
        }
        Update: {
          ai_optimized?: boolean | null
          carbon_footprint?: number | null
          cost_estimate?: number | null
          created_at?: string | null
          created_by?: string | null
          destination_address?: string | null
          distance_km?: number | null
          estimated_duration?: number | null
          id?: string
          metadata?: Json | null
          optimization_params?: Json | null
          organization_id?: string
          origin_address?: string | null
          restrictions?: Json | null
          route_name?: string
          traffic_pattern?: Json | null
          updated_at?: string | null
          waypoints?: Json | null
          weather_considerations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "routes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "routes_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      sensor_readings: {
        Row: {
          additional_data: Json | null
          alert_level: string | null
          alert_triggered: boolean | null
          anomaly_score: number | null
          created_at: string | null
          id: string
          processed: boolean | null
          reading_quality: string | null
          reading_timestamp: string
          reading_unit: string | null
          reading_value: number
          sensor_id: string
        }
        Insert: {
          additional_data?: Json | null
          alert_level?: string | null
          alert_triggered?: boolean | null
          anomaly_score?: number | null
          created_at?: string | null
          id?: string
          processed?: boolean | null
          reading_quality?: string | null
          reading_timestamp: string
          reading_unit?: string | null
          reading_value: number
          sensor_id: string
        }
        Update: {
          additional_data?: Json | null
          alert_level?: string | null
          alert_triggered?: boolean | null
          anomaly_score?: number | null
          created_at?: string | null
          id?: string
          processed?: boolean | null
          reading_quality?: string | null
          reading_timestamp?: string
          reading_unit?: string | null
          reading_value?: number
          sensor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sensor_readings_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "iot_sensors"
            referencedColumns: ["sensor_id"]
          },
        ]
      }
      shipments: {
        Row: {
          actual_delivery_date: string | null
          actual_pickup_date: string | null
          additional_charges: Json | null
          ai_risk_assessment: Json | null
          blockchain_hash: string | null
          carrier_id: string | null
          created_at: string | null
          created_by: string | null
          delivery_issues: Json | null
          destination_address: string | null
          destination_coordinates: Json | null
          fuel_surcharge: number | null
          gps_tracking: Json | null
          handling_requirements: Json | null
          id: string
          insurance_value: number | null
          metadata: Json | null
          organization_id: string
          origin_warehouse_id: string | null
          package_count: number | null
          planned_delivery_date: string | null
          planned_pickup_date: string | null
          po_id: string | null
          priority: string | null
          proof_of_delivery: Json | null
          route_id: string | null
          shipment_number: string
          shipment_type: string | null
          shipping_cost: number | null
          special_instructions: string | null
          status: string | null
          temperature_requirements: Json | null
          total_volume: number | null
          total_weight: number | null
          tracking_number: string | null
          updated_at: string | null
          updated_by: string | null
          vehicle_id: string | null
        }
        Insert: {
          actual_delivery_date?: string | null
          actual_pickup_date?: string | null
          additional_charges?: Json | null
          ai_risk_assessment?: Json | null
          blockchain_hash?: string | null
          carrier_id?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_issues?: Json | null
          destination_address?: string | null
          destination_coordinates?: Json | null
          fuel_surcharge?: number | null
          gps_tracking?: Json | null
          handling_requirements?: Json | null
          id?: string
          insurance_value?: number | null
          metadata?: Json | null
          organization_id: string
          origin_warehouse_id?: string | null
          package_count?: number | null
          planned_delivery_date?: string | null
          planned_pickup_date?: string | null
          po_id?: string | null
          priority?: string | null
          proof_of_delivery?: Json | null
          route_id?: string | null
          shipment_number: string
          shipment_type?: string | null
          shipping_cost?: number | null
          special_instructions?: string | null
          status?: string | null
          temperature_requirements?: Json | null
          total_volume?: number | null
          total_weight?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
          vehicle_id?: string | null
        }
        Update: {
          actual_delivery_date?: string | null
          actual_pickup_date?: string | null
          additional_charges?: Json | null
          ai_risk_assessment?: Json | null
          blockchain_hash?: string | null
          carrier_id?: string | null
          created_at?: string | null
          created_by?: string | null
          delivery_issues?: Json | null
          destination_address?: string | null
          destination_coordinates?: Json | null
          fuel_surcharge?: number | null
          gps_tracking?: Json | null
          handling_requirements?: Json | null
          id?: string
          insurance_value?: number | null
          metadata?: Json | null
          organization_id?: string
          origin_warehouse_id?: string | null
          package_count?: number | null
          planned_delivery_date?: string | null
          planned_pickup_date?: string | null
          po_id?: string | null
          priority?: string | null
          proof_of_delivery?: Json | null
          route_id?: string | null
          shipment_number?: string
          shipment_type?: string | null
          shipping_cost?: number | null
          special_instructions?: string | null
          status?: string | null
          temperature_requirements?: Json | null
          total_volume?: number | null
          total_weight?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipments_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_origin_warehouse_id_fkey"
            columns: ["origin_warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouse_utilization_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_origin_warehouse_id_fkey"
            columns: ["origin_warehouse_id"]
            isOneToOne: false
            referencedRelation: "warehouses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_po_id_fkey"
            columns: ["po_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shipments_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          ai_model_version: string | null
          ai_performance_score: number | null
          ai_risk_score: number | null
          blockchain_hash: string | null
          blockchain_verified: boolean | null
          certifications: Json | null
          city: string | null
          code: string
          contact_person: string | null
          country: string | null
          created_at: string | null
          created_by: string | null
          credit_limit: number | null
          currency: string | null
          description: string | null
          email: string | null
          id: string
          is_active: boolean | null
          last_ai_evaluation: string | null
          metadata: Json | null
          name: string
          organization_id: string
          payment_terms: string | null
          performance_metrics: Json | null
          phone: string | null
          postal_code: string | null
          state: string | null
          tax_id: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          ai_model_version?: string | null
          ai_performance_score?: number | null
          ai_risk_score?: number | null
          blockchain_hash?: string | null
          blockchain_verified?: boolean | null
          certifications?: Json | null
          city?: string | null
          code: string
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          currency?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          last_ai_evaluation?: string | null
          metadata?: Json | null
          name: string
          organization_id: string
          payment_terms?: string | null
          performance_metrics?: Json | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          ai_model_version?: string | null
          ai_performance_score?: number | null
          ai_risk_score?: number | null
          blockchain_hash?: string | null
          blockchain_verified?: boolean | null
          certifications?: Json | null
          city?: string | null
          code?: string
          contact_person?: string | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          credit_limit?: number | null
          currency?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          last_ai_evaluation?: string | null
          metadata?: Json | null
          name?: string
          organization_id?: string
          payment_terms?: string | null
          performance_metrics?: Json | null
          phone?: string | null
          postal_code?: string | null
          state?: string | null
          tax_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suppliers_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          accessibility_settings: Json | null
          auth0_id: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          email: string
          full_name: string | null
          github_id: string | null
          id: string
          is_active: boolean
          is_deleted: boolean
          is_superuser: boolean
          is_verified: boolean
          language_preference: string | null
          last_active_at: string | null
          last_login: string | null
          last_password_change: string | null
          locked_until: string | null
          login_attempts: number
          metadata: Json | null
          mfa_enabled: boolean | null
          mfa_secret: string | null
          name: string
          organization_id: string | null
          password_hash: string | null
          permissions: Json | null
          persona_id: string | null
          phone: string | null
          role: string
          timezone: string | null
          totp_enabled: boolean
          updated_at: string
          updated_by: string | null
          version: string
        }
        Insert: {
          accessibility_settings?: Json | null
          auth0_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email: string
          full_name?: string | null
          github_id?: string | null
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          is_superuser?: boolean
          is_verified?: boolean
          language_preference?: string | null
          last_active_at?: string | null
          last_login?: string | null
          last_password_change?: string | null
          locked_until?: string | null
          login_attempts?: number
          metadata?: Json | null
          mfa_enabled?: boolean | null
          mfa_secret?: string | null
          name: string
          organization_id?: string | null
          password_hash?: string | null
          permissions?: Json | null
          persona_id?: string | null
          phone?: string | null
          role?: string
          timezone?: string | null
          totp_enabled?: boolean
          updated_at?: string
          updated_by?: string | null
          version?: string
        }
        Update: {
          accessibility_settings?: Json | null
          auth0_id?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          email?: string
          full_name?: string | null
          github_id?: string | null
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          is_superuser?: boolean
          is_verified?: boolean
          language_preference?: string | null
          last_active_at?: string | null
          last_login?: string | null
          last_password_change?: string | null
          locked_until?: string | null
          login_attempts?: number
          metadata?: Json | null
          mfa_enabled?: boolean | null
          mfa_secret?: string | null
          name?: string
          organization_id?: string | null
          password_hash?: string | null
          permissions?: Json | null
          persona_id?: string | null
          phone?: string | null
          role?: string
          timezone?: string | null
          totp_enabled?: boolean
          updated_at?: string
          updated_by?: string | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          capacity_volume: number | null
          capacity_weight: number | null
          carrier_id: string | null
          certifications: Json | null
          created_at: string | null
          current_location: Json | null
          fuel_type: string | null
          id: string
          iot_device_id: string | null
          is_active: boolean | null
          maintenance_schedule: Json | null
          make_model: string | null
          metadata: Json | null
          organization_id: string
          status: string | null
          updated_at: string | null
          vehicle_id: string
          vehicle_type: string
          year: number | null
        }
        Insert: {
          capacity_volume?: number | null
          capacity_weight?: number | null
          carrier_id?: string | null
          certifications?: Json | null
          created_at?: string | null
          current_location?: Json | null
          fuel_type?: string | null
          id?: string
          iot_device_id?: string | null
          is_active?: boolean | null
          maintenance_schedule?: Json | null
          make_model?: string | null
          metadata?: Json | null
          organization_id: string
          status?: string | null
          updated_at?: string | null
          vehicle_id: string
          vehicle_type: string
          year?: number | null
        }
        Update: {
          capacity_volume?: number | null
          capacity_weight?: number | null
          carrier_id?: string | null
          certifications?: Json | null
          created_at?: string | null
          current_location?: Json | null
          fuel_type?: string | null
          id?: string
          iot_device_id?: string | null
          is_active?: boolean | null
          maintenance_schedule?: Json | null
          make_model?: string | null
          metadata?: Json | null
          organization_id?: string
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string
          vehicle_type?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      warehouses: {
        Row: {
          address: string | null
          capacity_cubic_meters: number | null
          city: string | null
          code: string
          contact_person: string | null
          country: string | null
          created_at: string
          created_by: string | null
          deleted_at: string | null
          deleted_by: string | null
          description: string | null
          email: string | null
          id: string
          is_active: boolean
          is_deleted: boolean
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          name: string
          organization_id: string
          phone: string | null
          postal_code: string | null
          total_capacity: number | null
          updated_at: string
          updated_by: string | null
          used_capacity: number
          version: string
        }
        Insert: {
          address?: string | null
          capacity_cubic_meters?: number | null
          city?: string | null
          code: string
          contact_person?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name: string
          organization_id: string
          phone?: string | null
          postal_code?: string | null
          total_capacity?: number | null
          updated_at?: string
          updated_by?: string | null
          used_capacity?: number
          version?: string
        }
        Update: {
          address?: string | null
          capacity_cubic_meters?: number | null
          city?: string | null
          code?: string
          contact_person?: string | null
          country?: string | null
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          description?: string | null
          email?: string | null
          id?: string
          is_active?: boolean
          is_deleted?: boolean
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name?: string
          organization_id?: string
          phone?: string | null
          postal_code?: string | null
          total_capacity?: number | null
          updated_at?: string
          updated_by?: string | null
          used_capacity?: number
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "warehouses_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_templates: {
        Row: {
          approval_matrix: Json | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          metadata: Json | null
          name: string
          organization_id: string
          trigger_conditions: Json | null
          trigger_type: string
          updated_at: string | null
          workflow_steps: Json
        }
        Insert: {
          approval_matrix?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name: string
          organization_id: string
          trigger_conditions?: Json | null
          trigger_type: string
          updated_at?: string | null
          workflow_steps: Json
        }
        Update: {
          approval_matrix?: Json | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          metadata?: Json | null
          name?: string
          organization_id?: string
          trigger_conditions?: Json | null
          trigger_type?: string
          updated_at?: string | null
          workflow_steps?: Json
        }
        Relationships: [
          {
            foreignKeyName: "workflow_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_templates_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      inventory_status_view: {
        Row: {
          available_quantity: number | null
          category: string | null
          id: string | null
          last_blockchain_sync: string | null
          location_code: string | null
          name: string | null
          on_hand: number | null
          reorder_point: number | null
          reserved: number | null
          sku: string | null
          status: string | null
          updated_at: string | null
          warehouse_code: string | null
          warehouse_name: string | null
        }
        Relationships: []
      }
      low_stock_alert_view: {
        Row: {
          available_quantity: number | null
          id: string | null
          location_code: string | null
          name: string | null
          on_hand: number | null
          priority: string | null
          reorder_point: number | null
          reorder_quantity: number | null
          reserved: number | null
          sku: string | null
          warehouse_code: string | null
          warehouse_name: string | null
        }
        Relationships: []
      }
      warehouse_utilization_view: {
        Row: {
          city: string | null
          code: string | null
          country: string | null
          id: string | null
          item_count: number | null
          name: string | null
          total_capacity: number | null
          used_capacity: number | null
          utilization_level: string | null
          utilization_percentage: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_inventory_turnover: {
        Args: { start_date: string; end_date: string }
        Returns: {
          category: string
          turnover_ratio: number
          avg_inventory: number
          cogs: number
        }[]
      }
      get_on_time_delivery_rate: {
        Args: { start_date: string; end_date: string }
        Returns: {
          warehouse_code: string
          warehouse_name: string
          total_shipments: number
          on_time_shipments: number
          on_time_rate: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
