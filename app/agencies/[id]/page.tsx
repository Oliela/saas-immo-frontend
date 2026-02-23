import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Building2,
  Clock,
  CheckCircle,
  ChevronRight,
  MessageSquare,
  Award,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertyCard } from "@/components/property-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { agencies, properties } from "@/lib/mock-data"

// Mock agents data
const agentsByAgency: Record<string, { id: string; name: string; role: string; avatar: string; experience: string }[]> = {
  "1": [
    { id: "1", name: "Sarah Johnson", role: "Lead Agent", avatar: "SJ", experience: "12 years" },
    { id: "2", name: "Michael Chen", role: "Senior Agent", avatar: "MC", experience: "8 years" },
    { id: "3", name: "Emily Davis", role: "Agent", avatar: "ED", experience: "5 years" },
  ],
  "2": [
    { id: "4", name: "Robert Wilson", role: "Managing Director", avatar: "RW", experience: "15 years" },
    { id: "5", name: "Jennifer Martinez", role: "Senior Agent", avatar: "JM", experience: "10 years" },
  ],
  "3": [
    { id: "6", name: "David Thompson", role: "Lead Agent", avatar: "DT", experience: "9 years" },
    { id: "7", name: "Amanda Clark", role: "Agent", avatar: "AC", experience: "4 years" },
    { id: "8", name: "Kevin Brown", role: "Agent", avatar: "KB", experience: "3 years" },
    { id: "9", name: "Lisa Anderson", role: "Agent", avatar: "LA", experience: "6 years" },
  ],
  "4": [
    { id: "10", name: "Thomas White", role: "Founder & CEO", avatar: "TW", experience: "20 years" },
    { id: "11", name: "Nicole Harris", role: "Senior Agent", avatar: "NH", experience: "11 years" },
  ],
  "5": [
    { id: "12", name: "Christopher Lee", role: "Managing Partner", avatar: "CL", experience: "14 years" },
    { id: "13", name: "Rachel Green", role: "Lead Agent", avatar: "RG", experience: "7 years" },
    { id: "14", name: "Daniel Taylor", role: "Agent", avatar: "DT", experience: "4 years" },
  ],
  "6": [
    { id: "15", name: "Mark Williams", role: "Director", avatar: "MW", experience: "18 years" },
    { id: "16", name: "Stephanie Moore", role: "Senior Agent", avatar: "SM", experience: "9 years" },
    { id: "17", name: "Brian Jackson", role: "Agent", avatar: "BJ", experience: "5 years" },
  ],
}

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const agency = agencies.find((a) => a.id === id)
  
  if (!agency) {
    return { title: "Agency Not Found" }
  }

  return {
    title: `${agency.name} - SAS IMO`,
    description: agency.description,
  }
}

export default async function AgencyDetailsPage({ params }: Props) {
  const { id } = await params
  const agency = agencies.find((a) => a.id === id)

  if (!agency) {
    notFound()
  }

  // Get agency properties (mock: assign some properties to each agency)
  const agencyProperties = properties.slice(0, Math.min(6, properties.length))
  const agents = agentsByAgency[id] || []

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        {/* Cover Image / Hero */}
        <div className="relative h-[300px] md:h-[400px] bg-muted">
          <Image
            src={agency.image || "/placeholder.svg"}
            alt={agency.name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          
          {/* Agency Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-card shadow-lg border">
                    <Building2 className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white text-balance">
                      {agency.name}
                    </h1>
                    <div className="flex items-center gap-2 mt-1 text-white/80">
                      <MapPin className="h-4 w-4" />
                      <span>{agency.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button size="lg" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Contact Agency
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="#properties">
                      View Properties
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle>About {agency.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {agency.description}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    With a commitment to excellence and a deep understanding of the local market, 
                    our team of experienced professionals is dedicated to helping you find the perfect 
                    property that meets your unique needs and lifestyle preferences.
                  </p>
                  
                  {/* Specialties */}
                  <div className="pt-4">
                    <h4 className="text-sm font-medium mb-3">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {agency.specialties.map((specialty) => (
                        <Badge key={specialty} variant="secondary" className="rounded-full">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{agency.propertiesCount}</div>
                      <div className="text-sm text-muted-foreground">Properties</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-2xl font-bold text-primary">
                        {agency.rating}
                        <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      </div>
                      <div className="text-sm text-muted-foreground">Rating</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{agents.length}</div>
                      <div className="text-sm text-muted-foreground">Agents</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Agents Section */}
              {agents.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Our Team
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {agents.map((agent) => (
                        <div
                          key={agent.id}
                          className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30"
                        >
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                            {agent.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground">{agent.name}</h4>
                            <p className="text-sm text-muted-foreground">{agent.role}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {agent.experience} experience
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="bg-transparent">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Properties Section */}
              <section id="properties">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Active Listings</h2>
                  <Button variant="outline" asChild className="bg-transparent">
                    <Link href={`/buy?agency=${agency.id}`}>
                      View All Properties
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {agencyProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Card */}
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">
                        123 Business Avenue<br />
                        {agency.location}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">
                        contact@{agency.name.toLowerCase().replace(/\s+/g, '')}.com
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Website</p>
                      <p className="text-sm text-muted-foreground">
                        www.{agency.name.toLowerCase().replace(/\s+/g, '')}.com
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Business Hours</p>
                      <p className="text-sm text-muted-foreground">
                        Mon - Fri: 9:00 AM - 6:00 PM<br />
                        Sat: 10:00 AM - 4:00 PM<br />
                        Sun: Closed
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button className="w-full" size="lg">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" size="lg">
                      <Phone className="mr-2 h-4 w-4" />
                      Request Call Back
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Indicators */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm">Verified Agency</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm">Licensed & Insured</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm">Background Checked Agents</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm">Secure Transactions</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
