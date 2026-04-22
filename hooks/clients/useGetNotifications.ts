"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export function useGetNotifications() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   

    axiosInstance
      .get("/api/notifications")
      .then((res) => {
        setData(res.data.notifications);
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
