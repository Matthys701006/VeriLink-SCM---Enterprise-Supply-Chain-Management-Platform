import React, { useEffect, useState } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Eye, 
  Search, 
  Filter,
  TrendingUp,
  Zap,
  Users,
  Lock
} from 'lucide-react';
import { useOrchestrix } from '../contexts/OrchestrixContext';
import { supabase } from '../services/supabase/client';
import { ComplianceRecord } from '../types/orchestrix';

interface AuditRecord {
  id: string;
  audit_type: string;
  entity_type: string;
  entity_id: string;
  findings: any[];
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  auditor: string;
  audit_date: string;
  due_date?: string;
  resolution_date?: string;
}

interface EthicsAlert {
  id: string;
  alert_type: 'bias_detection' | 'data_privacy' | 'algorithmic_fairness' | 'transparency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ai_model_id?: string;
  affected_entities: string[];
  detected_at: string;
  reviewed_by?: string;
  resolution_status: 'open' | 'investigating' | 'resolved' | 'dismissed';
}

export const Compliance: React.FC = () => {
  const { hasPermission, organization } = useOrchestrix();
  const [complianceRecords, setComplianceRecords] = useState<ComplianceRecord[]>([]);
  const [auditRecords, setAuditRecords] = useState<AuditRecord[]>([]);
  const [ethicsAlerts, setEthicsAlerts] = useState<EthicsAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'audits' | 'ethics' | 'certifications'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    if (organization?.id) {
      loadComplianceData();
    }
  }, [organization?.id]);

  const loadComplianceData = async () => {
    try {
      setLoading(true);
      
      // Load compliance records
      const { data: complianceData, error: complianceError } = await supabase
        .from('compliance_records')
        .select('*')
        .eq('organization_id', organization?.id)
        .order('assessment_date', { ascending: false });

      if (complianceError) throw complianceError;
      setComplianceRecords(complianceData || []);

      // Generate mock audit and ethics data
      const mockAudits = generateMockAudits();
      const mockEthicsAlerts = generateMockEthicsAlerts();
      
      setAuditRecords(mockAudits);
      setEthicsAlerts(mockEthicsAlerts);

    } catch (error) {
      console.error('Error loading compliance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAudits = (): AuditRecord[] => {
    const auditTypes = ['Financial Audit', 'Security Audit', 'Data Privacy Audit', 'AI Ethics Review', 'Supplier Compliance'];
    const entityTypes = ['supplier', 'process', 'system', 'contract', 'employee'];
    const auditors = ['Internal Audit Team', 'External Auditor', 'Compliance Officer', 'AI Ethics Board'];
    const riskLevels: AuditRecord['risk_level'][] = ['low', 'medium', 'high', 'critical'];
    const statuses: AuditRecord['status'][] = ['open', 'in_progress', 'resolved', 'closed'];

    return Array.from({ length: 15 }, (_, i) => ({
      id: `audit-${i + 1}`,
      audit_type: auditTypes[Math.floor(Math.random() * auditTypes.length)],
      entity_type: entityTypes[Math.floor(Math.random() * entityTypes.length)],
      entity_id: `entity-${i + 1}`,
      findings: [
        { finding: 'Minor documentation gaps', severity: 'low' },
        { finding: 'Process optimization needed', severity: 'medium' }
      ],
      risk_level: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      auditor: auditors[Math.floor(Math.random() * auditors.length)],
      audit_date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      due_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      resolution_date: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString() : undefined
    }));
  };

  const generateMockEthicsAlerts = (): EthicsAlert[] => {
    const alertTypes: EthicsAlert['alert_type'][] = ['bias_detection', 'data_privacy', 'algorithmic_fairness', 'transparency'];
    const severities: EthicsAlert['severity'][] = ['low', 'medium', 'high', 'critical'];
    const statuses: EthicsAlert['resolution_status'][] = ['open', 'investigating', 'resolved', 'dismissed'];
    
    const descriptions = [
      'Potential gender bias detected in supplier scoring algorithm',
      'Data retention policy violation in customer analytics',
      'Algorithmic fairness concerns in demand forecasting',
      'Insufficient transparency in AI decision-making process',
      'Privacy impact assessment required for new ML model'
    ];

    return Array.from({ length: 8 }, (_, i) => ({
      id: `ethics-${i + 1}`,
      alert_type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      ai_model_id: `model-${Math.floor(Math.random() * 5) + 1}`,
      affected_entities: [`entity-${Math.floor(Math.random() * 10) + 1}`],
      detected_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      reviewed_by: Math.random() > 0.5 ? 'AI Ethics Officer' : undefined,
      resolution_status: statuses[Math.floor(Math.random() * statuses.length)]
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
      case 'resolved':
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'non_compliant':
      case 'open':
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'requires_action':
      case 'in_progress':
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return AlertTriangle;
      case 'high':
        return AlertTriangle;
      case 'medium':
        return Clock;
      case 'low':
        return CheckCircle;
      default:
        return Shield;
    }
  };

  // Calculate metrics
  const totalCompliance = complianceRecords.length;
  const compliantRecords = complianceRecords.filter(r => r.compliance_status === 'compliant').length;
  const complianceRate = totalCompliance > 0 ? (compliantRecords / totalCompliance) * 100 : 0;
  const openAudits = auditRecords.filter(a => a.status === 'open').length;
  const criticalAlerts = ethicsAlerts.filter(a => a.severity === 'critical').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!hasPermission('compliance.read')) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
        <p className="text-gray-500">You don't have permission to access compliance data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ethics & Compliance Management</h1>
          <p className="text-gray-600">Monitor regulatory compliance, AI ethics, and audit requirements</p>
        </div>
        {hasPermission('compliance.write') && (
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />
            New Assessment
          </button>
        )}
      </div>

      {/* Compliance Status Banner */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="w-8 h-8 mr-3" />
            <div>
              <h3 className="text-xl font-semibold">Compliance Status: Excellent</h3>
              <p className="text-green-100 mt-1">
                GDPR, POPIA, PCI-DSS, and ISO 27001 certified with continuous monitoring
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-200">Overall Compliance Rate</div>
            <div className="text-3xl font-bold">{complianceRate.toFixed(1)}%</div>
            <div className="text-sm text-green-200">Last audit: 30 days ago</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
              <p className="text-2xl font-bold text-gray-900">{complianceRate.toFixed(1)}%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div className="mt-2 text-sm text-green-600">+2.3% vs last quarter</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Open Audits</p>
              <p className="text-2xl font-bold text-gray-900">{openAudits}</p>
            </div>
            <FileText className="w-8 h-8 text-orange-600" />
          </div>
          <div className="mt-2 text-sm text-orange-600">Requires attention</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ethics Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{criticalAlerts}</p>
            </div>
            <Zap className="w-8 h-8 text-red-600" />
          </div>
          <div className="mt-2 text-sm text-red-600">Critical level</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Certifications</p>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <div className="mt-2 text-sm text-green-600">All current</div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setSelectedTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Compliance Overview
            </button>
            <button
              onClick={() => setSelectedTab('audits')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'audits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Audit Management ({auditRecords.length})
            </button>
            <button
              onClick={() => setSelectedTab('ethics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'ethics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              AI Ethics ({ethicsAlerts.length})
            </button>
            <button
              onClick={() => setSelectedTab('certifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'certifications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Certifications
            </button>
          </nav>
        </div>

        {selectedTab === 'overview' ? (
          <div className="p-6">
            {/* Compliance Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {['GDPR', 'POPIA', 'PCI-DSS', 'ISO 27001', 'SOX', 'HIPAA'].map((regulation) => (
                <div key={regulation} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900">{regulation}</h4>
                      <p className="text-sm text-gray-500">
                        {regulation === 'GDPR' ? 'General Data Protection Regulation' :
                         regulation === 'POPIA' ? 'Protection of Personal Information Act' :
                         regulation === 'PCI-DSS' ? 'Payment Card Industry Data Security' :
                         regulation === 'ISO 27001' ? 'Information Security Management' :
                         regulation === 'SOX' ? 'Sarbanes-Oxley Act' :
                         'Health Insurance Portability'}
                      </p>
                    </div>
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      COMPLIANT
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Last Assessment</span>
                      <span className="font-medium">
                        {new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Next Review</span>
                      <span className="font-medium">
                        {new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Compliance Score</span>
                      <span className="font-medium text-green-600">
                        {(85 + Math.random() * 15).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Compliance Activity</h3>
              <div className="space-y-3">
                <div className="flex items-start p-3 bg-white rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">ISO 27001 audit completed successfully</p>
                    <p className="text-sm text-gray-500">All security controls reviewed and approved • 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-white rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-500 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">GDPR data retention review scheduled</p>
                    <p className="text-sm text-gray-500">Quarterly review of data processing activities • 5 days ago</p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-white rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-500 mr-3 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">PCI-DSS vulnerability assessment required</p>
                    <p className="text-sm text-gray-500">Annual security assessment due within 30 days • 1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : selectedTab === 'audits' ? (
          <div className="p-6">
            {/* Audit Records Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Audit Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Auditor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {auditRecords.map((audit) => (
                    <tr key={audit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{audit.audit_type}</div>
                        <div className="text-sm text-gray-500">{audit.findings.length} findings</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{audit.entity_type}</div>
                        <div className="text-sm text-gray-500">{audit.entity_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskLevelColor(audit.risk_level)}`}>
                          {audit.risk_level.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(audit.status)}`}>
                          {audit.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {audit.auditor}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {audit.due_date ? new Date(audit.due_date).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : selectedTab === 'ethics' ? (
          <div className="p-6">
            {/* AI Ethics Header */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <div className="flex items-center">
                <Zap className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-purple-900">AI Ethics & Bias Monitoring</h3>
                  <p className="text-purple-700 mt-1">
                    Continuous monitoring of AI systems for bias, fairness, and ethical compliance with human oversight protocols.
                  </p>
                </div>
              </div>
            </div>

            {/* Ethics Alerts */}
            <div className="space-y-4">
              {ethicsAlerts.map((alert) => {
                const SeverityIcon = getSeverityIcon(alert.severity);
                return (
                  <div key={alert.id} className={`border rounded-lg p-4 ${
                    alert.severity === 'critical' ? 'border-red-200 bg-red-50' :
                    alert.severity === 'high' ? 'border-orange-200 bg-orange-50' :
                    alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <SeverityIcon className={`w-5 h-5 mr-3 mt-0.5 ${
                          alert.severity === 'critical' ? 'text-red-500' :
                          alert.severity === 'high' ? 'text-orange-500' :
                          alert.severity === 'medium' ? 'text-yellow-500' :
                          'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{alert.description}</h4>
                          <div className="mt-1 flex items-center gap-4 text-sm text-gray-600">
                            <span>Type: {alert.alert_type.replace('_', ' ')}</span>
                            <span>Model: {alert.ai_model_id}</span>
                            <span>Detected: {new Date(alert.detected_at).toLocaleDateString()}</span>
                          </div>
                          {alert.reviewed_by && (
                            <div className="mt-1 text-sm text-gray-500">
                              Reviewed by: {alert.reviewed_by}
                            </div>
                          )}
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(alert.resolution_status)}`}>
                        {alert.resolution_status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="text-center py-12">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Certification Management</p>
              <p className="text-sm text-gray-400 mt-1">Track and manage regulatory certifications and compliance status</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};