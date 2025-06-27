
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { RotateCcw, AlertTriangle, DollarSign, Package, Truck, FileX } from 'lucide-react'

export function ReturnsRefunds() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Returns & Loss Management</h2>
        <p className="text-muted-foreground">
          Comprehensive handling of returns, losses, breakages, accidents, and refunds
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5" />
              Returns Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Return Authorization (RMA)</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">Automated</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                • Automated RMA generation with QR codes<br/>
                • Quality inspection upon receipt<br/>
                • Inventory restocking or disposal decision<br/>
                • Customer notification and refund processing
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Return Categories</span>
                <Badge variant="outline">Classification</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                • Defective products → Supplier claim<br/>
                • Customer change of mind → Restocking fee<br/>
                • Damaged in transit → Carrier claim<br/>
                • Wrong item shipped → Full refund + expedited replacement
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Loss & Breakage Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Breakage During Transit</span>
                <Badge variant="outline" className="bg-orange-50 text-orange-700">Insurance</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                • Photo documentation required<br/>
                • Carrier liability assessment<br/>
                • Insurance claim filing<br/>
                • Customer replacement or refund
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Warehouse Damage</span>
                <Badge variant="outline">Internal</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                • Incident reporting system<br/>
                • Staff accountability tracking<br/>
                • Process improvement analysis<br/>
                • Cost center allocation
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Accident & Emergency Response
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Transportation Accidents</span>
                <Badge variant="outline" className="bg-red-50 text-red-700">Critical</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                • Immediate incident reporting<br/>
                • Emergency contact notification<br/>
                • Insurance company alert<br/>
                • Alternative delivery arrangement<br/>
                • Legal compliance documentation
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Product Recalls</span>
                <Badge variant="outline">Regulatory</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                • Batch/lot tracking system<br/>
                • Customer notification automation<br/>
                • Return logistics coordination<br/>
                • Regulatory reporting compliance
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment & Refund Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Wrong Payment Handling</span>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Reconciliation</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                • Overpayment → Credit note or refund<br/>
                • Underpayment → Invoice adjustment<br/>
                • Duplicate payment → Automatic refund<br/>
                • Wrong supplier payment → Recovery process
              </div>
              
              <Separator />
              
              <div className="flex justify-between items-center">
                <span className="font-medium">Refund Processing</span>
                <Badge variant="outline">Automated</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                • Same payment method refund priority<br/>
                • Processing time: 3-5 business days<br/>
                • Refund status tracking<br/>
                • Customer notification system
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileX className="h-5 w-5" />
              Loss Prevention & Recovery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Prevention Measures</h4>
                <div className="text-sm text-muted-foreground">
                  • Quality control checkpoints<br/>
                  • Proper packaging standards<br/>
                  • Staff training programs<br/>
                  • Equipment maintenance schedules<br/>
                  • Environmental monitoring
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Recovery Processes</h4>
                <div className="text-sm text-muted-foreground">
                  • Supplier charge-backs<br/>
                  • Insurance claim processing<br/>
                  • Carrier liability recovery<br/>
                  • Tax write-off documentation<br/>
                  • Salvage value realization
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Performance Metrics</h4>
                <div className="text-sm text-muted-foreground">
                  • Return rate by supplier<br/>
                  • Damage rate by carrier<br/>
                  • Processing time efficiency<br/>
                  • Recovery rate percentage<br/>
                  • Customer satisfaction scores
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
