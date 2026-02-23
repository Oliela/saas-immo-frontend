import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building, Users, Shield, TrendingUp } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { PropertyCard } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { properties } from "@/lib/mock-data"

const stats = [
  { label: "Properties Listed", value: "12,000+" },
  { label: "Happy Clients", value: "8,500+" },
  { label: "Partner Agencies", value: "450+" },
  { label: "Cities Covered", value: "120+" },
]

const features = [
  {
    icon: Building,
    title: "Extensive Property Listings",
    description: "Browse thousands of verified properties from trusted agencies across the country.",
  },
  {
    icon: Shield,
    title: "Trusted & Verified",
    description: "All properties and agencies are thoroughly verified for your peace of mind.",
  },
  {
    icon: Users,
    title: "Expert Agents",
    description: "Connect with experienced real estate professionals who understand your needs.",
  },
  {
    icon: TrendingUp,
    title: "Market Insights",
    description: "Get access to real-time market data and property valuations.",
  },
]

export default function HomePage() {
  const featuredProperties = properties.filter((p) => p.featured).slice(0, 3)
  const recentProperties = properties.slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-bg.jpg"
              alt="Modern home exterior"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-primary/70" />
          </div>
          
          <div className="relative z-10 w-full px-4 py-16 lg:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-2xl mb-10">
                <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl text-balance">
                  Find Your Perfect Place to Call Home
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-primary-foreground/90">
                  Discover exceptional properties for sale and rent. Connect with trusted agencies and find the home that fits your lifestyle.
                </p>
              </div>
              
              <SearchBar variant="hero" />
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/buy">
                    Browse Properties for Sale
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                  <Link href="/rent">
                    Find Rentals
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-card border-y border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Featured Properties</h2>
                <p className="mt-2 text-muted-foreground">Handpicked premium listings for you</p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex bg-transparent">
                <Link href="/buy">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            
            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild>
                <Link href="/buy">
                  View All Properties
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-muted">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Why Choose SAS IMO</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                We make finding your perfect property simple, transparent, and stress-free
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Listings */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Recent Listings</h2>
                <p className="mt-2 text-muted-foreground">Fresh properties just added to our platform</p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex bg-transparent">
                <Link href="/buy">
                  Explore More
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl text-balance">
              Ready to Find Your Dream Home?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Join thousands of happy homeowners who found their perfect property through SAS IMO.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                <Link href="/agencies">
                  Browse Agencies
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
