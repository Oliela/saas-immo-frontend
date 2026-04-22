"use client"

import VisitsHeader        from "@/components/dashboard/visits/VisitsHeader"
import VisitsStats         from "@/components/dashboard/visits/VisitsStats"
import VisitsAllList       from "@/components/dashboard/visits/VisitsAllList"
import VisitsTodaySchedule from "@/components/dashboard/visits/VisitsTodaySchedule"
import { useAuthAgent }    from "@/hooks/agence/useAuthAgent"
import { useGetVisits }    from "@/hooks/agence/useGetVisits"

export default function VisitsPage() {
  const { user, loading }                              = useAuthAgent()
  const { visits, statistics, loading: loadingVisits } = useGetVisits({
    agencyId: user?.agency?.id,
  })

  if (loading || loadingVisits) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <VisitsHeader />
      <VisitsStats statistics={statistics} />
      <div className="grid gap-6 lg:grid-cols-3">
        <VisitsTodaySchedule visits={statistics?.today_visits ?? []} />
        <VisitsAllList visits={visits} />
      </div>
    </div>
  )
}