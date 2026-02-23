"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  FileText,
  User,
  Building2,
  DollarSign,
  Eye,
  Send,
  Save,
  ChevronUp,
  ChevronDown,
  Pencil,
  Copy,
  AlertCircle,
  Check,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface Clause {
  id: string
  title: string
  content: string
  isCustom: boolean
}

const defaultClauses: Clause[] = [
  {
    id: "1",
    title: "Payment Terms",
    content: "The tenant agrees to pay the monthly rent of [AMOUNT] on or before the [DAY] of each month. Late payments will incur a fee of [LATE_FEE].",
    isCustom: false,
  },
  {
    id: "2",
    title: "Security Deposit",
    content: "A security deposit of [DEPOSIT_AMOUNT] is required upon signing this agreement. This deposit will be returned within 30 days of lease termination, minus any deductions for damages.",
    isCustom: false,
  },
  {
    id: "3",
    title: "Maintenance Responsibilities",
    content: "The tenant is responsible for minor maintenance and repairs under $100. Major repairs and structural issues are the responsibility of the landlord.",
    isCustom: false,
  },
  {
    id: "4",
    title: "Property Use",
    content: "The property shall be used exclusively for residential purposes. No commercial activities are permitted without written consent from the landlord.",
    isCustom: false,
  },
]

const mockClients = [
  { id: "1", name: "Emily Thompson", email: "emily@example.com", phone: "+1 555-0101", status: "approved" },
  { id: "2", name: "David Wilson", email: "david@example.com", phone: "+1 555-0202", status: "approved" },
  { id: "3", name: "Lisa Anderson", email: "lisa@example.com", phone: "+1 555-0303", status: "pending" },
]

const mockProperties = [
  { id: "1", title: "Modern Downtown Apartment", address: "123 Main St, New York", price: 2500, type: "rent" },
  { id: "2", title: "Spacious Family Home", address: "456 Oak Ave, Los Angeles", price: 450000, type: "sale" },
  { id: "3", title: "Luxury Penthouse Suite", address: "789 Park Blvd, Miami", price: 5000, type: "rent" },
]

export default function NewContractPage() {
  const [activeTab, setActiveTab] = useState("info")
  const [contractType, setContractType] = useState<"rental" | "sale">("rental")
  const [selectedClient, setSelectedClient] = useState<typeof mockClients[0] | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<typeof mockProperties[0] | null>(null)
  const [clauses, setClauses] = useState<Clause[]>(defaultClauses)
  const [editingClause, setEditingClause] = useState<Clause | null>(null)
  const [showClauseDialog, setShowClauseDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [newClause, setNewClause] = useState({ title: "", content: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    city: "",
    startDate: "",
    duration: "12",
    rentAmount: "",
    deposit: "",
    commission: "",
    paymentFrequency: "monthly",
  })

  const moveClause = (index: number, direction: "up" | "down") => {
    const newClauses = [...clauses]
    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex >= 0 && newIndex < clauses.length) {
      [newClauses[index], newClauses[newIndex]] = [newClauses[newIndex], newClauses[index]]
      setClauses(newClauses)
    }
  }

  const addClause = () => {
    if (newClause.title && newClause.content) {
      setClauses([
        ...clauses,
        {
          id: Date.now().toString(),
          title: newClause.title,
          content: newClause.content,
          isCustom: true,
        },
      ])
      setNewClause({ title: "", content: "" })
      setShowClauseDialog(false)
    }
  }

  const updateClause = () => {
    if (editingClause) {
      setClauses(clauses.map((c) => (c.id === editingClause.id ? editingClause : c)))
      setEditingClause(null)
    }
  }

  const removeClause = (id: string) => {
    setClauses(clauses.filter((c) => c.id !== id))
  }

  const duplicateClause = (clause: Clause) => {
    const newClauseItem: Clause = {
      id: Date.now().toString(),
      title: `${clause.title} (Copy)`,
      content: clause.content,
      isCustom: true,
    }
    const index = clauses.findIndex((c) => c.id === clause.id)
    const newClauses = [...clauses]
    newClauses.splice(index + 1, 0, newClauseItem)
    setClauses(newClauses)
  }

  const filteredProperties = mockProperties.filter(
    (p) => p.type === (contractType === "rental" ? "rent" : "sale")
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/contracts">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Create Contract</h1>
            <p className="text-muted-foreground">Generate a new contract document</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Sheet open={showPreview} onOpenChange={setShowPreview}>
            <SheetTrigger asChild>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Contract Preview</SheetTitle>
                <SheetDescription>
                  Review the contract before generating
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="p-6 border border-border rounded-lg bg-card">
                  <div className="text-center mb-8">
                    <h2 className="text-xl font-bold text-foreground">
                      {contractType === "rental" ? "RENTAL AGREEMENT" : "SALE CONTRACT"}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Contract #{Date.now().toString().slice(-6)}
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">1. PARTIES</h3>
                      <p className="text-sm text-muted-foreground">
                        This agreement is entered into between{" "}
                        <span className="font-medium text-foreground">
                          {selectedClient?.name || "[Client Name]"}
                        </span>{" "}
                        (hereinafter "Client") and SAS IMO Real Estate Agency (hereinafter "Agency").
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">2. PROPERTY</h3>
                      <p className="text-sm text-muted-foreground">
                        The property subject to this agreement is located at{" "}
                        <span className="font-medium text-foreground">
                          {selectedProperty?.address || "[Property Address]"}
                        </span>
                        , referred to as{" "}
                        <span className="font-medium text-foreground">
                          {selectedProperty?.title || "[Property Title]"}
                        </span>
                        .
                      </p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-foreground mb-2">3. TERMS</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>
                          Start Date:{" "}
                          <span className="font-medium text-foreground">
                            {formData.startDate || "[Start Date]"}
                          </span>
                        </p>
                        {contractType === "rental" && (
                          <p>
                            Duration:{" "}
                            <span className="font-medium text-foreground">
                              {formData.duration} months
                            </span>
                          </p>
                        )}
                        <p>
                          {contractType === "rental" ? "Monthly Rent" : "Sale Price"}:{" "}
                          <span className="font-medium text-foreground">
                            ${formData.rentAmount || "[Amount]"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {clauses.map((clause, index) => (
                      <div key={clause.id}>
                        <h3 className="font-semibold text-foreground mb-2">
                          {index + 4}. {clause.title.toUpperCase()}
                        </h3>
                        <p className="text-sm text-muted-foreground">{clause.content}</p>
                      </div>
                    ))}

                    <div className="pt-8 border-t border-border">
                      <div className="grid grid-cols-2 gap-8">
                        <div>
                          <p className="text-sm font-medium text-foreground mb-4">Client Signature</p>
                          <div className="h-16 border-b border-foreground" />
                          <p className="text-xs text-muted-foreground mt-2">
                            {selectedClient?.name || "Client Name"}
                          </p>
                          <p className="text-xs text-muted-foreground">Date: ___________</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground mb-4">Agency Representative</p>
                          <div className="h-16 border-b border-foreground" />
                          <p className="text-xs text-muted-foreground mt-2">SAS IMO Agency</p>
                          <p className="text-xs text-muted-foreground">Date: ___________</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Info</span>
              </TabsTrigger>
              <TabsTrigger value="parties" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Parties</span>
              </TabsTrigger>
              <TabsTrigger value="clauses" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Clauses</span>
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Financial</span>
              </TabsTrigger>
            </TabsList>

            {/* Contract Information Tab */}
            <TabsContent value="info" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Information</CardTitle>
                  <CardDescription>Basic contract details and type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Contract Type</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setContractType("rental")
                          setSelectedProperty(null)
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all",
                          contractType === "rental"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div
                          className={cn(
                            "p-3 rounded-full",
                            contractType === "rental" ? "bg-primary/10" : "bg-muted"
                          )}
                        >
                          <Calendar
                            className={cn(
                              "h-6 w-6",
                              contractType === "rental" ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                        </div>
                        <div className="text-center">
                          <p
                            className={cn(
                              "font-semibold",
                              contractType === "rental" ? "text-primary" : "text-foreground"
                            )}
                          >
                            Rental Contract
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            For property rentals
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setContractType("sale")
                          setSelectedProperty(null)
                        }}
                        className={cn(
                          "flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all",
                          contractType === "sale"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div
                          className={cn(
                            "p-3 rounded-full",
                            contractType === "sale" ? "bg-primary/10" : "bg-muted"
                          )}
                        >
                          <Building2
                            className={cn(
                              "h-6 w-6",
                              contractType === "sale" ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                        </div>
                        <div className="text-center">
                          <p
                            className={cn(
                              "font-semibold",
                              contractType === "sale" ? "text-primary" : "text-foreground"
                            )}
                          >
                            Sale Contract
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            For property sales
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) => setFormData({ ...formData, city: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new-york">New York</SelectItem>
                          <SelectItem value="los-angeles">Los Angeles</SelectItem>
                          <SelectItem value="miami">Miami</SelectItem>
                          <SelectItem value="chicago">Chicago</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      />
                    </div>
                  </div>

                  {contractType === "rental" && (
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (months)</Label>
                      <Select
                        value={formData.duration}
                        onValueChange={(value) => setFormData({ ...formData, duration: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 month</SelectItem>
                          <SelectItem value="3">3 months</SelectItem>
                          <SelectItem value="6">6 months</SelectItem>
                          <SelectItem value="12">12 months</SelectItem>
                          <SelectItem value="24">24 months</SelectItem>
                          <SelectItem value="36">36 months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Parties Tab */}
            <TabsContent value="parties" className="mt-6">
              <div className="space-y-6">
                {/* Client Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Client Information</CardTitle>
                    <CardDescription>Select the client for this contract</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {mockClients.filter((c) => c.status === "approved").map((client) => (
                      <button
                        key={client.id}
                        type="button"
                        onClick={() => setSelectedClient(client)}
                        className={cn(
                          "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
                          selectedClient?.id === client.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                        </div>
                        <Badge variant="secondary">Verified</Badge>
                        {selectedClient?.id === client.id && (
                          <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                      </button>
                    ))}
                  </CardContent>
                </Card>

                {/* Property Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Property Information</CardTitle>
                    <CardDescription>
                      Select the property for this {contractType === "rental" ? "rental" : "sale"} contract
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredProperties.length > 0 ? (
                      filteredProperties.map((property) => (
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
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{property.title}</p>
                            <p className="text-sm text-muted-foreground">{property.address}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              ${property.price.toLocaleString()}
                              {property.type === "rent" && "/mo"}
                            </p>
                          </div>
                          {selectedProperty?.id === property.id && (
                            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                              <Check className="h-4 w-4 text-primary-foreground" />
                            </div>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Building2 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No properties available for {contractType}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Clauses Tab */}
            <TabsContent value="clauses" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Contract Clauses</CardTitle>
                    <CardDescription>Add, edit, or reorder contract clauses</CardDescription>
                  </div>
                  <Dialog open={showClauseDialog} onOpenChange={setShowClauseDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Clause
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Clause</DialogTitle>
                        <DialogDescription>
                          Create a custom clause for this contract
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="clauseTitle">Clause Title</Label>
                          <Input
                            id="clauseTitle"
                            placeholder="e.g., Pet Policy"
                            value={newClause.title}
                            onChange={(e) => setNewClause({ ...newClause, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="clauseContent">Clause Content</Label>
                          <Textarea
                            id="clauseContent"
                            placeholder="Enter the clause content..."
                            value={newClause.content}
                            onChange={(e) => setNewClause({ ...newClause, content: e.target.value })}
                            className="min-h-[150px]"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowClauseDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={addClause}>Add Clause</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent className="space-y-3">
                  {clauses.map((clause, index) => (
                    <div
                      key={clause.id}
                      className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card"
                    >
                      <div className="flex flex-col items-center gap-1 pt-1">
                        <button
                          type="button"
                          onClick={() => moveClause(index, "up")}
                          disabled={index === 0}
                          className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <button
                          type="button"
                          onClick={() => moveClause(index, "down")}
                          disabled={index === clauses.length - 1}
                          className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-muted-foreground">
                            {index + 1}.
                          </span>
                          <h4 className="font-semibold text-foreground">{clause.title}</h4>
                          {clause.isCustom && (
                            <Badge variant="secondary" className="text-xs">
                              Custom
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {clause.content}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setEditingClause({ ...clause })}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Clause</DialogTitle>
                              <DialogDescription>
                                Modify the clause content
                              </DialogDescription>
                            </DialogHeader>
                            {editingClause && (
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label>Clause Title</Label>
                                  <Input
                                    value={editingClause.title}
                                    onChange={(e) =>
                                      setEditingClause({ ...editingClause, title: e.target.value })
                                    }
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>Clause Content</Label>
                                  <Textarea
                                    value={editingClause.content}
                                    onChange={(e) =>
                                      setEditingClause({ ...editingClause, content: e.target.value })
                                    }
                                    className="min-h-[150px]"
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingClause(null)}>
                                Cancel
                              </Button>
                              <Button onClick={updateClause}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => duplicateClause(clause)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeClause(clause.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Terms</CardTitle>
                  <CardDescription>Set the financial details for this contract</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="rentAmount">
                        {contractType === "rental" ? "Monthly Rent" : "Sale Price"}
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="rentAmount"
                          type="number"
                          placeholder="0"
                          value={formData.rentAmount}
                          onChange={(e) =>
                            setFormData({ ...formData, rentAmount: e.target.value })
                          }
                          className="pl-7"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deposit">Security Deposit</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="deposit"
                          type="number"
                          placeholder="0"
                          value={formData.deposit}
                          onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                          className="pl-7"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="commission">Agency Commission (%)</Label>
                      <div className="relative">
                        <Input
                          id="commission"
                          type="number"
                          placeholder="0"
                          value={formData.commission}
                          onChange={(e) =>
                            setFormData({ ...formData, commission: e.target.value })
                          }
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          %
                        </span>
                      </div>
                    </div>

                    {contractType === "rental" && (
                      <div className="space-y-2">
                        <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                        <Select
                          value={formData.paymentFrequency}
                          onValueChange={(value) =>
                            setFormData({ ...formData, paymentFrequency: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="biannual">Bi-annual</SelectItem>
                            <SelectItem value="annual">Annual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Financial Summary */}
                  <Separator />
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold text-foreground mb-3">Financial Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          {contractType === "rental" ? "Monthly Rent" : "Sale Price"}
                        </span>
                        <span className="font-medium text-foreground">
                          ${Number(formData.rentAmount || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Security Deposit</span>
                        <span className="font-medium text-foreground">
                          ${Number(formData.deposit || 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Agency Commission</span>
                        <span className="font-medium text-foreground">
                          {formData.commission || 0}%
                        </span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between text-base">
                        <span className="font-semibold text-foreground">Total Due at Signing</span>
                        <span className="font-bold text-foreground">
                          $
                          {(
                            Number(formData.rentAmount || 0) + Number(formData.deposit || 0)
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contract Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <Badge variant="outline" className="capitalize">
                    {contractType}
                  </Badge>
                </div>
                <Separator />
                <div>
                  <span className="text-sm text-muted-foreground">Client</span>
                  {selectedClient ? (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {selectedClient.name}
                        </p>
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
                    <div className="mt-2">
                      <p className="text-sm font-medium text-foreground">
                        {selectedProperty.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{selectedProperty.address}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">Not selected</p>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Clauses</span>
                  <span className="text-sm font-medium text-foreground">{clauses.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completion Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Completion Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center",
                    formData.city && formData.startDate ? "bg-primary" : "bg-muted"
                  )}
                >
                  {formData.city && formData.startDate ? (
                    <Check className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <span className="text-xs text-muted-foreground">1</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    formData.city && formData.startDate
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  Contract Information
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center",
                    selectedClient && selectedProperty ? "bg-primary" : "bg-muted"
                  )}
                >
                  {selectedClient && selectedProperty ? (
                    <Check className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <span className="text-xs text-muted-foreground">2</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    selectedClient && selectedProperty
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  Parties Selected
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center",
                    clauses.length > 0 ? "bg-primary" : "bg-muted"
                  )}
                >
                  {clauses.length > 0 ? (
                    <Check className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <span className="text-xs text-muted-foreground">3</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    clauses.length > 0 ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Clauses Added
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center",
                    formData.rentAmount ? "bg-primary" : "bg-muted"
                  )}
                >
                  {formData.rentAmount ? (
                    <Check className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <span className="text-xs text-muted-foreground">4</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm",
                    formData.rentAmount ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Financial Terms Set
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Generate & Send Contract
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
