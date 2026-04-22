// types/creneau.ts

export interface CreneauBien {
  id: number
  title: string
  propertyType: string
  listingType: "sale" | "rent"
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
  furnished: 0 | 1
  description: string
  owners_id: number
  agency_id: number
  created_at: string
  updated_at: string
}

export interface CreneauAgency {
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
  terms_accepted: 0 | 1
  information_certified: 0 | 1
  is_active: 0 | 1
  created_at: string
  updated_at: string
}

export interface CreneauAgent {
  id: number
  nom: string
  prenom: string
  phone: string
  email: string
  email_verified_at: string | null
  account_type: "agency_user" | "super_admin" | "client"
  is_active: 0 | 1
  created_at: string
  updated_at: string
}

export interface ReservationClientUser {
  id: number
  nom: string
  prenom: string
  phone: string
  email: string
  email_verified_at: string | null
  account_type: string
  is_active: 0 | 1
  created_at: string
  updated_at: string
}

export interface ReservationClient {
  id: number
  user_id: number
  nom: string
  prenom: string
  phone: string
  address: string
  city: string | null
  country: string | null
  occupation: string
  employer: string
  type_employment: string
  monthly_income: string
  property_type: string
  monthly_budget: string
  nb_pieces: number
  move_in_date: string
  note: string
  id_document: string
  income_proof: string
  bank_statement: string
  recommendation_letter: string
  work_contract: string | null
  rental_history: string | null
  other: string | null
  birth_date: string
  created_at: string
  updated_at: string
  user: ReservationClientUser
}

export interface Reservation {
  id: number
  visit_schedule_id: number
  client_id: number
  status: "confirmed" | "pending" | "cancelled"
  created_at: string
  updated_at: string
  client: ReservationClient
}
export interface Client {
  id: number
  prenom: string
  phone: string

}

export interface Creneau {
  id: number
  agency_id: number
  bien_id: number | null
  agent_id: number | null
  visit_date: string          // "YYYY-MM-DD"
  start_time: string          // "HH:MM:SS"
  end_time: string            // "HH:MM:SS"
  status: "available" | "reserved" | "cancelled" | "unavailable"
  created_at: string
  updated_at: string

  // Relations
  client: Client | null
  bien: CreneauBien | null
  agency: CreneauAgency | null
  agent: CreneauAgent | null
  reservations: Reservation[]
}

// ─── Helper : nom complet de l'agent ─────────────────────────────────────────
export const agentFullName = (agent: CreneauAgent) =>
  `${agent.prenom} ${agent.nom}`

// ─── Helper : formater l'heure "10:00:00" → "10:00" ─────────────────────────
export const formatTime = (time: string) => time.slice(0, 5)