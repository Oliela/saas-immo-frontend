"use client";

import { useEffect, useState } from "react";
import { adminDashboardService, AdminDashboardData } from "@/services/adminDashboardService";

export function useAdminDashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminDashboardService
      .getDashboard()
      .then((res) => setData(res))
      .catch(() => setError("Erreur lors du chargement du dashboard"))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
