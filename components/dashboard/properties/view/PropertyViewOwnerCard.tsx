import Link from "next/link"
import { User, Mail, Phone } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"


export default function PropertyViewOwnerCard({ property }: any) {
    console.log("Owner data:", property) // Debug log to check owner data structure
  return (
     <Card>
            <CardHeader>
              <CardTitle className="text-base">Propriétaire du bien</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{property.owner.name}</p>
                  <p className="text-sm text-muted-foreground">Propriétaire</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{property.owner.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{property.owner.phone}</span>
                </div>
              </div>
              <Separator className="my-4" />
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/owners/${property.owner.id}`}>
                  Voir le profil du propriétaire
                </Link>
              </Button>
            </CardContent>
          </Card>
  )
}