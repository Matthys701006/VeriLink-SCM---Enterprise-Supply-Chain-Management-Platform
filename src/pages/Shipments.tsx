import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, Truck, Calendar, Package, MapPin, FileText } from "lucide-react"
import { useSupabaseData } from "@/hooks/useSupabaseData"
import { ShipmentForm } from "@/components/forms/ShipmentForm"
import { DocumentUpload } from "@/components/common/DocumentUpload"

interface Shipment {
  id: string
  shipment_number: string
  status: string
  origin: string
  destination: string
  expected_delivery: string
  carrier: string
  tracking_number: string
  created_at: string
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
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null)
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])

  const { data: shipments, loading, error } = useSupabaseData<Shipment>(
    "shipments",
    "id, shipment_number, status, origin, destination, expected_delivery, carrier, tracking_number, created_at",
    { column: "created_at", ascending: false }
  )

  const filteredShipments = shipments.filter(shipment =>
    shipment.shipment_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shipment.destination.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in_transit":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleFormSuccess = () => {
    setDialogOpen(false)
    setEditingShipment(null)
  }

  const handleEdit = (shipment: Shipment) => {
    setEditingShipment(shipment)
    setDialogOpen(true)
  }

  const handleDocuments = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setDocumentDialogOpen(true)
  }

  const handleDocumentUploaded = (doc: Document) => {
    setDocuments(prev => [...prev, doc])
  }

  const handleDocumentDeleted = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id))
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Shipments
          </h1>
          <p className="text-muted-foreground">
            Track and manage your shipments
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => setEditingShipment(null)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Shipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingShipment ? "Edit Shipment" : "Add New Shipment"}
              </DialogTitle>
            </DialogHeader>
            <ShipmentForm
              onSuccess={handleFormSuccess}
              onCancel={() => setDialogOpen(false)}
              initialData={editingShipment || undefined}
              shipmentId={editingShipment?.id}
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
        <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200">
          Total: {shipments.length}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredShipments.map((shipment) => (
          <Card key={shipment.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{shipment.shipment_number}</CardTitle>
                    <p className="text-sm text-muted-foreground font-mono">{shipment.carrier}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant="outline" className={getStatusColor(shipment.status)}>
                    {shipment.status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(shipment)}
                    >
                      <Package className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDocuments(shipment)}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Expected: {new Date(shipment.expected_delivery).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{shipment.origin} → {shipment.destination}</span>
                </div>
                {shipment.tracking_number && (
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-mono">{shipment.tracking_number}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Document Management Dialog */}
      <Dialog open={documentDialogOpen} onOpenChange={setDocumentDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Documents - {selectedShipment?.shipment_number}
            </DialogTitle>
          </DialogHeader>
          {selectedShipment && (
            <DocumentUpload
              entityId={selectedShipment.id}
              entityType="shipment"
              documents={documents}
              onDocumentUploaded={handleDocumentUploaded}
              onDocumentDeleted={handleDocumentDeleted}
            />
          )}
        </DialogContent>
      </Dialog>

      {filteredShipments.length === 0 && !loading && (
        <div className="text-center py-12">
          <Truck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No shipments found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Start by adding your first shipment"}
          </p>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Shipment
          </Button>
        </div>
      )}
    </div>
  )
}
