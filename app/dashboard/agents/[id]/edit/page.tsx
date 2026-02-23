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
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

const initialData = {
  id: "1",
  firstName: "Sarah",
  lastName: "Wilson",
  email: "sarah.wilson@sasimo.com",
  phone: "+1 (555) 100-1001",
  role: "admin",
  status: "active",
  bio: "Senior real estate agent with 8+ years of experience specializing in luxury residential and commercial properties.",
  specialization: "Luxury Residential",
  licenseNumber: "RE-2023-45678",
  commissionRate: "3",
  permissions: {
    properties: true,
    clients: true,
    contracts: true,
    invoices: true,
    settings: true,
    team: true,
  },
}

export default function AgentEditPage() {
  const [formData, setFormData] = useState(initialData)
  const [permissions, setPermissions] = useState(initialData.permissions)

  const togglePermission = (key: string) => {
    setPermissions({ ...permissions, [key]: !permissions[key as keyof typeof permissions] })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/agents/${formData.id}`}><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Agent Profile</h1>
            <p className="text-muted-foreground">{formData.firstName} {formData.lastName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" />Remove Agent</Button>
          <Button size="sm"><Save className="mr-2 h-4 w-4" />Save Changes</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={4} />
            </div>
          </CardContent>
        </Card>

        {/* Role & License */}
        <Card>
          <CardHeader>
            <CardTitle>Role & Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="junior">Junior Agent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Input value={formData.specialization} onChange={(e) => setFormData({ ...formData, specialization: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>License Number</Label>
              <Input value={formData.licenseNumber} onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Commission Rate (%)</Label>
              <Input type="number" value={formData.commissionRate} onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>Control what this agent can access and modify</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(permissions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <Label htmlFor={`perm-${key}`} className="capitalize cursor-pointer">{key}</Label>
                  <Switch id={`perm-${key}`} checked={value} onCheckedChange={() => togglePermission(key)} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
