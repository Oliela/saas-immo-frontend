"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertiesListing } from "@/components/properties-listing"
import { useBiens } from "@/hooks/useBiens"
import { useFeatures } from "@/hooks/useFeatures"
import { biensToProperties } from "@/lib/adapters/bienAdapter"
import { useMemo } from "react"

export default function ListingBuyPage() {
  const { data, loading, error } = useBiens()
  const { data: features, loading: featuresLoading } = useFeatures()

  const buyProperties = useMemo(
    () => (error || !data ? [] : biensToProperties(data).filter((p) => p.listingType === "sale")),
    [data, error]
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background">
        <PropertiesListing
          properties={buyProperties}
          features={features}
          title="Biens à vendre"
          description="Découvrez notre sélection de biens immobiliers disponibles à l'achat"
          isLoading={loading || featuresLoading}
        />
      </main>
      <Footer />
    </div>
  )
}