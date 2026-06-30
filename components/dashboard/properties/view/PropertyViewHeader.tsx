import Link from "next/link"
import { ArrowLeft, Pencil, Trash2, Printer, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PropertyViewHeader({ property }: any) {
  const handleDelete = () => {
    // Logique de suppression du bien
    // console.log("Bien supprimé :", property.id)
  }
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/properties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div>
          <h1 className="text-2xl font-bold">{property?.title || "Untitled Property"}</h1>
          <p className="text-muted-foreground">{property?.address || "No address available"}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {/* <Button variant="outline" size="icon">
          <Printer className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Share2 className="h-4 w-4" />
        </Button> */}
        <Button variant="outline" asChild>
          <Link href={`/dashboard/properties/${property.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Modifier
          </Link>
        </Button>
        <Button variant="destructive" onClick={handleDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </Button>
      </div>
    </div>
  )
}