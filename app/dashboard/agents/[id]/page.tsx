"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  Star,
  Building2,
  Users,
  TrendingUp,
  Shield,
  Calendar,
  CheckCircle,
  FileText,
  DollarSign,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

const agent = {
  id: "1",
  name: "Sarah Wilson",
  email: "sarah.wilson@sasimo.com",
  phone: "+1 (555) 100-1001",
  role: "admin",
  status: "active",
  joinedDate: "2023-01-15",
  lastActive: "Online now",
  rating: 4.9,
  totalReviews: 87,
  properties: 45,
  clients: 28,
  closedDeals: 156,
  revenue: "$2.4M",
  bio: "Senior real estate agent with 8+ years of experience specializing in luxury residential and commercial properties. Consistently top performer with expertise in negotiation and client relationship management.",
  skills: ["Luxury Properties", "Negotiation", "Market Analysis", "Client Relations", "Property Valuation"],
  permissions: { properties: true, clients: true, contracts: true, invoices: true, settings: true, team: true },
  recentDeals: [
    { id: "CT-2026-001", property: "Modern Downtown Apartment", client: "John Smith", value: "$725,000", date: "2026-01-28", type: "sale" },
    { id: "CT-2026-003", property: "Penthouse with City Views", client: "Robert Williams", value: "$1,850,000", date: "2026-02-01", type: "sale" },
    { id: "CT-2025-045", property: "Family Home with Garden", client: "David Brown", value: "$890,000", date: "2025-12-15", type: "sale" },
  ],
  performance: [
    { label: "Deals Closed", value: 156, target: 150, percentage: 104 },
    { label: "Revenue Generated", value: 2400000, target: 2000000, percentage: 120 },
    { label: "Client Satisfaction", value: 4.9, target: 4.5, percentage: 109 },
    { label: "Response Time (hrs)", value: 2.1, target: 4, percentage: 190 },
  ],
  reviews: [
    { client: "John Smith", rating: 5, comment: "Sarah was exceptional throughout the entire process. Highly recommended!", date: "2026-01-28" },
    { client: "Emily Johnson", rating: 5, comment: "Very professional and knowledgeable. Made the process seamless.", date: "2026-01-15" },
    { client: "David Brown", rating: 4, comment: "Great experience overall. Very responsive and helpful.", date: "2025-12-20" },
  ],
}

export default function AgentViewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/agents"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16"><AvatarFallback className="text-xl">SW</AvatarFallback></Avatar>
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{agent.name}</h1>
                <Badge variant="default" className="flex items-center gap-1"><Shield className="h-3 w-3" />Admin</Badge>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-1"><Star className="h-4 w-4 fill-amber-400 text-amber-400" /><span className="font-semibold text-foreground">{agent.rating}</span><span className="text-muted-foreground text-sm">({agent.totalReviews} reviews)</span></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-transparent"><Mail className="mr-2 h-4 w-4" />Email</Button>
          <Button variant="outline" size="sm" className="bg-transparent"><Phone className="mr-2 h-4 w-4" />Call</Button>
          <Button size="sm" asChild>
            <Link href={`/dashboard/agents/${agent.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit Profile</Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Properties</p><p className="text-2xl font-bold text-foreground mt-1">{agent.properties}</p></div><div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><Building2 className="h-5 w-5 text-muted-foreground" /></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Clients</p><p className="text-2xl font-bold text-foreground mt-1">{agent.clients}</p></div><div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><Users className="h-5 w-5 text-muted-foreground" /></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Closed Deals</p><p className="text-2xl font-bold text-foreground mt-1">{agent.closedDeals}</p></div><div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><TrendingUp className="h-5 w-5 text-muted-foreground" /></div></div></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">Revenue</p><p className="text-2xl font-bold text-foreground mt-1">{agent.revenue}</p></div><div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><DollarSign className="h-5 w-5 text-muted-foreground" /></div></div></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="deals">
            <TabsList>
              <TabsTrigger value="deals"><FileText className="mr-2 h-4 w-4" />Recent Deals</TabsTrigger>
              <TabsTrigger value="performance"><TrendingUp className="mr-2 h-4 w-4" />Performance</TabsTrigger>
              <TabsTrigger value="reviews"><Star className="mr-2 h-4 w-4" />Reviews</TabsTrigger>
            </TabsList>

            <TabsContent value="deals" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Recent Deals</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {agent.recentDeals.map((deal) => (
                    <div key={deal.id} className="flex items-center justify-between p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><FileText className="h-5 w-5 text-muted-foreground" /></div>
                        <div>
                          <p className="font-medium text-foreground">{deal.property}</p>
                          <p className="text-sm text-muted-foreground">{deal.client} - {deal.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">{deal.value}</p>
                        <p className="text-xs text-muted-foreground">{new Date(deal.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Performance Metrics</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  {agent.performance.map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{metric.label}</span>
                        <span className="text-sm text-muted-foreground">{metric.percentage}% of target</span>
                      </div>
                      <Progress value={Math.min(metric.percentage, 100)} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Client Reviews</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {agent.reviews.map((review, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-foreground">{review.client}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(review.date).toLocaleDateString()}</p>
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
            <CardHeader><CardTitle className="text-lg">Contact</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" />{agent.email}</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4" />{agent.phone}</div>
              <Separator />
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Joined</span><span className="text-foreground">{new Date(agent.joinedDate).toLocaleDateString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Last active</span><span className="text-foreground">{agent.lastActive}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">About</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{agent.bio}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {agent.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Permissions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(agent.permissions).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-foreground">{key}</span>
                  {value ? <CheckCircle className="h-4 w-4 text-green-600" /> : <span className="h-4 w-4 rounded-full bg-muted" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
