
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, FileText, Calendar, DollarSign, AlertCircle } from "lucide-react"
import { useSupabaseData } from "@/hooks/useSupabaseData"
import { DocumentUpload } from "@/components/common/DocumentUpload"
import { InvoiceForm } from "@/components/forms/InvoiceForm"

interface Invoice {
  id: string
  invoice_number: string
  invoice_date: string
  due_date: string
  status: string
  total_amount: number
  currency: string
  supplier_id: string
  payment_terms: string
}

interface Supplier {
  id: string
  name: string
  code: string
}

interface Document {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
}

export default function Invoices() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const { data: invoices, loading, error, refetch } = useSupabaseData<Invoice>(
    "invoices",
    "id, invoice_number, invoice_date, due_date, status, total_amount, currency, supplier_id, payment_terms",
    { column: "invoice_date", ascending: false }
  )

  const { data: suppliers } = useSupabaseData<Supplier>(
    "suppliers",
    "id, name, code"
  )

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId)
    return supplier ? supplier.name : "Unknown Supplier"
  }

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getSupplierName(invoice.supplier_id).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const isOverdue = (dueDate: string, status: string) => {
    if (status.toLowerCase() === 'paid') return false
    return new Date(dueDate) < new Date()
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
        <div className="text-lg">Loading invoices...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading invoices: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Invoice Management</h1>
          <p className="text-muted-foreground">
            Track and manage your invoices and payments
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Invoice</DialogTitle>
            </DialogHeader>
            <InvoiceForm 
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
            placeholder="Search invoices..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredInvoices.map((invoice) => (
              <Card key={invoice.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{invoice.invoice_number}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {getSupplierName(invoice.supplier_id)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant="outline" className={getStatusColor(invoice.status)}>
                        {invoice.status}
                      </Badge>
                      {isOverdue(invoice.due_date, invoice.status) && (
                        <div className="flex items-center text-red-600">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          <span className="text-xs">Overdue</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg font-bold">
                        {invoice.currency} {invoice.total_amount?.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div className="text-sm">
                        <p>Issued: {new Date(invoice.invoice_date).toLocaleDateString()}</p>
                        {invoice.due_date && (
                          <p className={isOverdue(invoice.due_date, invoice.status) ? "text-red-600" : ""}>
                            Due: {new Date(invoice.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {invoice.payment_terms && (
                      <div className="pt-2 border-t">
                        <p className="text-sm">
                          <span className="font-medium">Terms: </span>
                          <span>{invoice.payment_terms}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInvoices.length === 0 && !loading && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No invoices found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "Start by creating your first invoice"}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <DocumentUpload
            entityId="invoices"
            entityType="invoices"
            documents={documents}
            onDocumentUploaded={handleDocumentUploaded}
            onDocumentDeleted={handleDocumentDeleted}
          />
        </div>
      </div>
    </div>
  )
}
