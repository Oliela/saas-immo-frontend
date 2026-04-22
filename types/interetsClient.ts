export type InteretStatus = "pending" | "confirmed" | "rejected"

export interface InteretBienImage {
  id: number
  url: string
  alt: string | null
  bien_id: number
  created_at: string
  updated_at: string
}

export interface InteretBienAgence {
  id: number
  name: string
  logo: string | null
  email: string
  phone: string
  city: string
  address: string
  description: string
  web_site: string
  licence_number: string
  terms_accepted: number
  information_certified: number
  is_active: number
  created_at: string
  updated_at: string
  laravel_through_key: number
}

export interface InteretBien {
  id: number
  title: string
  propertyType: string
  listingType: "rent" | "sale"
  price: string
  status: string
  city: string
  neighborhood: string
  address: string
  zipCode: string | null
  country: string
  surface: string
  rooms: number
  bathrooms: number
  floor: number
  furnished: number
  description: string
  owners_id: number
  agency_id: number
  created_at: string
  updated_at: string
  images: InteretBienImage[]
  agence: InteretBienAgence
}

export interface Interet {
  id: number
  client_id: number
  bien_id: number
  status: InteretStatus
  message: string | null
  agent_response: string | null      // ← ajouter
  responded_at: string | null        // ← ajouter
  client_confirmed: boolean | null   // ← ajouter
  created_at: string
  updated_at: string
  bien: InteretBien
}

export interface InteretsStats {
  total: number
  confirmed: number
  pending: number
  rejected: number
}

export interface InteretsResponse {
  stats: InteretsStats
  interets: Interet[]
}