"use client"

import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"


export default function DocumentsHeader({ user }: { user: any }) {
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
    const [selectedDocType, setSelectedDocType] = useState<string>("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!selectedDocType) {
            toast.error("Veuillez sélectionner un type de document")
            return
        }

        if (!selectedFile) {
            toast.error("Veuillez sélectionner un fichier")
            return
        }

        setIsSubmitting(true)
        // console.log("Selected Document Type:", selectedDocType)
        // console.log("Selected File:", selectedFile)

        try {
            const formData = new FormData()
            formData.append("client_id", user.id)
            formData.append("type", selectedDocType)
            formData.append("file", selectedFile)

            const token = localStorage.getItem("token")

            const res = await axiosInstance.post("/api/profile/documents/upload", formData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "multipart/form-data"
                }
            })

            if (res.status === 201) {
                toast.success("Document téléchargé avec succès")
                setUploadDialogOpen(false)
                setSelectedFile(null)
                setSelectedDocType("")
                window.location.reload()
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Erreur lors du téléchargement du document"
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }
    // const [selectedFile, setSelectedFile] = useState<File | null>(null)
    // const [isSubmitting, setIsSubmitting] = useState(false)


    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Mes documents</h1>
                <p className="text-muted-foreground">Téléchargez et gérez les documents de votre candidature.</p>
            </div>
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Charger un document
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Télécharger un document</DialogTitle>
                        <DialogDescription>
                            Sélectionnez un type de document et téléchargez votre fichier.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="docType">Type de document</Label>
                                <Select value={selectedDocType} onValueChange={setSelectedDocType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner le type de document" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="income_proof">Justificatif de revenus</SelectItem>
                                        <SelectItem value="id_document">Pièce d'identité</SelectItem>
                                        <SelectItem value="bank_statement">Relevé bancaire</SelectItem>
                                        {/* <SelectItem value="recommendation_letter">Lettre de recommandation</SelectItem> */}
                                        <SelectItem value="work_contract">Contrat de travail</SelectItem>
                                        <SelectItem value="other">Autre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="file">Fichier</Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Glissez-déposez votre fichier ici, ou cliquez pour parcourir
                                    </p>
                                    <Input
                                        id="file"
                                        type="file"
                                        className="hidden"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                    />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="bg-transparent"
                                        onClick={() => document.getElementById("file")?.click()}
                                        type="button"
                                    >
                                        Parcourir les fichiers
                                    </Button>
                                    {selectedFile && (
                                        <p className="text-xs text-green-600 mt-2">
                                            Fichier sélectionné: {selectedFile.name}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-2">
                                        PDF, JPG ou PNG (max 10 Mo)
                                    </p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setUploadDialogOpen(false)}
                                className="bg-transparent"
                                disabled={isSubmitting}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Téléchargement..." : "Télécharger"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}