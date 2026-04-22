import type { Metadata } from "next"
import { properties } from "@/lib/mock-data"
import ListingRentPage from "@/components/rent/page"

export const metadata: Metadata = {
  title: "Louer des biens | SAS IMO",
  description: "Trouvez la propriété de location parfaite. Parcourez les appartements, studios, maisons et plus disponibles à la location.",
}

export default function RentPage() {
  const rentProperties = properties.filter((p) => p.listingType === "rent")

  return (
   <ListingRentPage/>
  )
}
