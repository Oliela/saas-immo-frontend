import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, Building } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { Agency } from "@/lib/mock-data"

interface AgencyCardProps {
  agency: Agency
}

export function AgencyCard({ agency }: AgencyCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={agency.image || "/placeholder.svg"}
          alt={agency.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-5">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{agency.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="text-sm">{agency.location}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {agency.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-accent">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium">{agency.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Building className="h-4 w-4" />
              <span>{agency.propertiesCount} properties</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {agency.specialties.slice(0, 3).map((specialty) => (
              <Badge key={specialty} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0 gap-2">
        <Button asChild className="flex-1">
          <Link href={`/agencies/${agency.id}`}>View Agency</Link>
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          Contact
        </Button>
      </CardFooter>
    </Card>
  )
}
