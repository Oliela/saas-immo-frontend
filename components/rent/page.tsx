
"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertiesListing } from "@/components/properties-listing"
import { biensToProperties } from "@/lib/adapters/bienAdapter"
import { useMemo } from "react"
import { useBiens } from "@/hooks/useBiens"
import { useFeatures } from "@/hooks/useFeatures"




export default function ListingRentPage() {
  const { data, loading, error } = useBiens()
  const { data: features, loading: featuresLoading } = useFeatures()


  // Convertit les biens API → format Property attendu par PropertiesListing
  // puis filtre uniquement les biens à la location
  const rentProperties = useMemo(
    () => biensToProperties(data).filter((p) => p.listingType === "rent"),
    [data]
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Chargement des biens...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }
  console.log("Rent Properties:", rentProperties)


  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <PropertiesListing
          properties={rentProperties}
          features={features}
          title="Biens en location"
          description="Trouvez la location parfaite qui correspond à votre style de vie et à votre budget"
        />
      </main>
      <Footer />
    </div>
  )
}
