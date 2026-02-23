"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { FileCheck } from "lucide-react"

interface Document {
    id: number
    client_id: number
    type: string
    file_path: string
    original_name: string
    is_verified: number // 0 ou 1
    uploaded_at: string
    verified_at: string | null
    created_at: string
    updated_at: string
}

export default function DocumentsProgressCard({ documents }: { documents: Document[] }) {
    // console.log("Documents in Progress Card:", documents)

    // 🔹 Calcul du nombre de documents vérifiés
    const verifiedCount = documents.filter((d) => d.is_verified === 1).length
    const totalDocuments = documents.length
    const progressPercentage = totalDocuments > 0 ? Math.round((verifiedCount / totalDocuments) * 100) : 0

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                        <FileCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-foreground">Progression de la vérification des documents</h3>
                            <span className="text-sm font-medium text-foreground">
                                {verifiedCount} sur {totalDocuments} vérifiés
                            </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        <p className="text-sm text-muted-foreground mt-2">
                            {progressPercentage === 100
                                ? "Tous les documents ont été vérifiés!"
                                : "Complétez tous les documents requis pour poursuivre votre candidature."}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}