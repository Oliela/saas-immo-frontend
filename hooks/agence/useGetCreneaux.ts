import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { type Creneau } from "@/types/creneau";

interface UseGetCreneauxOptions {
  agencyId?: number;
}

// ── Normalise visit_date "2026-03-31T00:00:00.000000Z" → "2026-03-31" ────────
function normalizeCreneau(c: any): Creneau {
  return {
    ...c,
    visit_date: c.visit_date ? c.visit_date.split("T")[0] : c.visit_date,
  }
}

export function useGetCreneaux(options?: UseGetCreneauxOptions) {
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCreneaux = async () => {
    if (!options?.agencyId) return
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/visit-schedules/agency/${options.agencyId}`);
      const raw: any[] = res.data.creneaux ?? []
      setCreneaux(raw.map(normalizeCreneau))
    } catch (error) {
      setCreneaux([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreneaux();
  }, [options?.agencyId]);

  return { creneaux, loading, fetchCreneaux };
}