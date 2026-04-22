import { Badge } from "@/components/ui/badge";
import { Building2, Check, Clock, Home, Landmark, Store } from "lucide-react";



interface PropertyBadgesProps {
  property: {
    listingType: "sale" | "rent"
    status: "available" | "sold" | "rented"
    featured?: boolean
  }
}
const propertyTypeIcons: Record<string, typeof Building2> = {
  apartment: Building2,
  house: Home,
  land: Landmark,
  commercial: Store,
}

const statusColors: Record<string, string> = {
  available: "bg-green-500/10 text-green-600 border-green-200",
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-200",
  reserved: "bg-blue-500/10 text-blue-600 border-blue-200",
  sold: "bg-gray-500/10 text-gray-600 border-gray-200",
}

const statusLabels: Record<string, string> = {
  available: "Disponible",
  pending: "En négociation",
  reserved: "Réservé",
  sold: "Vendu",
}



export default function PropertyViewBadget({ property }: any) {

  const PropertyIcon = propertyTypeIcons[property.propertyType] || Building2

  return (
    <div className="flex flex-wrap gap-2">
      {/* Type de transaction */}
      <Badge variant="outline" className={statusColors[property.status]}>
        {property.status === "available" && <Check className="mr-1 h-3 w-3" />}
        {property.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
        {statusLabels[property.status] || property.status}
      </Badge>
      <Badge variant={property.listingType === "rent" ? "secondary" : "default"}>
        {property.listingType === "rent" ? "À louer" : "À vendre"}
      </Badge>
      <Badge variant="outline" className="capitalize">
        <PropertyIcon className="mr-1 h-3 w-3" />
        {property.propertyType}
      </Badge>
    </div>
  )
}