"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import type { Agency } from "@/lib/admin-types";

export function useAdminAgencies() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/api/admin/agencies")
      .then((res) => {
        const raw = Array.isArray(res.data.agencies) ? res.data.agencies : [];
        const mapped: Agency[] = raw.map((a: any) => ({
          id: String(a.id),
          name: a.nom ?? "",
          email: a.email ?? "",
          phone: a.phone ?? "",
          address: a.address ?? "",
          city: a.ville ?? "",
          country: a.country ?? "",
          logo: a.logo,
          status: a.estActive ? "active" : "inactive",
          isCertified: a.estCertifiee ?? false,
          propertiesCount: a.nombreBiens ?? 0,
          ownersCount: a.nombreOwners ?? 0,
          agentsCount: a.nombreAgents ?? 0,
          contractsCount: a.contractsCount ?? 0,
          totalRevenue: a.totalRevenue ?? 0,
          createdAt: a.createdAt ?? "",
          updatedAt: a.updatedAt ?? "",
        }));
        setAgencies(mapped);
      })
      .catch(() => setError("Erreur lors du chargement des agences"))
      .finally(() => setLoading(false));
  }, []);

  return { agencies, setAgencies, loading, error };
}