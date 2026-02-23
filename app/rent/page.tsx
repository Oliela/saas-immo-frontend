import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertiesListing } from "@/components/properties-listing"
import { properties } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Rent Properties | SAS IMO",
  description: "Find your perfect rental property. Browse apartments, studios, houses and more available for rent.",
}

export default function RentPage() {
  const rentProperties = properties.filter((p) => p.listingType === "rent")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <PropertiesListing
          properties={rentProperties}
          title="Properties for Rent"
          description="Find the perfect rental that fits your lifestyle and budget"
        />
      </main>
      <Footer />
    </div>
  )
}
