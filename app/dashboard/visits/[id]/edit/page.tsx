"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const initialData = {
  id: "1",
  status: "confirmed",
  property: "Modern Downtown Apartment",
  propertyAddress: "123 Main St, New York, NY 10001",
  clientName: "John Smith",
  clientEmail: "john.smith@email.com",
  clientPhone: "+1 (555) 123-4567",
  agent: "Sarah Wilson",
  date: "2026-02-04",
  time: "10:00",
  duration: "30",
  notes: "First viewing, interested in 2BR units. Client mentioned budget flexibility up to $750K. Please prepare comparables for the area.",
  feedback: "Client was very interested in the property. Liked the open floor plan and natural light. Concerned about parking availability. Will follow up within 48 hours.",
}

export default function VisitEditPage() {
  const [formData, setFormData] = useState(initialData)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/visits/${formData.id}`}><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Visit</h1>
            <p className="text-muted-foreground">{formData.property}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" />Cancel Visit</Button>
          <Button size="sm"><Save className="mr-2 h-4 w-4" />Save Changes</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduling</CardTitle>
            <CardDescription>Date, time and duration of the visit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </div>
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label>Time</Label>
                <Input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Duration (min)</Label>
                <Select value={formData.duration} onValueChange={(v) => setFormData({ ...formData, duration: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="90">1.5 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Assigned Agent</Label>
              <Select value={formData.agent} onValueChange={(v) => setFormData({ ...formData, agent: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                  <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                  <SelectItem value="Emily Rodriguez">Emily Rodriguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Property */}
        <Card>
          <CardHeader>
            <CardTitle>Property</CardTitle>
            <CardDescription>Property to visit</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Property Name</Label>
              <Input value={formData.property} onChange={(e) => setFormData({ ...formData, property: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        {/* Client */}
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={formData.clientEmail} onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={formData.clientPhone} onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Notes & Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Pre-Visit Notes</Label>
              <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Post-Visit Feedback</Label>
              <Textarea value={formData.feedback} onChange={(e) => setFormData({ ...formData, feedback: e.target.value })} rows={4} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
