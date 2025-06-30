import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, Users, Mail, Phone, MapPin, TrendingUp, TrendingDown, Edit, FileText } from "lucide-react"
import { useSupabaseData } from "@/hooks/useSupabaseData"
import { SupplierForm } from "@/components/forms/SupplierForm"
import { DocumentUpload } from "@/components/common/DocumentUpload"

interface Supplier {
  id: string
  code: string
  name: string
  contact_person: string
  email: string
  phone: string
  city: string
  state: string
  country: string
  is_active: boolean
  ai_risk_score: number
}

interface Document {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
}

export default function Suppliers() {
  const [searchTerm, setSearchTerm] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null)
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])

  const { data: suppliers, loading, error } = useSupabaseData<Supplier>(
    "suppliers",
    "id, code, name, contact_person, email, phone, city, state, country, is_active, ai_risk_score",
    { column: "name", ascending: true }
  )

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getRiskColor = (riskScore: number) => {
    if (riskScore <= 0.2) return "bg-green-100 text-green-800"
    if (riskScore <= 0.4) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getRiskLabel = (riskScore: number) => {
    if (riskScore <= 0.2) return "Low Risk"
    if (riskScore <= 0.4) return "Medium Risk"
    return "High Risk"
  }

  const handleFormSuccess = () => {
    setDialogOpen(false)
    setEditingSupplier(null)
  }

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier)
    setDialogOpen(true)
  }

  const handleDocuments = (supplier: Supplier) => {
    setSelectedSupplier(supplier)
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
        <div className="text-lg">Loading suppliers...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading suppliers: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            Supplier Management
          </h1>
          <p className="text-muted-foreground">
            Manage your supplier relationships and performance
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={() => setEditingSupplier(null)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingSupplier ? "Edit Supplier" : "Add New Supplier"}
              </DialogTitle>
            </DialogHeader>
            <SupplierForm
              onSuccess={handleFormSuccess}
              onCancel={() => setDialogOpen(false)}
              initialData={editingSupplier || undefined}
              supplierId={editingSupplier?.id}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search suppliers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Badge variant="outline" className="bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-blue-200">
          Total: {suppliers.length}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <p className="text-sm text-muted-foreground font-mono">{supplier.code}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant={supplier.is_active ? "default" : "secondary"}
                         className={supplier.is_active ? "bg-green-100 text-green-800" : ""}>
                    {supplier.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline" className={getRiskColor(supplier.ai_risk_score)}>
                    {getRiskLabel(supplier.ai_risk_score)}
                  </Badge>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(supplier)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDocuments(supplier)}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {supplier.contact_person && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{supplier.contact_person}</span>
                  </div>
                )}
                {supplier.email && (
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{supplier.email}</span>
                  </div>
                )}
                {supplier.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{supplier.phone}</span>
                  </div>
                )}
                {supplier.city && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">
                      {supplier.city}, {supplier.state}, {supplier.country}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-sm font-medium">Risk Score:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-bold">
                      {(supplier.ai_risk_score * 100).toFixed(1)}%
                    </span>
                    {supplier.ai_risk_score <= 0.2 ? (
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    ) : (
                      <TrendingUp className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
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
              Documents - {selectedSupplier?.name}
            </DialogTitle>
          </DialogHeader>
          {selectedSupplier && (
            <DocumentUpload
              entityId={selectedSupplier.id}
              entityType="supplier"
              documents={documents}
              onDocumentUploaded={handleDocumentUploaded}
              onDocumentDeleted={handleDocumentDeleted}
            />
          )}
        </DialogContent>
      </Dialog>

      {filteredSuppliers.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No suppliers found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Start by adding your first supplier"}
          </p>
          <Button 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      )}
    </div>
  )
}
