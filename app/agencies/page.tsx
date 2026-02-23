import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AgencyCard } from "@/components/agency-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { agencies } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Real Estate Agencies | SAS IMO",
  description: "Find trusted real estate agencies near you. Browse our network of verified professionals ready to help you find your perfect property.",
}

export default function AgenciesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        {/* Page Header */}
        <section className="bg-muted py-12 lg:py-16 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold text-foreground lg:text-4xl">
                Partner Agencies
              </h1>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Connect with trusted real estate professionals. Our partner agencies are verified and committed to helping you find your perfect property.
              </p>
            </div>
            
            <div className="mt-8 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search agencies by name or location..."
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Agencies Grid */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">{agencies.length}</span> agencies found
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {agencies.map((agency) => (
                <AgencyCard key={agency.id} agency={agency} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 lg:py-16 bg-muted border-t border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Are You a Real Estate Agency?</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Join our network of trusted professionals and reach thousands of potential clients looking for their perfect property.
            </p>
            <a
              href="/register"
              className="inline-flex items-center justify-center mt-6 px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              Partner With Us
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
