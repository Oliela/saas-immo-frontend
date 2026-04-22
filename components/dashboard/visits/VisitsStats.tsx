"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { VisitStatistics } from "@/hooks/agence/useGetVisits"

interface VisitsStatsProps {
  statistics?: VisitStatistics | null
}

export default function VisitsStats({ statistics }: VisitsStatsProps) {
  const stats = [
    {
      label:   "Aujourd'hui",
      value:   statistics?.today_visits_count ?? "—",
      subtext: "visites prévues",
    },
    {
      label:   "Cette semaine",
      value:   statistics?.weekly_visits ?? "—",
      subtext: "total de visites",
    },
    {
      label:   "Taux de confirmation",
      value:   statistics ? `${statistics.confirmation_rate}%` : "—",
      subtext: "visites confirmées",
    },
    {
      label:   "Durée moyenne",
      value:   statistics ? `${statistics.average_duration} min` : "—",
      subtext: "par visite",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}