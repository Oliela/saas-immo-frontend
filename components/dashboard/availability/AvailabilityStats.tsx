"use client"

import { Calendar, Check, Clock, Building2, Ban } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { AvailabilitySlot } from "./types"

export function AvailabilityStats({ slots }: { slots: AvailabilitySlot[] }) {
  const stats = [
    {
      label: "Total de créneaux",
      value: slots.length,
      icon: Calendar,
      bgColor: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Disponible",
      value: slots.filter((s) => s.status === "available").length,
      icon: Check,
      bgColor: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "Réservé",
      value: slots.filter((s) => s.status === "reserved").length,
      icon: Clock,
      bgColor: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "Indisponible",
      value: slots.filter((s) => s.status === "unavailable").length,
      icon: Ban,
      bgColor: "bg-slate-100",
      iconColor: "text-slate-500",
    },
    {
      label: "Propriétés concernées",
      value: new Set(slots.filter((s) => s.bien_id).map((s) => s.bien_id)).size,
      icon: Building2,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-5">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}