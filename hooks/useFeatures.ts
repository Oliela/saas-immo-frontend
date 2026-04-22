// hooks/useFeatures.ts
"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export interface ApiFeature {
  id: number;
  name: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export function useFeatures() {
  const [data, setData] = useState<ApiFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get<ApiFeature[]>("/api/features")
      .then((res) => setData(res.data))
      .catch(() => setError("Erreur lors du chargement des caractéristiques"))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
