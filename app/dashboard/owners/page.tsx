"use client";

import OwnersListing from "@/components/owners/OwnersListing";
import { useAgency } from "@/hooks/agence/useAgency";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

export default function OwnersPage() {
  const { data: agencyData, loading: agencyLoading } = useAgency();
  const [ownersData, setOwnersData] = useState<{ owners: any[]; statistics: any } | null>(null);
  const [loading, setLoading] = useState(false); // ← false par défaut
  const [error, setError] = useState<string | null>(null);

  const fetchOwners = async (agencyId: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await axiosInstance.get("/api/owners", {
        params: { agency_id: agencyId },
      });
      setOwnersData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors du chargement des propriétaires");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (agencyLoading) return; // attendre que useAgency ait fini

    // 🔍 Log pour voir la vraie structure
    console.log("agencyData:", agencyData);

    const agencyId = agencyData?.agency?.id;
    console.log("agencyId:", agencyId);

    if (agencyId) {
      fetchOwners(agencyId);
    }
  }, [agencyData, agencyLoading]); // ← ajouter agencyLoading en dépendance

  // if (agencyLoading || loading) return <p>Chargement...</p>;
  // if (error) return <p>{error}</p>;
  // if (!ownersData) return <p>Aucune donnée disponible</p>;

  return (
    <div className="space-y-6">
      <OwnersListing data={ownersData} />
    </div>
  );
}