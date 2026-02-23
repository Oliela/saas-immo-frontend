import Link from "next/link"
import Image from "next/image"
import {
  Building2,
  Users,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Calendar,
  MoreHorizontal,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { properties } from "@/lib/mock-data"

const stats = [
  {
    name: "Total Properties",
    value: "245",
    change: "+12",
    changeType: "positive" as const,
    icon: Building2,
  },
  {
    name: "Active Leads",
    value: "48",
    change: "+8",
    changeType: "positive" as const,
    icon: Users,
  },
  {
    name: "New Messages",
    value: "12",
    change: "-3",
    changeType: "negative" as const,
    icon: MessageSquare,
  },
  {
    name: "Views This Month",
    value: "2,845",
    change: "+18%",
    changeType: "positive" as const,
    icon: Eye,
  },
]

const recentLeads = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@email.com",
    property: "Modern Downtown Apartment",
    status: "new",
    time: "2 hours ago",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    property: "Luxury Beachfront Villa",
    status: "contacted",
    time: "5 hours ago",
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "m.brown@email.com",
    property: "Penthouse with City Views",
    status: "viewing",
    time: "1 day ago",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.d@email.com",
    property: "Family Home with Garden",
    status: "new",
    time: "1 day ago",
  },
]

const upcomingAppointments = [
  {
    id: "1",
    clientName: "Robert Wilson",
    property: "Charming Victorian House",
    date: "Today",
    time: "2:00 PM",
    type: "Viewing",
  },
  {
    id: "2",
    clientName: "Lisa Anderson",
    property: "Modern Loft Space",
    date: "Tomorrow",
    time: "10:00 AM",
    type: "Viewing",
  },
  {
    id: "3",
    clientName: "David Martinez",
    property: "Suburban Family Estate",
    date: "Feb 6",
    time: "3:30 PM",
    type: "Signing",
  },
]

export default function DashboardPage() {
  const formatPrice = (price: number, listingType: "buy" | "rent") => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
    return listingType === "rent" ? `${formatted}/mo` : formatted
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Premier Properties</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/properties/new">Add New Property</Link>
        </Button>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your agency</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/contracts/new">
                <Building2 className="mr-2 h-4 w-4" />
                New Contract
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/dashboard/invoices/new">
                <TrendingUp className="mr-2 h-4 w-4" />
                Create Invoice
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/dashboard/owners/new">
                <Users className="mr-2 h-4 w-4" />
                Add Owner
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    stat.changeType === "positive" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.changeType === "positive" ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Properties */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Properties</CardTitle>
              <CardDescription>Your latest listed properties</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="bg-transparent">
              <Link href="/dashboard/properties">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {properties.slice(0, 4).map((property) => (
                <div
                  key={property.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{property.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{property.location}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="font-medium text-foreground">
                      {formatPrice(property.price, property.listingType)}
                    </p>
                    <Badge variant={property.listingType === "rent" ? "secondary" : "default"} className="mt-1">
                      {property.listingType === "rent" ? "Rent" : "Sale"}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Appointments</CardTitle>
              <CardDescription>Upcoming viewings & meetings</CardDescription>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/appointments">
                <Calendar className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
                    {appointment.clientName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{appointment.clientName}</p>
                    <p className="text-sm text-muted-foreground truncate">{appointment.property}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {appointment.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {appointment.date} at {appointment.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Leads</CardTitle>
            <CardDescription>People interested in your properties</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild className="bg-transparent">
            <Link href="/dashboard/leads">View All Leads</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Property</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Time</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{lead.name}</p>
                          <p className="text-sm text-muted-foreground hidden sm:block">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <p className="text-sm text-foreground truncate max-w-[200px]">{lead.property}</p>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          lead.status === "new"
                            ? "default"
                            : lead.status === "contacted"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground hidden md:table-cell">{lead.time}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">
                        Contact
                      </Button>
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
