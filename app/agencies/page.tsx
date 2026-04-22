"use client"

import ListingAgenciesPage from "@/components/agencies/page"
import { useAgency } from "@/hooks/useAgency"

export default function AgenciesPage() {
  const { data: agencyData, loading: loadingAgency, error: errorAgency } = useAgency()
  console.log("AgenciesPage - data:", agencyData, "loading:", loadingAgency, "error:", errorAgency)
  return (
    <ListingAgenciesPage
      agencies={agencyData ?? []}
      loading={loadingAgency}
      error={errorAgency}
    />
  )
}