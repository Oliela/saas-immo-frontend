"use client";

import { useState, useEffect, useMemo } from "react";
import { defaultClauses } from "@/data/clauseSysteme";
import type {
  CatalogClause,
  ApiClause,
  ContractType,
  UsageCase,
} from "@/types/contractNew";
import axiosInstance from "@/lib/axios";

export function useCatalogClauses(
  contractType: ContractType,
  usageCase: UsageCase,
  agencyId: number,
) {
  const [agencyClauses, setAgencyClauses] = useState<CatalogClause[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    axiosInstance
      // La réponse est { data: [...] } → typer { data: ApiClause[] }
      .get<{ data: ApiClause[] }>("/api/clauses", {
        params: {
          agency_id: agencyId,
          type: contractType,
          usage_case: usageCase,
        },
      })
      .then((res) => {
        if (cancelled) return;
        // res.data     = corps axios   → { data: [...] }
        // res.data.data = tableau réel → ApiClause[]
        const normalized: CatalogClause[] = res.data.data.map((c) => ({
          id: `agency-${c.id}`,
          clause_id: c.id,
          title: c.title,
          content: c.content,
          type: c.type,
          usage_case: c.usage_case ?? undefined,
          source: "agency" as const,
          is_default: Boolean(c.is_default),
        }));
        setAgencyClauses(normalized);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [agencyId, contractType, usageCase]);

  const catalog = useMemo<CatalogClause[]>(() => {
    const matchesUsageCase = (clause: CatalogClause) =>
      !clause.usage_case || clause.usage_case === usageCase;

    const systemClauses = defaultClauses.filter(
      (clause) =>
        (clause.type === contractType || clause.type === "both") &&
        matchesUsageCase(clause),
    );

    const agencyFiltered = agencyClauses.filter(
      (clause) =>
        (clause.type === contractType || clause.type === "both") &&
        matchesUsageCase(clause),
    );

    return [...systemClauses, ...agencyFiltered];
  }, [agencyClauses, contractType, usageCase])
  

  return { catalog, isLoading, error };
}
