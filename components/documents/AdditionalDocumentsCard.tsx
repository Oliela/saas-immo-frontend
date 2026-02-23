"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Download, ImageIcon, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { useState } from "react"

interface AdditionalDocument {
    id: number
    client_id: number
    type: string
    file_path?: string
    original_name?: string
    is_verified?: number
    uploaded_at?: string
    verified_at?: string | null
}

export default function AdditionalDocumentsCard({ documents }: { documents: AdditionalDocument[] }) {
    console.log("Additional Documents in Card:", documents)
        const [localDocuments, setLocalDocuments] = useState<AdditionalDocument[]>(documents)
    


     const handleDelete = async (doc?: AdditionalDocument) => {
        if (!doc?.id) return;
        const token = localStorage.getItem("token")

        try {
            await axiosInstance.delete(`/api/profile/documents/${doc.id}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "multipart/form-data"
                }
            });

            toast.success("Document supprimé avec succès ✅");


            setLocalDocuments((prev) =>
                prev.filter((d) => d.id !== doc.id)
            );
            window.location.reload()
        } catch (error: any) {
            toast.error(
                error.response?.data?.error || "Erreur lors de la suppression"
            );
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Documents additionnels</CardTitle>
                <CardDescription>
                    Documents supplémentaires que vous avez téléchargés pour soutenir votre candidature.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {documents && documents.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {documents.map((doc) => (
                            <div
                                key={doc.client_id}
                                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">{doc.original_name}</p>
                                    <p className="text-xs text-muted-foreground">{doc.type} - Téléchargé le {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Download className="h-4 w-4" />
                                    </Button>
                                   
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(doc)}>
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Supprimer</span>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">Aucun document trouvé.</p>
                )}
            </CardContent>
        </Card>
    )
}