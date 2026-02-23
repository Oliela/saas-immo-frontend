"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  UserPlus,
  Download,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const clients = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    type: "buyer",
    status: "active",
    budget: "$500,000 - $750,000",
    interestedIn: "Apartment",
    lastContact: "2 days ago",
    assignedAgent: "Sarah Wilson",
  },
  {
    id: "2",
    name: "Emily Johnson",
    email: "emily.j@email.com",
    phone: "+1 (555) 234-5678",
    location: "Los Angeles, CA",
    type: "renter",
    status: "active",
    budget: "$2,500 - $3,500/mo",
    interestedIn: "Studio",
    lastContact: "1 day ago",
    assignedAgent: "Michael Chen",
  },
  {
    id: "3",
    name: "Robert Williams",
    email: "r.williams@email.com",
    phone: "+1 (555) 345-6789",
    location: "Chicago, IL",
    type: "buyer",
    status: "lead",
    budget: "$800,000 - $1,200,000",
    interestedIn: "House",
    lastContact: "5 hours ago",
    assignedAgent: "Unassigned",
  },
  {
    id: "4",
    name: "Maria Garcia",
    email: "maria.g@email.com",
    phone: "+1 (555) 456-7890",
    location: "Miami, FL",
    type: "renter",
    status: "lead",
    budget: "$1,800 - $2,200/mo",
    interestedIn: "Apartment",
    lastContact: "3 days ago",
    assignedAgent: "Sarah Wilson",
  },
  {
    id: "5",
    name: "David Brown",
    email: "d.brown@email.com",
    phone: "+1 (555) 567-8901",
    location: "San Francisco, CA",
    type: "buyer",
    status: "negotiating",
    budget: "$1,500,000+",
    interestedIn: "Penthouse",
    lastContact: "Today",
    assignedAgent: "Michael Chen",
  },
  {
    id: "6",
    name: "Jennifer Taylor",
    email: "jen.taylor@email.com",
    phone: "+1 (555) 678-9012",
    location: "Seattle, WA",
    type: "buyer",
    status: "closed",
    budget: "$650,000 - $800,000",
    interestedIn: "Townhouse",
    lastContact: "1 week ago",
    assignedAgent: "Sarah Wilson",
  },
]

const stats = [
  { label: "Total Clients", value: "156", change: "+12 this month" },
  { label: "Active Leads", value: "48", change: "+8 this week" },
  { label: "In Negotiation", value: "12", change: "3 closing soon" },
  { label: "Closed Deals", value: "89", change: "+5 this month" },
]

export default function ClientsPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredClients = clients.filter((client) => {
    if (statusFilter !== "all" && client.status !== statusFilter) return false
    if (typeFilter !== "all" && client.type !== typeFilter) return false
    return true
  })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      active: "default",
      lead: "secondary",
      negotiating: "outline",
      closed: "secondary",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients & Leads</h1>
          <p className="text-muted-foreground">Manage your clients and track leads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Client
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
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="all">All Clients</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="closed">Closed</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search clients..." className="pl-9 w-[200px]" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Client type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buyer">Buyers</SelectItem>
                <SelectItem value="renter">Renters</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Client</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Contact</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Budget</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Agent</th>
                      <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>{client.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{client.name}</p>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {client.location}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden md:table-cell">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {client.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {client.phone}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden lg:table-cell">
                          <p className="text-sm font-medium text-foreground">{client.budget}</p>
                          <p className="text-xs text-muted-foreground">Looking for: {client.interestedIn}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            {getStatusBadge(client.status)}
                            <p className="text-xs text-muted-foreground capitalize">{client.type}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 hidden sm:table-cell">
                          <p className="text-sm text-foreground">{client.assignedAgent}</p>
                          <p className="text-xs text-muted-foreground">{client.lastContact}</p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
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
        </TabsContent>

        <TabsContent value="leads">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center py-8">
                Showing leads only. Filter applied.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center py-8">
                Showing active clients only. Filter applied.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="closed">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center py-8">
                Showing closed deals only. Filter applied.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
