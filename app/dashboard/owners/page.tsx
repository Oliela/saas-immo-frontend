"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Building2,
  Download,
  UserCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

const owners = [
  {
    id: "1",
    name: "Alexander Thompson",
    email: "alex.thompson@email.com",
    phone: "+1 (555) 111-2222",
    location: "New York, NY",
    properties: 5,
    totalValue: "$4,250,000",
    status: "active",
    joinedDate: "2024-03-15",
    lastActivity: "2 days ago",
  },
  {
    id: "2",
    name: "Victoria Chen",
    email: "v.chen@email.com",
    phone: "+1 (555) 222-3333",
    location: "San Francisco, CA",
    properties: 3,
    totalValue: "$2,800,000",
    status: "active",
    joinedDate: "2024-06-20",
    lastActivity: "1 week ago",
  },
  {
    id: "3",
    name: "Marcus Williams",
    email: "m.williams@email.com",
    phone: "+1 (555) 333-4444",
    location: "Miami, FL",
    properties: 8,
    totalValue: "$6,500,000",
    status: "active",
    joinedDate: "2023-11-10",
    lastActivity: "Today",
  },
  {
    id: "4",
    name: "Isabella Rodriguez",
    email: "i.rodriguez@email.com",
    phone: "+1 (555) 444-5555",
    location: "Los Angeles, CA",
    properties: 2,
    totalValue: "$1,200,000",
    status: "inactive",
    joinedDate: "2024-01-25",
    lastActivity: "1 month ago",
  },
  {
    id: "5",
    name: "James Mitchell",
    email: "j.mitchell@email.com",
    phone: "+1 (555) 555-6666",
    location: "Chicago, IL",
    properties: 4,
    totalValue: "$3,100,000",
    status: "active",
    joinedDate: "2024-08-05",
    lastActivity: "3 days ago",
  },
  {
    id: "6",
    name: "Sophia Anderson",
    email: "s.anderson@email.com",
    phone: "+1 (555) 666-7777",
    location: "Seattle, WA",
    properties: 1,
    totalValue: "$750,000",
    status: "pending",
    joinedDate: "2026-01-28",
    lastActivity: "Today",
  },
]

const stats = [
  { label: "Total Owners", value: "89" },
  { label: "Total Properties", value: "312" },
  { label: "Portfolio Value", value: "$45.2M" },
  { label: "New This Month", value: "7" },
]

export default function OwnersPage() {
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOwners = owners.filter((owner) => {
    if (statusFilter !== "all" && owner.status !== statusFilter) return false
    return true
  })

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline", label: string }> = {
      active: { variant: "default", label: "Active" },
      inactive: { variant: "secondary", label: "Inactive" },
      pending: { variant: "outline", label: "Pending" },
    }
    const { variant, label } = config[status] || { variant: "outline", label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Owners Management</h1>
          <p className="text-muted-foreground">Manage property owners and their portfolios</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button asChild>
            <Link href="/dashboard/owners/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Owner
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
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
              <Input placeholder="Search owners..." className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Owners Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredOwners.map((owner) => (
          <Card key={owner.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg">
                      {owner.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{owner.name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {owner.location}
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/owners/${owner.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/owners/${owner.id}/edit`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Building2 className="mr-2 h-4 w-4" />
                      View Properties
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {owner.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {owner.phone}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{owner.properties}</p>
                    <p className="text-xs text-muted-foreground">Properties</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">{owner.totalValue}</p>
                    <p className="text-xs text-muted-foreground">Portfolio Value</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                {getStatusBadge(owner.status)}
                <p className="text-xs text-muted-foreground">Last active: {owner.lastActivity}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
