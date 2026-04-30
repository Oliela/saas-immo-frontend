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

  const isLoading = loading || loadingVisits

  return (
    <div className="space-y-6">
      <VisitsHeader />
      <VisitsStats statistics={statistics} loading={isLoading} />
      <div className="grid gap-6 lg:grid-cols-3">
        <VisitsTodaySchedule visits={statistics?.today_visits ?? []} loading={isLoading} />
        <VisitsAllList visits={visits} loading={isLoading} />
      </div>
    </div>
  )
}