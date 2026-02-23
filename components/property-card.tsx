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
  type: "apartment" | "house" | "villa" | "studio" | "commercial"
  listingType: "buy" | "rent"
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  featured?: boolean
}

interface PropertyCardProps {
  property: Property
}

export function PropertyCard({ property }: PropertyCardProps) {
  const formatPrice = (price: number, listingType: "buy" | "rent") => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
    return listingType === "rent" ? `${formatted}/mo` : formatted
  }

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.image || "/placeholder.svg"}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant={property.listingType === "rent" ? "secondary" : "default"}>
            {property.listingType === "rent" ? "For Rent" : "For Sale"}
          </Badge>
          {property.featured && (
            <Badge className="bg-accent text-accent-foreground">Featured</Badge>
          )}
        </div>
      </div>
      <CardContent className="p-4">
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
              <span>{property.bedrooms} beds</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{property.bathrooms} baths</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{property.area} sqft</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2">
        <Button asChild className="flex-1">
          <Link href={`/property/${property.id}`}>View Property</Link>
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          Show Interest
        </Button>
      </CardFooter>
    </Card>
  )
}
