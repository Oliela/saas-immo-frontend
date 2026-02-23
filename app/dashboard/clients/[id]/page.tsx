"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { use } from "react"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  FileText,
  Check,
  X,
  AlertCircle,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Upload,
  Save,
  Trash2,
  MessageSquare,
  Calendar,
  Building2,
  Shield,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

interface Document {
  id: string
  name: string
  type: string
  uploadedAt: string
  status: "pending" | "approved" | "rejected"
  size: string
}

const mockClient = {
  id: "1",
  firstName: "Emily",
  lastName: "Thompson",
  email: "emily.thompson@example.com",
  phone: "+1 555-0101",
  status: "pending" as const,
  notes: "Looking for a 2-bedroom apartment in downtown area. Budget: $2,000-$2,500/month.",
  createdAt: "2024-01-15",
  avatar: "/images/property-1.jpg",
}

const mockDocuments: Document[] = [
  { id: "1", name: "ID Card.pdf", type: "Identity", uploadedAt: "2024-01-15", status: "approved", size: "1.2 MB" },
  { id: "2", name: "Proof of Income.pdf", type: "Income", uploadedAt: "2024-01-16", status: "approved", size: "2.5 MB" },
  { id: "3", name: "Bank Statement.pdf", type: "Financial", uploadedAt: "2024-01-17", status: "pending", size: "890 KB" },
  { id: "4", name: "Employment Letter.pdf", type: "Employment", uploadedAt: "2024-01-18", status: "rejected", size: "450 KB" },
]

const requiredFields = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "idDocument", label: "ID Document" },
  { key: "incomeProof", label: "Proof of Income" },
]

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [formData, setFormData] = useState({
    firstName: mockClient.firstName,
    lastName: mockClient.lastName,
    email: mockClient.email,
    phone: mockClient.phone,
    status: mockClient.status,
    notes: mockClient.notes,
  })
  const [documents, setDocuments] = useState<Document[]>(mockDocuments)
  const [activeTab, setActiveTab] = useState("profile")
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)

  // Calculate profile completeness
  const completedFields = [
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.phone,
    documents.some((d) => d.type === "Identity" && d.status === "approved"),
    documents.some((d) => d.type === "Income" && d.status === "approved"),
  ].filter(Boolean).length

  const profileCompleteness = Math.round((completedFields / requiredFields.length) * 100)

  const getStatusBadge = (status: "pending" | "approved" | "rejected") => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
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

  const handleApproveDocument = (docId: string) => {
    setDocuments(documents.map((d) => (d.id === docId ? { ...d, status: "approved" as const } : d)))
  }

  const handleRejectDocument = (docId: string) => {
    setDocuments(documents.map((d) => (d.id === docId ? { ...d, status: "rejected" as const } : d)))
  }

  const handleApproveProfile = () => {
    setFormData({ ...formData, status: "approved" })
  }

  const handleRejectProfile = () => {
    setFormData({ ...formData, status: "rejected" })
    setShowRejectDialog(false)
    setRejectReason("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={mockClient.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {formData.firstName[0]}
                {formData.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {formData.firstName} {formData.lastName}
              </h1>
              <p className="text-muted-foreground">{formData.email}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          {formData.status === "pending" && (
            <>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10 bg-transparent">
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reject Client Profile</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to reject this client's profile? This action can be undone later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="py-4">
                    <Label htmlFor="rejectReason">Reason for Rejection</Label>
                    <Textarea
                      id="rejectReason"
                      placeholder="Please provide a reason..."
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRejectProfile}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Reject Profile
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button onClick={handleApproveProfile}>
                <Check className="mr-2 h-4 w-4" />
                Approve
              </Button>
            </>
          )}
          {formData.status !== "pending" && getStatusBadge(formData.status)}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Forms */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Client's personal details and contact information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        First Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Last Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Client Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: "pending" | "approved" | "rejected") =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending Review</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any notes about this client..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="min-h-[120px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      Internal notes about client preferences, requirements, or history
                    </p>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Cancel</Button>
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Uploaded Documents</CardTitle>
                    <CardDescription>Review and validate client documents</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Request Document
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-border"
                    >
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{doc.type}</span>
                          <span>-</span>
                          <span>{doc.size}</span>
                          <span>-</span>
                          <span>Uploaded {doc.uploadedAt}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(doc.status)}
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                        {doc.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApproveDocument(doc.id)}
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRejectDocument(doc.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}

                  {documents.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-muted-foreground">No documents uploaded yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Client's interaction history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { icon: Calendar, text: "Scheduled visit for Modern Downtown Apartment", time: "2 hours ago", color: "text-blue-600" },
                      { icon: FileText, text: "Uploaded Bank Statement.pdf", time: "1 day ago", color: "text-primary" },
                      { icon: Building2, text: "Showed interest in Luxury Penthouse Suite", time: "2 days ago", color: "text-primary" },
                      { icon: MessageSquare, text: "Sent message to agent", time: "3 days ago", color: "text-emerald-600" },
                      { icon: User, text: "Profile created", time: "5 days ago", color: "text-muted-foreground" },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={cn("p-2 rounded-full bg-muted", activity.color)}>
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{activity.text}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Profile Completeness */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Profile Completeness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold text-foreground">{profileCompleteness}%</span>
                <Badge
                  variant={profileCompleteness === 100 ? "default" : "secondary"}
                  className={profileCompleteness === 100 ? "bg-emerald-500" : ""}
                >
                  {profileCompleteness === 100 ? "Complete" : "Incomplete"}
                </Badge>
              </div>
              <Progress value={profileCompleteness} className="h-2" />

              <Separator />

              <div className="space-y-3">
                {requiredFields.map((field, index) => {
                  let isComplete = false
                  if (field.key === "idDocument") {
                    isComplete = documents.some((d) => d.type === "Identity" && d.status === "approved")
                  } else if (field.key === "incomeProof") {
                    isComplete = documents.some((d) => d.type === "Income" && d.status === "approved")
                  } else {
                    isComplete = Boolean((formData as Record<string, string>)[field.key])
                  }

                  return (
                    <div key={field.key} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-5 w-5 rounded-full flex items-center justify-center",
                          isComplete ? "bg-emerald-500" : "bg-muted"
                        )}
                      >
                        {isComplete ? (
                          <Check className="h-3 w-3 text-white" />
                        ) : (
                          <span className="text-xs text-muted-foreground">{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-sm",
                          isComplete ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {field.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Validation Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Validation Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={cn(
                  "p-4 rounded-lg",
                  formData.status === "approved" && "bg-emerald-500/10",
                  formData.status === "rejected" && "bg-destructive/10",
                  formData.status === "pending" && "bg-muted"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  {formData.status === "approved" && (
                    <Shield className="h-6 w-6 text-emerald-600" />
                  )}
                  {formData.status === "rejected" && (
                    <XCircle className="h-6 w-6 text-destructive" />
                  )}
                  {formData.status === "pending" && (
                    <Clock className="h-6 w-6 text-muted-foreground" />
                  )}
                  <div>
                    <p className="font-semibold text-foreground capitalize">{formData.status}</p>
                    <p className="text-xs text-muted-foreground">
                      {formData.status === "approved" && "Profile verified and approved"}
                      {formData.status === "rejected" && "Profile needs attention"}
                      {formData.status === "pending" && "Awaiting review"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Document Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Documents</span>
                <span className="font-medium text-foreground">{documents.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-emerald-600" />
                  Approved
                </span>
                <span className="font-medium text-foreground">
                  {documents.filter((d) => d.status === "approved").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3 text-amber-600" />
                  Pending
                </span>
                <span className="font-medium text-foreground">
                  {documents.filter((d) => d.status === "pending").length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <XCircle className="h-3 w-3 text-destructive" />
                  Rejected
                </span>
                <span className="font-medium text-foreground">
                  {documents.filter((d) => d.status === "rejected").length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Visit
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <FileText className="mr-2 h-4 w-4" />
                Create Contract
              </Button>
              <Separator className="my-2" />
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive bg-transparent">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Client
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
