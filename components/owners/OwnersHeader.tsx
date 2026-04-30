import Link from "next/link"
import { Plus, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OwnersHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">Gestion des propriétaires</h1>
        <p className="text-muted-foreground">
          Gérez les propriétaires et leurs portefeuilles
        </p>
      </div>

      <div className="flex gap-2">
        {/* <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button> */}

        <Button asChild>
          <Link href="/dashboard/owners/new">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un propriétaire
          </Link>
        </Button>
      </div>
    </div>
  )
}