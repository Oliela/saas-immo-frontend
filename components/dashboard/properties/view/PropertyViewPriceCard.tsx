import { Card, CardContent } from "@/components/ui/card"

export default function PropertyViewPriceCard({ property }: any) {
  const formatPrice = (price: number, listingType: string) => {
    const formatted = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price)

    return listingType === "rent" ? `${formatted}/mois` : formatted
  }

  return (
    <Card>
      <CardContent className="p-6 text-center">
        <p className="text-sm text-muted-foreground mb-1">
          {property.listingType === "rent" ? "Loyer mensuel" : "Prix de vente"}
        </p>
        <p className="text font-bold">
          {formatPrice(property.price, property.listingType)}
        </p>
      </CardContent>
    </Card>
  )
}