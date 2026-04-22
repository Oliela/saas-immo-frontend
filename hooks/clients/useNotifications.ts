"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export function useNotifications() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   

    axiosInstance
      .get("/api/notifications/client")
      .then((res) => {
        setData(res.data);
        // console.log("useAgency - data:", res.data.agency);
      })
      .catch(() => {
        setError("Erreur lors du chargement des notifications");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { data, loading, error };
}
