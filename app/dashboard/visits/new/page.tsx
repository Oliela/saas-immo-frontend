"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  User,
  Building2,
  Calendar,
  Clock,
  UserCircle,
  FileText,
  Check,
  X,
  Send,
  Save,
  Mail,
  Phone,
  Bell,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const mockClients = [
  { id: "1", name: "Emily Thompson", email: "emily@example.com", phone: "+1 555-0101", avatar: "/images/property-1.jpg" },
  { id: "2", name: "David Wilson", email: "david@example.com", phone: "+1 555-0202", avatar: "/images/property-2.jpg" },
  { id: "3", name: "Lisa Anderson", email: "lisa@example.com", phone: "+1 555-0303", avatar: "/images/property-3.jpg" },
]

const mockProperties = [
  { id: "1", title: "Modern Downtown Apartment", address: "123 Main St, New York", image: "/images/property-1.jpg" },
  { id: "2", title: "Spacious Family Home", address: "456 Oak Ave, Los Angeles", image: "/images/property-2.jpg" },
  { id: "3", title: "Luxury Penthouse Suite", address: "789 Park Blvd, Miami", image: "/images/property-3.jpg" },
]

const mockAgents = [
  { id: "1", name: "John Smith", role: "Senior Agent", avatar: "/images/agency-1.jpg" },
  { id: "2", name: "Sarah Johnson", role: "Property Specialist", avatar: "/images/agency-2.jpg" },
  { id: "3", name: "Michael Brown", role: "Sales Manager", avatar: "/images/agency-3.jpg" },
]

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
]

export default function NewVisitPage() {
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<typeof mockProperties[0] | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<typeof mockAgents[0] | null>(null)
  const [visitDate, setVisitDate] = useState("")
  const [visitTime, setVisitTime] = useState("")
  const [status, setStatus] = useState<"pending" | "confirmed" | "canceled">("pending")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showNotificationPreview, setShowNotificationPreview] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!selectedClient) newErrors.client = "Please select a client"
    if (!selectedProperty) newErrors.property = "Please select a property"
    if (!visitDate) newErrors.date = "Please select a date"
    if (!visitTime) newErrors.time = "Please select a time"
    if (!selectedAgent) newErrors.agent = "Please assign an agent"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      setShowNotificationPreview(true)
    }
  }

  const getStatusBadge = (visitStatus: "pending" | "confirmed" | "canceled") => {
    switch (visitStatus) {
      case "confirmed":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Confirmed
          </Badge>
        )
      case "canceled":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Canceled
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  // Generate dates for the next 14 days
  const availableDates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return {
      value: date.toISOString().split("T")[0],
      label: date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      dayOfWeek: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString("en-US", { month: "short" }),
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/visits">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Schedule Visit</h1>
          <p className="text-muted-foreground">Create a new property visit appointment</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Select Client
              </CardTitle>
              <CardDescription>Choose the client for this visit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {mockClients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => setSelectedClient(client)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left",
                      selectedClient?.id === client.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Avatar>
                      <AvatarImage src={client.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{client.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{client.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                    </div>
                    {selectedClient?.id === client.id && (
                      <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {errors.client && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.client}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Property Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Select Property
              </CardTitle>
              <CardDescription>Choose the property to visit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {mockProperties.map((property) => (
                  <button
                    key={property.id}
                    type="button"
                    onClick={() => setSelectedProperty(property)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
                      selectedProperty?.id === property.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="h-16 w-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      <Building2 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{property.title}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {property.address}
                      </p>
                    </div>
                    {selectedProperty?.id === property.id && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {errors.property && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.property}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Date & Time Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Date & Time
              </CardTitle>
              <CardDescription>Select when the visit should take place</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-3">
                <Label>Visit Date</Label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {availableDates.slice(0, 7).map((date) => (
                    <button
                      key={date.value}
                      type="button"
                      onClick={() => setVisitDate(date.value)}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all",
                        visitDate === date.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <span className="text-xs font-medium">{date.dayOfWeek}</span>
                      <span className="text-lg font-bold">{date.dayNumber}</span>
                      <span className="text-xs">{date.month}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Or select specific date:</span>
                  <Input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-auto"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                {errors.date && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.date}
                  </p>
                )}
              </div>

              <Separator />

              {/* Time Selection */}
              <div className="space-y-3">
                <Label>Visit Time</Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setVisitTime(time)}
                      className={cn(
                        "py-2 px-3 rounded-lg border-2 text-sm font-medium transition-all",
                        visitTime === time
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                {errors.time && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.time}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Agent Assignment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                Assign Agent
              </CardTitle>
              <CardDescription>Select the agent who will conduct the visit</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {mockAgents.map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => setSelectedAgent(agent)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all",
                      selectedAgent?.id === agent.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={agent.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{agent.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p className="font-medium text-foreground">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.role}</p>
                    </div>
                    {selectedAgent?.id === agent.id && (
                      <Badge variant="default" className="text-xs">
                        Selected
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
              {errors.agent && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.agent}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Status & Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Status & Notes
              </CardTitle>
              <CardDescription>Set the visit status and add any internal notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Visit Status</Label>
                <div className="flex gap-3">
                  {(["pending", "confirmed", "canceled"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={cn(
                        "flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium capitalize",
                        status === s
                          ? s === "confirmed"
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                            : s === "canceled"
                              ? "border-destructive bg-destructive/10 text-destructive"
                              : "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes for the agent or internal reference..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[120px]"
                />
                <p className="text-xs text-muted-foreground">
                  These notes are for internal use only and won't be shared with the client
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Visit Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Visit Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Client</span>
                  {selectedClient ? (
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedClient.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {selectedClient.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{selectedClient.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedClient.email}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">Not selected</p>
                  )}
                </div>

                <Separator />

                <div>
                  <span className="text-sm text-muted-foreground">Property</span>
                  {selectedProperty ? (
                    <div className="mt-1">
                      <p className="text-sm font-medium text-foreground">{selectedProperty.title}</p>
                      <p className="text-xs text-muted-foreground">{selectedProperty.address}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">Not selected</p>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Date</span>
                  <span className="text-sm font-medium text-foreground">
                    {visitDate
                      ? new Date(visitDate).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })
                      : "Not selected"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Time</span>
                  <span className="text-sm font-medium text-foreground">
                    {visitTime || "Not selected"}
                  </span>
                </div>

                <Separator />

                <div>
                  <span className="text-sm text-muted-foreground">Assigned Agent</span>
                  {selectedAgent ? (
                    <div className="mt-1 flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedAgent.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {selectedAgent.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-foreground">{selectedAgent.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedAgent.role}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">Not assigned</p>
                  )}
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  {getStatusBadge(status)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notification Preview
              </CardTitle>
              <CardDescription>Preview the notification sent to client</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedClient && selectedProperty && visitDate && visitTime ? (
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Email Notification</span>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-foreground mb-2">
                      Visit Scheduled - {selectedProperty.title}
                    </p>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      Dear {selectedClient.name},<br /><br />
                      Your property visit has been scheduled:<br />
                      <strong>Property:</strong> {selectedProperty.title}<br />
                      <strong>Address:</strong> {selectedProperty.address}<br />
                      <strong>Date:</strong> {new Date(visitDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}<br />
                      <strong>Time:</strong> {visitTime}<br />
                      {selectedAgent && (
                        <>
                          <strong>Agent:</strong> {selectedAgent.name}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Complete the form to preview notification</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full" onClick={handleSubmit}>
              <Check className="mr-2 h-4 w-4" />
              Confirm & Send Notification
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button variant="ghost" className="w-full" asChild>
              <Link href="/dashboard/visits">Cancel</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
