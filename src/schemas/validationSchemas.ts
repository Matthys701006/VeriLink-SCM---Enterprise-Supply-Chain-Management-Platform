
import { z } from "zod"

// Authentication schemas
export const signUpSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export type SignUpFormData = z.infer<typeof signUpSchema>
export type SignInFormData = z.infer<typeof signInSchema>

// User preferences schema
export const userPreferencesSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).default("system"),
  language: z.string().default("en"),
  itemsPerPage: z.number().int().min(10).max(100).default(25),
  emailNotifications: z.boolean().default(true),
  pushNotifications: z.boolean().default(true),
  lowStockAlerts: z.boolean().default(true),
  deliveryNotifications: z.boolean().default(true)
})

export type UserPreferencesFormData = z.infer<typeof userPreferencesSchema>

// Supplier form schema
export const supplierSchema = z.object({
  code: z.string().min(1, "Supplier code is required"),
  name: z.string().min(1, "Supplier name is required"),
  description: z.string().optional(),
  contact_person: z.string().optional(),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  payment_terms: z.string().optional(),
  currency: z.string().default("USD")
})

export type SupplierFormData = z.infer<typeof supplierSchema>

// Purchase Order form schema
export const purchaseOrderSchema = z.object({
  po_number: z.string().min(1, "PO number is required"),
  supplier_id: z.string().min(1, "Please select a supplier"),
  order_date: z.date(),
  expected_delivery_date: z.date().optional(),
  status: z.enum(["draft", "pending", "approved", "delivered", "cancelled"]).default("draft"),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  currency: z.string().default("USD"),
  payment_terms: z.string().optional(),
  shipping_address: z.string().optional(),
  billing_address: z.string().optional(),
  notes: z.string().optional()
})

export type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>

// Shipment form schema
export const shipmentSchema = z.object({
  shipment_number: z.string().min(1, "Shipment number is required"),
  tracking_number: z.string().optional(),
  status: z.enum(["pending", "in_transit", "delivered", "cancelled"]).default("pending"),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  planned_pickup_date: z.date().optional(),
  planned_delivery_date: z.date().optional(),
  actual_pickup_date: z.date().optional(),
  actual_delivery_date: z.date().optional(),
  total_weight: z.number().positive().optional(),
  total_volume: z.number().positive().optional(),
  shipping_cost: z.number().positive().optional(),
  destination_address: z.string().optional(),
  special_instructions: z.string().optional()
})

export type ShipmentFormData = z.infer<typeof shipmentSchema>

// Inventory Item form schema  
export const inventoryItemSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  warehouse_id: z.string().min(1, "Please select a warehouse"),
  on_hand: z.number().int().min(0, "On hand quantity must be 0 or greater"),
  reorder_point: z.number().int().min(0, "Reorder point must be 0 or greater"),
  reorder_quantity: z.number().int().min(1, "Reorder quantity must be at least 1"),
  unit_cost: z.number().positive("Unit cost must be greater than 0"),
  location_code: z.string().optional()
})

export type InventoryItemFormData = z.infer<typeof inventoryItemSchema>
