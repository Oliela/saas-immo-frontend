"use client"

import { useState } from "react"
import {
  Receipt,
  Download,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  Calendar,
  FileText,
  ArrowUpRight,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    id: "INV-2026-001",
    description: "Security Deposit",
    property: "Modern Loft in Downtown",
    amount: 5000,
    dueDate: "Feb 15, 2026",
    status: "pending",
    type: "deposit",
  },
  {
    id: "INV-2026-002",
    description: "First Month Rent - March 2026",
    property: "Modern Loft in Downtown",
    amount: 2500,
    dueDate: "Mar 1, 2026",
    status: "pending",
    type: "rent",
  },
  {
    id: "INV-2025-012",
    description: "Monthly Rent - December 2025",
    property: "Cozy Studio Apartment",
    amount: 1800,
    paidDate: "Dec 1, 2025",
    status: "paid",
    type: "rent",
  },
  {
    id: "INV-2025-011",
    description: "Monthly Rent - November 2025",
    property: "Cozy Studio Apartment",
    amount: 1800,
    paidDate: "Nov 1, 2025",
    status: "paid",
    type: "rent",
  },
  {
    id: "INV-2025-010",
    description: "Monthly Rent - October 2025",
    property: "Cozy Studio Apartment",
    amount: 1800,
    paidDate: "Oct 1, 2025",
    status: "paid",
    type: "rent",
  },
  {
    id: "INV-2025-009",
    description: "Monthly Rent - September 2025",
    property: "Cozy Studio Apartment",
    amount: 1800,
    paidDate: "Sep 1, 2025",
    status: "paid",
    type: "rent",
  },
]

const paymentMethods = [
  { id: "card", name: "Credit/Debit Card", last4: "4242", brand: "Visa" },
  { id: "bank", name: "Bank Transfer", last4: "6789", brand: "Chase Bank" },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "paid":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle className="mr-1 h-3 w-3" />
          Paid
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
          <Clock className="mr-1 h-3 w-3" />
          Pending
        </Badge>
      )
    case "overdue":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <AlertCircle className="mr-1 h-3 w-3" />
          Overdue
        </Badge>
      )
    default:
      return null
  }
}

export default function InvoicesPage() {
  const [payDialogOpen, setPayDialogOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card")
  const [filterYear, setFilterYear] = useState("all")

  const pendingInvoices = invoices.filter((inv) => inv.status === "pending")
  const paidInvoices = invoices.filter((inv) => inv.status === "paid")
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Invoices & Payments</h1>
          <p className="text-muted-foreground">Manage your invoices and payment history.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">${totalPending.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Pending Payment</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">${totalPaid.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Paid (2025)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Visa ending in 4242</p>
                <p className="text-xs text-muted-foreground">Default Payment Method</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Invoices Alert */}
      {pendingInvoices.length > 0 && (
        <Card className="border-accent/50 bg-accent/5">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 flex-shrink-0">
                <Receipt className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">
                  {pendingInvoices.length} pending invoice{pendingInvoices.length > 1 ? "s" : ""}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Total amount due: ${totalPending.toLocaleString()}
                </p>
              </div>
              <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay All (${totalPending.toLocaleString()})
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Make Payment</DialogTitle>
                    <DialogDescription>
                      Select a payment method for your pending invoices.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="rounded-lg border border-border p-4 bg-secondary/30">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Invoices</span>
                        <span className="text-sm font-medium">{pendingInvoices.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Amount</span>
                        <span className="text-lg font-semibold">${totalPending.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center space-x-3 border border-border rounded-lg p-3">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">{method.name}</p>
                                  <p className="text-xs text-muted-foreground">{method.brand} ending in {method.last4}</p>
                                </div>
                                <CreditCard className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    <Button variant="link" className="px-0 text-accent">
                      + Add new payment method
                    </Button>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setPayDialogOpen(false)} className="bg-transparent">
                      Cancel
                    </Button>
                    <Button onClick={() => setPayDialogOpen(false)}>
                      Pay ${totalPending.toLocaleString()}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Invoices</CardTitle>
              <CardDescription>View and download your invoices.</CardDescription>
            </div>
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead className="hidden md:table-cell">Property</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{invoice.id}</p>
                        <p className="text-xs text-muted-foreground">{invoice.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <p className="text-sm text-muted-foreground">{invoice.property}</p>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-foreground">${invoice.amount.toLocaleString()}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <p className="text-sm text-muted-foreground">
                        {invoice.status === "paid" ? invoice.paidDate : invoice.dueDate}
                      </p>
                    </TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                        {invoice.status === "pending" && (
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-accent">
                            <CreditCard className="h-4 w-4" />
                            <span className="sr-only">Pay</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your saved payment methods.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{method.brand} ending in {method.last4}</p>
                    <p className="text-xs text-muted-foreground">{method.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {method.id === "card" && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent">
              + Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
