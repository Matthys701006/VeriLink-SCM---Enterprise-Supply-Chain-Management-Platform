import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Calculator,
  User,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useOrchestrix } from '../../contexts/OrchestrixContext';
import { supabase } from '../../services/supabase/client';
import { Modal } from '../ui/Modal';
import { Supplier, CostCenter } from '../../types/orchestrix';

interface POLineItem {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface POCreationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const POCreationForm: React.FC<POCreationFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const { organization, enhancedUser, hasPermission } = useOrchestrix();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [costCenters, setCostCenters] = useState<CostCenter[]>([]);
  const [loading, setLoading] = useState(false);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    expected_delivery_date: '',
    payment_terms: '',
    shipping_address: '',
    notes: '',
    cost_center_id: ''
  });
  
  const [lineItems, setLineItems] = useState<POLineItem[]>([
    { id: '1', sku: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }
  ]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [budgetWarning, setBudgetWarning] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && organization?.id) {
      loadFormData();
    }
  }, [isOpen, organization?.id]);

  const loadFormData = async () => {
    try {
      // Load suppliers
      const { data: supplierData, error: supplierError } = await supabase
        .from('suppliers')
        .select('*')
        .eq('organization_id', organization?.id)
        .eq('is_active', true)
        .order('ai_performance_score', { ascending: false });

      if (supplierError) throw supplierError;
      setSuppliers(supplierData || []);

      // Load cost centers
      const { data: costCenterData, error: costCenterError } = await supabase
        .from('cost_centers')
        .select('*')
        .eq('organization_id', organization?.id)
        .eq('is_active', true)
        .order('name');

      if (costCenterError) throw costCenterError;
      setCostCenters(costCenterData || []);

    } catch (error) {
      console.error('Error loading form data:', error);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(supplierSearch.toLowerCase()) ||
    supplier.code.toLowerCase().includes(supplierSearch.toLowerCase())
  );

  const calculateSubtotal = () => {
    return lineItems.reduce((sum, item) => sum + item.total_price, 0);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.08; // 8% tax rate - should be configurable
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    return subtotal + tax;
  };

  const addLineItem = () => {
    const newItem: POLineItem = {
      id: Date.now().toString(),
      sku: '',
      description: '',
      quantity: 1,
      unit_price: 0,
      total_price: 0
    };
    setLineItems([...lineItems, newItem]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter(item => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof POLineItem, value: string | number) => {
    setLineItems(lineItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        // Recalculate total price when quantity or unit price changes
        if (field === 'quantity' || field === 'unit_price') {
          updatedItem.total_price = updatedItem.quantity * updatedItem.unit_price;
        }
        return updatedItem;
      }
      return item;
    }));
  };

  const selectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSupplierSearch(supplier.name);
    setShowSupplierDropdown(false);
    
    // Check supplier risk score
    if (supplier.ai_risk_score >= 3.5) {
      setErrors(prev => ({
        ...prev,
        supplier: `Warning: High risk supplier (Risk Score: ${supplier.ai_risk_score}/5.0)`
      }));
    } else {
      setErrors(prev => {
        const { supplier, ...rest } = prev;
        return rest;
      });
    }
  };

  const checkBudget = async () => {
    if (!formData.cost_center_id) return;
    
    const total = calculateTotal();
    const costCenter = costCenters.find(cc => cc.id === formData.cost_center_id);
    
    if (costCenter && costCenter.budget_remaining) {
      if (total > costCenter.budget_remaining) {
        setBudgetWarning(
          `PO total ($${total.toLocaleString()}) exceeds remaining budget ($${costCenter.budget_remaining.toLocaleString()})`
        );
      } else if (total > costCenter.budget_remaining * 0.8) {
        setBudgetWarning(
          `PO will use ${((total / costCenter.budget_remaining) * 100).toFixed(1)}% of remaining budget`
        );
      } else {
        setBudgetWarning(null);
      }
    }
  };

  useEffect(() => {
    checkBudget();
  }, [lineItems, formData.cost_center_id]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!selectedSupplier) {
      newErrors.supplier = 'Please select a supplier';
    }
    
    if (!formData.expected_delivery_date) {
      newErrors.expected_delivery_date = 'Expected delivery date is required';
    }
    
    if (!formData.cost_center_id) {
      newErrors.cost_center_id = 'Cost center is required';
    }
    
    if (lineItems.some(item => !item.sku || !item.description || item.quantity <= 0 || item.unit_price <= 0)) {
      newErrors.line_items = 'All line items must have SKU, description, valid quantity and price';
    }
    
    // Budget validation
    if (budgetWarning && budgetWarning.includes('exceeds')) {
      newErrors.budget = 'PO total exceeds available budget';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!selectedSupplier || !organization?.id || !enhancedUser?.id) return;
    
    try {
      setLoading(true);
      
      const subtotal = calculateSubtotal();
      const taxAmount = calculateTax(subtotal);
      const totalAmount = subtotal + taxAmount;
      
      // Generate PO number
      const poNumber = `PO-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
      
      // Create PO
      const { data: poData, error: poError } = await supabase
        .from('purchase_orders')
        .insert({
          organization_id: organization.id,
          po_number: poNumber,
          supplier_id: selectedSupplier.id,
          status: 'pending',
          priority: formData.priority,
          currency: 'USD',
          subtotal,
          tax_amount: taxAmount,
          shipping_amount: 0,
          total_amount: totalAmount,
          expected_delivery_date: formData.expected_delivery_date,
          payment_terms: formData.payment_terms,
          shipping_address: formData.shipping_address,
          notes: formData.notes,
          approval_workflow: [
            {
              step: 1,
              approver: 'Department Head',
              status: 'pending',
              required_role: 'manager'
            }
          ],
          ai_fraud_score: Math.random() * 2, // Mock AI fraud detection
          created_by: enhancedUser.id
        })
        .select()
        .single();
      
      if (poError) throw poError;
      
      // Create PO line items
      const lineItemsData = lineItems.map(item => ({
        po_id: poData.id,
        sku: item.sku,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        total_price: item.total_price
      }));
      
      const { error: itemsError } = await supabase
        .from('purchase_order_items')
        .insert(lineItemsData);
      
      if (itemsError) throw itemsError;
      
      // Create notification for approval
      await supabase
        .from('notifications')
        .insert({
          organization_id: organization.id,
          recipient_id: enhancedUser.id, // In real app, would be manager's ID
          type: 'approval_required',
          priority: formData.priority === 'urgent' ? 'urgent' : 'high',
          title: 'Purchase Order Approval Required',
          message: `PO ${poNumber} for $${totalAmount.toLocaleString()} requires approval`,
          action_url: '/procurement',
          is_read: false
        });
      
      onSuccess();
      resetForm();
      
    } catch (error) {
      console.error('Error creating PO:', error);
      setErrors({ submit: 'Failed to create purchase order. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      priority: 'normal',
      expected_delivery_date: '',
      payment_terms: '',
      shipping_address: '',
      notes: '',
      cost_center_id: ''
    });
    setLineItems([{ id: '1', sku: '', description: '', quantity: 1, unit_price: 0, total_price: 0 }]);
    setSelectedSupplier(null);
    setSupplierSearch('');
    setErrors({});
    setBudgetWarning(null);
  };

  if (!hasPermission('procurement.write')) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Access Denied">
        <div className="text-center py-6">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-500">You don't have permission to create purchase orders</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Purchase Order" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        {/* Supplier Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supplier *
          </label>
          <div className="relative">
            <input
              type="text"
              value={supplierSearch}
              onChange={(e) => {
                setSupplierSearch(e.target.value);
                setShowSupplierDropdown(true);
              }}
              onFocus={() => setShowSupplierDropdown(true)}
              placeholder="Search suppliers..."
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.supplier ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            
            {showSupplierDropdown && filteredSuppliers.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {filteredSuppliers.map((supplier) => (
                  <div
                    key={supplier.id}
                    onClick={() => selectSupplier(supplier)}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">{supplier.name}</div>
                        <div className="text-sm text-gray-500">{supplier.code}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          Performance: {supplier.ai_performance_score.toFixed(1)}/5.0
                        </div>
                        <div className="text-sm text-gray-500">
                          Risk: {supplier.ai_risk_score.toFixed(1)}/5.0
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {errors.supplier && (
            <p className="mt-1 text-sm text-red-600">{errors.supplier}</p>
          )}
        </div>

        {/* PO Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="normal">Normal</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expected Delivery *
            </label>
            <input
              type="date"
              value={formData.expected_delivery_date}
              onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.expected_delivery_date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.expected_delivery_date && (
              <p className="mt-1 text-sm text-red-600">{errors.expected_delivery_date}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cost Center *
            </label>
            <select
              value={formData.cost_center_id}
              onChange={(e) => setFormData({ ...formData, cost_center_id: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.cost_center_id ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Cost Center</option>
              {costCenters.map((cc) => (
                <option key={cc.id} value={cc.id}>
                  {cc.name} ({cc.code})
                </option>
              ))}
            </select>
            {errors.cost_center_id && (
              <p className="mt-1 text-sm text-red-600">{errors.cost_center_id}</p>
            )}
          </div>
        </div>

        {/* Budget Warning */}
        {budgetWarning && (
          <div className={`p-4 rounded-lg ${
            budgetWarning.includes('exceeds') ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-start">
              <AlertTriangle className={`w-5 h-5 mr-2 mt-0.5 ${
                budgetWarning.includes('exceeds') ? 'text-red-500' : 'text-yellow-500'
              }`} />
              <p className={`text-sm ${
                budgetWarning.includes('exceeds') ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {budgetWarning}
              </p>
            </div>
          </div>
        )}

        {/* Line Items */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Line Items</h3>
            <button
              type="button"
              onClick={addLineItem}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>
          
          <div className="space-y-3">
            {lineItems.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-lg">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    value={item.sku}
                    onChange={(e) => updateLineItem(item.id, 'sku', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="SKU-001"
                  />
                </div>
                
                <div className="col-span-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Item description"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Unit Price</label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unit_price}
                    onChange={(e) => updateLineItem(item.id, 'unit_price', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                
                <div className="col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Total</label>
                  <div className="text-sm font-medium text-gray-900 py-1">
                    ${item.total_price.toFixed(2)}
                  </div>
                </div>
                
                <div className="col-span-1">
                  <button
                    type="button"
                    onClick={() => removeLineItem(item.id)}
                    disabled={lineItems.length === 1}
                    className="p-1 text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {errors.line_items && (
            <p className="mt-1 text-sm text-red-600">{errors.line_items}</p>
          )}
        </div>

        {/* PO Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (8%):</span>
                <span className="font-medium">${calculateTax(calculateSubtotal()).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Total:</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Payment Terms</label>
                <input
                  type="text"
                  value={formData.payment_terms}
                  onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Net 30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shipping Address
            </label>
            <textarea
              value={formData.shipping_address}
              onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter shipping address..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Special instructions or notes..."
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Create Purchase Order
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};