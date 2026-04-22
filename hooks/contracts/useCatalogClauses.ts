"use client"

import { useState, useEffect, useMemo } from "react"
import { defaultClauses } from "@/data/clauseSysteme"
import type { CatalogClause, ApiClause, ContractType } from "@/types/contractNew"
import axiosInstance from "@/lib/axios"

export function useCatalogClauses(contractType: ContractType, agencyId: number) {
  const [agencyClauses, setAgencyClauses] = useState<CatalogClause[]>([])
  const [isLoading,     setIsLoading]     = useState(true)
  const [error,         setError]         = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    axiosInstance
      // La réponse est { data: [...] } → typer { data: ApiClause[] }
      .get<{ data: ApiClause[] }>("/api/clauses", { params: { agency_id: agencyId } })
      .then((res) => {
        if (cancelled) return
        // res.data     = corps axios   → { data: [...] }
        // res.data.data = tableau réel → ApiClause[]
        const normalized: CatalogClause[] = res.data.data.map((c) => ({
          id:         `agency-${c.id}`,
          clause_id:  c.id,
          title:      c.title,
          content:    c.content,
          type:       c.type,
          source:     "agency" as const,
          is_default: Boolean(c.is_default),
        }))
        setAgencyClauses(normalized)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [agencyId])

  const catalog = useMemo<CatalogClause[]>(() => {
    // defaultClauses est déjà CatalogClause[] avec le champ `type` (pas contractType)
    // → filtrer directement, pas besoin de .map()
    const systemClauses = defaultClauses.filter(
      (c) => c.type === contractType || c.type === "both"
    )

    const agencyFiltered = agencyClauses.filter(
      (c) => c.type === contractType || c.type === "both"
    )

    return [...systemClauses, ...agencyFiltered]
  }, [agencyClauses, contractType])

  return { catalog, isLoading, error }
}