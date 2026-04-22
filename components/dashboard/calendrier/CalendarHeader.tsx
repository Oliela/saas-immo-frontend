"use client"

import Link from "next/link"
import { Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CalendarHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Calendrier</h1>
        <p className="text-muted-foreground">Gérer les visites et la disponibilité des agents</p>
      </div>
      <div className="flex gap-2">
        <Button asChild variant="outline" className="bg-transparent">
          <Link href="/dashboard/availability">
            <Clock className="mr-2 h-4 w-4" />
            Gérer la disponibilité
          </Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard/visits/new">
            <Plus className="mr-2 h-4 w-4" />
            Planifier une visite
          </Link>
        </Button>
      </div>
    </div>
  )
}
