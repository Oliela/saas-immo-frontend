"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PropertiesHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Propriétés</h1>
        <p className="text-muted-foreground">Gérez vos annonces immobilières</p>
      </div>

      <Button asChild>
        <Link href="/dashboard/properties/new">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une propriété
        </Link>
      </Button>
    </div>
  )
}