import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface UseOwnersOptions {
  agencyId?: number;
}

export function useOwners(options?: UseOwnersOptions) {
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOwners = async () => {
    if (!options?.agencyId) return; // ✅ sécurité

    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/owners/agency/${options.agencyId}`
      );

      setOwners(response.data?.owners || []);
      // console.log("Données des propriétaires récupérées :", response.data);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des propriétaires :",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, [options?.agencyId]);

  return { owners, loading, fetchOwners };
}