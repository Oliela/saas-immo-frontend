import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bath, BedDouble, CheckCircle, Layers, MapPin, Maximize, Sofa } from "lucide-react"
import { Separator } from "@/components/ui/separator"


interface Feature {
  id: string | number
  name: string
}

interface Property {
  surface: number
  rooms: number
  bathrooms: number
  floor: number | string
  furnished: boolean
  description?: string
  address?: string
  city?: string
  neighborhood?: string
  features: Feature[]
}

interface PropertyViewTabsProps {
  property: Property
}


export default function PropertyViewTabs({ property }: PropertyViewTabsProps) {


  return (
    <Tabs defaultValue="details">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="details">Détails</TabsTrigger>
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="location">Localisation</TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Détails du bien</CardTitle>
            <CardDescription>Spécifications et caractéristiques</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 mb-6">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-primary/10">
                  <Maximize className="h-5 w-5 text-primary" />
                </div>
                <div >
                  <p className="text-sm text-muted-foreground">Surface</p>
                  <p className="font-semibold text-foreground">{property.surface} m²</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-primary/10">
                  <BedDouble className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pièces</p>
                  <p className="font-semibold text-foreground">{property.rooms} pièces</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-primary/10">
                  <Bath className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Salles de bain</p>
                  <p className="font-semibold text-foreground">{property.bathrooms} salles de bain</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <div className="p-2 rounded-full bg-primary/10">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Étage</p>
                  <p className="font-semibold text-foreground">Étage {property.floor}</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="p-2 rounded-full bg-primary/10">
                <Sofa className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Meublé</p>
                <p className="font-semibold text-foreground">{property.furnished ? "Oui, entièrement meublé" : "Non, non meublé"}</p>
              </div>
            </div>


          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Features & Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {property.features.map((feature) => (
                <div key={feature.id} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent" />
                  <span className="text-sm text-foreground">
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="description" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="location" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Localisation</CardTitle>
            <CardDescription>{property.address}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Ville</p>
                <p className="text-medium text-foreground">{property.city}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Quartier</p>
                <p className="text-medium text-foreground">{property.neighborhood}</p>
              </div>
            </div>
            {/* <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">Aperçu de la carte</p>
              </div>
            </div> */}
            <div className="aspect-video rounded-lg overflow-hidden bg-muted">
              {property.address ? (
                <iframe
                  width="100%"
                  height="100%"
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    `${property.neighborhood}, ${property.city}`
                  )}&output=embed`}
                  className="border-0"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Adresse non disponible</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}