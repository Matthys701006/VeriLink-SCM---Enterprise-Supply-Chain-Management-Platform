
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, Package, AlertTriangle, Edit } from "lucide-react"
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime"
import { InventoryItemForm } from "@/components/forms/InventoryItemForm"
import { useAppStore } from "@/stores/appStore"

interface InventoryItem {
  id: string
  sku: string
  name: string
  description: string
  category: string
  on_hand: number
  reorder_point: number
  unit_cost: number
  status: string
}

export default function Inventory() {
  const { searchTerm, setSearchTerm } = useAppStore()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  
  const { data: inventoryItems, loading, error } = useSupabaseRealtime<InventoryItem>(
    "inventory_items",
    "id, sku, name, description, category, on_hand, reorder_point, unit_cost, status",
    { column: "name", ascending: true },
    true // Enable real-time updates
  )

  const filteredItems = inventoryItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "low_stock":
        return "bg-yellow-100 text-yellow-800"
      case "out_of_stock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleFormSuccess = () => {
    setDialogOpen(false)
    setEditingItem(null)
  }

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item)
    setDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading inventory...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading inventory: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Track and manage your inventory levels with real-time updates
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingItem(null)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? "Edit Inventory Item" : "Add New Inventory Item"}
              </DialogTitle>
            </DialogHeader>
            <InventoryItemForm
              onSuccess={handleFormSuccess}
              onCancel={() => setDialogOpen(false)}
              initialData={editingItem || undefined}
              itemId={editingItem?.id}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search inventory..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          Real-time updates enabled
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{item.sku}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className={getStatusColor(item.status)}>
                    {item.status.replace('_', ' ')}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Category:</span>
                  <span className="text-sm">{item.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">On Hand:</span>
                  <span className={`text-sm font-bold ${item.on_hand <= item.reorder_point ? 'text-red-600' : 'text-green-600'}`}>
                    {item.on_hand}
                    {item.on_hand <= item.reorder_point && (
                      <AlertTriangle className="w-4 h-4 inline ml-1" />
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Reorder Point:</span>
                  <span className="text-sm">{item.reorder_point}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Unit Cost:</span>
                  <span className="text-sm font-bold">${item.unit_cost}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No inventory items found</h3>
          <p className="text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms" : "Start by adding your first inventory item"}
          </p>
        </div>
      )}
    </div>
  )
}
