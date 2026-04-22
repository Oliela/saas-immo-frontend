import type { Metadata } from "next"
import { properties } from "@/lib/mock-data"

import ListingBuyPage from "@/components/buy/page"

export const metadata: Metadata = {
  title: "Buy Properties | SAS IMO",
  description: "Browse properties for sale. Find your dream home from our extensive listings of apartments, houses, villas, and more.",
}

export default function BuyPage() {

  const buyProperties = properties.filter((p) => p.listingType === "sale")

  return (
   <ListingBuyPage />
  )
}
