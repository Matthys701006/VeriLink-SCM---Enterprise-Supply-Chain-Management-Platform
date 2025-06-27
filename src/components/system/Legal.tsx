
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Scale, FileText, Gavel, AlertCircle, Shield, Globe, Users, Building } from 'lucide-react'

export function Legal() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Legal Compliance Framework</h2>
        <p className="text-muted-foreground">
          Comprehensive legal framework and regulatory compliance monitoring
        </p>
      </div>

      {/* Regulatory Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Regulatory Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Global Regulations
              </h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <div>
                    <span className="font-medium">GDPR (EU)</span>
                    <p className="text-xs text-muted-foreground">Data protection since 2018</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <div>
                    <span className="font-medium">CCPA (California)</span>
                    <p className="text-xs text-muted-foreground">Consumer privacy rights</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                  <div>
                    <span className="font-medium">EU AI Act</span>
                    <p className="text-xs text-muted-foreground">Effective August 2024</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">Monitoring</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                  <div>
                    <span className="font-medium">Canada FAFLA</span>
                    <p className="text-xs text-muted-foreground">Forced labour prevention</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Compliance Documentation
              </h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>DPIAs:</strong> Data Protection Impact Assessments for high-risk processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>AI Documentation:</strong> Risk assessments and conformity declarations</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Training Records:</strong> Regular employee compliance training</span>
                </li>
                <li className="flex items-start gap-2">
                  <Building className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Audit Reports:</strong> Third-party compliance verification</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Legal Documents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Legal Documents Framework
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Core Legal Documents</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">Terms of Service</h5>
                  <p className="text-sm text-muted-foreground">User rights and responsibilities framework</p>
                  <Badge variant="outline" className="mt-1">Updated Q4 2024</Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">Privacy Policy</h5>
                  <p className="text-sm text-muted-foreground">Data collection, use, and protection practices</p>
                  <Badge variant="outline" className="mt-1">GDPR Compliant</Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">Data Processing Agreements</h5>
                  <p className="text-sm text-muted-foreground">Third-party processor compliance requirements</p>
                  <Badge variant="outline" className="mt-1">Standard Clauses</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Operational Policies</h4>
              <div className="space-y-2">
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">AI Ethics Policy</h5>
                  <p className="text-sm text-muted-foreground">Ethical AI development and deployment guidelines</p>
                  <Badge variant="outline" className="mt-1">UNESCO Aligned</Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">Supplier Code of Conduct</h5>
                  <p className="text-sm text-muted-foreground">Ethical labor and environmental standards</p>
                  <Badge variant="outline" className="mt-1">Due Diligence</Badge>
                </div>
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium">Incident Response Plan</h5>
                  <p className="text-sm text-muted-foreground">Breach response and remediation procedures</p>
                  <Badge variant="outline" className="mt-1">72-Hour SLA</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Legal Risk Assessment Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-semibold text-red-600">High-Risk Categories</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Criminal Liabilities:</strong> Trade fraud, corruption prevention (up to 5% global turnover)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Civil Liabilities:</strong> False Claims Act violations, securities fraud from greenwashing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Emerging Risks:</strong> Whistleblower reports, AI-enabled fraud, geopolitical tensions</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-600">Mitigation Strategies</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Due Diligence:</strong> Comprehensive supplier mapping with blockchain traceability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Contractual Safeguards:</strong> Clear contracts with defined responsibilities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Self-Disclosure:</strong> Leverage DOJ declination policies for voluntary reporting</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold mb-3">Liability Distribution Matrix</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Party</th>
                      <th className="text-left p-2">Primary Liabilities</th>
                      <th className="text-left p-2">Risk Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Corporations</td>
                      <td className="p-2">Vicarious liability, negligence claims, regulatory fines</td>
                      <td className="p-2"><Badge className="bg-red-100 text-red-800">High</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Suppliers</td>
                      <td className="p-2">Breach of contract, counterfeiting penalties</td>
                      <td className="p-2"><Badge className="bg-yellow-100 text-yellow-800">Medium</Badge></td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Logistics Providers</td>
                      <td className="p-2">Customs non-compliance, smuggling charges</td>
                      <td className="p-2"><Badge className="bg-yellow-100 text-yellow-800">Medium</Badge></td>
                    </tr>
                    <tr>
                      <td className="p-2 font-medium">Employees</td>
                      <td className="p-2">Prosecution for fraud/bribery, misconduct dismissal</td>
                      <td className="p-2"><Badge className="bg-orange-100 text-orange-800">Variable</Badge></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incident Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Incident Management & Reporting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Response Procedures</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Incident Response Plan:</strong> Comprehensive breach response and remediation steps</span>
                </li>
                <li className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Breach Notifications:</strong> 72-hour notification to authorities per GDPR/CCPA</span>
                </li>
                <li className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Documentation:</strong> Complete incident records with actions and outcomes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Scale className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Continuous Improvement:</strong> Post-incident analysis for prevention</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Recent Incident Example (2025)</h4>
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h5 className="font-medium text-blue-800">Data Breach Response</h5>
                <p className="text-sm mt-2">
                  Customer data exposure incident was contained within 24 hours. Affected parties were notified 
                  within the required 72-hour GDPR timeframe. Enhanced encryption protocols were implemented 
                  to prevent future occurrences.
                </p>
                <div className="mt-2 flex gap-2">
                  <Badge className="bg-green-100 text-green-800">Resolved</Badge>
                  <Badge className="bg-blue-100 text-blue-800">Compliant</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
