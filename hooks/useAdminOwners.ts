"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import type { Owner } from "@/lib/admin-types";

export function useAdminOwners() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/api/admin/owners")
      .then((res) => {
        const raw = Array.isArray(res.data.owners) ? res.data.owners : [];
        const mapped: Owner[] = raw.map((o: any) => {
          const parts = (o.nomComplet ?? "").split(" ");
          return {
            id: String(o.id),
            firstName: parts[0] ?? "",
            lastName: parts.slice(1).join(" "),
            email: o.email ?? "",
            phone: o.telephone ?? "",
            status: o.statut === "actif" ? "active" : "inactive",
            linkedAgencyId: "",
            linkedAgencyName: o.agence ?? "",
            propertiesCount: o.nombreBiens ?? 0,
            contractsCount: 0,
            totalRevenue: o.valeurPortefeuille ?? 0,
            createdAt: o.createdAt ?? "",
            updatedAt: o.updatedAt ?? "",
          };
        });
        setOwners(mapped);
      })
      .catch(() => setError("Erreur lors du chargement des propriétaires"))
      .finally(() => setLoading(false));
  }, []);

  return { owners, loading, error };
}