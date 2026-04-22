import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface UseGetVisitsOptions {
  clientId?: number;
}

export function useGetVisits(options?: UseGetVisitsOptions) {
  // const [agent, setCreneaux] = useState<Creneau[]>([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchVisits = async () => {
    if (!options?.clientId) return  // ← ne pas fetch si clientId pas encore dispo
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/visit-reservations/client/${options.clientId}`);
      setVisits(res.data.visits ?? [])  // ← extraire le tableau
    } catch (error) {
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, [options?.clientId]);

  return { visits, loading, fetchVisits };
}