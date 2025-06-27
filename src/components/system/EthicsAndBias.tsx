
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Shield, AlertTriangle, Eye, Users, CheckCircle, FileText, Scale, Globe } from 'lucide-react'

export function EthicsAndBias() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Ethics and Fraud Prevention Report</h2>
        <p className="text-muted-foreground">
          Comprehensive overview of our ethical AI practices and fraud prevention measures
        </p>
      </div>

      {/* Ethical Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Ethical Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Our organization is committed to responsible AI development and deployment, guided by principles 
            informed by global frameworks such as UNESCO's Recommendation on the Ethics of AI and the EU's 
            Ethics Guidelines for Trustworthy AI.
          </p>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Core Principles</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Human Rights and Dignity:</strong> Respect, protect, and promote human rights in all AI applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Fairness and Non-Discrimination:</strong> Design AI systems to avoid unfair bias and promote social justice</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Transparency and Explainability:</strong> Provide clear insights into AI decision-making processes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Accountability:</strong> Establish auditability and redress mechanisms for AI systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Privacy and Data Protection:</strong> Adhere to data protection regulations with robust governance</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Implementation Framework</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Ethical Impact Assessment:</strong> Regular evaluations of AI projects for ethical implications</span>
                </li>
                <li className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Interdisciplinary Teams:</strong> Collaboration among ethicists, legal experts, and data scientists</span>
                </li>
                <li className="flex items-start gap-2">
                  <Scale className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Training and Education:</strong> Ongoing employee training on AI ethics and responsible practices</span>
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Monitoring and Auditing:</strong> Continuous monitoring to detect and address ethical issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <Globe className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Stakeholder Engagement:</strong> Regular feedback sessions to align with ethical standards</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bias Detection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Bias Detection & Mitigation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Fairness Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="font-medium">Demographic Parity</span>
                  <span className="text-blue-700 font-bold">0.95</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="font-medium">Equal Opportunity</span>
                  <span className="text-green-700 font-bold">0.92</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                  <span className="font-medium">Calibration Score</span>
                  <span className="text-purple-700 font-bold">0.88</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Recent Audit Results</h4>
              <div className="space-y-2 text-sm">
                <p className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                  <strong>Hiring AI Model (2025):</strong> Achieved demographic parity score of 0.95 across gender groups. 
                  Minor age group discrepancy addressed through dataset augmentation.
                </p>
                <p className="p-3 bg-blue-50 rounded border-l-4 border-blue-500">
                  <strong>Supplier Selection AI:</strong> Regular testing shows consistent fairness across geographic regions 
                  with ongoing monitoring for small business inclusion.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transparency Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Transparency Reports & Model Cards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Example Model Card</h4>
              <div className="p-4 border rounded-lg space-y-2">
                <h5 className="font-medium">Customer Service Chatbot</h5>
                <div className="text-sm space-y-1">
                  <p><strong>Purpose:</strong> Automate responses to customer inquiries</p>
                  <p><strong>Training Data:</strong> Historical interactions (2020-2024)</p>
                  <p><strong>Performance:</strong> 85% intent recognition accuracy</p>
                  <p><strong>Bias Assessment:</strong> No significant bias across language groups</p>
                  <p><strong>Limitations:</strong> May struggle with complex queries or nuanced language</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Decision-Making Transparency</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Role of AI clearly defined (advisory vs automated)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Human oversight mechanisms in place</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Appeal and redress procedures established</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Public disclosures available on website</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stakeholder Impact Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Stakeholder Impact Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="font-semibold">Affected Stakeholders</h4>
              <ul className="text-sm space-y-2">
                <li><strong>Workers:</strong> AI-driven hiring and labor allocation monitoring for bias prevention</li>
                <li><strong>Suppliers:</strong> Procurement AI evaluation for fair treatment of all business sizes</li>
                <li><strong>Communities:</strong> Logistics AI assessment for equitable service distribution</li>
                <li><strong>Consumers:</strong> Service delivery AI monitoring for fairness and trust</li>
                <li><strong>Investors:</strong> Ethical compliance tracking for confidence maintenance</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">2025 Key Findings</h4>
              <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <p className="text-sm">
                  <strong>Logistics AI Improvement:</strong> Identified under-service to rural communities due to biased training data. 
                  Implemented data diversification and rerouting algorithms to ensure equitable service distribution.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm">
                  <strong>Supplier Diversity:</strong> Increased small business participation by 23% through AI bias correction 
                  in procurement processes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
