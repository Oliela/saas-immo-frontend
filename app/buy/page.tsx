import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertiesListing } from "@/components/properties-listing"
import { properties } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Buy Properties | SAS IMO",
  description: "Browse properties for sale. Find your dream home from our extensive listings of apartments, houses, villas, and more.",
}

export default function BuyPage() {
  const buyProperties = properties.filter((p) => p.listingType === "buy")

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <PropertiesListing
          properties={buyProperties}
          title="Properties for Sale"
          description="Discover your perfect property from our curated selection of homes for sale"
        />
      </main>
      <Footer />
    </div>
  )
}
