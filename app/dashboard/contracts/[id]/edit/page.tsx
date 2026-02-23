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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

const initialData = {
  id: "CT-2026-001",
  type: "sale",
  status: "signed",
  property: "Modern Downtown Apartment",
  propertyAddress: "123 Main Street, Apt 4B, New York, NY 10001",
  clientName: "John Smith",
  clientEmail: "john.smith@email.com",
  clientPhone: "+1 (555) 123-4567",
  agent: "Sarah Wilson",
  salePrice: "725000",
  commissionRate: "3",
  deposit: "72500",
  startDate: "2026-01-15",
  endDate: "2027-01-28",
  notes: "Standard sale contract with 15-day inspection period.",
  clauses: [
    { id: 1, title: "Property Description", content: "The Seller agrees to sell and the Buyer agrees to purchase the property located at 123 Main Street, Apt 4B, New York, NY 10001." },
    { id: 2, title: "Purchase Price", content: "The total purchase price for the Property shall be Seven Hundred Twenty-Five Thousand Dollars ($725,000)." },
    { id: 3, title: "Deposit", content: "The Buyer shall deposit the sum of Seventy-Two Thousand Five Hundred Dollars ($72,500) within five (5) business days." },
    { id: 4, title: "Inspection Period", content: "The Buyer shall have fifteen (15) days from the date of contract execution to conduct a professional inspection." },
    { id: 5, title: "Closing Date", content: "The closing of this transaction shall take place on or before March 15, 2026." },
  ],
}

export default function ContractEditPage() {
  const [formData, setFormData] = useState(initialData)
  const [clauses, setClauses] = useState(initialData.clauses)

  const addClause = () => {
    setClauses([...clauses, { id: Date.now(), title: "", content: "" }])
  }

  const removeClause = (id: number) => {
    setClauses(clauses.filter((c) => c.id !== id))
  }

  const updateClause = (id: number, field: "title" | "content", value: string) => {
    setClauses(clauses.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/contracts/${formData.id}`}><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Contract {formData.id}</h1>
            <p className="text-muted-foreground">Modify contract details and clauses</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" />Delete</Button>
          <Button size="sm"><Save className="mr-2 h-4 w-4" />Save Changes</Button>
        </div>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">General Info</TabsTrigger>
          <TabsTrigger value="parties">Parties</TabsTrigger>
          <TabsTrigger value="clauses">Clauses</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Information</CardTitle>
              <CardDescription>Basic contract details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Contract Type</Label>
                  <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="rental">Rental</SelectItem>
                      <SelectItem value="lease">Lease</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="review">In Review</SelectItem>
                      <SelectItem value="pending_signature">Pending Signature</SelectItem>
                      <SelectItem value="signed">Signed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Property</Label>
                <Input value={formData.property} onChange={(e) => setFormData({ ...formData, property: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Property Address</Label>
                <Input value={formData.propertyAddress} onChange={(e) => setFormData({ ...formData, propertyAddress: e.target.value })} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={3} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parties" className="mt-6 space-y-6">
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
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Assigned Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Agent</Label>
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
        </TabsContent>

        <TabsContent value="clauses" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Contract Clauses</CardTitle>
                <CardDescription>{clauses.length} clauses</CardDescription>
              </div>
              <Button size="sm" onClick={addClause}><Plus className="mr-2 h-4 w-4" />Add Clause</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {clauses.map((clause, index) => (
                <div key={clause.id} className="p-4 rounded-lg border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">{index + 1}</span>
                      <span className="text-sm font-medium text-muted-foreground">Clause {index + 1}</span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeClause(clause.id)}><X className="h-4 w-4" /></Button>
                  </div>
                  <Input placeholder="Clause title" value={clause.title} onChange={(e) => updateClause(clause.id, "title", e.target.value)} />
                  <Textarea placeholder="Clause content..." value={clause.content} onChange={(e) => updateClause(clause.id, "content", e.target.value)} rows={3} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Sale Price ($)</Label>
                  <Input type="number" value={formData.salePrice} onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Commission Rate (%)</Label>
                  <Input type="number" value={formData.commissionRate} onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Deposit Amount ($)</Label>
                <Input type="number" value={formData.deposit} onChange={(e) => setFormData({ ...formData, deposit: e.target.value })} />
              </div>
              <Separator />
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex justify-between mb-2"><span className="text-muted-foreground">Commission Amount</span><span className="font-bold text-foreground">${(Number(formData.salePrice) * Number(formData.commissionRate) / 100).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Net to Seller</span><span className="font-bold text-foreground">${(Number(formData.salePrice) - Number(formData.salePrice) * Number(formData.commissionRate) / 100).toLocaleString()}</span></div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
