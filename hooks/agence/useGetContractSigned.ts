import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";



interface UseGetContractSignedOptions {
  agencyId?: number;
}

export function useGetContractSigned(options?: UseGetContractSignedOptions) {
  // const [agent, setCreneaux] = useState<Creneau[]>([]);
  const [contracts, setContracts] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchContracts = async () => {
    if (!options?.agencyId) return  // ← ne pas fetch si agencyId pas encore dispo
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/contracts/signed/agency`,{
        params: { agency_id: options.agencyId }
      });
      setContracts(res.data.contracts ?? [])  // ← extraire le tableau
    } catch (error) {
      setContracts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [options?.agencyId]);

  return { contracts, loading, fetchContracts };
}