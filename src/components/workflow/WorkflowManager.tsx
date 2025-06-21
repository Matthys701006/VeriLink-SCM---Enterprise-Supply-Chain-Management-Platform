import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  User, 
  ArrowRight,
  Settings
} from 'lucide-react';
import { useOrchestrix } from '../../contexts/OrchestrixContext';
import { Modal } from '../ui/Modal';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'approval' | 'notification' | 'automation' | 'review';
  assignee?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  due_date?: string;
  completed_at?: string;
  notes?: string;
}

interface Workflow {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  status: 'active' | 'paused' | 'completed' | 'failed';
  steps: WorkflowStep[];
  created_at: string;
  started_at?: string;
  completed_at?: string;
}

export const WorkflowManager: React.FC = () => {
  const { hasPermission, enhancedUser } = useOrchestrix();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [showWorkflowModal, setShowWorkflowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      
      // Generate mock workflow data
      const mockWorkflows = generateMockWorkflows();
      setWorkflows(mockWorkflows);
      
    } catch (error) {
      console.error('Error loading workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockWorkflows = (): Workflow[] => {
    return [
      {
        id: 'wf-1',
        name: 'Purchase Order Approval',
        description: 'Multi-level approval process for purchase orders exceeding $10,000',
        trigger_type: 'po_creation',
        status: 'active',
        steps: [
          {
            id: 'step-1',
            name: 'Department Head Approval',
            type: 'approval',
            assignee: 'dept.head@company.com',
            status: 'completed',
            completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            notes: 'Approved - Budget allocated'
          },
          {
            id: 'step-2',
            name: 'Finance Review',
            type: 'review',
            assignee: 'finance.controller@company.com',
            status: 'in_progress',
            due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'step-3',
            name: 'Final Approval',
            type: 'approval',
            assignee: 'cfo@company.com',
            status: 'pending',
            due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'step-4',
            name: 'Send to Supplier',
            type: 'automation',
            status: 'pending'
          }
        ],
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        started_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'wf-2',
        name: 'Supplier Onboarding',
        description: 'Complete verification and approval process for new suppliers',
        trigger_type: 'supplier_registration',
        status: 'active',
        steps: [
          {
            id: 'step-1',
            name: 'Document Verification',
            type: 'review',
            assignee: 'procurement@company.com',
            status: 'completed',
            completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'step-2',
            name: 'Financial Assessment',
            type: 'review',
            assignee: 'risk@company.com',
            status: 'completed',
            completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'step-3',
            name: 'Compliance Check',
            type: 'review',
            assignee: 'compliance@company.com',
            status: 'in_progress',
            due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'step-4',
            name: 'Final Approval',
            type: 'approval',
            assignee: 'procurement.manager@company.com',
            status: 'pending'
          }
        ],
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        started_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'wf-3',
        name: 'Inventory Reorder',
        description: 'Automated reordering process for items below minimum stock levels',
        trigger_type: 'inventory_threshold',
        status: 'completed',
        steps: [
          {
            id: 'step-1',
            name: 'Stock Level Check',
            type: 'automation',
            status: 'completed',
            completed_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'step-2',
            name: 'Generate Purchase Requisition',
            type: 'automation',
            status: 'completed',
            completed_at: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'step-3',
            name: 'Supervisor Approval',
            type: 'approval',
            assignee: 'warehouse.supervisor@company.com',
            status: 'completed',
            completed_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            notes: 'Approved - Critical stock item'
          },
          {
            id: 'step-4',
            name: 'Create Purchase Order',
            type: 'automation',
            status: 'completed',
            completed_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
          }
        ],
        created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        started_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        completed_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'in_progress':
        return Play;
      case 'pending':
        return Clock;
      case 'failed':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in_progress':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      case 'paused':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStepTypeIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return CheckCircle;
      case 'review':
        return User;
      case 'automation':
        return Settings;
      case 'notification':
        return AlertTriangle;
      default:
        return Clock;
    }
  };

  if (!hasPermission('workflow.read')) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-500">You don't have permission to access workflow management</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Workflow Management</h2>
          <p className="text-gray-600">Monitor and manage automated business processes</p>
        </div>
        {hasPermission('workflow.write') && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create Workflow
          </button>
        )}
      </div>

      {/* Active Workflows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {workflows.map((workflow) => {
          const StatusIcon = getStatusIcon(workflow.status);
          const completedSteps = workflow.steps.filter(step => step.status === 'completed').length;
          const totalSteps = workflow.steps.length;
          const progress = (completedSteps / totalSteps) * 100;
          
          return (
            <div
              key={workflow.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedWorkflow(workflow);
                setShowWorkflowModal(true);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(workflow.status)}`}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {workflow.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{completedSteps}/{totalSteps} steps</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Trigger: {workflow.trigger_type.replace('_', ' ')}</span>
                  <span>
                    {workflow.status === 'completed' 
                      ? `Completed ${new Date(workflow.completed_at!).toLocaleDateString()}`
                      : `Started ${new Date(workflow.started_at || workflow.created_at).toLocaleDateString()}`
                    }
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Workflow Details Modal */}
      <Modal
        isOpen={showWorkflowModal}
        onClose={() => setShowWorkflowModal(false)}
        title={selectedWorkflow?.name || 'Workflow Details'}
        size="lg"
      >
        {selectedWorkflow && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">{selectedWorkflow.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Trigger: {selectedWorkflow.trigger_type.replace('_', ' ')}
                </p>
              </div>
              <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedWorkflow.status)}`}>
                {selectedWorkflow.status.toUpperCase()}
              </span>
            </div>

            {/* Workflow Steps */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Workflow Steps</h4>
              {selectedWorkflow.steps.map((step, index) => {
                const StepIcon = getStepTypeIcon(step.type);
                const StatusIcon = getStatusIcon(step.status);
                
                return (
                  <div key={step.id} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(step.status)}`}>
                        <StatusIcon className="w-4 h-4" />
                      </div>
                      {index < selectedWorkflow.steps.length - 1 && (
                        <div className="w-0.5 h-8 bg-gray-300 mt-2" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900">{step.name}</h5>
                        <div className="flex items-center text-sm text-gray-500">
                          <StepIcon className="w-4 h-4 mr-1" />
                          {step.type}
                        </div>
                      </div>
                      
                      {step.assignee && (
                        <p className="text-sm text-gray-600 mt-1">
                          Assigned to: {step.assignee}
                        </p>
                      )}
                      
                      {step.due_date && step.status !== 'completed' && (
                        <p className="text-sm text-orange-600 mt-1">
                          Due: {new Date(step.due_date).toLocaleDateString()}
                        </p>
                      )}
                      
                      {step.completed_at && (
                        <p className="text-sm text-green-600 mt-1">
                          Completed: {new Date(step.completed_at).toLocaleDateString()}
                        </p>
                      )}
                      
                      {step.notes && (
                        <p className="text-sm text-gray-500 mt-1 italic">
                          {step.notes}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowWorkflowModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              {hasPermission('workflow.write') && selectedWorkflow.status === 'active' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Take Action
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {workflows.length === 0 && !loading && (
        <div className="text-center py-12">
          <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No active workflows</p>
          <p className="text-sm text-gray-400 mt-1">Workflows will appear here when processes are triggered</p>
        </div>
      )}
    </div>
  );
};