 "use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Bien, BiensListResponse } from "@/types/biensTypes";

export function useBiens() {
  const [data, setData] = useState<BiensListResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get<BiensListResponse>("/api/biens")
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        setError("Erreur lors du chargement des biens");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}