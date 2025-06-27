
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, Plus, CreditCard, Calendar, DollarSign, CheckCircle, Clock, XCircle } from "lucide-react"
import { useSupabaseData } from "@/hooks/useSupabaseData"
import { DocumentUpload } from "@/components/common/DocumentUpload"
import { PaymentForm } from "@/components/forms/PaymentForm"

interface Payment {
  id: string
  payment_reference: string
  amount: number
  payment_method: string
  status: string
  currency: string
  payment_date: string
  invoice_id: string
}

interface Invoice {
  id: string
  invoice_number: string
  supplier_id: string
}

interface Supplier {
  id: string
  name: string
}

interface Document {
  id: string
  name: string
  type: string
  size: number
  url: string
  uploadedAt: Date
}

export default function Payments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const { data: payments, loading, error, refetch } = useSupabaseData<Payment>(
    "payments",
    "id, payment_reference, amount, payment_method, status, currency, payment_date, invoice_id",
    { column: "payment_date", ascending: false }
  )

  const { data: invoices } = useSupabaseData<Invoice>(
    "invoices",
    "id, invoice_number, supplier_id"
  )

  const { data: suppliers } = useSupabaseData<Supplier>(
    "suppliers",
    "id, name"
  )

  const getInvoiceInfo = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (!invoice) return { invoiceNumber: "Unknown", supplierName: "Unknown" }
    
    const supplier = suppliers.find(sup => sup.id === invoice.supplier_id)
    return {
      invoiceNumber: invoice.invoice_number,
      supplierName: supplier ? supplier.name : "Unknown Supplier"
    }
  }

  const filteredPayments = payments.filter(payment => {
    const { invoiceNumber, supplierName } = getInvoiceInfo(payment.invoice_id)
    return payment.payment_reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
           payment.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
           invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
           supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      case "processing":
        return <Clock className="w-4 h-4 text-blue-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getPaymentMethodDisplay = (method: string) => {
    switch (method.toLowerCase()) {
      case "bank_transfer":
        return "Bank Transfer"
      case "credit_card":
        return "Credit Card"
      case "wire_transfer":
        return "Wire Transfer"
      case "check":
        return "Check"
      default:
        return method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
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
        <div className="text-lg">Loading payments...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading payments: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">
            Track and manage your payment transactions
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record Payment</DialogTitle>
            </DialogHeader>
            <PaymentForm 
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
            placeholder="Search payments..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredPayments.map((payment) => {
              const { invoiceNumber, supplierName } = getInvoiceInfo(payment.invoice_id)
              
              return (
                <Card key={payment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="w-5 h-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg">{payment.payment_reference}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {invoiceNumber} • {supplierName}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge variant="outline" className={getStatusColor(payment.status)}>
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(payment.status)}
                            <span>{payment.status}</span>
                          </div>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-lg font-bold">
                          {payment.currency} {payment.amount?.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div className="text-sm">
                          {payment.payment_date ? (
                            <p>Paid: {new Date(payment.payment_date).toLocaleDateString()}</p>
                          ) : (
                            <p>Date: Not recorded</p>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-sm">
                          <span className="font-medium">Method: </span>
                          <span>{getPaymentMethodDisplay(payment.payment_method)}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredPayments.length === 0 && !loading && (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No payments found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "Start by recording your first payment"}
              </p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <DocumentUpload
            entityId="payments"
            entityType="payments"
            documents={documents}
            onDocumentUploaded={handleDocumentUploaded}
            onDocumentDeleted={handleDocumentDeleted}
          />
        </div>
      </div>
    </div>
  )
}
