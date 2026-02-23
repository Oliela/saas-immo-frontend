"use client"

import Link from "next/link"
import {
  ArrowLeft,
  FileText,
  Pencil,
  Download,
  Printer,
  Send,
  CheckCircle,
  Clock,
  User,
  Building2,
  MapPin,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  History,
  Copy,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const contract = {
  id: "CT-2026-001",
  type: "sale",
  status: "signed",
  progress: 100,
  createdDate: "2026-01-15",
  signedDate: "2026-01-28",
  expiryDate: "2027-01-28",
  property: {
    title: "Modern Downtown Apartment",
    address: "123 Main Street, Apt 4B, New York, NY 10001",
    type: "Apartment",
    surface: "120 m\u00B2",
    rooms: 3,
    price: "$725,000",
  },
  client: {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    status: "approved",
  },
  agent: {
    name: "Sarah Wilson",
    role: "Senior Agent",
  },
  financial: {
    salePrice: "$725,000",
    commission: "3%",
    commissionAmount: "$21,750",
    deposit: "$72,500",
    depositPaid: true,
  },
  clauses: [
    { id: 1, title: "Property Description", content: "The Seller agrees to sell and the Buyer agrees to purchase the property located at 123 Main Street, Apt 4B, New York, NY 10001, as described in Exhibit A." },
    { id: 2, title: "Purchase Price", content: "The total purchase price for the Property shall be Seven Hundred Twenty-Five Thousand Dollars ($725,000), payable as outlined in Section 3." },
    { id: 3, title: "Deposit", content: "The Buyer shall deposit the sum of Seventy-Two Thousand Five Hundred Dollars ($72,500) within five (5) business days of the execution of this Agreement." },
    { id: 4, title: "Inspection Period", content: "The Buyer shall have fifteen (15) days from the date of contract execution to conduct a professional inspection of the Property at Buyer's expense." },
    { id: 5, title: "Closing Date", content: "The closing of this transaction shall take place on or before March 15, 2026, at the office of the designated title company." },
  ],
  history: [
    { date: "2026-01-28", action: "Contract signed by both parties", user: "System" },
    { date: "2026-01-25", action: "Client approved and signed", user: "John Smith" },
    { date: "2026-01-22", action: "Sent for client signature", user: "Sarah Wilson" },
    { date: "2026-01-20", action: "Final review completed", user: "Sarah Wilson" },
    { date: "2026-01-18", action: "Clauses updated", user: "Sarah Wilson" },
    { date: "2026-01-15", action: "Contract created", user: "Sarah Wilson" },
  ],
}

export default function ContractViewPage() {
  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      signed: { variant: "default", label: "Signed" },
      pending_signature: { variant: "secondary", label: "Pending Signature" },
      draft: { variant: "outline", label: "Draft" },
      review: { variant: "secondary", label: "In Review" },
      expired: { variant: "destructive", label: "Expired" },
      cancelled: { variant: "destructive", label: "Cancelled" },
    }
    const { variant, label } = config[status] || { variant: "outline", label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/contracts"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{contract.id}</h1>
              {getStatusBadge(contract.status)}
              <Badge variant="outline" className="capitalize">{contract.type}</Badge>
            </div>
            <p className="text-muted-foreground mt-1">Created on {new Date(contract.createdDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="bg-transparent"><Printer className="mr-2 h-4 w-4" />Print</Button>
          <Button variant="outline" size="sm" className="bg-transparent"><Download className="mr-2 h-4 w-4" />Download PDF</Button>
          <Button variant="outline" size="sm" className="bg-transparent"><Send className="mr-2 h-4 w-4" />Send</Button>
          <Button size="sm" asChild>
            <Link href={`/dashboard/contracts/${contract.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit Contract</Link>
          </Button>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Contract Progress</p>
            <p className="text-sm text-muted-foreground">{contract.progress}% complete</p>
          </div>
          <Progress value={contract.progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details"><FileText className="mr-2 h-4 w-4" />Details</TabsTrigger>
              <TabsTrigger value="clauses"><Copy className="mr-2 h-4 w-4" />Clauses</TabsTrigger>
              <TabsTrigger value="history"><History className="mr-2 h-4 w-4" />History</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Property Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Building2 className="h-5 w-5" />Property</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between"><span className="text-muted-foreground">Property</span><span className="font-medium text-foreground">{contract.property.title}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-medium text-foreground text-right max-w-[300px]">{contract.property.address}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium text-foreground">{contract.property.type}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Surface</span><span className="font-medium text-foreground">{contract.property.surface}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Rooms</span><span className="font-medium text-foreground">{contract.property.rooms}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Listed Price</span><span className="font-bold text-foreground">{contract.property.price}</span></div>
                </CardContent>
              </Card>

              {/* Financial */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><DollarSign className="h-5 w-5" />Financial Terms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between"><span className="text-muted-foreground">Sale Price</span><span className="font-bold text-foreground text-lg">{contract.financial.salePrice}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Commission Rate</span><span className="font-medium text-foreground">{contract.financial.commission}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Commission Amount</span><span className="font-medium text-foreground">{contract.financial.commissionAmount}</span></div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Deposit</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{contract.financial.deposit}</span>
                      {contract.financial.depositPaid ? <Badge variant="default">Paid</Badge> : <Badge variant="secondary">Pending</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Calendar className="h-5 w-5" />Key Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between"><span className="text-muted-foreground">Created</span><span className="font-medium text-foreground">{new Date(contract.createdDate).toLocaleDateString()}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Signed</span><span className="font-medium text-foreground">{contract.signedDate ? new Date(contract.signedDate).toLocaleDateString() : "Not yet"}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="text-muted-foreground">Expires</span><span className="font-medium text-foreground">{contract.expiryDate ? new Date(contract.expiryDate).toLocaleDateString() : "N/A"}</span></div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="clauses" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Clauses</CardTitle>
                  <CardDescription>{contract.clauses.length} clauses in this contract</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contract.clauses.map((clause, index) => (
                    <div key={clause.id} className="p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">{index + 1}</span>
                        <h4 className="font-semibold text-foreground">{clause.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed pl-8">{clause.content}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0">
                    {contract.history.map((event, index) => (
                      <div key={index} className="flex gap-4 pb-6 last:pb-0">
                        <div className="flex flex-col items-center">
                          <div className={`h-3 w-3 rounded-full ${index === 0 ? "bg-primary" : "bg-border"}`} />
                          {index < contract.history.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                        </div>
                        <div className="flex-1 pb-2">
                          <p className="text-sm font-medium text-foreground">{event.action}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</span>
                            <span className="text-xs text-muted-foreground">by {event.user}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5" />Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12"><AvatarFallback>JS</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold text-foreground">{contract.client.name}</p>
                  <Badge variant="default" className="mt-1">Approved</Badge>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" />{contract.client.email}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" />{contract.client.phone}</div>
              </div>
            </CardContent>
          </Card>

          {/* Agent */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assigned Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10"><AvatarFallback>SW</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold text-foreground">{contract.agent.name}</p>
                  <p className="text-sm text-muted-foreground">{contract.agent.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm" asChild><Link href={`/dashboard/contracts/${contract.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit Contract</Link></Button>
              <Button variant="outline" className="w-full bg-transparent" size="sm"><Download className="mr-2 h-4 w-4" />Download PDF</Button>
              <Button variant="outline" className="w-full bg-transparent" size="sm"><Send className="mr-2 h-4 w-4" />Send to Client</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
