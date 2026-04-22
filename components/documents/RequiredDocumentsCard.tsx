"use client"

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle, Clock, Download, Eye, FileText, Trash2, Upload } from "lucide-react"
import { Button } from "../ui/button"
import { useState } from "react"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

interface Document {
    id: number
    client_id: number
    type: string
    file_path?: string
    original_name?: string
    status?: "pending" | "approved" | "rejected"
    uploaded_at?: string
    verified_at?: string | null
}

const REQUIRED_TYPES = [
    { type: "id_document", label: "Pièce d'identité", description: "Pièce d'identité officielle (CNI ou passeport)" },
    { type: "income_proof", label: "Justificatif de revenus", description: "Fiche de paie, lettre d'emploi ou déclaration d'impôts" },
    { type: "bank_statement", label: "Relevé bancaire", description: "Relevés bancaires des 3 derniers mois" },
    // { type: "recommendation_letter", label: "Lettre de recommandation", description: "Recommandation d'ancien propriétaire ou employeur" },
]

function getStatus(doc?: Document): "to_upload" | "pending" | "approved" | "rejected" {
    if (!doc || !doc.file_path) return "to_upload"
    return doc.status ?? "pending"
}

function getStatusBadge(status: "to_upload" | "pending" | "approved" | "rejected") {
    switch (status) {
        case "approved":
            return (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Approuvé
                </Badge>
            )
        case "pending":
            return (
                <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
                    <Clock className="mr-1 h-3 w-3" />
                    En attente
                </Badge>
            )
        case "rejected":
            return (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Rejeté
                </Badge>
            )
        case "to_upload":
            return (
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                    <Upload className="mr-1 h-3 w-3" />
                    A telecharger
                </Badge>
            )
        default:
            return null
    }
}

export default function RequiredDocumentsCard({ documents }: { documents: Document[] }) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    // console.log("Documents in RequiredDocumentsCard:", documents)
    const [localDocuments, setLocalDocuments] = useState<Document[]>(documents)

    const handleView = (doc?: Document) => {
        if (!doc?.file_path) return
        const url = `${API_BASE_URL}/storage/${doc.file_path}`
        window.open(url, "_blank")
    }

    const handleDownload = (doc?: Document) => {
        if (!doc?.file_path) return
        const url = `${API_BASE_URL}/storage/${doc.file_path}`

        const link = document.createElement("a")
        link.href = url
        link.download = doc.original_name || "document.pdf"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleDelete = async (doc?: Document) => {
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
                <CardTitle>Documents requis</CardTitle>
                <CardDescription>Ces documents sont nécessaires pour traiter votre candidature.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {REQUIRED_TYPES.map((req) => {
                        const doc = documents.find((d) => d.type === req.type)
                        const status = getStatus(doc)

                        return (
                            <div
                                key={req.type}
                                className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border ${status === "to_upload" ? "border-destructive/50 bg-destructive/5" : "border-border"
                                    }`}
                            >
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 ${status === "approved"
                                        ? "bg-green-100"
                                        : status === "pending"
                                            ? "bg-amber-100"
                                        : status === "rejected"
                                            ? "bg-red-100"
                                            : "bg-red-100"
                                        }`}
                                >
                                    <FileText
                                        className={`h-5 w-5 ${status === "approved"
                                            ? "text-green-600"
                                            : status === "pending"
                                                ? "text-amber-600"
                                            : status === "rejected"
                                                ? "text-red-600"
                                                : "text-red-600"
                                            }`}
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-foreground">{req.label}</h4>
                                        {getStatusBadge(status)}
                                    </div>
                                    <p className="text-sm text-muted-foreground">{req.description}</p>
                                    {doc?.uploaded_at && (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {doc.original_name} - Téléchargé le {new Date(doc.uploaded_at).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {status === "to_upload" ? (
                                        // <Button size="sm" onClick={() => setUploadDialogOpen(true)}>
                                        //     <Upload className="mr-2 h-4 w-4" />
                                        //     Charger un document
                                        // </Button>
                                        null
                                    ) : (
                                        <>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleView(doc)}
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span className="sr-only">Voir</span>
                                            </Button>
                                            {/* 
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDownload(doc)}
                                            >
                                                <Download className="h-4 w-4" />
                                                <span className="sr-only">Télécharger</span>
                                            </Button> */}
                                            {/* {status !== "approved" && (
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(doc)}>
                                                    <Trash2 className="h-4 w-4" />
                                                    <span className="sr-only">Supprimer</span>
                                                </Button>
                                            )} */}
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(doc)}>
                                                <Trash2 className="h-4 w-4" />
                                                <span className="sr-only">Supprimer</span>
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}