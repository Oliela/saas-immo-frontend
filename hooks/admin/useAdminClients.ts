"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export interface AdminClient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  status: string;
  affiliatedAgencyId: string;
  affiliatedAgencyName: string | null;
  contractsCount: number;
  createdAt: string;
}

export interface AdminClientAgency {
  id: string;
  name: string;
}

export function useAdminClients() {
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [agencies, setAgencies] = useState<AdminClientAgency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/api/admin/clients")
      .then((res) => {
        const rawClients: any[] = Array.isArray(res.data.clients) ? res.data.clients : [];

        const mapped: AdminClient[] = rawClients.map((c) => {
          const parts = (c.nomComplet ?? "").trim().split(" ");
          return {
            id: c.id,
            firstName: parts[0] ?? "",
            lastName: parts.slice(1).join(" "),
            email: c.email ?? "",
            phone: c.telephone ?? "",
            city: c.city ?? "",
            status: c.statut ?? "",                        // ✅ statut (pas status)
            affiliatedAgencyId: c.agences?.[0] ?? "",      // ✅ string (nom de l'agence)
            affiliatedAgencyName: c.agences?.[0] ?? null,  // ✅ tableau de strings
            contractsCount: c.nombreContrats ?? 0,         // ✅ nombreContrats (pas contractsCount)
            createdAt: c.inscription ?? "",                // ✅ inscription (pas createdAt)
          };
        });

        // Déduplication des agences pour le filtre
        const agencyNames = new Set<string>();
        rawClients.forEach((c) =>
          (c.agences ?? []).forEach((name: string) => agencyNames.add(name))
        );
        const agenciesList: AdminClientAgency[] = Array.from(agencyNames).map((name) => ({
          id: name,
          name,
        }));

        setClients(mapped);
        setAgencies(agenciesList);
      })
      .catch(() => setError("Erreur lors du chargement des clients"))
      .finally(() => setLoading(false));
  }, []);

  return { clients, agencies, loading, error };
}