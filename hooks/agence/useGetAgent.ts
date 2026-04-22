import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface UseGetAgentOptions {
  agencyId?: number;
}

export function useGetAgent(options?: UseGetAgentOptions) {
 
  const [agent, setAgent] = useState([]);
  const [stat, setStat] = useState([]);


  const [loading, setLoading] = useState(false);

  const fetchAgent = async () => {
    if (!options?.agencyId) return  // ← ne pas fetch si agencyId pas encore dispo
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/agents/agency/${options.agencyId}`);
      setAgent(res.data.agents ?? [])  // ← extraire le tableau
      setStat(res.data.statistics ?? [])  // ← extraire les statistiques
    } catch (error) {
      setAgent([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgent();
  }, [options?.agencyId]);

  return { agent, stat, loading, fetchAgent };
}