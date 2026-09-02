"use client";

import { useCallback, useEffect, useState } from "react";
import { getAgencySubscriptions } from "@/services/agencySubscriptionService";
import type { AgencySubscriptionHistoryResponse } from "@/types/subscription";

export function useAgencySubscriptions() {
  const [data, setData] = useState<AgencySubscriptionHistoryResponse | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAgencySubscriptions();
      setData(response);
    } catch {
      setError("Impossible de charger les informations de l’abonnement.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
  }, [refresh]);

  return {
    data,
    loading,
    error,
    refresh,
  };
}
