"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import type { Contract } from "@/lib/admin-types";

export function useAdminContracts() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/api/admin/contracts")
      .then((res) => {
        const raw = Array.isArray(res.data.contracts) ? res.data.contracts : [];
        const mapped: Contract[] = raw.map((c: any) => ({
          id: String(c.id),
          reference: c.reference ?? "",
          type: c.type ?? "rental",
          status: c.statut ?? c.status ?? "draft",
          clientId: "",
          clientName: c.client ?? "",
          agencyId: "",
          agencyName: c.agence ?? "",
          ownerId: "",
          ownerName: "",
          propertyId: "",
          propertyTitle: c.titreBien ?? "",
          amount: parseFloat(c.prixBien ?? "0"),
          startDate: c.startDate ?? "",
          endDate: c.endDate,
          signatureDate: c.signatureDate,
          pdfUrl: c.pdfUrl,
          createdAt: c.createdAt ?? "",
          updatedAt: c.updatedAt ?? "",
        }));
        setContracts(mapped);
      })
      .catch(() => setError("Erreur lors du chargement des contrats"))
      .finally(() => setLoading(false));
  }, []);

  return { contracts, loading, error };
}