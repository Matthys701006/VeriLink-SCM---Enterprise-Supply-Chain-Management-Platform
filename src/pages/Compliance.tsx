import { useState, useEffect } from "react"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Search,
  Filter,
  TrendingUp,
  Zap,
  Users,
  Lock,
  RefreshCw,
  CalendarClock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSupabaseData } from "@/hooks/useSupabaseData"
import { useAppStore } from "@/stores/appStore"

interface ComplianceRecord {
  id: string
  organization_id: string
  regulation_type: string
  entity_type: string
  entity_id: string
  compliance_status: string
  assessment_date: string
  expiry_date?: string
  evidence_documents: any[]
  violations: any[]
  remediation_plan?: string
  next_review_date?: string
}

export default function Compliance() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [regulationFilter, setRegulationFilter] = useState("")
  const [selectedTab, setSelectedTab] = useState<'overview' | 'regulations' | 'audits' | 'training'>('overview')

  const { data: complianceRecords, loading, error, refetch } = useSupabaseData<ComplianceRecord>(
    "compliance_records",
    "id, organization_id, regulation_type, entity_type, entity_id, compliance_status, assessment_date, expiry_date, evidence_documents, violations, remediation_plan, next_review_date",
    { column: "assessment_date", ascending: false }
  )

  // Calculate compliance metrics
  const totalRecords = complianceRecords.length
  const compliantRecords = complianceRecords.filter(r => r.compliance_status === 'compliant').length
  const pendingRecords = complianceRecords.filter(r => r.compliance_status === 'pending').length
  const nonCompliantRecords = complianceRecords.filter(r => r.compliance_status === 'non_compliant').length
  const complianceRate = totalRecords > 0 ? (compliantRecords / totalRecords) * 100 : 0

  // Get upcoming reviews (next 30 days)
  const today = new Date()
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(today.getDate() + 30)
  
  const upcomingReviews = complianceRecords.filter(record => {
    if (!record.next_review_date) return false
    const reviewDate = new Date(record.next_review_date)
    return reviewDate >= today && reviewDate <= thirtyDaysFromNow
  }).sort((a, b) => new Date(a.next_review_date!).getTime() - new Date(b.next_review_date!).getTime())

  // Calculate expiring certifications
  const expiringCertifications = complianceRecords.filter(record => {
    if (!record.expiry_date) return false
    const expiryDate = new Date(record.expiry_date)
    return expiryDate >= today && expiryDate <= thirtyDaysFromNow
  }).sort((a, b) => new Date(a.expiry_date!).getTime() - new Date(b.expiry_date!).getTime())

  // Get unique regulation types
  const regulationTypes = [...new Set(complianceRecords.map(r => r.regulation_type))]

  // Get filtered records
  const filteredRecords = complianceRecords.filter(record => {
    const matchesSearch = record.regulation_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.entity_type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || record.compliance_status === statusFilter
    const matchesRegulation = !regulationFilter || record.regulation_type === regulationFilter
    return matchesSearch && matchesStatus && matchesRegulation
  })

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return "bg-green-100 text-green-800"
      case 'non_compliant':
        return "bg-red-100 text-red-800"
      case 'pending':
        return "bg-yellow-100 text-yellow-800"
      case 'exempt':
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'non_compliant':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      default:
        return <Shield className="w-4 h-4 text-gray-600" />
    }
  }

  // Regulations data (mock data since we don't have a dedicated regulations table)
  const regulations = [
    {
      id: 'reg-1',
      name: 'GDPR',
      description: 'General Data Protection Regulation',
      category: 'Data Privacy',
      applicability: 'Global',
      compliance_score: 94.5,
      last_audit: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      documents_required: ['Privacy Policy', 'Data Processing Agreement', 'DPIA'],
      key_requirements: [
        'Lawful basis for processing',
        'Data subject rights',
        'Data breach notification',
        'Data protection officer',
      ]
    },
    {
      id: 'reg-2',
      name: 'ISO 27001',
      description: 'Information Security Management System',
      category: 'Security',
      applicability: 'Global',
      compliance_score: 87.2,
      last_audit: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      documents_required: ['Security Policy', 'Risk Assessment', 'Security Controls Documentation'],
      key_requirements: [
        'Information security policy',
        'Risk assessment methodology',
        'Security controls implementation',
        'Management review',
      ]
    },
    {
      id: 'reg-3',
      name: 'CCPA',
      description: 'California Consumer Privacy Act',
      category: 'Data Privacy',
      applicability: 'US/California',
      compliance_score: 91.8,
      last_audit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      documents_required: ['Privacy Notice', 'Data Inventory', 'Consumer Rights Procedure'],
      key_requirements: [
        'Right to access',
        'Right to delete',
        'Right to opt-out of sale',
        'Privacy notice',
      ]
    },
    {
      id: 'reg-4',
      name: 'SOC 2',
      description: 'Service Organization Control 2',
      category: 'Security & Trust',
      applicability: 'US',
      compliance_score: 82.5,
      last_audit: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      documents_required: ['Security Policy', 'Availability Policy', 'Confidentiality Policy'],
      key_requirements: [
        'Security',
        'Availability',
        'Processing integrity',
        'Confidentiality',
        'Privacy',
      ]
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertTriangle className="w-6 h-6 mr-2" /> Error loading compliance data: {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Compliance Management</h1>
          <p className="text-muted-foreground">
            Monitor regulatory compliance, certifications, and audit requirements
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => refetch()} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Create Record
          </Button>
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Compliance Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold">{complianceRate.toFixed(1)}%</div>
              {complianceRate >= 90 ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingUp className="w-4 h-4 text-yellow-600" />
              )}
            </div>
            <Progress value={complianceRate} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Regulations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regulationTypes.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {compliantRecords} compliant, {nonCompliantRecords} non-compliant, {pendingRecords} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingReviews.length}</div>
            <p className="text-xs text-muted-foreground mt-1">In the next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expiring Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiringCertifications.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Require renewal soon</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={(value) => setSelectedTab(value as any)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="regulations">Regulations</TabsTrigger>
          <TabsTrigger value="audits">Audits & Evidence</TabsTrigger>
          <TabsTrigger value="training">Compliance Training</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {/* Search and filters */}
              <div className="bg-white rounded-lg border mb-4 p-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search compliance records..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full md:w-auto min-w-[150px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="compliant">Compliant</option>
                    <option value="non_compliant">Non-Compliant</option>
                    <option value="pending">Pending</option>
                    <option value="exempt">Exempt</option>
                  </select>
                  <select
                    value={regulationFilter}
                    onChange={(e) => setRegulationFilter(e.target.value)}
                    className="w-full md:w-auto min-w-[150px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Regulations</option>
                    {regulationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Compliance Records */}
              <div className="bg-white rounded-lg border">
                <div className="px-4 py-3 border-b">
                  <h3 className="font-semibold">Compliance Records</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Regulation
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Entity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assessment Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Next Review
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{record.regulation_type}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-900">{record.entity_type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.compliance_status)}`}>
                              {getStatusIcon(record.compliance_status)}
                              <span className="ml-1">
                                {record.compliance_status.replace('_', ' ').toUpperCase()}
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(record.assessment_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.next_review_date ? 
                              new Date(record.next_review_date).toLocaleDateString() : 
                              'Not scheduled'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm">
                                <FileText className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column - Alerts and Upcoming Reviews */}
            <div className="space-y-6">
              {/* Compliance Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                      Compliance Alerts
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {expiringCertifications.length > 0 ? (
                    expiringCertifications.slice(0, 3).map((cert, index) => (
                      <div key={cert.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{cert.regulation_type}</h4>
                            <p className="text-xs text-gray-600">
                              Expires: {new Date(cert.expiry_date!).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="bg-orange-100 text-orange-800">Expiring</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      No immediate compliance alerts
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Upcoming Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    <div className="flex items-center">
                      <CalendarClock className="w-5 h-5 mr-2 text-blue-500" />
                      Upcoming Reviews
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingReviews.length > 0 ? (
                    upcomingReviews.slice(0, 4).map((review, index) => (
                      <div key={review.id} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{review.regulation_type}</h4>
                            <p className="text-xs text-gray-600">
                              Scheduled: {new Date(review.next_review_date!).toLocaleDateString()}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">
                      No upcoming reviews scheduled
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="regulations">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regulations.map(regulation => (
              <Card key={regulation.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{regulation.name}</CardTitle>
                    <Badge className="bg-blue-100 text-blue-800">{regulation.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{regulation.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Compliance Score</span>
                    <div className="text-right">
                      <span className={`font-semibold ${regulation.compliance_score >= 90 ? 'text-green-600' : 'text-orange-600'}`}>
                        {regulation.compliance_score.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <Progress 
                    value={regulation.compliance_score} 
                    className="h-2" 
                  />

                  <div className="text-sm">
                    <div className="font-medium mb-2">Key Requirements</div>
                    <ul className="space-y-1">
                      {regulation.key_requirements.slice(0, 3).map((req, i) => (
                        <li key={i} className="flex items-baseline gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
                          <span className="text-muted-foreground">{req}</span>
                        </li>
                      ))}
                      {regulation.key_requirements.length > 3 && (
                        <li className="text-xs text-muted-foreground">
                          + {regulation.key_requirements.length - 3} more requirements
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Last audit: {new Date(regulation.last_audit).toLocaleDateString()}</span>
                    <span>Applicability: {regulation.applicability}</span>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audits">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start md:items-center flex-col md:flex-row gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900">Audit Management System</h3>
                <p className="text-blue-700 mt-1">
                  Schedule, conduct, and manage audits with comprehensive documentation and evidence collection.
                </p>
              </div>
              <Button variant="outline" className="bg-white">Schedule Audit</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Audits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: 'ISO 27001 Internal Audit', date: '2025-02-15', status: 'completed', findings: 2 },
                    { name: 'GDPR Compliance Review', date: '2025-01-20', status: 'completed', findings: 0 },
                    { name: 'SOC 2 Type II Prep', date: '2024-12-05', status: 'in_progress', findings: 4 },
                  ].map((audit, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{audit.name}</div>
                        <div className="text-xs text-muted-foreground">{new Date(audit.date).toLocaleDateString()}</div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={audit.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                      >
                        {audit.status === 'completed' ? 'Completed' : 'In Progress'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Evidence Repository</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Data Processing Agreement', type: 'pdf', category: 'GDPR', date: '2025-01-10' },
                    { name: 'Security Controls Attestation', type: 'pdf', category: 'ISO 27001', date: '2025-02-05' },
                    { name: 'Staff Training Records', type: 'xlsx', category: 'Training', date: '2025-01-15' },
                    { name: 'Incident Response Policy', type: 'docx', category: 'Security', date: '2024-12-20' },
                  ].map((document, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-sm">{document.name}</div>
                          <div className="text-xs text-muted-foreground">{document.category} • {new Date(document.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                      <Badge variant="outline">{document.type.toUpperCase()}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">View All Documents</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Audit Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'CCPA Annual Assessment', date: '2025-03-15', type: 'Upcoming', days: 21 },
                    { name: 'Cybersecurity Controls Review', date: '2025-04-10', type: 'Upcoming', days: 47 },
                    { name: 'GDPR Processor Audit', date: '2025-05-20', type: 'Scheduled', days: 87 },
                  ].map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium text-sm">{event.name}</div>
                        <div className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={event.days < 30 ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}
                      >
                        {event.days < 30 ? `${event.days} days` : event.type}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">View Calendar</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="training">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
            <div className="flex items-start md:items-center flex-col md:flex-row gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-900">Compliance Training Platform</h3>
                <p className="text-purple-700 mt-1">
                  Track and manage employee training for all compliance requirements and certifications.
                </p>
              </div>
              <Button variant="outline" className="bg-white">Manage Training</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Training Compliance Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    { name: 'Data Protection Training', completion: 94.5, required: true, staff: 85, deadline: '2025-04-15' },
                    { name: 'Information Security Awareness', completion: 88.2, required: true, staff: 85, deadline: '2025-03-10' },
                    { name: 'Code of Conduct', completion: 100, required: true, staff: 85, deadline: '2025-01-05' },
                    { name: 'Anti-Bribery and Corruption', completion: 76.4, required: true, staff: 85, deadline: '2025-02-25' },
                    { name: 'Industry Regulation Updates', completion: 65.8, required: false, staff: 45, deadline: '2025-03-20' },
                  ].map((training, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <span className="font-medium">{training.name}</span>
                          {training.required && (
                            <Badge className="ml-2 bg-red-100 text-red-800">Required</Badge>
                          )}
                        </div>
                        <span className={`font-medium ${
                          training.completion >= 90 ? 'text-green-600' :
                          training.completion >= 75 ? 'text-yellow-600' : 'text-red-600'
                        }`}>{training.completion}%</span>
                      </div>
                      <Progress 
                        value={training.completion} 
                        className="h-2" 
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{training.staff} staff members</span>
                        <span>Deadline: {new Date(training.deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Training Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overall completion</span>
                    <span className="text-sm font-medium text-green-600">87.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Regulatory training</span>
                    <span className="text-sm font-medium text-green-600">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Security training</span>
                    <span className="text-sm font-medium text-yellow-600">78.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New hire orientation</span>
                    <span className="text-sm font-medium text-green-600">100%</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-3">Training Needs</h4>
                  <div className="space-y-2">
                    <div className="p-2 bg-orange-50 text-orange-800 rounded text-xs">
                      5 staff members overdue on security training
                    </div>
                    <div className="p-2 bg-yellow-50 text-yellow-800 rounded text-xs">
                      New GDPR update training required by March 30
                    </div>
                    <div className="p-2 bg-green-50 text-green-800 rounded text-xs">
                      Supply chain compliance training completed successfully
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">View All Training</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}