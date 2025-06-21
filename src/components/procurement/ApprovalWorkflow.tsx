import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  MessageSquare, 
  AlertTriangle,
  DollarSign,
  Calendar,
  Eye
} from 'lucide-react';
import { useOrchestrix } from '../../contexts/OrchestrixContext';
import { supabase } from '../../services/supabase/client';
import { Modal } from '../ui/Modal';
import { PurchaseOrder } from '../../types/orchestrix';

interface ApprovalWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: PurchaseOrder | null;
  onApprovalComplete: () => void;
}

interface ApprovalStep {
  step: number;
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  date?: string;
  comments?: string;
  required_role?: string;
}

export const ApprovalWorkflow: React.FC<ApprovalWorkflowProps> = ({
  isOpen,
  onClose,
  purchaseOrder,
  onApprovalComplete
}) => {
  const { enhancedUser, hasPermission } = useOrchestrix();
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState('');
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>([]);
  const [canApprove, setCanApprove] = useState(false);

  useEffect(() => {
    if (purchaseOrder) {
      initializeApprovalSteps();
      checkApprovalPermissions();
    }
  }, [purchaseOrder, enhancedUser]);

  const initializeApprovalSteps = () => {
    if (!purchaseOrder) return;

    // Default approval workflow based on PO amount
    let steps: ApprovalStep[] = [];
    
    if (purchaseOrder.total_amount > 50000) {
      // High value POs require multiple approvals
      steps = [
        {
          step: 1,
          approver: 'Department Head',
          status: 'pending',
          required_role: 'manager'
        },
        {
          step: 2,
          approver: 'Finance Controller',
          status: 'pending',
          required_role: 'finance_controller'
        },
        {
          step: 3,
          approver: 'CFO',
          status: 'pending',
          required_role: 'cfo'
        }
      ];
    } else if (purchaseOrder.total_amount > 10000) {
      // Medium value POs
      steps = [
        {
          step: 1,
          approver: 'Department Head',
          status: 'pending',
          required_role: 'manager'
        },
        {
          step: 2,
          approver: 'Finance Controller',
          status: 'pending',
          required_role: 'finance_controller'
        }
      ];
    } else {
      // Low value POs
      steps = [
        {
          step: 1,
          approver: 'Department Head',
          status: 'pending',
          required_role: 'manager'
        }
      ];
    }

    // Override with existing workflow if available
    if (purchaseOrder.approval_workflow && purchaseOrder.approval_workflow.length > 0) {
      setApprovalSteps(purchaseOrder.approval_workflow);
    } else {
      setApprovalSteps(steps);
    }
  };

  const checkApprovalPermissions = () => {
    if (!enhancedUser || !purchaseOrder) return;

    // Check if user can approve based on role and current step
    const currentStep = approvalSteps.find(step => step.status === 'pending');
    if (!currentStep) {
      setCanApprove(false);
      return;
    }

    // For demo purposes, allow users with procurement.approve permission
    const hasApprovalPermission = hasPermission('procurement.approve') || hasPermission('*');
    
    // In a real system, you'd check specific role requirements
    const hasRequiredRole = enhancedUser.role === 'manager' || 
                           enhancedUser.role === 'admin' ||
                           enhancedUser.role === 'finance_controller';

    setCanApprove(hasApprovalPermission && hasRequiredRole);
  };

  const handleApproval = async (approved: boolean) => {
    if (!purchaseOrder || !enhancedUser) return;

    try {
      setLoading(true);

      // Find current pending step
      const currentStepIndex = approvalSteps.findIndex(step => step.status === 'pending');
      if (currentStepIndex === -1) return;

      const updatedSteps = [...approvalSteps];
      updatedSteps[currentStepIndex] = {
        ...updatedSteps[currentStepIndex],
        status: approved ? 'approved' : 'rejected',
        date: new Date().toISOString(),
        comments: comments || undefined
      };

      // Determine overall PO status
      let newStatus = purchaseOrder.status;
      
      if (!approved) {
        newStatus = 'cancelled'; // Rejected
      } else {
        // Check if all steps are approved
        const allApproved = updatedSteps.every(step => step.status === 'approved');
        if (allApproved) {
          newStatus = 'approved';
        }
      }

      // Update PO in database
      const updateData: any = {
        approval_workflow: updatedSteps,
        status: newStatus,
        updated_at: new Date().toISOString()
      };

      if (approved && newStatus === 'approved') {
        updateData.approved_by = enhancedUser.id;
        updateData.approved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('purchase_orders')
        .update(updateData)
        .eq('id', purchaseOrder.id);

      if (error) throw error;

      // Create notification for next approver or PO creator
      let notificationData;
      
      if (approved && newStatus !== 'approved') {
        // Notify next approver
        const nextStep = updatedSteps.find(step => step.status === 'pending');
        if (nextStep) {
          notificationData = {
            organization_id: purchaseOrder.organization_id,
            recipient_id: enhancedUser.id, // In real app, would be next approver's ID
            type: 'approval_required',
            priority: purchaseOrder.priority === 'urgent' ? 'urgent' : 'normal',
            title: 'Purchase Order Approval Required',
            message: `PO ${purchaseOrder.po_number} requires your approval (Step ${nextStep.step})`,
            action_url: '/procurement',
            is_read: false
          };
        }
      } else {
        // Notify PO creator of final decision
        notificationData = {
          organization_id: purchaseOrder.organization_id,
          recipient_id: purchaseOrder.created_by || enhancedUser.id,
          type: approved ? 'approval_approved' : 'approval_rejected',
          priority: 'normal',
          title: `Purchase Order ${approved ? 'Approved' : 'Rejected'}`,
          message: `PO ${purchaseOrder.po_number} has been ${approved ? 'approved' : 'rejected'}`,
          action_url: '/procurement',
          is_read: false
        };
      }

      if (notificationData) {
        await supabase.from('notifications').insert(notificationData);
      }

      setApprovalSteps(updatedSteps);
      onApprovalComplete();
      
      if (approved && newStatus === 'approved') {
        // Trigger blockchain transaction for approved PO
        await triggerBlockchainTransaction(purchaseOrder);
      }

    } catch (error) {
      console.error('Error processing approval:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerBlockchainTransaction = async (po: PurchaseOrder) => {
    try {
      // Mock blockchain transaction
      const transactionHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      await supabase
        .from('blockchain_transactions')
        .insert({
          organization_id: po.organization_id,
          transaction_hash: transactionHash,
          transaction_type: 'purchase_order_approval',
          entity_type: 'purchase_order',
          entity_id: po.id,
          payload: {
            po_number: po.po_number,
            total_amount: po.total_amount,
            supplier_id: po.supplier_id,
            approved_by: enhancedUser?.id,
            approved_at: new Date().toISOString()
          },
          verified: true
        });

      // Update PO with blockchain hash
      await supabase
        .from('purchase_orders')
        .update({
          blockchain_tx_hash: transactionHash,
          blockchain_verified: true
        })
        .eq('id', po.id);

    } catch (error) {
      console.error('Error creating blockchain transaction:', error);
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return CheckCircle;
      case 'rejected':
        return XCircle;
      case 'pending':
        return Clock;
      default:
        return Clock;
    }
  };

  if (!purchaseOrder) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Purchase Order Approval" size="lg">
      <div className="space-y-6">
        {/* PO Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Purchase Order Details</h3>
              <div className="space-y-1 text-sm">
                <div><span className="text-gray-600">PO Number:</span> {purchaseOrder.po_number}</div>
                <div><span className="text-gray-600">Supplier:</span> {purchaseOrder.suppliers?.name}</div>
                <div><span className="text-gray-600">Priority:</span> 
                  <span className={`ml-1 px-2 py-1 rounded-full text-xs font-medium ${
                    purchaseOrder.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                    purchaseOrder.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {purchaseOrder.priority.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Financial Summary</h3>
              <div className="space-y-1 text-sm">
                <div><span className="text-gray-600">Subtotal:</span> ${purchaseOrder.subtotal.toLocaleString()}</div>
                <div><span className="text-gray-600">Tax:</span> ${purchaseOrder.tax_amount.toLocaleString()}</div>
                <div className="font-semibold"><span className="text-gray-600">Total:</span> ${purchaseOrder.total_amount.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Approval Steps */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">Approval Workflow</h3>
          <div className="space-y-3">
            {approvalSteps.map((step, index) => {
              const StatusIcon = getStepIcon(step.status);
              const isCurrentStep = step.status === 'pending';
              
              return (
                <div
                  key={step.step}
                  className={`flex items-start p-4 rounded-lg border ${
                    isCurrentStep ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex-shrink-0 mr-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStepStatusColor(step.status)}`}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">
                        Step {step.step}: {step.approver}
                      </h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStepStatusColor(step.status)}`}>
                        {step.status.toUpperCase()}
                      </span>
                    </div>
                    
                    {step.date && (
                      <p className="text-sm text-gray-500 mt-1">
                        {step.status === 'approved' ? 'Approved' : 'Rejected'} on {new Date(step.date).toLocaleDateString()}
                      </p>
                    )}
                    
                    {step.comments && (
                      <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                        <strong>Comments:</strong> {step.comments}
                      </div>
                    )}
                    
                    {isCurrentStep && canApprove && (
                      <div className="mt-3">
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Comments (Optional)
                          </label>
                          <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add approval comments..."
                          />
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleApproval(true)}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {loading ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleApproval(false)}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                          >
                            <XCircle className="w-4 h-4" />
                            {loading ? 'Processing...' : 'Reject'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Risk Assessment */}
        {purchaseOrder.ai_fraud_score && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">AI Risk Assessment</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Fraud Risk Score: {purchaseOrder.ai_fraud_score.toFixed(1)}/5.0
                  {purchaseOrder.ai_fraud_score > 3 && (
                    <span className="ml-2 text-red-600 font-medium">High Risk - Review Carefully</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {!canApprove && (
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-500">
              {purchaseOrder.status === 'approved' ? (
                <span className="text-green-600 font-medium">✓ This purchase order has been approved</span>
              ) : purchaseOrder.status === 'cancelled' ? (
                <span className="text-red-600 font-medium">✗ This purchase order has been rejected</span>
              ) : (
                'You do not have permission to approve this purchase order'
              )}
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};