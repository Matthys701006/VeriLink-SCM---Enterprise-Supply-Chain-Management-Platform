
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useSupabaseData } from "@/hooks/useSupabaseData"

interface Invoice {
  id: string
  invoice_number: string
  total_amount: number
  currency: string
  supplier_id: string
}

interface Supplier {
  id: string
  name: string
}

interface PaymentFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export function PaymentForm({ onSuccess, onCancel }: PaymentFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  
  const { data: invoices } = useSupabaseData<Invoice>(
    "invoices", 
    "id, invoice_number, total_amount, currency, supplier_id",
    { column: "created_at", ascending: false }
  )
  const { data: suppliers } = useSupabaseData<Supplier>("suppliers", "id, name")

  const [formData, setFormData] = useState({
    payment_reference: `PAY-${Date.now()}`,
    invoice_id: "",
    amount: 0,
    currency: "USD",
    payment_method: "bank_transfer",
    payment_date: new Date().toISOString().split('T')[0],
    status: "completed",
    transaction_id: "",
    payment_gateway: "",
    bank_details: "",
    notes: ""
  })

  const selectedInvoice = invoices.find(inv => inv.id === formData.invoice_id)
  const selectedSupplier = suppliers.find(sup => sup.id === selectedInvoice?.supplier_id)

  const handleInvoiceChange = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.id === invoiceId)
    if (invoice) {
      setFormData(prev => ({
        ...prev,
        invoice_id: invoiceId,
        amount: invoice.total_amount,
        currency: invoice.currency
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.invoice_id) {
      toast({
        title: "Error",
        description: "Please select an invoice",
        variant: "destructive",
      })
      return
    }

    if (formData.amount <= 0) {
      toast({
        title: "Error",
        description: "Payment amount must be greater than 0",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const paymentData = {
        ...formData,
        organization_id: "550e8400-e29b-41d4-a716-446655440000", // Default org ID
        payment_date: new Date(formData.payment_date).toISOString(),
        bank_details: formData.bank_details ? JSON.parse(`{"details": "${formData.bank_details}"}`) : null,
        metadata: {
          notes: formData.notes,
          transaction_id: formData.transaction_id,
          payment_gateway: formData.payment_gateway
        }
      }

      // Remove fields that aren't in the database schema
      const {notes, transaction_id, payment_gateway, bank_details, ...cleanData} = paymentData

      const { error } = await supabase
        .from("payments")
        .insert([{
          ...cleanData,
          bank_details: formData.bank_details ? { details: formData.bank_details } : null
        }])

      if (error) throw error

      // Update invoice status if payment is completed
      if (formData.status === "completed" && formData.amount >= (selectedInvoice?.total_amount || 0)) {
        await supabase
          .from("invoices")
          .update({ status: "paid" })
          .eq("id", formData.invoice_id)
      }

      toast({
        title: "Success",
        description: "Payment recorded successfully",
      })
      onSuccess()
    } catch (error: any) {
      console.error("Error recording payment:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to record payment",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="payment_reference">Payment Reference</Label>
          <Input
            id="payment_reference"
            value={formData.payment_reference}
            onChange={(e) => setFormData(prev => ({ ...prev, payment_reference: e.target.value }))}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="invoice_id">Invoice</Label>
          <Select
            value={formData.invoice_id}
            onValueChange={handleInvoiceChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select invoice to pay" />
            </SelectTrigger>
            <SelectContent>
              {invoices.map((invoice) => {
                const supplier = suppliers.find(s => s.id === invoice.supplier_id)
                return (
                  <SelectItem key={invoice.id} value={invoice.id}>
                    {invoice.invoice_number} - {supplier?.name} - {invoice.currency} {invoice.total_amount}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {selectedInvoice && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm">Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Invoice:</span>
                <span>{selectedInvoice.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Supplier:</span>
                <span>{selectedSupplier?.name}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Amount:</span>
                <span>{selectedInvoice.currency} {selectedInvoice.total_amount}</span>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          <Label htmlFor="amount">Payment Amount</Label>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              <SelectItem value="CAD">CAD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_method">Payment Method</Label>
          <Select
            value={formData.payment_method}
            onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
              <SelectItem value="credit_card">Credit Card</SelectItem>
              <SelectItem value="check">Check</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_date">Payment Date</Label>
          <Input
            id="payment_date"
            type="date"
            value={formData.payment_date}
            onChange={(e) => setFormData(prev => ({ ...prev, payment_date: e.target.value }))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transaction_id">Transaction ID (Optional)</Label>
          <Input
            id="transaction_id"
            placeholder="Bank/Gateway transaction ID"
            value={formData.transaction_id}
            onChange={(e) => setFormData(prev => ({ ...prev, transaction_id: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="payment_gateway">Payment Gateway (Optional)</Label>
          <Input
            id="payment_gateway"
            placeholder="e.g., Stripe, PayPal, Bank"
            value={formData.payment_gateway}
            onChange={(e) => setFormData(prev => ({ ...prev, payment_gateway: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bank_details">Bank Details (Optional)</Label>
          <Input
            id="bank_details"
            placeholder="Bank account or reference details"
            value={formData.bank_details}
            onChange={(e) => setFormData(prev => ({ ...prev, bank_details: e.target.value }))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Additional payment notes..."
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Recording..." : "Record Payment"}
        </Button>
      </div>
    </form>
  )
}
