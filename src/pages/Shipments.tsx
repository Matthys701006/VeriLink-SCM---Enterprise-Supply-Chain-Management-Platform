
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, Truck, Calendar, Package, MapPin } from "lucide-react"
import { useSupabaseData } from "@/hooks/useSupabaseData"
import { ShipmentForm } from "@/components/forms/ShipmentForm"
import { DocumentUpload } from "@/components/common/DocumentUpload"

interface Shipment {
  id: string
  shipment_number: string
  status: string
  planned_delivery_date: string
  actual_delivery_date: string
  total_weight: number
  shipping_cost: number
  priority: string
  destination_address: string
  package_count: number
  tracking_number: string
}

interface Document {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
}

export default function Shipments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const { data: shipments, loading, error, refetch } = useSupabaseData<Shipment>(
    "shipments",
    "id, shipment_number, status, planned_delivery_date, actual_delivery_date, total_weight, shipping_cost, priority, destination_address, package_count, tracking_number",
    { column: "planned_delivery_date", ascending: false }
  )

  const filteredShipments = shipments.filter(shipment =>
    shipment.shipment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "in_transit":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "delayed":
        return "bg-red-100 text-red-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    refetch()
  }

  const handleDocumentUploaded = (document: Document) => {
    setDocuments(prev => [...prev, document])
  }

  const handleDocumentDeleted = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading shipments...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading shipments: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Shipment Tracking</h1>
          <p className="text-muted-foreground">
            Monitor your shipments and delivery status
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Shipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Shipment</DialogTitle>
            </DialogHeader>
            <ShipmentForm 
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search shipments..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredShipments.map((shipment) => (
              <Card key={shipment.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-5 h-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{shipment.shipment_number}</CardTitle>
                        {shipment.tracking_number && (
                          <p className="text-sm text-muted-foreground">
                            Track: {shipment.tracking_number}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant="outline" className={getStatusColor(shipment.status)}>
                        {shipment.status.replace('_', ' ')}
                      </Badge>
                      {shipment.priority && (
                        <Badge variant="outline" className={getPriorityColor(shipment.priority)}>
                          {shipment.priority}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <div className="text-sm">
                        <span className="font-medium">{shipment.package_count || 1} packages</span>
                        {shipment.total_weight && (
                          <span className="text-muted-foreground ml-2">
                            • {shipment.total_weight} kg
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p>Planned: {new Date(shipment.planned_delivery_date).toLocaleDateString()}</p>
                        {shipment.actual_delivery_date && (
                          <p>Delivered: {new Date(shipment.actual_delivery_date).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>

                    {shipment.destination_address && (
                      <div className="flex items-start space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          {shipment.destination_address}
                        </p>
                      </div>
                    )}

                    {shipment.shipping_cost && (
                      <div className="pt-2 border-t">
                        <p className="text-sm">
                          <span className="font-medium">Cost: </span>
                          <span className="font-bold">${shipment.shipping_cost.toLocaleString()}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredShipments.length === 0 && !loading && (
            <div className="text-center py-12">
              <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No shipments found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "Start by creating your first shipment"}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <DocumentUpload
            entityId="shipments"
            entityType="shipments"
            documents={documents}
            onDocumentUploaded={handleDocumentUploaded}
            onDocumentDeleted={handleDocumentDeleted}
          />
        </div>
      </div>
    </div>
  )
}
