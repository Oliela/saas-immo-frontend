export type AccountType = "client" | "agency_user" | "agent" | "super_admin";

export type AccountStatus =
  | "active"
  | "pending"
  | "rejected"
  | "suspended"
  | "agency_not_found"
  | "subscription_required"
  | "subscription_not_started"
  | "subscription_expired"
  | "unknown";

export type AgencyApprovalStatus = "pending" | "approved" | "rejected";

// ─── Profil utilisateur ───────────────────────────────────────────────────────

export interface UserProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  address: string | null;
}

// ─── Utilisateur authentifié ──────────────────────────────────────────────────

export interface AuthUser {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  account_type: AccountType;
  is_active?: boolean | 0 | 1;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  login_count?: number;
  profile?: UserProfile | null;
}

// ─── Spécialisation agence ────────────────────────────────────────────────────

export interface AgencySpecialization {
  id: number;
  name: string;
}

export interface AgencyAccountSummary {
  id: number;
  name: string;
  email: string;
  approval_status: AgencyApprovalStatus;
  is_active: boolean;
  rejection_reason: string | null;
  reviewed_at: string | null;
  timezone?: string | null;
}

// ─── Agence ───────────────────────────────────────────────────────────────────

export interface Agency {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  timezone: string | null;
  web_site: string | null;
  logo: string | null;
  description: string | null;
  licence_number: string | null;
  information_certified: boolean | 0 | 1;
  terms_accepted: boolean | 0 | 1;
  is_active: boolean;
  approval_status: AgencyApprovalStatus;
  rejection_reason: string | null;
  reviewed_at: string | null;
  reviewed_by: number | null;
  created_at: string;
  updated_at: string;
  specializations: AgencySpecialization[];
  users: AuthUser[];
}

// ─── Réponse du hook useAuthAgent ─────────────────────────────────────────────

export interface AuthAgentData {
  user: AuthUser;
  roles: string[];
  agency: Agency | null;
  account_status: AccountStatus;
  redirect: string;
}

export interface CurrentUserResponse extends AuthUser {
  agency: AgencyAccountSummary | null;
  account_status: AccountStatus;
  redirect: string;
}

export interface AuthenticatedUserResponse {
  user: AuthUser;
  agency: AgencyAccountSummary | null;
  account_status: AccountStatus;
  redirect: string;
}

export interface LoginResponse {
  user: AuthUser;
  agency: AgencyAccountSummary | null;
  account_status: AccountStatus;
  redirect: string;
  message: string;
  login_count: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Nom complet de l'utilisateur : "Dupont jean" */
export const userFullName = (user: AuthUser): string =>
  `${user.prenom} ${user.nom}`;

/** Initiales de l'utilisateur : "DJ" */
export const userInitials = (user: AuthUser): string =>
  `${user.prenom[0] ?? ""}${user.nom[0] ?? ""}`.toUpperCase();
