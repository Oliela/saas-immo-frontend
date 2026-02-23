"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Receipt,
  Download,
  MoreHorizontal,
  Eye,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  CreditCard,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const invoices = [
  {
    id: "INV-2026-001",
    client: "John Smith",
    property: "Modern Downtown Apartment",
    type: "commission",
    amount: 21750,
    status: "paid",
    issueDate: "2026-01-15",
    dueDate: "2026-01-30",
    paidDate: "2026-01-28",
  },
  {
    id: "INV-2026-002",
    client: "Emily Johnson",
    property: "Luxury Beachfront Villa",
    type: "rental",
    amount: 4500,
    status: "pending",
    issueDate: "2026-02-01",
    dueDate: "2026-02-15",
    paidDate: null,
  },
  {
    id: "INV-2026-003",
    client: "Robert Williams",
    property: "Penthouse with City Views",
    type: "deposit",
    amount: 55500,
    status: "pending",
    issueDate: "2026-02-02",
    dueDate: "2026-02-16",
    paidDate: null,
  },
  {
    id: "INV-2026-004",
    client: "Maria Garcia",
    property: "Cozy Studio Apartment",
    type: "rental",
    amount: 2200,
    status: "overdue",
    issueDate: "2026-01-01",
    dueDate: "2026-01-15",
    paidDate: null,
  },
  {
    id: "INV-2026-005",
    client: "David Brown",
    property: "Family Home with Garden",
    type: "commission",
    amount: 26700,
    status: "paid",
    issueDate: "2025-12-20",
    dueDate: "2026-01-05",
    paidDate: "2026-01-03",
  },
  {
    id: "INV-2026-006",
    client: "Jennifer Taylor",
    property: "Victorian House",
    type: "deposit",
    amount: 36000,
    status: "draft",
    issueDate: "2026-02-04",
    dueDate: null,
    paidDate: null,
  },
]

const stats = [
  { label: "Total Revenue", value: "$142,850", change: "+12%", icon: DollarSign },
  { label: "Pending", value: "$62,200", change: "4 invoices", icon: Clock },
  { label: "Overdue", value: "$2,200", change: "1 invoice", icon: AlertTriangle },
  { label: "Paid This Month", value: "$48,450", change: "+8%", icon: CheckCircle },
]

export default function InvoicesPage() {
  const [statusFilter, setStatusFilter] = useState("all")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", label: string }> = {
      paid: { variant: "default", label: "Paid" },
      pending: { variant: "secondary", label: "Pending" },
      overdue: { variant: "destructive", label: "Overdue" },
      draft: { variant: "outline", label: "Draft" },
    }
    const { variant, label } = config[status] || { variant: "outline", label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  const getTypeBadge = (type: string) => {
    return <Badge variant="outline" className="capitalize">{type}</Badge>
  }

  const filteredInvoices = invoices.filter((invoice) => {
    if (statusFilter !== "all" && invoice.status !== statusFilter) return false
    return true
  })

  const totalPending = invoices.filter(i => i.status === "pending").reduce((sum, i) => sum + i.amount, 0)
  const totalOverdue = invoices.filter(i => i.status === "overdue").reduce((sum, i) => sum + i.amount, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Invoices & Payments</h1>
          <p className="text-muted-foreground">Manage billing and track payments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/invoices/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      {(totalPending > 0 || totalOverdue > 0) && (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Outstanding Payments</p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(totalPending + totalOverdue)} in pending and overdue invoices
                  </p>
                </div>
              </div>
              <Button variant="outline" className="bg-transparent">
                Send Reminders
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters & Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>All Invoices</CardTitle>
            <CardDescription>Manage and track all invoice payments</CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search invoices..." className="pl-9 w-[180px]" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Invoice</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Client / Property</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Type</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden xl:table-cell">Due Date</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Receipt className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{invoice.id}</p>
                          <p className="text-xs text-muted-foreground">
                            Issued {new Date(invoice.issueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <p className="font-medium text-foreground">{invoice.client}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">{invoice.property}</p>
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell">
                      {getTypeBadge(invoice.type)}
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold text-foreground">{formatCurrency(invoice.amount)}</p>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(invoice.status)}
                    </td>
                    <td className="py-4 px-4 hidden xl:table-cell">
                      <p className="text-sm text-muted-foreground">
                        {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}
                      </p>
                      {invoice.paidDate && (
                        <p className="text-xs text-green-600">
                          Paid {new Date(invoice.paidDate).toLocaleDateString()}
                        </p>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/invoices/${invoice.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Invoice
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Send to Client
                          </DropdownMenuItem>
                          {invoice.status === "pending" || invoice.status === "overdue" ? (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <CreditCard className="mr-2 h-4 w-4" />
                                Record Payment
                              </DropdownMenuItem>
                            </>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
