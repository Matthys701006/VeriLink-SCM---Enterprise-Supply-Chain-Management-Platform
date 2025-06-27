import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, Warehouse, MapPin, Package, TrendingUp, TrendingDown, Phone, Mail, User, Edit } from "lucide-react"
import { useSupabaseData } from "@/hooks/useSupabaseData"
import { WarehouseForm } from "@/components/forms/WarehouseForm"
import { DocumentUpload } from "@/components/common/DocumentUpload"

interface WarehouseData {
  id: string
  code: string
  name: string
  address: string
  city: string
  country: string
  capacity_cubic_meters: number
  used_capacity: number
  contact_person: string
  phone: string
  email: string
  is_active: boolean
}

export default function Warehouses() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseData | null>(null)
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false)
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseData | null>(null)
  const [documents, setDocuments] = useState<any[]>([])

  const { data: warehouses, loading, error } = useSupabaseData<WarehouseData>(
    "warehouses",
    "id, code, name, address, city, country, capacity_cubic_meters, used_capacity, contact_person, phone, email, is_active",
    { column: "name", ascending: true }
  )

  const filteredWarehouses = warehouses.filter(warehouse =>
    warehouse.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    warehouse.city?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 60) return "text-green-600"
    if (utilization < 85) return "text-yellow-600"
    return "text-red-600"
  }

  const getUtilizationBadge = (utilization: number) => {
    if (utilization < 60) return "bg-green-100 text-green-800"
    if (utilization < 85) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const handleFormSuccess = () => {
    setDialogOpen(false)
    setEditingWarehouse(null)
  }

  const handleEdit = (warehouse: WarehouseData) => {
    setEditingWarehouse(warehouse)
    setDialogOpen(true)
  }

  const handleDocuments = (warehouse: WarehouseData) => {
    setSelectedWarehouse(warehouse)
    setDocumentDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading warehouses...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading warehouses: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Warehouse Management
          </h1>
          <p className="text-muted-foreground">
            Monitor and manage your warehouse facilities
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => setEditingWarehouse(null)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Warehouse
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingWarehouse ? "Edit Warehouse" : "Add New Warehouse"}
              </DialogTitle>
            </DialogHeader>
            <WarehouseForm
              onSuccess={handleFormSuccess}
              onCancel={() => setDialogOpen(false)}
              initialData={editingWarehouse || undefined}
              warehouseId={editingWarehouse?.id}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search warehouses..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200">
          Total: {warehouses.length}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredWarehouses.map((warehouse) => {
          const utilization = warehouse.capacity_cubic_meters > 0 
            ? (warehouse.used_capacity / warehouse.capacity_cubic_meters) * 100 
            : 0
          
          return (
            <Card key={warehouse.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                      <Warehouse className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{warehouse.name}</CardTitle>
                      <p className="text-sm text-muted-foreground font-mono">{warehouse.code}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge variant={warehouse.is_active ? "default" : "secondary"} 
                           className={warehouse.is_active ? "bg-green-100 text-green-800" : ""}>
                      {warehouse.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className={getUtilizationBadge(utilization)}>
                      {utilization.toFixed(1)}% Used
                    </Badge>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(warehouse)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDocuments(warehouse)}
                      >
                        <Package className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {warehouse.address && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p>{warehouse.address}</p>
                        <p className="text-muted-foreground">{warehouse.city}, {warehouse.country}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Capacity</p>
                      <p className="text-sm font-semibold">
                        {warehouse.capacity_cubic_meters?.toLocaleString() || 0} m³
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Used</p>
                      <p className={`text-sm font-bold ${getUtilizationColor(utilization)}`}>
                        {warehouse.used_capacity?.toLocaleString() || 0} m³
                        {utilization < 60 ? (
                          <TrendingDown className="w-3 h-3 inline ml-1" />
                        ) : (
                          <TrendingUp className="w-3 h-3 inline ml-1" />
                        )}
                      </p>
                    </div>
                  </div>

                  {(warehouse.contact_person || warehouse.phone || warehouse.email) && (
                    <div className="pt-3 border-t space-y-2">
                      {warehouse.contact_person && (
                        <div className="flex items-center space-x-2 text-sm">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{warehouse.contact_person}</span>
                        </div>
                      )}
                      {warehouse.phone && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{warehouse.phone}</span>
                        </div>
                      )}
                      {warehouse.email && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span>{warehouse.email}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="pt-3 border-t">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          utilization < 60 ? 'bg-green-500' : 
                          utilization < 85 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(utilization, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      Utilization: {utilization.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Document Management Dialog */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Documents - {selectedWarehouse?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedWarehouse && (
            <DocumentUpload
              entityId={selectedWarehouse.id}
              entityType="warehouse"
              documents={documents}
              onDocumentUploaded={(doc) => setDocuments([...documents, doc])}
              onDocumentDeleted={(id) => setDocuments(documents.filter(d => d.id !== id))}
            />
          )}
        </DialogContent>
      </Dialog>

      {filteredWarehouses.length === 0 && !loading && (
        <div className="text-center py-12">
          <Warehouse className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No warehouses found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Start by adding your first warehouse"}
          </p>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Warehouse
          </Button>
        </div>
      )}

      {/* VeriLink Badge */}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Package className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      </div>
    </div>
  )
}
