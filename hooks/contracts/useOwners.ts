// ─── hook/contracts/useOwners ─────────────
// Utilisé pour les Mandats (vente/location) et la Gestion locative :
// à ce stade il n'y a pas encore de client, seulement un Propriétaire + ses biens.

"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import type { Owner, Property } from "@/types/contractNew";

interface ApiOwnerBien {
  id: number;
  title: string;
  propertyType: string;
  listingType: "rent" | "sale";
  price: string;
  city: string;
  address: string;
  neighborhood: string;
}

interface ApiOwner {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  biens: ApiOwnerBien[];
}

interface ApiResponse {
  owners: ApiOwner[];
}

export function useOwners(agencyId: number) {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [biensByOwner, setBiensByOwner] = useState<Record<string, Property[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    axiosInstance
      .get<ApiResponse>(`/api/owners/agency/${agencyId}`)
      .then((res) => {
        if (cancelled) return;

        const normalizedOwners: Owner[] = [];
        const biensMap: Record<string, Property[]> = {};

        res.data.owners.forEach((owner) => {
          normalizedOwners.push({
            id: String(owner.id),
            name: `${owner.firstName} ${owner.lastName}`,
            email: owner.email,
            phone: owner.phone,
          });

          biensMap[String(owner.id)] = (owner.biens ?? []).map((bien) => ({
            id: String(bien.id),
            title: bien.title,
            address: `${bien.address}, ${bien.neighborhood}, ${bien.city}`,
            price: parseFloat(bien.price),
            type: bien.listingType,
          }));
        });

        setOwners(normalizedOwners);
        setBiensByOwner(biensMap);
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
  }, [agencyId]);

  return { owners, biensByOwner, isLoading, error };
}
