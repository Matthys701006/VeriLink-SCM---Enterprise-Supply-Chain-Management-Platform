
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/stores/appStore"

const warehouseSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postal_code: z.string().optional(),
  capacity_cubic_meters: z.number().min(0, "Capacity must be positive"),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
})

type WarehouseFormData = z.infer<typeof warehouseSchema>

interface WarehouseFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<WarehouseFormData>
  warehouseId?: string
}

export function WarehouseForm({ onSuccess, onCancel, initialData, warehouseId }: WarehouseFormProps) {
  const { toast } = useToast()
  const { addNotification } = useAppStore()

  const form = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      code: initialData?.code || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      address: initialData?.address || "",
      city: initialData?.city || "",
      country: initialData?.country || "",
      postal_code: initialData?.postal_code || "",
      capacity_cubic_meters: initialData?.capacity_cubic_meters || 0,
      contact_person: initialData?.contact_person || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
    }
  })

  const onSubmit = async (data: WarehouseFormData) => {
    try {
      // Ensure required fields are present and properly typed
      const warehouseData = {
        code: data.code,
        name: data.name,
        description: data.description || "",
        address: data.address || "",
        city: data.city || "",
        country: data.country || "",
        postal_code: data.postal_code || "",
        capacity_cubic_meters: data.capacity_cubic_meters,
        contact_person: data.contact_person || "",
        phone: data.phone || "",
        email: data.email || "",
        organization_id: "550e8400-e29b-41d4-a716-446655440000",
        is_active: true,
        used_capacity: 0,
      }

      let result
      if (warehouseId) {
        result = await supabase
          .from("warehouses")
          .update(warehouseData)
          .eq("id", warehouseId)
      } else {
        result = await supabase
          .from("warehouses")
          .insert(warehouseData)
      }

      if (result.error) {
        throw result.error
      }

      toast({
        title: "Success",
        description: `Warehouse ${warehouseId ? 'updated' : 'created'} successfully`,
      })

      addNotification({
        type: 'success',
        title: 'Warehouse Updated',
        message: `Warehouse "${data.name}" has been ${warehouseId ? 'updated' : 'created'}`
      })

      onSuccess?.()
    } catch (error: any) {
      console.error("Error saving warehouse:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save warehouse",
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
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warehouse Code</FormLabel>
                <FormControl>
                  <Input placeholder="WH001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Main Warehouse" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contact_person"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Person</FormLabel>
                <FormControl>
                  <Input placeholder="John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1-555-0123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="contact@warehouse.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="capacity_cubic_meters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity (m³)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="10000" 
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
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="New York" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="United States" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="10001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="123 Main Street, Suite 100" 
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Warehouse description and notes" 
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
            {form.formState.isSubmitting ? "Saving..." : warehouseId ? "Update Warehouse" : "Create Warehouse"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
