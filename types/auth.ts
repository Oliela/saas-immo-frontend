// ─── Profil utilisateur ───────────────────────────────────────────────────────

export interface UserProfile {
  id: number
  user_id: number
  first_name: string
  last_name: string
  address: string | null
}

// ─── Utilisateur authentifié ──────────────────────────────────────────────────

export interface AuthUser {
  id: number
  nom: string
  prenom: string
  email: string
  phone: string
  account_type: "agency_user" | "client" | string
  is_active: number
  email_verified_at: string | null
  created_at: string
  updated_at: string
  profile: UserProfile
}

// ─── Spécialisation agence ────────────────────────────────────────────────────

export interface AgencySpecialization {
  id: number
  name: string
}

// ─── Agence ───────────────────────────────────────────────────────────────────

export interface Agency {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  web_site: string | null
  logo: string | null
  description: string | null
  licence_number: string
  information_certified: number
  terms_accepted: number
  is_active: number
  created_at: string
  updated_at: string
  specializations: AgencySpecialization[]
  users: AuthUser[]
}

// ─── Réponse du hook useAuthAgent ─────────────────────────────────────────────

export interface AuthAgentData {
  user: AuthUser
  role: "admin_agence" | "agent" | string
  agency: Agency
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Nom complet de l'utilisateur : "Dupont jean" */
export const userFullName = (user: AuthUser): string =>
  `${user.prenom} ${user.nom}`

/** Initiales de l'utilisateur : "DJ" */
export const userInitials = (user: AuthUser): string =>
  `${user.prenom[0] ?? ""}${user.nom[0] ?? ""}`.toUpperCase()