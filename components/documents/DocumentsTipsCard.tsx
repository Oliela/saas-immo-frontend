"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function DocumentsTipsCard() {
    return (
        <Card className="bg-secondary/30">
            <CardContent className="p-6">
                <h3 className="font-medium text-foreground mb-3">Conseils pour le téléchargement de documents</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        Assurez-vous que tous les documents sont clairs et lisibles
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        Le format PDF est préféré pour une meilleure qualité
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        Les documents doivent être datés de moins de 3 mois
                    </li>
                    <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        Toutes les pages des documents multi-pages doivent être incluses
                    </li>
                </ul>
            </CardContent>
        </Card>
    )
}