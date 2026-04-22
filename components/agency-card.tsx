import Link from "next/link"
import { MapPin, Star, Building, BadgeCheck, Building2, Home } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import type { AgencyServer } from "@/components/agencies/page"

interface AgencyCardProps {
  agency: AgencyServer
}

export function AgencyCard({ agency }: AgencyCardProps) {
  const initials = agency.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Logo / placeholder */}
      <div className="relative aspect-[16/9] overflow-hidden bg-muted flex items-center justify-center">
        {agency.logo ? (
          <img
            src={agency.logo}
            alt={agency.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Building2 className="h-16 w-16 text-muted-foreground/30" />
        )}
        {agency.information_certified === 1 && (
          <div className="absolute top-3 right-3">
            <Badge className="gap-1 bg-green-600 text-white text-xs">
              <BadgeCheck className="h-3 w-3" />
              Certifiée
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{agency.name}</h3>
            <div className="flex items-center gap-1 mt-1 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="text-sm">{agency.address}, {agency.city}</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {agency.description}
          </p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-accent">
              <Star className="h-4 w-4 fill-current" />
              {/* <span className="font-medium">{agency.rating || 0}</span> */}
              <span className="font-medium">0.0</span>

            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Building className="h-4 w-4" />
               <span>{agency.biens?.length ?? 0} bien{(agency.biens?.length ?? 0) > 1 ? "s" : ""}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {agency.specializations.slice(0, 3).map((s) => (
              <Badge key={s.id} variant="secondary" className="text-xs">
                {s.name}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 gap-2">
        <Button asChild className="flex-1">
          <Link href={`/agencies/${agency.id}`}>Voir l'agence</Link>
        </Button>
        <Button variant="outline" asChild className="flex-1 bg-transparent">
          <a href={`mailto:${agency.email}`}>Contacter</a>
        </Button>
      </CardFooter>
    </Card>
  )
}