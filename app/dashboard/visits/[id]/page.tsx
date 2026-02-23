"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Pencil,
  Calendar,
  Clock,
  MapPin,
  User,
  Building2,
  Phone,
  Mail,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Navigation,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const visit = {
  id: "1",
  status: "confirmed",
  property: {
    title: "Modern Downtown Apartment",
    address: "123 Main St, New York, NY 10001",
    type: "Apartment",
    rooms: 3,
    surface: "120 m\u00B2",
    price: "$725,000",
  },
  client: {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1 (555) 123-4567",
  },
  agent: {
    name: "Sarah Wilson",
    email: "sarah.wilson@sasimo.com",
    phone: "+1 (555) 100-1001",
  },
  date: "2026-02-04",
  time: "10:00 AM",
  endTime: "10:30 AM",
  duration: "30 min",
  notes: "First viewing, interested in 2BR units. Client mentioned budget flexibility up to $750K. Please prepare comparables for the area.",
  feedback: "Client was very interested in the property. Liked the open floor plan and natural light. Concerned about parking availability. Will follow up within 48 hours.",
  checklist: [
    { item: "Confirm appointment with client", done: true },
    { item: "Prepare property documentation", done: true },
    { item: "Check property access keys", done: true },
    { item: "Print comparable market analysis", done: true },
    { item: "Follow up after visit", done: false },
  ],
  history: [
    { date: "2026-02-04 10:30 AM", action: "Visit completed" },
    { date: "2026-02-04 10:00 AM", action: "Visit started" },
    { date: "2026-02-03 09:00 AM", action: "Reminder sent to client" },
    { date: "2026-02-01 02:15 PM", action: "Visit confirmed by client" },
    { date: "2026-02-01 11:00 AM", action: "Visit scheduled by Sarah Wilson" },
  ],
}

export default function VisitViewPage() {
  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      confirmed: { variant: "default", label: "Confirmed" },
      pending: { variant: "secondary", label: "Pending" },
      completed: { variant: "outline", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
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
            <Link href="/dashboard/visits"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">Visit Details</h1>
              {getStatusBadge(visit.status)}
            </div>
            <p className="text-muted-foreground mt-1">{visit.property.title}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-transparent"><MessageSquare className="mr-2 h-4 w-4" />Send Reminder</Button>
          <Button size="sm" asChild>
            <Link href={`/dashboard/visits/${visit.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit Visit</Link>
          </Button>
        </div>
      </div>

      {/* Date/Time Banner */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center">
                <span className="text-xs font-medium text-primary">{new Date(visit.date).toLocaleDateString("en-US", { month: "short" })}</span>
                <span className="text-2xl font-bold text-primary">{new Date(visit.date).getDate()}</span>
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">{new Date(visit.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
                <div className="flex items-center gap-4 mt-1 text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{visit.time} - {visit.endTime}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{visit.duration}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Property */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Building2 className="h-5 w-5" />Property</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Property</span><span className="font-medium text-foreground">{visit.property.title}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Address</span><span className="font-medium text-foreground">{visit.property.address}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium text-foreground">{visit.property.type}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Rooms / Surface</span><span className="font-medium text-foreground">{visit.property.rooms} rooms - {visit.property.surface}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="text-muted-foreground">Price</span><span className="font-bold text-foreground">{visit.property.price}</span></div>
              <div className="pt-2">
                <Button variant="outline" size="sm" className="bg-transparent"><Navigation className="mr-2 h-4 w-4" />Get Directions</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Pre-Visit Notes</CardTitle></CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{visit.notes}</p>
            </CardContent>
          </Card>

          {/* Feedback */}
          {visit.feedback && (
            <Card>
              <CardHeader><CardTitle className="text-lg">Post-Visit Feedback</CardTitle></CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{visit.feedback}</p>
              </CardContent>
            </Card>
          )}

          {/* History */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Activity Timeline</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-0">
                {visit.history.map((event, index) => (
                  <div key={index} className="flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full ${index === 0 ? "bg-primary" : "bg-border"}`} />
                      {index < visit.history.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-sm font-medium text-foreground">{event.action}</p>
                      <span className="text-xs text-muted-foreground">{event.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5" />Client</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12"><AvatarFallback>JS</AvatarFallback></Avatar>
                <p className="font-semibold text-foreground">{visit.client.name}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" />{visit.client.email}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" />{visit.client.phone}</div>
              </div>
            </CardContent>
          </Card>

          {/* Agent */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Assigned Agent</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10"><AvatarFallback>SW</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold text-foreground">{visit.agent.name}</p>
                  <p className="text-sm text-muted-foreground">{visit.agent.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Checklist</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {visit.checklist.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                  <span className={`text-sm ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}>{item.item}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm" asChild><Link href={`/dashboard/visits/${visit.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit Visit</Link></Button>
              <Button variant="outline" className="w-full bg-transparent" size="sm"><MessageSquare className="mr-2 h-4 w-4" />Send Reminder</Button>
              <Button variant="outline" className="w-full bg-transparent" size="sm"><CheckCircle className="mr-2 h-4 w-4" />Mark Complete</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
