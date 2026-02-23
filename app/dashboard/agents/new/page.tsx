"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  Shield,
  User,
  Mail,
  Check,
  X,
  Info,
  AlertTriangle,
  Building2,
  Users,
  FileText,
  Receipt,
  Calendar,
  MessageSquare,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Role = "admin" | "agent" | "accountant"

interface Permission {
  id: string
  name: string
  description: string
  category: string
  icon: React.ReactNode
}

const roles: { id: Role; name: string; description: string; color: string }[] = [
  {
    id: "admin",
    name: "Administrator",
    description: "Full access to all features and settings",
    color: "bg-red-100 text-red-700 border-red-200",
  },
  {
    id: "agent",
    name: "Agent",
    description: "Manage properties, clients, and visits",
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    id: "accountant",
    name: "Accountant",
    description: "Access to financial data and invoices",
    color: "bg-green-100 text-green-700 border-green-200",
  },
]

const permissionCategories = [
  { id: "properties", name: "Properties", icon: <Building2 className="h-4 w-4" /> },
  { id: "clients", name: "Clients", icon: <Users className="h-4 w-4" /> },
  { id: "contracts", name: "Contracts", icon: <FileText className="h-4 w-4" /> },
  { id: "finances", name: "Finances", icon: <Receipt className="h-4 w-4" /> },
  { id: "visits", name: "Visits", icon: <Calendar className="h-4 w-4" /> },
  { id: "messages", name: "Messages", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "settings", name: "Settings", icon: <Settings className="h-4 w-4" /> },
]

const permissions: Permission[] = [
  // Properties
  { id: "properties_view", name: "View Properties", description: "Can view property listings", category: "properties", icon: <Eye className="h-4 w-4" /> },
  { id: "properties_create", name: "Create Properties", description: "Can add new properties", category: "properties", icon: <Plus className="h-4 w-4" /> },
  { id: "properties_edit", name: "Edit Properties", description: "Can modify property details", category: "properties", icon: <Edit className="h-4 w-4" /> },
  { id: "properties_delete", name: "Delete Properties", description: "Can remove properties", category: "properties", icon: <Trash2 className="h-4 w-4" /> },
  // Clients
  { id: "clients_view", name: "View Clients", description: "Can view client profiles", category: "clients", icon: <Eye className="h-4 w-4" /> },
  { id: "clients_create", name: "Create Clients", description: "Can add new clients", category: "clients", icon: <Plus className="h-4 w-4" /> },
  { id: "clients_edit", name: "Edit Clients", description: "Can modify client details", category: "clients", icon: <Edit className="h-4 w-4" /> },
  { id: "clients_delete", name: "Delete Clients", description: "Can remove clients", category: "clients", icon: <Trash2 className="h-4 w-4" /> },
  // Contracts
  { id: "contracts_view", name: "View Contracts", description: "Can view contracts", category: "contracts", icon: <Eye className="h-4 w-4" /> },
  { id: "contracts_create", name: "Create Contracts", description: "Can create new contracts", category: "contracts", icon: <Plus className="h-4 w-4" /> },
  { id: "contracts_edit", name: "Edit Contracts", description: "Can modify contracts", category: "contracts", icon: <Edit className="h-4 w-4" /> },
  { id: "contracts_delete", name: "Delete Contracts", description: "Can void contracts", category: "contracts", icon: <Trash2 className="h-4 w-4" /> },
  // Finances
  { id: "finances_view", name: "View Finances", description: "Can view financial data", category: "finances", icon: <Eye className="h-4 w-4" /> },
  { id: "finances_manage", name: "Manage Invoices", description: "Can create/edit invoices", category: "finances", icon: <Edit className="h-4 w-4" /> },
  { id: "finances_expenses", name: "Record Expenses", description: "Can add expense records", category: "finances", icon: <Plus className="h-4 w-4" /> },
  { id: "finances_reports", name: "Financial Reports", description: "Can generate reports", category: "finances", icon: <FileText className="h-4 w-4" /> },
  // Visits
  { id: "visits_view", name: "View Visits", description: "Can view scheduled visits", category: "visits", icon: <Eye className="h-4 w-4" /> },
  { id: "visits_schedule", name: "Schedule Visits", description: "Can schedule new visits", category: "visits", icon: <Plus className="h-4 w-4" /> },
  { id: "visits_manage", name: "Manage Visits", description: "Can modify/cancel visits", category: "visits", icon: <Edit className="h-4 w-4" /> },
  // Messages
  { id: "messages_view", name: "View Messages", description: "Can view messages", category: "messages", icon: <Eye className="h-4 w-4" /> },
  { id: "messages_send", name: "Send Messages", description: "Can send messages", category: "messages", icon: <Plus className="h-4 w-4" /> },
  // Settings
  { id: "settings_agency", name: "Agency Settings", description: "Can modify agency settings", category: "settings", icon: <Settings className="h-4 w-4" /> },
  { id: "settings_team", name: "Team Management", description: "Can manage team members", category: "settings", icon: <Users className="h-4 w-4" /> },
]

const rolePermissions: Record<Role, string[]> = {
  admin: permissions.map((p) => p.id),
  agent: [
    "properties_view", "properties_create", "properties_edit",
    "clients_view", "clients_create", "clients_edit",
    "contracts_view", "contracts_create",
    "visits_view", "visits_schedule", "visits_manage",
    "messages_view", "messages_send",
  ],
  accountant: [
    "properties_view",
    "clients_view",
    "contracts_view",
    "finances_view", "finances_manage", "finances_expenses", "finances_reports",
    "messages_view", "messages_send",
  ],
}

const existingAgents = [
  { id: 1, name: "John Smith", email: "john@sasimo.com", role: "admin" as Role, avatar: "/images/agency-1.jpg" },
  { id: 2, name: "Sarah Johnson", email: "sarah@sasimo.com", role: "agent" as Role, avatar: "/images/agency-2.jpg" },
  { id: 3, name: "Mike Williams", email: "mike@sasimo.com", role: "accountant" as Role, avatar: "/images/agency-3.jpg" },
]

export default function AgentPermissionsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "" as Role | "",
  })
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [customPermissions, setCustomPermissions] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRoleChange = (role: Role) => {
    setFormData({ ...formData, role })
    if (!customPermissions) {
      setSelectedPermissions(rolePermissions[role] || [])
    }
  }

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleCategoryToggle = (categoryId: string) => {
    const categoryPermissions = permissions
      .filter((p) => p.category === categoryId)
      .map((p) => p.id)
    
    const allSelected = categoryPermissions.every((p) => selectedPermissions.includes(p))
    
    if (allSelected) {
      setSelectedPermissions((prev) => prev.filter((p) => !categoryPermissions.includes(p)))
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...categoryPermissions])])
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (!formData.role) newErrors.role = "Please select a role"
    if (selectedPermissions.length === 0) {
      newErrors.permissions = "At least one permission is required"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
  }

  const selectedRole = roles.find((r) => r.id === formData.role)

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/agents">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Add Team Member</h1>
              <p className="text-sm text-muted-foreground">Invite a new agent and set permissions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-primary" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>Enter the agent's contact details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="agent@sasimo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Role Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Role Assignment
                  </CardTitle>
                  <CardDescription>Select a role to define base permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => handleRoleChange(role.id)}
                        className={`relative rounded-lg border-2 p-4 text-left transition-all ${
                          formData.role === role.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {formData.role === role.id && (
                          <div className="absolute right-2 top-2">
                            <Check className="h-5 w-5 text-primary" />
                          </div>
                        )}
                        <Badge className={`mb-2 ${role.color}`}>{role.name}</Badge>
                        <p className="text-xs text-muted-foreground">{role.description}</p>
                      </button>
                    ))}
                  </div>
                  {errors.role && (
                    <p className="text-sm text-destructive">{errors.role}</p>
                  )}
                </CardContent>
              </Card>

              {/* Permissions Matrix */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5 text-primary" />
                        Permissions
                      </CardTitle>
                      <CardDescription>
                        {customPermissions
                          ? "Customize individual permissions"
                          : "Permissions based on selected role"}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="custom" className="text-sm">Custom</Label>
                      <Switch
                        id="custom"
                        checked={customPermissions}
                        onCheckedChange={setCustomPermissions}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!formData.role && !customPermissions ? (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Select a Role</AlertTitle>
                      <AlertDescription>
                        Please select a role above to see the default permissions, or enable custom permissions.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="space-y-6">
                      {permissionCategories.map((category) => {
                        const categoryPerms = permissions.filter((p) => p.category === category.id)
                        const selectedCount = categoryPerms.filter((p) =>
                          selectedPermissions.includes(p.id)
                        ).length
                        const allSelected = selectedCount === categoryPerms.length

                        return (
                          <div key={category.id} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {category.icon}
                                <span className="font-medium">{category.name}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {selectedCount}/{categoryPerms.length}
                                </Badge>
                              </div>
                              {customPermissions && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCategoryToggle(category.id)}
                                >
                                  {allSelected ? "Deselect All" : "Select All"}
                                </Button>
                              )}
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                              {categoryPerms.map((permission) => (
                                <TooltipProvider key={permission.id}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <label
                                        className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                                          selectedPermissions.includes(permission.id)
                                            ? "border-primary/50 bg-primary/5"
                                            : "border-border hover:bg-muted/50"
                                        } ${!customPermissions ? "pointer-events-none opacity-75" : ""}`}
                                      >
                                        <Checkbox
                                          checked={selectedPermissions.includes(permission.id)}
                                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                                          disabled={!customPermissions}
                                        />
                                        <div className="flex items-center gap-2">
                                          {permission.icon}
                                          <span className="text-sm">{permission.name}</span>
                                        </div>
                                      </label>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{permission.description}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {errors.permissions && (
                    <p className="mt-4 text-sm text-destructive">{errors.permissions}</p>
                  )}
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="outline" className="bg-transparent" asChild>
                  <Link href="/dashboard/agents">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending Invite..." : "Send Invitation"}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            {(formData.name || formData.email || formData.role) && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {formData.name
                          ? formData.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {formData.name || "Agent Name"}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {formData.email || "email@sasimo.com"}
                      </p>
                    </div>
                  </div>
                  {selectedRole && (
                    <Badge className={`mt-3 ${selectedRole.color}`}>
                      {selectedRole.name}
                    </Badge>
                  )}
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Permissions Summary
                    </p>
                    <p className="text-sm">
                      <span className="font-semibold">{selectedPermissions.length}</span> permissions enabled
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Notice */}
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Security Notice</AlertTitle>
              <AlertDescription className="text-xs">
                The invited user will receive an email to set up their password. Admin permissions grant full system access.
              </AlertDescription>
            </Alert>

            {/* Current Team */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Current Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {existingAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                        <AvatarFallback>
                          {agent.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{agent.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{agent.email}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={roles.find((r) => r.id === agent.role)?.color}
                      >
                        {roles.find((r) => r.id === agent.role)?.name}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
