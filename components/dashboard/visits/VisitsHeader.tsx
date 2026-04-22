"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"

interface VisitsHeaderProps {
  onSchedule?: () => void
}

export default function VisitsHeader() {
  const onSchedule = () => { 
    redirect("/dashboard/visits/new")
   }
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Planification des visites</h1>
        <p className="text-muted-foreground">Gérer les visites de propriétés et les rendez-vous</p>
      </div>
      <Button onClick={onSchedule}>
        <Plus className="mr-2 h-4 w-4" />
        Planifier une visite
      </Button>
    </div>
  )
}
