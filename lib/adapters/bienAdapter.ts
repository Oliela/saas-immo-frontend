import type { Bien } from "@/types/biensTypes"
import type { Property } from "@/components/property-card"

const propertyTypeMap: Record<string, Property["type"]> = {
  appartement: "apartment",
  villa: "villa",
  bureau: "commercial",
  terrain: "commercial",
  maison: "house",
  studio: "studio",
  duplex: "apartment",
  commerce: "commercial",
  entrepot: "commercial",
  immeuble: "commercial",
}

export function bienToProperty(bien: Bien): Property {
  return {
    id: String(bien.id),
    title: bien.title,
    price: parseFloat(bien.price),
    location: `${bien.neighborhood}, ${bien.city}`,
    neighborhood: bien.neighborhood,
    features: bien.features.map((f) => f.name),
    type: propertyTypeMap[bien.propertyType?.toLowerCase()] ?? "apartment",
    listingType: bien.listingType as "sale" | "rent",
    bedrooms: bien.rooms,
    bathrooms: bien.bathrooms,
    area: parseFloat(bien.surface),
    image: bien.images[0]?.url ?? "",
    status: bien.status as Property["status"],
  }
}

export function biensToProperties(biens: Bien[]): Property[] {
  return biens.map(bienToProperty)
}