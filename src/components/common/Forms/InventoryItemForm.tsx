
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { inventoryItemSchema, type InventoryItemFormData } from "@/schemas/validationSchemas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useSupabaseData } from "@/hooks/useSupabaseData"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAppStore } from "@/stores/appStore"

interface InventoryItemFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<InventoryItemFormData>
  itemId?: string
}

interface Warehouse {
  id: string
  name: string
  code: string
}

export function InventoryItemForm({ onSuccess, onCancel, initialData, itemId }: InventoryItemFormProps) {
  const { toast } = useToast()
  const { addNotification } = useAppStore()
  const { data: warehouses } = useSupabaseData<Warehouse>("warehouses", "id, name, code")

  const form = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
    defaultValues: {
      sku: initialData?.sku || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      on_hand: initialData?.on_hand || 0,
      reorder_point: initialData?.reorder_point || 0,
      reorder_quantity: initialData?.reorder_quantity || 1,
      unit_cost: initialData?.unit_cost || 0,
      warehouse_id: initialData?.warehouse_id || ""
    }
  })

  const onSubmit = async (data: InventoryItemFormData) => {
    try {
      // Ensure all required fields are present and properly typed
      const itemData = {
        sku: data.sku,
        name: data.name,
        description: data.description || null,
        category: data.category,
        on_hand: data.on_hand,
        reorder_point: data.reorder_point,
        reorder_quantity: data.reorder_quantity,
        unit_cost: data.unit_cost,
        warehouse_id: data.warehouse_id,
        organization_id: "550e8400-e29b-41d4-a716-446655440000", // Default org ID
        is_active: true,
        status: 'available' as const
      }

      let result
      if (itemId) {
        result = await supabase
          .from("inventory_items")
          .update(itemData)
          .eq("id", itemId)
      } else {
        result = await supabase
          .from("inventory_items")
          .insert(itemData)
      }

      if (result.error) {
        throw result.error
      }

      toast({
        title: "Success",
        description: `Inventory item ${itemId ? 'updated' : 'created'} successfully`,
      })

      addNotification({
        type: 'success',
        title: 'Inventory Updated',
        message: `Item "${data.name}" has been ${itemId ? 'updated' : 'created'}`
      })

      onSuccess?.()
    } catch (error: any) {
      console.error("Error saving inventory item:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to save inventory item",
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
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="Enter SKU" {...field} />
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
                  <Input placeholder="Enter item name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="warehouse_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warehouse</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {warehouses.map((warehouse) => (
                      <SelectItem key={warehouse.id} value={warehouse.id}>
                        {warehouse.name} ({warehouse.code})
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
            name="on_hand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>On Hand Quantity</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reorder_point"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reorder Point</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="reorder_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reorder Quantity</FormLabel>
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
            name="unit_cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Unit Cost</FormLabel>
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter item description" 
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
            {form.formState.isSubmitting ? "Saving..." : itemId ? "Update Item" : "Create Item"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
