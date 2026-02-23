"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  FileText,
  Download,
  MoreHorizontal,
  Eye,
  Pencil,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  Filter,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Progress } from "@/components/ui/progress"

const contracts = [
  {
    id: "CT-2026-001",
    property: "Modern Downtown Apartment",
    client: "John Smith",
    type: "sale",
    value: "$725,000",
    status: "signed",
    createdDate: "2026-01-15",
    expiryDate: "2026-02-15",
    progress: 100,
    agent: "Sarah Wilson",
  },
  {
    id: "CT-2026-002",
    property: "Luxury Beachfront Villa",
    client: "Emily Johnson",
    type: "rental",
    value: "$4,500/mo",
    status: "pending_signature",
    createdDate: "2026-01-28",
    expiryDate: "2026-02-28",
    progress: 75,
    agent: "Michael Chen",
  },
  {
    id: "CT-2026-003",
    property: "Penthouse with City Views",
    client: "Robert Williams",
    type: "sale",
    value: "$1,850,000",
    status: "draft",
    createdDate: "2026-02-01",
    expiryDate: null,
    progress: 25,
    agent: "Sarah Wilson",
  },
  {
    id: "CT-2026-004",
    property: "Cozy Studio Apartment",
    client: "Maria Garcia",
    type: "rental",
    value: "$2,200/mo",
    status: "review",
    createdDate: "2026-02-02",
    expiryDate: "2026-03-02",
    progress: 50,
    agent: "Michael Chen",
  },
  {
    id: "CT-2026-005",
    property: "Family Home with Garden",
    client: "David Brown",
    type: "sale",
    value: "$890,000",
    status: "expired",
    createdDate: "2025-12-15",
    expiryDate: "2026-01-15",
    progress: 0,
    agent: "Sarah Wilson",
  },
  {
    id: "CT-2026-006",
    property: "Victorian House",
    client: "Jennifer Taylor",
    type: "sale",
    value: "$1,200,000",
    status: "cancelled",
    createdDate: "2026-01-20",
    expiryDate: null,
    progress: 0,
    agent: "Michael Chen",
  },
]

const stats = [
  { label: "Total Contracts", value: "47", icon: FileText },
  { label: "Pending Signature", value: "8", icon: Clock },
  { label: "Signed This Month", value: "12", icon: CheckCircle },
  { label: "Total Value", value: "$4.2M", icon: FileText },
]

export default function ContractsPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", label: string }> = {
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

  const filteredContracts = contracts.filter((contract) => {
    if (statusFilter !== "all" && contract.status !== statusFilter) return false
    if (typeFilter !== "all" && contract.type !== typeFilter) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contracts Management</h1>
          <p className="text-muted-foreground">Create and manage property contracts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/contracts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Contract
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
                </div>
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search contracts..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="pending_signature">Pending Signature</SelectItem>
                  <SelectItem value="signed">Signed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="rental">Rental</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Contract ID</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Property / Client</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Type</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Value</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden xl:table-cell">Progress</th>
                  <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{contract.id}</p>
                          <p className="text-xs text-muted-foreground">
                            Created {new Date(contract.createdDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-foreground truncate max-w-[200px]">{contract.property}</p>
                      <p className="text-sm text-muted-foreground">{contract.client}</p>
                    </td>
                    <td className="py-4 px-4 hidden md:table-cell">
                      <Badge variant="outline" className="capitalize">{contract.type}</Badge>
                    </td>
                    <td className="py-4 px-4 hidden lg:table-cell">
                      <p className="font-medium text-foreground">{contract.value}</p>
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(contract.status)}
                    </td>
                    <td className="py-4 px-4 hidden xl:table-cell">
                      <div className="w-[100px]">
                        <Progress value={contract.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">{contract.progress}% complete</p>
                      </div>
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
                            <Link href={`/dashboard/contracts/${contract.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Contract
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/contracts/${contract.id}/edit`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Send for Signature
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Cancel Contract
                          </DropdownMenuItem>
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
