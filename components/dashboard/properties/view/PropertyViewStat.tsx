import Link from "next/link"
import { ArrowLeft, Pencil, Trash2, Printer, Share2, Eye, Heart, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PropertyViewStat({ property }: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Rendement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span className="text-sm">Vues</span>
          </div>
          <span className="font-semibold text-foreground">{property.views || 0}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span className="text-sm">Favoris</span>
          </div>
          <span className="font-semibold text-foreground">{property.favoris || 0}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span className="text-sm">Intérêt</span>
          </div>
          <span className="font-semibold text-foreground">{property.interets || 0}</span>
        </div>
      </CardContent>
    </Card>
  )
}