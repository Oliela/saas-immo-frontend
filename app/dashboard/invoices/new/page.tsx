"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Receipt,
  FileText,
  Calendar,
  DollarSign,
  Send,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Eye,
  Save,
  User,
  Building2,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

// Mock data
const clients = [
  { id: "1", name: "James Wilson", email: "james@example.com", type: "client" },
  { id: "2", name: "Sarah Chen", email: "sarah@example.com", type: "client" },
  { id: "3", name: "Mike Brown", email: "mike@example.com", type: "client" },
]

const propertyOwners = [
  { id: "1", name: "Robert Taylor", email: "robert@example.com", type: "owner" },
  { id: "2", name: "Emily Davis", email: "emily@example.com", type: "owner" },
  { id: "3", name: "Michael Johnson", email: "michael@example.com", type: "owner" },
]

const properties = [
  { id: "1", name: "Modern Downtown Apartment", address: "123 Main St, New York" },
  { id: "2", name: "Luxury Beach Villa", address: "456 Ocean Ave, Miami" },
  { id: "3", name: "Cozy Studio Loft", address: "789 Arts District, Los Angeles" },
]

const contracts = [
  { id: "1", name: "Rental Agreement #RA-2026-001", property: "123 Main St" },
  { id: "2", name: "Sale Contract #SC-2026-002", property: "456 Ocean Ave" },
  { id: "3", name: "Rental Agreement #RA-2026-003", property: "789 Arts District" },
]

type InvoiceType = "expense" | "rent_payment" | "income"
type InvoiceStatus = "draft" | "pending" | "paid" | "overdue"
type RecipientType = "client" | "owner"

const invoiceTypes: { value: InvoiceType; label: string; description: string; icon: React.ReactNode }[] = [
  { 
    value: "expense", 
    label: "Expense", 
    description: "Property maintenance, repairs, etc.",
    icon: <ArrowUpCircle className="h-5 w-5" />
  },
  { 
    value: "rent_payment", 
    label: "Rent Payment", 
    description: "Monthly rent collection",
    icon: <Home className="h-5 w-5" />
  },
  { 
    value: "income", 
    label: "Income", 
    description: "Commission, fees, other income",
    icon: <ArrowDownCircle className="h-5 w-5" />
  },
]

const statusOptions: { value: InvoiceStatus; label: string; color: string; icon: React.ReactNode }[] = [
  { value: "draft", label: "Draft", color: "bg-muted text-muted-foreground", icon: <FileText className="h-3.5 w-3.5" /> },
  { value: "pending", label: "Pending", color: "bg-amber-100 text-amber-700 border-amber-200", icon: <Clock className="h-3.5 w-3.5" /> },
  { value: "paid", label: "Paid", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle className="h-3.5 w-3.5" /> },
  { value: "overdue", label: "Overdue", color: "bg-red-100 text-red-700 border-red-200", icon: <AlertTriangle className="h-3.5 w-3.5" /> },
]

export default function NewInvoicePage() {
  const [formData, setFormData] = useState({
    invoiceType: "" as InvoiceType | "",
    label: "",
    description: "",
    recipientType: "client" as RecipientType,
    recipientId: "",
    propertyId: "",
    contractId: "",
    amount: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    status: "draft" as InvoiceStatus,
  })
  const [receipt, setReceipt] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const recipients = formData.recipientType === "client" ? clients : propertyOwners
  const selectedRecipient = recipients.find((r) => r.id === formData.recipientId)
  const selectedProperty = properties.find((p) => p.id === formData.propertyId)
  const selectedInvoiceType = invoiceTypes.find((t) => t.value === formData.invoiceType)
  const selectedStatus = statusOptions.find((s) => s.value === formData.status)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceipt(e.target.files[0])
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.invoiceType) newErrors.invoiceType = "Please select invoice type"
    if (!formData.label.trim()) newErrors.label = "Please enter a label"
    if (!formData.recipientId) newErrors.recipientId = "Please select a recipient"
    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }
    if (!formData.issueDate) newErrors.issueDate = "Please select issue date"
    if (!formData.dueDate) newErrors.dueDate = "Please select due date"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent, asDraft: boolean = false) => {
    e.preventDefault()
    if (!asDraft && !validateForm()) return
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
  }

  const formatCurrency = (value: string) => {
    const num = Number.parseFloat(value)
    if (Number.isNaN(num)) return "$0.00"
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/invoices">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Create Invoice</h1>
                <p className="text-sm text-muted-foreground">Generate a new invoice for tracking</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {selectedStatus && (
                <Badge variant="outline" className={selectedStatus.color}>
                  <span className="mr-1.5">{selectedStatus.icon}</span>
                  {selectedStatus.label}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <form onSubmit={(e) => handleSubmit(e, false)}>
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Invoice Type */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Wallet className="h-5 w-5 text-primary" />
                    Invoice Type
                  </CardTitle>
                  <CardDescription>Select the type of invoice you want to create</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.invoiceType}
                    onValueChange={(value) => setFormData({ ...formData, invoiceType: value as InvoiceType })}
                    className="grid gap-3 sm:grid-cols-3"
                  >
                    {invoiceTypes.map((type) => (
                      <div key={type.value}>
                        <RadioGroupItem
                          value={type.value}
                          id={type.value}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={type.value}
                          className="flex flex-col items-center gap-2 rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-all"
                        >
                          <div className="text-primary">{type.icon}</div>
                          <span className="font-medium">{type.label}</span>
                          <span className="text-xs text-muted-foreground text-center">{type.description}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                  {errors.invoiceType && (
                    <p className="mt-2 text-sm text-destructive">{errors.invoiceType}</p>
                  )}
                </CardContent>
              </Card>

              {/* Invoice Details */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5 text-primary" />
                    Invoice Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="label">Invoice Label / Title</Label>
                    <Input
                      id="label"
                      placeholder="e.g., February 2026 Rent Payment"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className={errors.label ? "border-destructive" : ""}
                    />
                    {errors.label && (
                      <p className="text-sm text-destructive">{errors.label}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add additional details about this invoice..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="status">Invoice Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({ ...formData, status: value as InvoiceStatus })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              <div className="flex items-center gap-2">
                                {status.icon}
                                {status.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recipient */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <User className="h-5 w-5 text-primary" />
                    Recipient
                  </CardTitle>
                  <CardDescription>Who should receive this invoice?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Recipient Type</Label>
                    <RadioGroup
                      value={formData.recipientType}
                      onValueChange={(value) => setFormData({ ...formData, recipientType: value as RecipientType, recipientId: "" })}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="client" id="client" />
                        <Label htmlFor="client" className="font-normal cursor-pointer">Client</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="owner" id="owner" />
                        <Label htmlFor="owner" className="font-normal cursor-pointer">Property Owner</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipient">
                      Select {formData.recipientType === "client" ? "Client" : "Property Owner"}
                    </Label>
                    <Select
                      value={formData.recipientId}
                      onValueChange={(value) => setFormData({ ...formData, recipientId: value })}
                    >
                      <SelectTrigger className={errors.recipientId ? "border-destructive" : ""}>
                        <SelectValue placeholder={`Select a ${formData.recipientType === "client" ? "client" : "property owner"}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {recipients.map((recipient) => (
                          <SelectItem key={recipient.id} value={recipient.id}>
                            <div className="flex flex-col">
                              <span>{recipient.name}</span>
                              <span className="text-xs text-muted-foreground">{recipient.email}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.recipientId && (
                      <p className="text-sm text-destructive">{errors.recipientId}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Related Property/Contract */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building2 className="h-5 w-5 text-primary" />
                    Related Property / Contract
                  </CardTitle>
                  <CardDescription>Optional: Link this invoice to a property or contract</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="property">Property (Optional)</Label>
                      <Select
                        value={formData.propertyId}
                        onValueChange={(value) => setFormData({ ...formData, propertyId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No property</SelectItem>
                          {properties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              <div className="flex flex-col">
                                <span>{property.name}</span>
                                <span className="text-xs text-muted-foreground">{property.address}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contract">Contract (Optional)</Label>
                      <Select
                        value={formData.contractId}
                        onValueChange={(value) => setFormData({ ...formData, contractId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select contract" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No contract</SelectItem>
                          {contracts.map((contract) => (
                            <SelectItem key={contract.id} value={contract.id}>
                              <div className="flex flex-col">
                                <span>{contract.name}</span>
                                <span className="text-xs text-muted-foreground">{contract.property}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amount & Dates */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <DollarSign className="h-5 w-5 text-primary" />
                    Amount & Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className={`pl-8 text-lg font-semibold ${errors.amount ? "border-destructive" : ""}`}
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      />
                    </div>
                    {errors.amount && (
                      <p className="text-sm text-destructive">{errors.amount}</p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="issueDate">Issue Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="issueDate"
                          type="date"
                          className={`pl-10 ${errors.issueDate ? "border-destructive" : ""}`}
                          value={formData.issueDate}
                          onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                        />
                      </div>
                      {errors.issueDate && (
                        <p className="text-sm text-destructive">{errors.issueDate}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Due Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="dueDate"
                          type="date"
                          className={`pl-10 ${errors.dueDate ? "border-destructive" : ""}`}
                          value={formData.dueDate}
                          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        />
                      </div>
                      {errors.dueDate && (
                        <p className="text-sm text-destructive">{errors.dueDate}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Receipt Upload */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Receipt className="h-5 w-5 text-primary" />
                    Receipt / Attachment
                  </CardTitle>
                  <CardDescription>Upload a receipt or supporting document (Optional)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      id="receipt"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {receipt ? (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2 text-primary">
                          <FileText className="h-8 w-8" />
                        </div>
                        <p className="font-medium">{receipt.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(receipt.size / 1024).toFixed(1)} KB
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setReceipt(null)}
                          className="bg-transparent"
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label htmlFor="receipt" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <div className="rounded-full bg-muted p-3">
                            <Receipt className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium">Upload Receipt</p>
                            <p className="text-sm text-muted-foreground">
                              Drag and drop or click to browse
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            PDF, PNG, JPG up to 10MB
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Invoice Preview */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    Invoice Preview
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Full Preview
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
                        <SheetHeader>
                          <SheetTitle>Invoice Preview</SheetTitle>
                          <SheetDescription>
                            Preview how your invoice will look
                          </SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 space-y-6">
                          {/* Full Invoice Preview */}
                          <div className="border rounded-lg p-6 bg-card">
                            <div className="flex justify-between items-start mb-6">
                              <div>
                                <h3 className="text-xl font-bold text-primary">SAS IMO</h3>
                                <p className="text-sm text-muted-foreground">Real Estate Agency</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Invoice #</p>
                                <p className="font-mono font-medium">INV-2026-XXX</p>
                              </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                              <div>
                                <p className="text-muted-foreground mb-1">Bill To</p>
                                <p className="font-medium">{selectedRecipient?.name || "—"}</p>
                                <p className="text-muted-foreground">{selectedRecipient?.email || ""}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-muted-foreground mb-1">Invoice Date</p>
                                <p className="font-medium">{formData.issueDate || "—"}</p>
                                <p className="text-muted-foreground mt-2 mb-1">Due Date</p>
                                <p className="font-medium">{formData.dueDate || "—"}</p>
                              </div>
                            </div>

                            {selectedProperty && (
                              <div className="bg-muted/50 rounded-lg p-3 mb-4 text-sm">
                                <p className="text-muted-foreground">Related Property</p>
                                <p className="font-medium">{selectedProperty.name}</p>
                                <p className="text-muted-foreground text-xs">{selectedProperty.address}</p>
                              </div>
                            )}

                            <div className="border rounded-lg overflow-hidden mb-4">
                              <div className="bg-muted/50 px-4 py-2 text-sm font-medium grid grid-cols-2">
                                <span>Description</span>
                                <span className="text-right">Amount</span>
                              </div>
                              <div className="px-4 py-3 grid grid-cols-2 text-sm">
                                <span>{formData.label || "Invoice item"}</span>
                                <span className="text-right font-medium">{formatCurrency(formData.amount)}</span>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <div className="w-48 space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-muted-foreground">Subtotal</span>
                                  <span>{formatCurrency(formData.amount)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-semibold">
                                  <span>Total</span>
                                  <span className="text-lg">{formatCurrency(formData.amount)}</span>
                                </div>
                              </div>
                            </div>

                            {formData.description && (
                              <>
                                <Separator className="my-4" />
                                <div className="text-sm">
                                  <p className="text-muted-foreground mb-1">Notes</p>
                                  <p>{formData.description}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    {/* Type Badge */}
                    {selectedInvoiceType && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="gap-1">
                          {selectedInvoiceType.icon}
                          {selectedInvoiceType.label}
                        </Badge>
                      </div>
                    )}

                    <Separator />

                    {/* Recipient */}
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Bill To</p>
                      {selectedRecipient ? (
                        <>
                          <p className="font-medium">{selectedRecipient.name}</p>
                          <p className="text-muted-foreground text-xs">{selectedRecipient.email}</p>
                        </>
                      ) : (
                        <p className="text-muted-foreground">No recipient selected</p>
                      )}
                    </div>

                    {/* Property */}
                    {selectedProperty && (
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Property</p>
                        <p className="font-medium">{selectedProperty.name}</p>
                        <p className="text-muted-foreground text-xs">{selectedProperty.address}</p>
                      </div>
                    )}

                    <Separator />

                    {/* Amount */}
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Amount</p>
                      <p className="text-2xl font-bold text-foreground">
                        {formatCurrency(formData.amount)}
                      </p>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Issue Date</p>
                        <p className="font-medium">{formData.issueDate || "—"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Due Date</p>
                        <p className="font-medium">{formData.dueDate || "—"}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Status</p>
                      {selectedStatus && (
                        <Badge variant="outline" className={`${selectedStatus.color} gap-1`}>
                          {selectedStatus.icon}
                          {selectedStatus.label}
                        </Badge>
                      )}
                    </div>

                    {/* Receipt */}
                    {receipt && (
                      <div>
                        <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Attachment</p>
                        <div className="flex items-center gap-2 text-xs">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="truncate">{receipt.name}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Creating..." : "Create & Send Invoice"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                  onClick={(e) => handleSubmit(e, true)}
                  disabled={isSubmitting}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save as Draft
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full" 
                  asChild
                >
                  <Link href="/dashboard/invoices">Cancel</Link>
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
