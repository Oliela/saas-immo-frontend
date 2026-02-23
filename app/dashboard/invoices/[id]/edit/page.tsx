"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Trash2, Plus, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

const initialData = {
  id: "INV-2026-001",
  status: "paid",
  type: "commission",
  clientName: "John Smith",
  clientEmail: "john.smith@email.com",
  clientPhone: "+1 (555) 123-4567",
  clientAddress: "456 Park Avenue, New York, NY 10022",
  property: "Modern Downtown Apartment",
  contract: "CT-2026-001",
  issueDate: "2026-01-15",
  dueDate: "2026-01-30",
  notes: "Commission for the sale of Modern Downtown Apartment.",
  items: [
    { id: 1, description: "Sale Commission (3% of $725,000)", quantity: 1, unitPrice: 21750 },
  ],
  taxRate: 0,
}

export default function InvoiceEditPage() {
  const [formData, setFormData] = useState(initialData)
  const [items, setItems] = useState(initialData.items)

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, unitPrice: 0 }])
  }

  const removeItem = (id: number) => {
    setItems(items.filter((i) => i.id !== id))
  }

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: value } : i)))
  }

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const tax = subtotal * formData.taxRate / 100
  const total = subtotal + tax

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/invoices/${formData.id}`}><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Invoice {formData.id}</h1>
            <p className="text-muted-foreground">Modify invoice details and line items</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
          <Button size="sm"><Save className="mr-2 h-4 w-4" />Save Changes</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Invoice Details */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Invoice Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="commission">Commission</SelectItem>
                      <SelectItem value="rental">Rental</SelectItem>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="service">Service Fee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Issue Date</Label>
                  <Input type="date" value={formData.issueDate} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Property</Label>
                  <Input value={formData.property} onChange={(e) => setFormData({ ...formData, property: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Related Contract</Label>
                  <Input value={formData.contract} onChange={(e) => setFormData({ ...formData, contract: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
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
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={formData.clientAddress} onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Line Items</CardTitle>
                <CardDescription>{items.length} item(s)</CardDescription>
              </div>
              <Button size="sm" onClick={addItem}><Plus className="mr-2 h-4 w-4" />Add Item</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id} className="p-4 rounded-lg border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Item {index + 1}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeItem(item.id)}><X className="h-4 w-4" /></Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input value={item.description} onChange={(e) => updateItem(item.id, "description", e.target.value)} />
                  </div>
                  <div className="grid gap-4 grid-cols-2">
                    <div className="space-y-2">
                      <Label>Quantity</Label>
                      <Input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Unit Price ($)</Label>
                      <Input type="number" min={0} value={item.unitPrice} onChange={(e) => updateItem(item.id, "unitPrice", Number(e.target.value))} />
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">Line Total: </span>
                    <span className="font-bold text-foreground">${(item.quantity * item.unitPrice).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tax & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tax Rate (%)</Label>
                <Input type="number" min={0} max={100} value={formData.taxRate} onChange={(e) => setFormData({ ...formData, taxRate: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={4} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium text-foreground">${subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax ({formData.taxRate}%)</span><span className="font-medium text-foreground">${tax.toLocaleString()}</span></div>
              <Separator />
              <div className="flex justify-between"><span className="font-bold text-foreground">Total</span><span className="font-bold text-foreground text-lg">${total.toLocaleString()}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
