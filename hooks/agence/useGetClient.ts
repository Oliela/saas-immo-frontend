// hooks/useGetCommodite.ts
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export function useGetClient() {
  const [client, setClient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await axiosInstance.get("/api/clients"); // plus de token
        setClient(res.data.clients);
      } catch (error) {
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, []);

  return { client, loading };
}