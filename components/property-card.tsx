import Image from "next/image"
import Link from "next/link"
import { MapPin, Bed, Bath, Square } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export interface Property {
  id: string
  title: string
  price: number
  location: string
  neighborhood: string
  features: string[]
  type: "apartment" | "house" | "villa" | "studio" | "commercial"
  listingType: "sale" | "rent"
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  featured?: boolean
  status?: "available" | "pending" | "sold"
}

interface PropertyCardProps {
  property: Property
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

export function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, listingType: "sale" | "rent") => {
    const formatted = new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(price)
    return listingType === "rent" ? `${formatted}/mois` : formatted
  }

  const getStatusText = (status?: string, listingType?: "sale" | "rent") => {
    switch (status) {
      case "available":
        return "Disponible"
      case "pending":
        return "En négociation"
      case "sold":
        return listingType === "rent" ? "Loué" : "Vendu"
      default:
        return null
    }
  }

  const getStatusStyle = (status?: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-500/10 text-emerald-700 border-emerald-200"
      case "pending":
        return "bg-amber-500/10 text-amber-700 border-amber-200"
      case "sold":
        return "bg-red-500/10 text-red-700 border-red-200"
      default:
        return "bg-muted text-muted-foreground border-border"
    }
  }

  const imageUrl = property.image
    ? `${API_BASE_URL}${property.image}`
    : "/placeholder.svg"

  const statusText = getStatusText(property.status, property.listingType)

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          {property.status === "available" || !property.status ? (
            <Badge variant={property.listingType === "rent" ? "secondary" : "default"}>
              {property.listingType === "rent" ? "À louer" : "À vendre"}
            </Badge>
          ) : (
            <Badge className={`border-0 ${
              property.status === "pending"
                ? "bg-amber-500/90 text-white"
                : property.status === "sold"
                  ? "bg-red-500/90 text-white"
                  : ""
            }`}>
              {getStatusText(property.status, property.listingType)}
            </Badge>
          )}
          {property.featured && (
            <Badge className="bg-accent text-accent-foreground">En vedette</Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 flex-1">
        <div className="space-y-3">
          <div>
            <p className="text-xl font-bold text-foreground">
              {formatPrice(property.price, property.listingType)}
            </p>
            <h3 className="mt-1 text-base font-medium text-foreground line-clamp-1">
              {property.title}
            </h3>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="text-sm line-clamp-1">{property.location}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{property.bedrooms} ch.</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} sdb.</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.area} m²</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        {property.status === "available" && (
          <div className={`w-full text-center rounded-md border px-3 py-1.5 text-xs font-medium ${getStatusStyle(property.status)}`}>
            Disponible
          </div>
        )}
        <Button asChild className="w-full">
          <Link href={`/property/${property.id}`}>Voir le bien</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}