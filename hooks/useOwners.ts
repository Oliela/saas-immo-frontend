"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { profile } from "console";

export function useOwners() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   

    axiosInstance
      .get("/api/agent/profile")
      .then((res) => {
        setData(res.data);
      })
      .catch(() => {
        setError("Erreur lors du chargement des propriétaires");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
