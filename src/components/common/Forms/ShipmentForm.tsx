
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

const shipmentSchema = z.object({
  shipment_number: z.string().min(1, "Shipment number is required"),
  status: z.string().default("pending"),
  priority: z.string().default("normal"),
  tracking_number: z.string().optional(),
  destination_address: z.string().optional(),
  package_count: z.number().min(1, "Package count must be at least 1"),
  total_weight: z.number().min(0, "Weight must be positive"),
  total_volume: z.number().min(0, "Volume must be positive"),
  shipping_cost: z.number().min(0, "Cost must be positive"),
  special_instructions: z.string().optional(),
})

type ShipmentFormData = z.infer<typeof shipmentSchema>

interface ShipmentFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<ShipmentFormData>
  shipmentId?: string
}

export function ShipmentForm({ onSuccess, onCancel, initialData, shipmentId }: ShipmentFormProps) {
  const { toast } = useToast()
  const { addNotification } = useAppStore()

  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues: {
      shipment_number: initialData?.shipment_number || "",
      status: initialData?.status || "pending",
      priority: initialData?.priority || "normal",
      tracking_number: initialData?.tracking_number || "",
      destination_address: initialData?.destination_address || "",
      package_count: initialData?.package_count || 1,
      total_weight: initialData?.total_weight || 0,
      total_volume: initialData?.total_volume || 0,
      shipping_cost: initialData?.shipping_cost || 0,
      special_instructions: initialData?.special_instructions || "",
    }
  })

  const onSubmit = async (data: ShipmentFormData) => {
    try {
      const shipmentData = {
        shipment_number: data.shipment_number,
        status: data.status,
        priority: data.priority,
        tracking_number: data.tracking_number || "",
        destination_address: data.destination_address || "",
        package_count: data.package_count,
        total_weight: data.total_weight,
        total_volume: data.total_volume,
        shipping_cost: data.shipping_cost,
        special_instructions: data.special_instructions || "",
        organization_id: "550e8400-e29b-41d4-a716-446655440000",
      }

      let result
      if (shipmentId) {
        result = await supabase
          .from("shipments")
          .update(shipmentData)
          .eq("id", shipmentId)
      } else {
        result = await supabase
          .from("shipments")
          .insert(shipmentData)
      }

      if (result.error) {
        throw result.error
      }

      toast({
        title: "Success",
        description: `Shipment ${shipmentId ? 'updated' : 'created'} successfully`,
      })

      addNotification({
        type: 'success',
        title: 'Shipment Updated',
        message: `Shipment "${data.shipment_number}" has been ${shipmentId ? 'updated' : 'created'}`
      })

      onSuccess?.()
    } catch (error: any) {
      console.error("Error saving shipment:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save shipment",
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
            name="shipment_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipment Number</FormLabel>
                <FormControl>
                  <Input placeholder="SH-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tracking_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tracking Number</FormLabel>
                <FormControl>
                  <Input placeholder="TRK123456789" {...field} />
                </FormControl>
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
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
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
            name="package_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Package Count</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="1" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total_weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Weight (kg)</FormLabel>
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
            name="total_volume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Volume (m³)</FormLabel>
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
            name="shipping_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shipping Cost</FormLabel>
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
          name="destination_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination Address</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter destination address" 
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
          name="special_instructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Instructions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any special handling instructions" 
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
            {form.formState.isSubmitting ? "Saving..." : shipmentId ? "Update Shipment" : "Create Shipment"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
