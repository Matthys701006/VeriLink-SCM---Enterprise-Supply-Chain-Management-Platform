
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/stores/appStore"
import { useSupabaseData } from "@/hooks/useSupabaseData"

const purchaseOrderSchema = z.object({
  po_number: z.string().min(1, "PO Number is required"),
  supplier_id: z.string().min(1, "Supplier is required"),
  status: z.string().default("draft"),
  priority: z.string().default("normal"),
  currency: z.string().default("USD"),
  subtotal: z.number().min(0, "Subtotal must be positive"),
  tax_amount: z.number().min(0, "Tax amount must be positive"),
  shipping_amount: z.number().min(0, "Shipping amount must be positive"),
  total_amount: z.number().min(0, "Total amount must be positive"),
  payment_terms: z.string().optional(),
  shipping_address: z.string().optional(),
  notes: z.string().optional(),
})

type PurchaseOrderFormData = z.infer<typeof purchaseOrderSchema>

interface PurchaseOrderFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<PurchaseOrderFormData>
  orderId?: string
}

interface Supplier {
  id: string
  name: string
  code: string
}

export function PurchaseOrderForm({ onSuccess, onCancel, initialData, orderId }: PurchaseOrderFormProps) {
  const { toast } = useToast()
  const { addNotification } = useAppStore()
  const { data: suppliers } = useSupabaseData<Supplier>("suppliers", "id, name, code")

  const form = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      po_number: initialData?.po_number || "",
      supplier_id: initialData?.supplier_id || "",
      status: initialData?.status || "draft",
      priority: initialData?.priority || "normal",
      currency: initialData?.currency || "USD",
      subtotal: initialData?.subtotal || 0,
      tax_amount: initialData?.tax_amount || 0,
      shipping_amount: initialData?.shipping_amount || 0,
      total_amount: initialData?.total_amount || 0,
      payment_terms: initialData?.payment_terms || "",
      shipping_address: initialData?.shipping_address || "",
      notes: initialData?.notes || "",
    }
  })

  const onSubmit = async (data: PurchaseOrderFormData) => {
    try {
      const orderData = {
        po_number: data.po_number,
        supplier_id: data.supplier_id,
        status: data.status,
        priority: data.priority,
        currency: data.currency,
        subtotal: data.subtotal,
        tax_amount: data.tax_amount,
        shipping_amount: data.shipping_amount,
        total_amount: data.total_amount,
        payment_terms: data.payment_terms || "",
        shipping_address: data.shipping_address || "",
        notes: data.notes || "",
        organization_id: "550e8400-e29b-41d4-a716-446655440000",
      }

      let result
      if (orderId) {
        result = await supabase
          .from("purchase_orders")
          .update(orderData)
          .eq("id", orderId)
      } else {
        result = await supabase
          .from("purchase_orders")
          .insert(orderData)
      }

      if (result.error) {
        throw result.error
      }

      toast({
        title: "Success",
        description: `Purchase order ${orderId ? 'updated' : 'created'} successfully`,
      })

      addNotification({
        type: 'success',
        title: 'Purchase Order Updated',
        message: `Purchase order "${data.po_number}" has been ${orderId ? 'updated' : 'created'}`
      })

      onSuccess?.()
    } catch (error: any) {
      console.error("Error saving purchase order:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save purchase order",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="po_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>PO Number</FormLabel>
                <FormControl>
                  <Input placeholder="PO-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="supplier_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        {supplier.name} ({supplier.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <Input placeholder="USD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="payment_terms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Terms</FormLabel>
                <FormControl>
                  <Input placeholder="Net 30" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subtotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subtotal</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tax_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tax Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shipping_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Amount</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01"
                    placeholder="0.00" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="shipping_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shipping Address</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter shipping address" 
                  {...field} 
                  rows={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Additional notes" 
                  {...field} 
                  rows={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : orderId ? "Update Order" : "Create Order"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
