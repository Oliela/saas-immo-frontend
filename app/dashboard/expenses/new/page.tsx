"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Upload,
  X,
  Receipt,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
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

const properties = [
  { id: "1", name: "Modern Downtown Apartment", address: "123 Main St, New York" },
  { id: "2", name: "Luxury Beach Villa", address: "456 Ocean Ave, Miami" },
  { id: "3", name: "Cozy Studio Loft", address: "789 Arts District, Los Angeles" },
  { id: "4", name: "Family Home", address: "321 Oak Lane, Austin" },
]

const expenseCategories = [
  { id: "maintenance", name: "Maintenance & Repairs", icon: "wrench" },
  { id: "utilities", name: "Utilities", icon: "zap" },
  { id: "insurance", name: "Insurance", icon: "shield" },
  { id: "taxes", name: "Property Taxes", icon: "landmark" },
  { id: "management", name: "Management Fees", icon: "briefcase" },
  { id: "legal", name: "Legal Fees", icon: "scale" },
  { id: "cleaning", name: "Cleaning Services", icon: "sparkles" },
  { id: "landscaping", name: "Landscaping", icon: "trees" },
  { id: "other", name: "Other", icon: "more-horizontal" },
]

const recentExpenses = [
  { id: 1, property: "Modern Downtown Apartment", category: "Maintenance", amount: 450, date: "2026-02-01" },
  { id: 2, property: "Luxury Beach Villa", category: "Utilities", amount: 280, date: "2026-01-28" },
  { id: 3, property: "Family Home", category: "Insurance", amount: 1200, date: "2026-01-15" },
]

export default function NewExpensePage() {
  const [formData, setFormData] = useState({
    property: "",
    category: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    recurring: false,
  })
  const [receipt, setReceipt] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.property) newErrors.property = "Please select a property"
    if (!formData.category) newErrors.category = "Please select a category"
    if (!formData.amount || Number.parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount"
    }
    if (!formData.date) newErrors.date = "Please select a date"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setReceipt(file)
    }
  }

  const selectedProperty = properties.find((p) => p.id === formData.property)

  if (isSuccess) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-foreground">Expense Recorded</h2>
            <p className="mb-6 text-muted-foreground">
              Your expense of ${formData.amount} has been successfully recorded.
            </p>
            <div className="flex flex-col gap-3">
              <Button asChild>
                <Link href="/dashboard/expenses/new">Record Another Expense</Link>
              </Button>
              <Button variant="outline" className="bg-transparent" asChild>
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Record Expense</h1>
              <p className="text-sm text-muted-foreground">Track property-related expenses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-primary" />
                    Expense Details
                  </CardTitle>
                  <CardDescription>Enter the expense information below</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Property Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="property" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      Property
                    </Label>
                    <Select
                      value={formData.property}
                      onValueChange={(value) => setFormData({ ...formData, property: value })}
                    >
                      <SelectTrigger
                        id="property"
                        className={errors.property ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select a property" />
                      </SelectTrigger>
                      <SelectContent>
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
                    {errors.property && (
                      <p className="flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.property}
                      </p>
                    )}
                  </div>

                  {/* Category Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="category" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      Expense Category
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger
                        id="category"
                        className={errors.category ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="flex items-center gap-1 text-sm text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        {errors.category}
                      </p>
                    )}
                  </div>

                  {/* Amount and Date Row */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="amount" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        Amount
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          className={`pl-7 ${errors.amount ? "border-destructive" : ""}`}
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                      </div>
                      {errors.amount && (
                        <p className="flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {errors.amount}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        className={errors.date ? "border-destructive" : ""}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                      {errors.date && (
                        <p className="flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          {errors.date}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add notes about this expense..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <Separator />

                  {/* Receipt Upload */}
                  <div className="space-y-2">
                    <Label>Receipt (Optional)</Label>
                    {receipt ? (
                      <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{receipt.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(receipt.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setReceipt(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <label
                        htmlFor="receipt"
                        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 p-6 transition-colors hover:border-primary/50 hover:bg-muted"
                      >
                        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-sm font-medium">Upload Receipt</p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG or PDF up to 10MB
                        </p>
                        <input
                          id="receipt"
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      className="bg-transparent"
                      asChild
                    >
                      <Link href="/dashboard">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Recording..." : "Record Expense"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Selected Property Preview */}
            {selectedProperty && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Selected Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedProperty.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedProperty.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Expenses</span>
                  <span className="font-semibold">$3,245.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Transactions</span>
                  <span className="font-semibold">12</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Top Category</span>
                  <Badge variant="secondary">Maintenance</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recent Expenses */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Recent Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentExpenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{expense.category}</p>
                        <p className="text-xs text-muted-foreground">{expense.property}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${expense.amount}</p>
                        <p className="text-xs text-muted-foreground">{expense.date}</p>
                      </div>
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
