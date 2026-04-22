// hooks/useGetCommodite.ts
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export function useGetCommodite() {
  const [commodite, setCommodite] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommodite = async () => {
      try {
        const res = await axiosInstance.get("/api/features"); // plus de token
        setCommodite(res.data);
      } catch (error) {
        setCommodite(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCommodite();
  }, []);

  return { commodite, loading };
}