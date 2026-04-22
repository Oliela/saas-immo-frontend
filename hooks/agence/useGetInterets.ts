import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import type { Interet, InteretsStats } from "@/types/interets";

interface UseGetInteretOptions {
  agencyId?: number;
}

const DEFAULT_STATS: InteretsStats = {
  total: 0,
  confirmed: 0,
  pending: 0,
  rejected: 0,
};

export function useGetInterets(options?: UseGetInteretOptions) {
  const [interets, setInterets] = useState<Interet[]>([]);
  const [stats, setStats] = useState<InteretsStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(false);

  const fetchInterets = async () => {
    if (!options?.agencyId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/interets/agency/${options.agencyId}`);
      // L'API renvoie { stats: {...}, interets: [...] }
      setInterets(res.data?.interets ?? []);
      setStats(res.data?.stats ?? DEFAULT_STATS);
    } catch (error) {
      setInterets([]);
      setStats(DEFAULT_STATS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterets();
  }, [options?.agencyId]);

  return { interets, stats, loading, refetch: fetchInterets };
}