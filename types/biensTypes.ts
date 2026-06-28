// types/biensTypes.ts
//============================================================
// Types pour l'API des biens immobiliers
// ============================================================

export type PropertyType = "appartement" | "villa" | "bureau" | "terrain" | "maison";

export type ListingType = "rent" | "sale";

export type PropertyStatus = "available" | "rented" | "sold" | "unavailable";

export type AccountType = "savings" | "checking";

export type TaxIdType = "NIF" | "NINEA" | "CIN";

export type OwnerStatus = "actif" | "inactif";

// ------------------------------------------------------------
// Propriétaire (Owner)
// ------------------------------------------------------------
export interface Owner {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string | null;
  country: string;

  // Informations bancaires
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  routingNumber: string;
  accountType: AccountType;

  // Informations fiscales
  taxIdType: TaxIdType;
  taxId: string;

  status: OwnerStatus;
  agency_id: number;
  created_at: string; // ISO 8601
  updated_at: string; // ISO 8601
}

// ------------------------------------------------------------
// Feature (Équipement / Caractéristique)
// ------------------------------------------------------------
export interface Feature {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
  pivot: {
    bien_id: number;
    feature_id: number;
  };
}

// ------------------------------------------------------------
// Image
// ------------------------------------------------------------
export interface BienImage {
  id: number;
  url: string;       // Chemin relatif, ex: /storage/biens/7/images/...
  alt: string | null;
  bien_id: number;
  created_at: string;
  updated_at: string;
}

// ------------------------------------------------------------
// Vidéo
// ------------------------------------------------------------
export interface BienVideo {
  id: number;
  url: string;       // Chemin relatif, ex: /storage/biens/7/videos/...
  title: string | null;
  bien_id: number;
  created_at: string;
  updated_at: string;
}

// ------------------------------------------------------------
// Bien immobilier (Property)
// ------------------------------------------------------------
export interface Bien {
  id: number;
  title: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: string;          // Décimal sérialisé en string par Laravel
  status: PropertyStatus;
  marketplace: boolean;

  // Localisation
  city: string;
  neighborhood: string;
  address: string;
  zipCode: string | null;
  country: string;

  // Caractéristiques physiques
  surface: string;        // En m², décimal sérialisé en string
  rooms: number;
  bathrooms: number;
  floor: number;
  furnished: 0 | 1;      // 1 = meublé, 0 = non meublé

  description: string;

  // Relations
  owners_id: number;
  agency_id: number;
  owner: Owner;
  features: Feature[];
  images: BienImage[];
  videos: BienVideo[];

  created_at: string;
  updated_at: string;
}

// ------------------------------------------------------------
// Réponse API — liste de biens
// ------------------------------------------------------------
export type BiensListResponse = Bien[];

// ------------------------------------------------------------
// Réponse API — bien unique
// ------------------------------------------------------------
export type BienDetailResponse = Bien;

// ------------------------------------------------------------
// Helpers utilitaires
// ------------------------------------------------------------

/** Retourne le prix sous forme de nombre */
export const parseBienPrice = (bien: Bien): number => parseFloat(bien.price);

/** Retourne la surface sous forme de nombre (m²) */
export const parseBienSurface = (bien: Bien): number => parseFloat(bien.surface);

/** Indique si le bien est meublé */
export const isFurnished = (bien: Bien): boolean => bien.furnished === 1;