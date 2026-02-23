"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Receipt,
  Pencil,
  Download,
  Printer,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Building2,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  CreditCard,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const invoice = {
  id: "INV-2026-001",
  status: "paid",
  type: "commission",
  issueDate: "2026-01-15",
  dueDate: "2026-01-30",
  paidDate: "2026-01-28",
  client: {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    address: "456 Park Avenue, New York, NY 10022",
  },
  property: {
    title: "Modern Downtown Apartment",
    address: "123 Main Street, Apt 4B, New York, NY 10001",
  },
  contract: "CT-2026-001",
  items: [
    { description: "Sale Commission (3% of $725,000)", quantity: 1, unitPrice: 21750, total: 21750 },
  ],
  subtotal: 21750,
  tax: 0,
  total: 21750,
  paymentMethod: "Bank Transfer",
  paymentRef: "TRF-2026-01-28-4521",
  notes: "Commission for the sale of Modern Downtown Apartment. Payment received on time.",
  history: [
    { date: "2026-01-28", action: "Payment received - Bank Transfer", status: "paid" },
    { date: "2026-01-20", action: "Payment reminder sent", status: "pending" },
    { date: "2026-01-15", action: "Invoice sent to client", status: "pending" },
    { date: "2026-01-15", action: "Invoice created", status: "draft" },
  ],
}

export default function InvoiceViewPage() {
  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      paid: { variant: "default", label: "Paid" },
      pending: { variant: "secondary", label: "Pending" },
      overdue: { variant: "destructive", label: "Overdue" },
      draft: { variant: "outline", label: "Draft" },
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
            <Link href="/dashboard/invoices"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{invoice.id}</h1>
              {getStatusBadge(invoice.status)}
              <Badge variant="outline" className="capitalize">{invoice.type}</Badge>
            </div>
            <p className="text-muted-foreground mt-1">Issued on {new Date(invoice.issueDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="bg-transparent"><Printer className="mr-2 h-4 w-4" />Print</Button>
          <Button variant="outline" size="sm" className="bg-transparent"><Download className="mr-2 h-4 w-4" />Download PDF</Button>
          <Button variant="outline" size="sm" className="bg-transparent"><Send className="mr-2 h-4 w-4" />Send</Button>
          <Button size="sm" asChild>
            <Link href={`/dashboard/invoices/${invoice.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit Invoice</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Preview */}
          <Card>
            <CardContent className="p-8">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">INVOICE</h2>
                  <p className="text-muted-foreground mt-1">{invoice.id}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground text-lg">SASIMO</p>
                  <p className="text-sm text-muted-foreground">Real Estate Management</p>
                  <p className="text-sm text-muted-foreground">contact@sasimo.com</p>
                </div>
              </div>

              <div className="grid gap-8 sm:grid-cols-2 mb-8">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Bill To</p>
                  <p className="font-semibold text-foreground">{invoice.client.name}</p>
                  <p className="text-sm text-muted-foreground">{invoice.client.email}</p>
                  <p className="text-sm text-muted-foreground">{invoice.client.address}</p>
                </div>
                <div className="text-right">
                  <div className="space-y-1">
                    <div className="flex justify-end gap-4"><span className="text-sm text-muted-foreground">Issue Date:</span><span className="text-sm font-medium text-foreground">{new Date(invoice.issueDate).toLocaleDateString()}</span></div>
                    <div className="flex justify-end gap-4"><span className="text-sm text-muted-foreground">Due Date:</span><span className="text-sm font-medium text-foreground">{new Date(invoice.dueDate).toLocaleDateString()}</span></div>
                    {invoice.paidDate && <div className="flex justify-end gap-4"><span className="text-sm text-muted-foreground">Paid Date:</span><span className="text-sm font-medium text-foreground">{new Date(invoice.paidDate).toLocaleDateString()}</span></div>}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-border rounded-lg overflow-hidden mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Description</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Qty</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Unit Price</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="border-t border-border">
                        <td className="py-3 px-4 text-sm text-foreground">{item.description}</td>
                        <td className="py-3 px-4 text-sm text-foreground text-center">{item.quantity}</td>
                        <td className="py-3 px-4 text-sm text-foreground text-right">${item.unitPrice.toLocaleString()}</td>
                        <td className="py-3 px-4 text-sm font-medium text-foreground text-right">${item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-[250px] space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="text-foreground">${invoice.subtotal.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="text-foreground">${invoice.tax.toLocaleString()}</span></div>
                  <Separator />
                  <div className="flex justify-between"><span className="font-bold text-foreground">Total</span><span className="font-bold text-foreground text-lg">${invoice.total.toLocaleString()}</span></div>
                </div>
              </div>

              {invoice.notes && (
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notes</p>
                  <p className="text-sm text-muted-foreground">{invoice.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Activity History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {invoice.history.map((event, index) => (
                  <div key={index} className="flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full ${index === 0 ? "bg-primary" : "bg-border"}`} />
                      {index < invoice.history.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-sm font-medium text-foreground">{event.action}</p>
                      <span className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5" />Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12"><AvatarFallback>JS</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold text-foreground">{invoice.client.name}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" />{invoice.client.email}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" />{invoice.client.phone}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg"><Building2 className="h-5 w-5" />Property</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold text-foreground">{invoice.property.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{invoice.property.address}</p>
              <Separator className="my-3" />
              <p className="text-sm text-muted-foreground">Contract: <Link href={`/dashboard/contracts/${invoice.contract}`} className="text-primary hover:underline">{invoice.contract}</Link></p>
            </CardContent>
          </Card>

          {invoice.status === "paid" && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg"><CreditCard className="h-5 w-5" />Payment Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Method</span><span className="text-sm font-medium text-foreground">{invoice.paymentMethod}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Reference</span><span className="text-sm font-medium text-foreground text-right max-w-[150px] truncate">{invoice.paymentRef}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground text-sm">Date</span><span className="text-sm font-medium text-foreground">{invoice.paidDate ? new Date(invoice.paidDate).toLocaleDateString() : "-"}</span></div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm" asChild><Link href={`/dashboard/invoices/${invoice.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit Invoice</Link></Button>
              <Button variant="outline" className="w-full bg-transparent" size="sm"><Download className="mr-2 h-4 w-4" />Download PDF</Button>
              <Button variant="outline" className="w-full bg-transparent" size="sm"><Send className="mr-2 h-4 w-4" />Send to Client</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
