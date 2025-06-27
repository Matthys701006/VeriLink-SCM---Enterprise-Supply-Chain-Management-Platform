
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useSupabaseData } from "@/hooks/useSupabaseData"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unit_price: z.number().min(0, "Unit price must be positive"),
  total: z.number().min(0, "Total must be positive")
})

const invoiceSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  supplier_id: z.string().min(1, "Supplier is required"),
  po_id: z.string().optional(),
  invoice_date: z.string().min(1, "Invoice date is required"),
  due_date: z.string().min(1, "Due date is required"),
  payment_terms: z.string().min(1, "Payment terms are required"),
  currency: z.string().min(1, "Currency is required"),
  subtotal: z.number().min(0, "Subtotal must be positive"),
  tax_amount: z.number().min(0, "Tax amount must be positive"),
  shipping_amount: z.number().min(0, "Shipping amount must be positive"),
  total_amount: z.number().min(0, "Total amount must be positive"),
  notes: z.string().optional(),
  line_items: z.array(lineItemSchema).min(1, "At least one line item is required")
})

type InvoiceFormData = z.infer<typeof invoiceSchema>
type LineItem = z.infer<typeof lineItemSchema>

interface InvoiceFormProps {
  onSuccess: () => void
  onCancel: () => void
}

interface Supplier {
  id: string
  name: string
  code: string
}

interface PurchaseOrder {
  id: string
  po_number: string
  supplier_id: string
}

export function InvoiceForm({ onSuccess, onCancel }: InvoiceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unit_price: 0, total: 0 }
  ])
  const { toast } = useToast()

  const { data: suppliers } = useSupabaseData<Supplier>(
    "suppliers",
    "id, name, code"
  )

  const { data: purchaseOrders } = useSupabaseData<PurchaseOrder>(
    "purchase_orders",
    "id, po_number, supplier_id"
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      currency: "USD",
      subtotal: 0,
      tax_amount: 0,
      shipping_amount: 0,
      total_amount: 0,
      line_items: lineItems
    }
  })

  const watchedValues = watch()

  const addLineItem = () => {
    const newLineItems = [...lineItems, { description: "", quantity: 1, unit_price: 0, total: 0 }]
    setLineItems(newLineItems)
    setValue("line_items", newLineItems)
  }

  const removeLineItem = (index: number) => {
    const newLineItems = lineItems.filter((_, i) => i !== index)
    setLineItems(newLineItems)
    setValue("line_items", newLineItems)
    calculateTotals(newLineItems)
  }

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const newLineItems = [...lineItems]
    newLineItems[index] = { ...newLineItems[index], [field]: value }
    
    if (field === 'quantity' || field === 'unit_price') {
      newLineItems[index].total = newLineItems[index].quantity * newLineItems[index].unit_price
    }
    
    setLineItems(newLineItems)
    setValue("line_items", newLineItems)
    calculateTotals(newLineItems)
  }

  const calculateTotals = (items: LineItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const taxAmount = watchedValues.tax_amount || 0
    const shippingAmount = watchedValues.shipping_amount || 0
    const total = subtotal + taxAmount + shippingAmount

    setValue("subtotal", subtotal)
    setValue("total_amount", total)
  }

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setIsSubmitting(true)

      const invoiceData = {
        organization_id: "550e8400-e29b-41d4-a716-446655440000", // Default org ID
        invoice_number: data.invoice_number,
        supplier_id: data.supplier_id,
        po_id: data.po_id || null,
        invoice_date: data.invoice_date,
        due_date: data.due_date,
        payment_terms: data.payment_terms,
        currency: data.currency,
        subtotal: data.subtotal,
        tax_amount: data.tax_amount,
        shipping_amount: data.shipping_amount,
        total_amount: data.total_amount,
        line_items: data.line_items,
        status: 'pending'
      }

      const { error } = await supabase
        .from("invoices")
        .insert(invoiceData)

      if (error) throw error

      toast({
        title: "Success",
        description: "Invoice created successfully",
      })

      reset()
      onSuccess()
    } catch (error) {
      console.error("Error creating invoice:", error)
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoice_number">Invoice Number</Label>
          <Input
            id="invoice_number"
            {...register("invoice_number")}
            placeholder="INV-001"
          />
          {errors.invoice_number && (
            <p className="text-sm text-red-600">{errors.invoice_number.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier_id">Supplier</Label>
          <Select onValueChange={(value) => setValue("supplier_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.name} ({supplier.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.supplier_id && (
            <p className="text-sm text-red-600">{errors.supplier_id.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="po_id">Purchase Order (Optional)</Label>
          <Select onValueChange={(value) => setValue("po_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select PO" />
            </SelectTrigger>
            <SelectContent>
              {purchaseOrders.map((po) => (
                <SelectItem key={po.id} value={po.id}>
                  {po.po_number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select onValueChange={(value) => setValue("currency", value)} defaultValue="USD">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="invoice_date">Invoice Date</Label>
          <Input
            id="invoice_date"
            type="date"
            {...register("invoice_date")}
          />
          {errors.invoice_date && (
            <p className="text-sm text-red-600">{errors.invoice_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            type="date"
            {...register("due_date")}
          />
          {errors.due_date && (
            <p className="text-sm text-red-600">{errors.due_date.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_terms">Payment Terms</Label>
          <Input
            id="payment_terms"
            {...register("payment_terms")}
            placeholder="Net 30"
          />
          {errors.payment_terms && (
            <p className="text-sm text-red-600">{errors.payment_terms.message}</p>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Line Items
            <Button type="button" onClick={addLineItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lineItems.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Input
                  value={item.description}
                  onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                  placeholder="Item description"
                />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 0)}
                  min="1"
                />
              </div>
              <div>
                <Label>Unit Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => updateLineItem(index, 'unit_price', parseFloat(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <Label>Total</Label>
                  <Input
                    type="number"
                    value={item.total}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
                {lineItems.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeLineItem(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tax_amount">Tax Amount</Label>
            <Input
              id="tax_amount"
              type="number"
              step="0.01"
              {...register("tax_amount", { valueAsNumber: true })}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0
                setValue("tax_amount", value)
                calculateTotals(lineItems)
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shipping_amount">Shipping Amount</Label>
            <Input
              id="shipping_amount"
              type="number"
              step="0.01"
              {...register("shipping_amount", { valueAsNumber: true })}
              onChange={(e) => {
                const value = parseFloat(e.target.value) || 0
                setValue("shipping_amount", value)
                calculateTotals(lineItems)
              }}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="total_amount">Total Amount</Label>
            <Input
              id="total_amount"
              type="number"
              {...register("total_amount", { valueAsNumber: true })}
              readOnly
              className="bg-gray-50 font-bold"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            {...register("notes")}
            placeholder="Additional notes..."
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Invoice"}
        </Button>
      </div>
    </form>
  )
}
