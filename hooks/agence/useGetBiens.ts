import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface UseGetBiensOptions {
  agencyId?: number;
}

export function useGetBiens(options?: UseGetBiensOptions) {
  // const [agent, setCreneaux] = useState<Creneau[]>([]);
  const [biens, setBiens] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchBiens = async () => {
    if (!options?.agencyId) return  // ← ne pas fetch si agencyId pas encore dispo
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/biens/agency/${options.agencyId}`);
      setBiens(res.data.biens ?? [])  // ← extraire le tableau
    } catch (error) {
      setBiens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBiens();
  }, [options?.agencyId]);

  return { biens, loading, fetchBiens };
}