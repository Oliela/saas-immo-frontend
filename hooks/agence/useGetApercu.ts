"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export function useGetApercu() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/api/dashboard/agency");
        setData(res.data);
      } catch (err) {
        const error = err as any;
        console.error("DASHBOARD ERROR status:", error.response?.status);
        console.error("DASHBOARD ERROR data:", error.response?.data);
        setError("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, loading, error };
}
