"use client"

import Link from "next/link"

import React from "react"

import { useState } from "react"
import {
  Plus,
  Search,
  Calendar,
  Clock,
  MapPin,
  User,
  Building2,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
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

const visits = [
  {
    id: "1",
    property: "Modern Downtown Apartment",
    propertyAddress: "123 Main St, New York, NY",
    client: "John Smith",
    clientPhone: "+1 (555) 123-4567",
    date: "2026-02-04",
    time: "10:00 AM",
    duration: "30 min",
    status: "confirmed",
    agent: "Sarah Wilson",
    notes: "First viewing, interested in 2BR units",
  },
  {
    id: "2",
    property: "Luxury Beachfront Villa",
    propertyAddress: "456 Ocean Dr, Miami, FL",
    client: "Emily Johnson",
    clientPhone: "+1 (555) 234-5678",
    date: "2026-02-04",
    time: "2:00 PM",
    duration: "45 min",
    status: "confirmed",
    agent: "Michael Chen",
    notes: "Second viewing, bringing family",
  },
  {
    id: "3",
    property: "Penthouse with City Views",
    propertyAddress: "789 Sky Tower, Chicago, IL",
    client: "Robert Williams",
    clientPhone: "+1 (555) 345-6789",
    date: "2026-02-05",
    time: "11:00 AM",
    duration: "1 hour",
    status: "pending",
    agent: "Sarah Wilson",
    notes: "VIP client, arrange refreshments",
  },
  {
    id: "4",
    property: "Cozy Studio Apartment",
    propertyAddress: "321 Park Ave, Boston, MA",
    client: "Maria Garcia",
    clientPhone: "+1 (555) 456-7890",
    date: "2026-02-05",
    time: "3:30 PM",
    duration: "30 min",
    status: "confirmed",
    agent: "Michael Chen",
    notes: "",
  },
  {
    id: "5",
    property: "Family Home with Garden",
    propertyAddress: "555 Oak Lane, Austin, TX",
    client: "David Brown",
    clientPhone: "+1 (555) 567-8901",
    date: "2026-02-06",
    time: "9:00 AM",
    duration: "45 min",
    status: "cancelled",
    agent: "Sarah Wilson",
    notes: "Client requested reschedule",
  },
  {
    id: "6",
    property: "Victorian House",
    propertyAddress: "888 Heritage St, San Francisco, CA",
    client: "Jennifer Taylor",
    clientPhone: "+1 (555) 678-9012",
    date: "2026-02-06",
    time: "1:00 PM",
    duration: "1 hour",
    status: "completed",
    agent: "Michael Chen",
    notes: "Very interested, will follow up",
  },
]

const stats = [
  { label: "Today", value: "4", subtext: "visits scheduled" },
  { label: "This Week", value: "18", subtext: "total visits" },
  { label: "Completion Rate", value: "92%", subtext: "last 30 days" },
  { label: "Avg. Duration", value: "38 min", subtext: "per visit" },
]

const timeSlots = [
  "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
]

export default function VisitsPage() {
  const [view, setView] = useState<"list" | "calendar">("list")
  const [statusFilter, setStatusFilter] = useState("all")

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive", icon: React.ReactNode }> = {
      confirmed: { variant: "default", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
      pending: { variant: "secondary", icon: <AlertCircle className="h-3 w-3 mr-1" /> },
      cancelled: { variant: "destructive", icon: <XCircle className="h-3 w-3 mr-1" /> },
      completed: { variant: "outline", icon: <CheckCircle className="h-3 w-3 mr-1" /> },
    }
    const { variant, icon } = config[status] || { variant: "outline", icon: null }
    return (
      <Badge variant={variant} className="flex items-center w-fit">
        {icon}
        {status}
      </Badge>
    )
  }

  const filteredVisits = visits.filter((visit) => {
    if (statusFilter !== "all" && visit.status !== statusFilter) return false
    return true
  })

  const todayVisits = visits.filter(v => v.date === "2026-02-04")
  const upcomingVisits = visits.filter(v => v.date > "2026-02-04" && v.status !== "cancelled")

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Visits Scheduling</h1>
          <p className="text-muted-foreground">Manage property viewings and appointments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Visit
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today&apos;s Schedule
            </CardTitle>
            <CardDescription>February 4, 2026</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todayVisits.length > 0 ? (
                todayVisits.map((visit) => (
                  <div key={visit.id} className="flex gap-3 p-3 rounded-lg border border-border">
                    <div className="flex flex-col items-center text-center min-w-[60px]">
                      <span className="text-sm font-medium text-foreground">{visit.time}</span>
                      <span className="text-xs text-muted-foreground">{visit.duration}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{visit.property}</p>
                      <p className="text-sm text-muted-foreground truncate">{visit.client}</p>
                      {getStatusBadge(visit.status)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No visits scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Visits List */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All Visits</CardTitle>
              <CardDescription>Manage all scheduled property viewings</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9 w-[150px]" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredVisits.map((visit) => (
                <div key={visit.id} className="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="hidden sm:flex flex-col items-center text-center min-w-[80px] p-2 rounded-lg bg-muted">
                    <span className="text-xs text-muted-foreground">
                      {new Date(visit.date).toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span className="text-lg font-bold text-foreground">
                      {new Date(visit.date).getDate()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(visit.date).toLocaleDateString("en-US", { month: "short" })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-foreground">{visit.property}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{visit.propertyAddress}</span>
                        </div>
                      </div>
                      {getStatusBadge(visit.status)}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {visit.client}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {visit.time} ({visit.duration})
                      </div>
                      <div className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {visit.agent}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/visits/${visit.id}`}>View Details</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/visits/${visit.id}/edit`}>Edit Visit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Cancel Visit</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
