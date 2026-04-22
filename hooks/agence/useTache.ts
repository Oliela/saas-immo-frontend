"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export function useTache() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   

    axiosInstance
      .get("/api/tasks/nombre")
      .then((res) => {
        setData(res.data);
        // console.log("useAgency - data:", res.data.agency);
      })
      .catch(() => {
        setError("Erreur lors du chargement des tâches");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
