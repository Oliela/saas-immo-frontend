export interface BienImage {
  id: number
  url: string
  alt: string | null
  bien_id: number
  created_at: string
  updated_at: string
}

export interface Bien {
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
  images: BienImage[]
}

export interface Contract {
  id: number
  contract_number: string
  client_id: number
  bien_id: number
  agency_id: number
  type: "rental" | "sale"
  status: "draft" | "sent" | "signed" | "revision" | "expired" | "cancelled" | "approved"
  city: string
  start_date: string
  duration: number
  cautionMonths: number
  amount: string
  deposit: string
  commission: string
  payment_frequency: "monthly" | "quarterly" | "yearly"
  sent_at: string | null
  signed_at: string | null
  expired_at: string | null
  created_at: string
  updated_at: string
  bien: Bien
}

export interface ContractsStats {
  total: number
  signed: number
  pending: number
  revision: number
  value?: string
}