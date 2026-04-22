export type InteretStatus = "pending" | "confirmed" | "rejected";

export interface InteretBienImage {
  id: number;
  url: string;
  alt: string | null;
  bien_id: number;
  created_at: string;
  updated_at: string;
}

export interface InteretBien {
  id: number;
  title: string;
  propertyType: string;
  listingType: "rent" | "sale";
  price: string;
  status: string;
  city: string;
  neighborhood: string;
  address: string;
  zipCode: string | null;
  country: string;
  surface: string;
  rooms: number;
  bathrooms: number;
  floor: number;
  furnished: number;
  description: string;
  owners_id: number;
  agency_id: number;
  created_at: string;
  updated_at: string;
  images: InteretBienImage[];
}

export interface InteretClientUser {
  id: number;
  nom: string;
  prenom: string;
  phone: string;
  email: string;
  email_verified_at: string | null;
  account_type: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface InteretClient {
  id: number;
  user_id: number;
  nom: string;
  prenom: string;
  phone: string;
  address: string;
  city: string | null;
  country: string | null;
  occupation: string;
  employer: string;
  type_employment: string;
  monthly_income: string;
  property_type: string;
  monthly_budget: string;
  nb_pieces: number;
  move_in_date: string;
  note: string;
  id_document: string;
  income_proof: string;
  bank_statement: string;
  recommendation_letter: string;
  work_contract: string | null;
  rental_history: string | null;
  other: string | null;
  birth_date: string;
  created_at: string;
  updated_at: string;
  user: InteretClientUser;
}

export interface Interet {
  id: number;
  client_id: number;
  bien_id: number;
  status: InteretStatus;
  message: string | null;
  agent_response: string | null;
  responded_at: string | null;
  created_at: string;
  updated_at: string;
  bien: InteretBien;
  client: InteretClient;
}

export interface InteretsStats {
  total: number;
  confirmed: number;
  pending: number;
  rejected: number;
}

export interface InteretsResponse {
  stats: InteretsStats;
  interets: Interet[];
}
