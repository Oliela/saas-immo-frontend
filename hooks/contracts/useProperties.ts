// ─── hook/contracts/useProperties ─────────────

"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import type { Property } from "@/types/contractNew";
import type { ContractType } from "@/types/contractNew";

interface ApiInterestClient {
  id: number;
  nom: string;
  prenom: string;
  phone: string;
  address: string;
  city: string | null;
}

interface ApiBien {
  id: number;
  title: string;
  listingType: "rent" | "sale";
  price: string;
  city: string;
  address: string;
  neighborhood: string;
}

interface ApiInterest {
  id: number;
  client_id: number;
  bien_id: number;
  status: string;
  client: ApiInterestClient;
  bien: ApiBien;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ApiInterest[];
}

// ─── Hook propriétés ──────────────────────────────────────────────────────────
// Extrait les biens uniques des intérêts confirmés, filtrés par type de contrat

export function useProperties(agencyId: number, contractType: ContractType) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // rental → "rent" | sale → "sale"
  const listingType = contractType === "rental" ? "rent" : "sale";

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    axiosInstance
      .get<ApiResponse>("/api/contracts/interests/confirmed", {
        params: { agency_id: agencyId },
      })
      .then((res) => {
        console.log("🟢 useProperties raw response:", res.data);
        console.log("🟢 listingType cherché:", listingType);
        res.data.data.forEach((interest) => {
          console.log(
            `🟢 bien ${interest.bien.id} - listingType: "${interest.bien.listingType}" - match: ${interest.bien.listingType === listingType}`,
          );
        });
        if (cancelled) return;

        // Déduplique par bien_id + filtre par type de listing
        const seen = new Set<number>();
        const normalized: Property[] = [];

        res.data.data.forEach((interest) => {
          const bien = interest.bien;
          if (seen.has(bien.id)) return;
          if (bien.listingType !== listingType) return;
          seen.add(bien.id);

          normalized.push({
            id: String(bien.id),
            title: bien.title,
            address: `${bien.address}, ${bien.neighborhood}, ${bien.city}`,
            price: parseFloat(bien.price),
            type: bien.listingType,
          });
        });
        console.log("🟢 properties normalisées:", normalized);
        setProperties(normalized);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [agencyId, listingType]);

  return { properties, isLoading, error };
}
