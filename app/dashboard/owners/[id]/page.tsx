"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  FileText,
  Home,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const owner = {
  id: "1",
  name: "Alexander Thompson",
  email: "alex.thompson@email.com",
  phone: "+1 (555) 111-2222",
  location: "New York, NY",
  address: "789 Fifth Avenue, Suite 12, New York, NY 10065",
  status: "active",
  joinedDate: "2024-03-15",
  lastActivity: "2 days ago",
  totalProperties: 5,
  totalValue: "$4,250,000",
  monthlyIncome: "$18,500",
  occupancyRate: "92%",
  bio: "Real estate investor with a portfolio focused on luxury residential properties in New York City. Former finance executive with 15 years of experience in property management.",
  properties: [
    { id: "1", title: "Modern Downtown Apartment", address: "123 Main St, NY", type: "Apartment", status: "rented", value: "$725,000", monthlyRent: "$4,500" },
    { id: "2", title: "Luxury Beachfront Villa", address: "456 Ocean Dr, Miami", type: "Villa", status: "rented", value: "$1,850,000", monthlyRent: "$8,000" },
    { id: "3", title: "Penthouse with City Views", address: "789 Sky Tower, NY", type: "Penthouse", status: "available", value: "$950,000", monthlyRent: "-" },
    { id: "4", title: "Cozy Studio Apartment", address: "321 Park Ave, NY", type: "Studio", status: "rented", value: "$425,000", monthlyRent: "$2,200" },
    { id: "5", title: "Family Home with Garden", address: "555 Oak Lane, NY", type: "House", status: "maintenance", value: "$300,000", monthlyRent: "-" },
  ],
  contracts: [
    { id: "CT-2026-001", property: "Modern Downtown Apartment", type: "rental", status: "signed", date: "2026-01-15" },
    { id: "CT-2026-002", property: "Luxury Beachfront Villa", type: "rental", status: "signed", date: "2026-01-10" },
    { id: "CT-2025-015", property: "Cozy Studio Apartment", type: "rental", status: "signed", date: "2025-09-01" },
  ],
  transactions: [
    { date: "2026-02-01", description: "Rental Income - Downtown Apt", amount: "+$4,500" },
    { date: "2026-02-01", description: "Rental Income - Beachfront Villa", amount: "+$8,000" },
    { date: "2026-02-01", description: "Rental Income - Studio Apt", amount: "+$2,200" },
    { date: "2026-01-28", description: "Maintenance - Family Home", amount: "-$1,200" },
    { date: "2026-01-15", description: "Property Tax - Q1", amount: "-$3,800" },
  ],
}

export default function OwnerViewPage() {
  const getPropertyStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      rented: { variant: "default", label: "Rented" },
      available: { variant: "secondary", label: "Available" },
      maintenance: { variant: "outline", label: "Maintenance" },
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
            <Link href="/dashboard/owners"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14"><AvatarFallback className="text-lg">AT</AvatarFallback></Avatar>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{owner.name}</h1>
                <Badge variant="default">Active</Badge>
              </div>
              <p className="text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-4 w-4" />{owner.location}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-transparent"><Mail className="mr-2 h-4 w-4" />Email</Button>
          <Button variant="outline" size="sm" className="bg-transparent"><Phone className="mr-2 h-4 w-4" />Call</Button>
          <Button size="sm" asChild>
            <Link href={`/dashboard/owners/${owner.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit Profile</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Properties</p><p className="text-2xl font-bold text-foreground mt-1">{owner.totalProperties}</p></div><div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><Home className="h-5 w-5 text-muted-foreground" /></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Portfolio Value</p><p className="text-2xl font-bold text-foreground mt-1">{owner.totalValue}</p></div><div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><DollarSign className="h-5 w-5 text-muted-foreground" /></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Monthly Income</p><p className="text-2xl font-bold text-foreground mt-1">{owner.monthlyIncome}</p></div><div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><TrendingUp className="h-5 w-5 text-muted-foreground" /></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Occupancy Rate</p><p className="text-2xl font-bold text-foreground mt-1">{owner.occupancyRate}</p></div><div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><Building2 className="h-5 w-5 text-muted-foreground" /></div></div></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="properties">
            <TabsList>
              <TabsTrigger value="properties"><Home className="mr-2 h-4 w-4" />Properties</TabsTrigger>
              <TabsTrigger value="contracts"><FileText className="mr-2 h-4 w-4" />Contracts</TabsTrigger>
              <TabsTrigger value="transactions"><DollarSign className="mr-2 h-4 w-4" />Transactions</TabsTrigger>
            </TabsList>

            <TabsContent value="properties" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Properties ({owner.properties.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {owner.properties.map((prop) => (
                    <div key={prop.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><Home className="h-5 w-5 text-muted-foreground" /></div>
                        <div>
                          <p className="font-medium text-foreground">{prop.title}</p>
                          <p className="text-sm text-muted-foreground">{prop.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="font-medium text-foreground">{prop.value}</p>
                          <p className="text-xs text-muted-foreground">{prop.monthlyRent}/mo</p>
                        </div>
                        {getPropertyStatusBadge(prop.status)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contracts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Contracts ({owner.contracts.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {owner.contracts.map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><FileText className="h-5 w-5 text-muted-foreground" /></div>
                        <div>
                          <p className="font-medium text-foreground">{c.id}</p>
                          <p className="text-sm text-muted-foreground">{c.property}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">{c.type}</Badge>
                        <Badge variant="default">Signed</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-0">
                  {owner.transactions.map((t, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">{t.description}</p>
                        <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()}</p>
                      </div>
                      <span className={`font-bold ${t.amount.startsWith("+") ? "text-green-600" : "text-destructive"}`}>{t.amount}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Contact Information</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" />{owner.email}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" />{owner.phone}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" />{owner.address}</div>
              <Separator />
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Member since</span><span className="text-foreground">{new Date(owner.joinedDate).toLocaleDateString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Last active</span><span className="text-foreground">{owner.lastActivity}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">About</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{owner.bio}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm" asChild><Link href={`/dashboard/owners/${owner.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit Profile</Link></Button>
              <Button variant="outline" className="w-full bg-transparent" size="sm"><Mail className="mr-2 h-4 w-4" />Send Email</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
