"use client"

import Link from "next/link"

import React from "react"

import { useState } from "react"
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Star,
  Building2,
  Users,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const agents = [
  {
    id: "1",
    name: "Sarah Wilson",
    email: "sarah.wilson@sasimo.com",
    phone: "+1 (555) 100-1001",
    role: "admin",
    status: "active",
    properties: 45,
    clients: 28,
    closedDeals: 156,
    rating: 4.9,
    joinedDate: "2023-01-15",
    lastActive: "Online now",
    permissions: {
      properties: true,
      clients: true,
      contracts: true,
      invoices: true,
      settings: true,
      team: true,
    },
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@sasimo.com",
    phone: "+1 (555) 100-1002",
    role: "agent",
    status: "active",
    properties: 32,
    clients: 19,
    closedDeals: 89,
    rating: 4.7,
    joinedDate: "2023-06-20",
    lastActive: "2 hours ago",
    permissions: {
      properties: true,
      clients: true,
      contracts: true,
      invoices: false,
      settings: false,
      team: false,
    },
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@sasimo.com",
    phone: "+1 (555) 100-1003",
    role: "agent",
    status: "active",
    properties: 28,
    clients: 15,
    closedDeals: 67,
    rating: 4.8,
    joinedDate: "2024-02-10",
    lastActive: "1 day ago",
    permissions: {
      properties: true,
      clients: true,
      contracts: true,
      invoices: false,
      settings: false,
      team: false,
    },
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@sasimo.com",
    phone: "+1 (555) 100-1004",
    role: "junior",
    status: "active",
    properties: 12,
    clients: 8,
    closedDeals: 23,
    rating: 4.5,
    joinedDate: "2025-08-01",
    lastActive: "3 hours ago",
    permissions: {
      properties: true,
      clients: true,
      contracts: false,
      invoices: false,
      settings: false,
      team: false,
    },
  },
  {
    id: "5",
    name: "Jessica Taylor",
    email: "j.taylor@sasimo.com",
    phone: "+1 (555) 100-1005",
    role: "agent",
    status: "inactive",
    properties: 0,
    clients: 5,
    closedDeals: 42,
    rating: 4.6,
    joinedDate: "2023-09-15",
    lastActive: "2 weeks ago",
    permissions: {
      properties: true,
      clients: true,
      contracts: true,
      invoices: false,
      settings: false,
      team: false,
    },
  },
]

const stats = [
  { label: "Total Agents", value: "12", icon: Users },
  { label: "Active Now", value: "8", icon: ShieldCheck },
  { label: "Avg. Rating", value: "4.7", icon: Star },
  { label: "Total Deals", value: "377", icon: TrendingUp },
]

export default function AgentsPage() {
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredAgents = agents.filter((agent) => {
    if (roleFilter !== "all" && agent.role !== roleFilter) return false
    if (statusFilter !== "all" && agent.status !== statusFilter) return false
    return true
  })

  const getRoleBadge = (role: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline", label: string, icon: React.ReactNode }> = {
      admin: { variant: "default", label: "Admin", icon: <ShieldCheck className="h-3 w-3 mr-1" /> },
      agent: { variant: "secondary", label: "Agent", icon: <Shield className="h-3 w-3 mr-1" /> },
      junior: { variant: "outline", label: "Junior Agent", icon: <ShieldAlert className="h-3 w-3 mr-1" /> },
    }
    const { variant, label, icon } = config[role] || { variant: "outline", label: role, icon: null }
    return (
      <Badge variant={variant} className="flex items-center w-fit">
        {icon}
        {label}
      </Badge>
    )
  }

  const getStatusIndicator = (status: string) => {
    return (
      <span className={`inline-flex h-2 w-2 rounded-full ${status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agents & Permissions</h1>
          <p className="text-muted-foreground">Manage team members and access controls</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Agent
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New Agent</DialogTitle>
              <DialogDescription>
                Send an invitation to add a new agent to your team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email">Email Address</Label>
                <Input id="invite-email" placeholder="agent@example.com" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">Role</Label>
                <Select defaultValue="agent">
                  <SelectTrigger id="invite-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="junior">Junior Agent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Send Invitation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
              <Input placeholder="Search agents..." className="pl-9" />
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agents List */}
      <div className="grid gap-4">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Agent Info */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative">
                    <Avatar className="h-14 w-14">
                      <AvatarFallback className="text-lg">
                        {agent.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background ${agent.status === "active" ? "bg-green-500" : "bg-gray-400"}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{agent.name}</p>
                      {getRoleBadge(agent.role)}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {agent.email}
                      </span>
                      <span className="hidden sm:flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {agent.phone}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{agent.lastActive}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 lg:gap-8">
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">{agent.properties}</p>
                    <p className="text-xs text-muted-foreground">Properties</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">{agent.clients}</p>
                    <p className="text-xs text-muted-foreground">Clients</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">{agent.closedDeals}</p>
                    <p className="text-xs text-muted-foreground">Deals</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <p className="text-xl font-bold text-foreground">{agent.rating}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-transparent">
                        Permissions
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Permissions - {agent.name}</DialogTitle>
                        <DialogDescription>
                          Control what this agent can access and modify.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        {Object.entries(agent.permissions).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between">
                            <Label htmlFor={`perm-${key}`} className="capitalize">{key}</Label>
                            <Switch id={`perm-${key}`} defaultChecked={value} />
                          </div>
                        ))}
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Changes</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/agents/${agent.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/agents/${agent.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Message
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove Agent
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
