export interface BienFeature {
  id: number
  name: string
  icon: string
  created_at: string
  updated_at: string
  pivot: {
    bien_id: number
    feature_id: number
  }
}

export interface BienImage {
  id: number
  url: string
  alt: string | null
  bien_id: number
  created_at: string
  updated_at: string
}

export interface BienVideo {
  id: number
  url: string
  title: string | null
  bien_id: number
  created_at: string
  updated_at: string
}

export interface BienOwner {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  country: string | null
  bankName: string | null
  accountHolder: string | null
  accountNumber: string | null
  routingNumber: string | null
  accountType: string | null
  taxIdType: string | null
  taxId: string | null
  status: "actif" | "inactif"
  agency_id: number
  created_at: string
  updated_at: string
}

export interface BienAgence {
  id: number
  name: string
  logo: string | null
  email: string
  phone: string
  city: string | null
  address: string | null
  description: string | null
  web_site: string | null
  licence_number: string | null
  terms_accepted: 0 | 1
  information_certified: 0 | 1
  is_active: 0 | 1
  created_at: string
  updated_at: string
  laravel_through_key: number
}

export type BienListingType = "sale" | "rent"
export type BienStatus = "available" | "sold" | "rented" | "pending"

export interface BienDetail {
  id: number
  title: string
  propertyType: string
  listingType: BienListingType
  price: string
  status: BienStatus
  city: string
  neighborhood: string | null
  address: string | null
  zipCode: string | null
  country: string | null
  surface: string
  rooms: number
  bathrooms: number
  floor: number | null
  furnished: 0 | 1
  description: string | null
  owners_id: number
  agency_id: number
  created_at: string
  updated_at: string
  owner: BienOwner
  features: BienFeature[]
  images: BienImage[]
  videos: BienVideo[]
  agence: BienAgence
}

export interface BienDetailResponse {
  data: BienDetail
}