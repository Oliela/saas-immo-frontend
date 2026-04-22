"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import {
    ArrowLeft,
    ArrowRight,
    Check,
    Upload,
    X,
    MapPin,
    Plus,
    ImageIcon,
    Video,
    User,
    Search,
    AlertCircle,
    Save,
    Loader2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import PropertyEditHeader from "@/components/dashboard/properties/edit/PropertyEditHeader"
import PropertyEditStepper from "@/components/dashboard/properties/edit/PropertyEditStepper"
import { useOwners } from "@/hooks/agence/useOwner"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { useGetCommodite } from "@/hooks/agence/useGetCommodite"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Owner {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
}

interface PropertyType {
    value: string
    label: string
    icon: React.ElementType
}

interface ExistingProperty {
    agency_id: string
    id: string
    title: string
    propertyType: string
    listingType: string
    price: number
    status: string
    city: string
    neighborhood: string
    address: string
    surface: number
    rooms: number
    bathrooms: number
    floor: string
    furnished: boolean
    description: string
    images: Array<string | { url?: string; path?: string; image?: string }>
    features: Array<string | { id: number; name: string }>
    video: string | null
    owners_id: string

}

interface MediaImage {
    id: string
    url: string

}

interface Props {
    propertyTypes: PropertyType[]
    mockOwners: Owner[]
    existingProperty: ExistingProperty
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const steps = [
    { id: 1, name: "Informations de base", description: "Détails du bien" },
    { id: 2, name: "Localisation", description: "Adresse et carte" },
    { id: 3, name: "Détails", description: "Spécifications" },
    { id: 4, name: "Médias", description: "Photos et vidéos" },
    { id: 5, name: "Propriétaire", description: "Propriétaire du bien" },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function PropertyEditPage({ propertyTypes, existingProperty }: Props) {
    const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

    const getImagePath = (imageValue: unknown): string => {
        if (typeof imageValue === "string") return imageValue
        if (imageValue && typeof imageValue === "object") {
            const candidate = imageValue as { url?: unknown; path?: unknown; image?: unknown }
            if (typeof candidate.url === "string") return candidate.url
            if (typeof candidate.path === "string") return candidate.path
            if (typeof candidate.image === "string") return candidate.image
        }
        return ""
    }

    const resolveImageUrl = (imageUrl: unknown) => {
        const normalizedInput = getImagePath(imageUrl)
        if (!normalizedInput) return "/placeholder.svg"
        if (
            normalizedInput.startsWith("http://") ||
            normalizedInput.startsWith("https://") ||
            normalizedInput.startsWith("blob:") ||
            normalizedInput.startsWith("data:")
        ) {
            return normalizedInput
        }
        const normalizedUrl = normalizedInput.startsWith("/") ? normalizedInput : `/${normalizedInput}`
        return `${STORAGE_URL}${normalizedUrl}`
    }
    // useProperties peut être asynchrone — on utilise mockOwners comme fallback
    const { owner, loading: ownersLoading } = useOwners({ agencyId: parseInt(existingProperty.agency_id, 10) })
    const { commodite, loading: commoditeLoading } = useGetCommodite()


    const owners: Owner[] = (owner as Owner[])

    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        title: existingProperty.title,
        propertyType: existingProperty.propertyType,
        listingType: existingProperty.listingType,
        price: existingProperty.price,
        status: existingProperty.status,
        city: existingProperty.city,
        neighborhood: existingProperty.neighborhood,
        address: existingProperty.address,
        surface: existingProperty.surface,
        rooms: existingProperty.rooms,
        bathrooms: existingProperty.bathrooms,
        floor: existingProperty.floor,
        furnished: existingProperty.furnished,
        description: existingProperty.description,
        images: [] as string[],
        video: "",
        commodite: existingProperty.features.map((f) => (typeof f === "string" ? parseInt(f, 10) : f.id)),
        ownerId: existingProperty.owners_id,
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [uploadedImages, setUploadedImages] = useState<MediaImage[]>(
        (existingProperty.images || []).map((img, index) => ({
            id: `existing-${index}`,
            url: getImagePath(img),
        }))
    )
    const [imageFilesById, setImageFilesById] = useState<Record<string, File>>({})
    const [isDragging, setIsDragging] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [ownerSearch, setOwnerSearch] = useState("")
    const [showNewOwnerDialog, setShowNewOwnerDialog] = useState(false)

    // ✅ FIX 1 — selectedOwner initialisé à null, puis synchronisé quand owners se charge
    // Sans useEffect, useState s'exécute avant que useProperties ait retourné les données,
    // donc owners=[] au premier render → find() échoue toujours.
    const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const createdBlobUrlsRef = useRef<string[]>([])

    useEffect(() => {
        return () => {
            createdBlobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
        }
    }, [])

    useEffect(() => {
        if (owners.length === 0) return
        // On ne réinitialise pas si l'utilisateur a déjà fait un choix manuel
        setSelectedOwner((prev) => {
            if (prev !== null) return prev
            return owners.find((o) => o.id === existingProperty.owners_id) ?? null
        })
    }, [owners, existingProperty.owners_id])

    // ─── Validation ───────────────────────────────────────────────────────────

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {}
        if (step === 1) {
            if (!formData.title) newErrors.title = "Le titre est requis"
            if (!formData.propertyType) newErrors.propertyType = "Le type de bien est requis"
            if (!formData.price) newErrors.price = "Le prix est requis"
        } else if (step === 2) {
            if (!formData.city) newErrors.city = "La ville est requise"
            if (!formData.address) newErrors.address = "L'adresse est requise"
        } else if (step === 3) {
            if (!formData.surface) newErrors.surface = "La surface est requise"
            if (!formData.rooms) newErrors.rooms = "Le nombre de pièces est requis"
        } else if (step === 4) {
            if (uploadedImages.length === 0) newErrors.images = "Au moins une image est requise"
        } else if (step === 5) {
            if (!selectedOwner) newErrors.owner = "Le propriétaire est requis"
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, steps.length))
        }
    }

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1))
    }

    // ─── Drag & Drop ──────────────────────────────────────────────────────────

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => setIsDragging(false)

    const addFilesToGallery = (files: FileList | File[]) => {
        const filesArray = Array.from(files)
        const imageFiles = filesArray.filter((file) => file.type.startsWith("image/"))

        if (imageFiles.length === 0) return

        const nextImages: MediaImage[] = imageFiles.map((file, index) => {
            const id = `new-${Date.now()}-${index}`
            const blobUrl = URL.createObjectURL(file)
            createdBlobUrlsRef.current.push(blobUrl)

            return {
                id,
                url: blobUrl,
            }
        })

        setImageFilesById((prev) => {
            const next = { ...prev }
            nextImages.forEach((image, index) => {
                next[image.id] = imageFiles[index]
            })
            return next
        })

        setUploadedImages((prev) => [...prev, ...nextImages])
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files?.length) {
            addFilesToGallery(e.dataTransfer.files)
        }
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return
        addFilesToGallery(e.target.files)
        e.target.value = ""
    }

    const removeImage = (id: string) => {
        setUploadedImages((prev) => {
            const imageToRemove = prev.find((image) => image.id === id)
            if (imageToRemove?.url?.startsWith("blob:")) {
                URL.revokeObjectURL(imageToRemove.url)
                createdBlobUrlsRef.current = createdBlobUrlsRef.current.filter((url) => url !== imageToRemove.url)
            }
            return prev.filter((image) => image.id !== id)
        })
        setImageFilesById((prev) => {
            const next = { ...prev }
            delete next[id]
            return next
        })
    }

    // ─── Owner search ─────────────────────────────────────────────────────────

    // ✅ FIX 2 — on protège aussi lastName contre undefined
    const filteredOwners = owners.filter((o) => {
        const search = ownerSearch.toLowerCase()
        return (
            (o.firstName ?? "").toLowerCase().includes(search) ||
            (o.lastName ?? "").toLowerCase().includes(search) ||
            (o.email ?? "").toLowerCase().includes(search)
        )
    })

    // ─── Feature toggle ───────────────────────────────────────────────────────────

    const toggleFeature = (id: number, checked: boolean) => {
        setFormData((fd) => ({
            ...fd,
            commodite: checked
                ? [...fd.commodite, id]
                : fd.commodite.filter((f) => f !== id),
        }))
    }

    // ─── Submit ───────────────────────────────────────────────────────────────

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return

        setIsSubmitting(true)
        try {
            const formDataToSend = new FormData()

            // ── Champs scalaires ──────────────────────────────────────────────────
            formDataToSend.append("title", formData.title)
            formDataToSend.append("propertyType", formData.propertyType)
            formDataToSend.append("listingType", formData.listingType)
            formDataToSend.append("price", formData.price.toString())
            formDataToSend.append("status", formData.status)
            formDataToSend.append("city", formData.city)
            formDataToSend.append("neighborhood", formData.neighborhood ?? "")
            formDataToSend.append("address", formData.address)
            formDataToSend.append("surface", formData.surface.toString())
            formDataToSend.append("rooms", formData.rooms.toString())
            formDataToSend.append("bathrooms", formData.bathrooms.toString())
            formDataToSend.append("floor", formData.floor?.toString() ?? "")
            formDataToSend.append("furnished", formData.furnished ? "1" : "0")
            formDataToSend.append("description", formData.description ?? "")
            formDataToSend.append("ownerId", selectedOwner?.id ?? "")

            // ── Méthode HTTP spoofing (Laravel ne lit pas PUT multipart) ──────────
            formDataToSend.append("_method", "PUT")

            // ── Features ─────────────────────────────────────────────────────────
            formData.commodite.forEach((id) => {
                formDataToSend.append("features[]", id.toString())
            })

            // ── Images conservées (URLs existantes) ──────────────────────────────
            const keptImages = uploadedImages.filter((img) => !img.url.startsWith("blob:"))
            keptImages.forEach((img) => {
                formDataToSend.append("keptImages[]", img.url)
            })

            // ── Nouvelles images (vrais fichiers File) ────────────────────────────
            const newImageEntries = uploadedImages.filter((img) => img.url.startsWith("blob:"))
            newImageEntries.forEach((img) => {
                const file = imageFilesById[img.id]
                if (file) {
                    formDataToSend.append("newImages[]", file)
                }
            })

            const response = await axiosInstance.post(
                `/api/biens/${existingProperty.id}`,
                formDataToSend,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            )

            console.log("Response:", response.data)
            toast.success("Bien mis à jour avec succès !")
        } catch (error) {
            console.error("Error updating property:", error)
            toast.error("Une erreur est survenue lors de la mise à jour du bien.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">
            <PropertyEditHeader property={existingProperty} />

            <PropertyEditStepper currentStep={currentStep} setCurrentStep={setCurrentStep} />

            <Card>
                <CardHeader>
                    <CardTitle>{steps[currentStep - 1].name}</CardTitle>
                    <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* ── Step 1 : Informations de base ── */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">
                                    Titre du bien <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="title"
                                    placeholder="ex: Appartement moderne avec vue sur la ville"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className={errors.title ? "border-destructive" : ""}
                                />
                                {errors.title && <FieldError message={errors.title} />}
                            </div>

                            <div className="space-y-2">
                                <Label>
                                    Type de bien <span className="text-destructive">*</span>
                                </Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {propertyTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, propertyType: type.value })}
                                            className={cn(
                                                "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                                                formData.propertyType === type.value
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/50"
                                            )}
                                        >
                                            <type.icon className={cn("h-6 w-6", formData.propertyType === type.value ? "text-primary" : "text-muted-foreground")} />
                                            <span className={cn("text-sm font-medium", formData.propertyType === type.value ? "text-primary" : "text-foreground")}>
                                                {type.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                {errors.propertyType && <FieldError message={errors.propertyType} />}
                            </div>

                            <div className="space-y-2">
                                <Label>Type d'annonce</Label>
                                <div className="flex gap-3">
                                    {(["sale", "rent"] as const).map((type) => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, listingType: type })}
                                            className={cn(
                                                "flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium",
                                                formData.listingType === type
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-border hover:border-primary/50"
                                            )}
                                        >
                                            {type === "sale" ? "À vendre" : "À louer"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="price">
                                        Prix <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">€</span>
                                        <Input
                                            id="price"
                                            type="number"
                                            placeholder="0"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                            className={cn("pl-7", errors.price ? "border-destructive" : "")}
                                        />
                                        {formData.listingType === "rent" && (
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/mois</span>
                                        )}
                                    </div>
                                    {errors.price && <FieldError message={errors.price} />}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="status">Statut de disponibilité</Label>
                                    <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="available">Disponible</SelectItem>
                                            <SelectItem value="pending">En attente</SelectItem>
                                            <SelectItem value="reserved">Réservé</SelectItem>
                                            <SelectItem value="sold">Vendu</SelectItem>
                                            <SelectItem value="rented">Loué</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Step 2 : Localisation ── */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="city">Ville <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="city"
                                        placeholder="ex: Dakar, Paris, New York"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    />
                                    {errors.city && <FieldError message={errors.city} />}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="neighborhood">Quartier</Label>
                                    <Input
                                        id="neighborhood"
                                        placeholder="ex: Centre-ville"
                                        value={formData.neighborhood}
                                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Adresse complète <span className="text-destructive">*</span></Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Textarea
                                        id="address"
                                        placeholder="Saisir l'adresse complète du bien"
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className={cn("pl-9 min-h-[80px]", errors.address ? "border-destructive" : "")}
                                    />
                                </div>
                                {errors.address && <FieldError message={errors.address} />}
                            </div>

                            <div className="space-y-2">
                                <Label>Localisation sur la carte</Label>
                                <div className="relative aspect-video rounded-lg border border-border bg-muted overflow-hidden">
                                    {formData.address ? (
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            loading="lazy"
                                            allowFullScreen
                                            src={`https://www.google.com/maps?q=${encodeURIComponent(`${formData.neighborhood}, ${formData.city}`)}&output=embed`}
                                            className="border-0"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                                                <p className="text-sm text-muted-foreground">Adresse non disponible</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Step 3 : Détails ── */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="surface">Surface (m²) <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="surface"
                                        type="number"
                                        placeholder="0"
                                        value={formData.surface}
                                        onChange={(e) => setFormData({ ...formData, surface: parseFloat(e.target.value) || 0 })}
                                        className={errors.surface ? "border-destructive" : ""}
                                    />
                                    {errors.surface && <FieldError message={errors.surface} />}
                                </div>

                                <div className="space-y-2">
                                    <Label>Chambres <span className="text-destructive">*</span></Label>
                                    <Select value={formData.rooms.toString()} onValueChange={(v) => setFormData({ ...formData, rooms: parseInt(v, 10) })}>
                                        <SelectTrigger className={errors.rooms ? "border-destructive" : ""}>
                                            <SelectValue>
                                                {formData.rooms ? `${formData.rooms} ${formData.rooms > 1 ? "chambres" : "chambre"}` : "Sélectionner"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                                <SelectItem key={n} value={n.toString()}>
                                                    {n} {n > 1 ? "chambres" : "chambre"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.rooms && <FieldError message={errors.rooms} />}
                                </div>

                                <div className="space-y-2">
                                    <Label>Salles de bain</Label>
                                    <Select value={formData.bathrooms.toString()} onValueChange={(v) => setFormData({ ...formData, bathrooms: parseInt(v, 10) })}>
                                        <SelectTrigger>
                                            <SelectValue>
                                                {formData.bathrooms ? `${formData.bathrooms} ${formData.bathrooms > 1 ? "salles de bain" : "salle de bain"}` : "Sélectionner"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5].map((n) => (
                                                <SelectItem key={n} value={n.toString()}>
                                                    {n} {n > 1 ? "salles de bain" : "salle de bain"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Étage</Label>
                                    <Select value={formData.floor} onValueChange={(v) => setFormData({ ...formData, floor: v })}>
                                        <SelectTrigger>
                                            <SelectValue>
                                                {formData.floor ? `${formData.floor === "ground" ? "Rez-de-chaussée" : formData.floor === "penthouse" ? "Penthouse" : `Étage ${formData.floor}`}` : "Sélectionner"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ground">Rez-de-chaussée</SelectItem>
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((n) => (
                                                <SelectItem key={n} value={n.toString()}>Étage {n}</SelectItem>
                                            ))}
                                            <SelectItem value="penthouse">Penthouse</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                                <div className="space-y-0.5">
                                    <Label htmlFor="furnished" className="cursor-pointer">Meublé</Label>
                                    <p className="text-sm text-muted-foreground">Ce bien est-il meublé ?</p>
                                </div>
                                <Switch
                                    id="furnished"
                                    checked={formData.furnished}
                                    onCheckedChange={(c) => setFormData({ ...formData, furnished: c })}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Décrivez les caractéristiques, les équipements et les particularités du bien..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="min-h-[150px]"
                                />
                            </div>
                            {(commodite ?? []).length > 0 && (
                                <div className="space-y-3">
                                    <Label>Commodités</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {(commodite as Array<{ id: number; name: string }> ?? []).map((feature) => {
                                            const checked = formData.commodite.includes(feature.id)
                                            return (
                                                <button
                                                    key={feature.id}
                                                    type="button"
                                                    onClick={() => toggleFeature(feature.id, !checked)}
                                                    className={cn(
                                                        "flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all",
                                                        checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors",
                                                        checked ? "border-primary bg-primary" : "border-muted-foreground"
                                                    )}>
                                                        {checked && <Check className="h-3 w-3 text-primary-foreground" />}
                                                    </div>
                                                    <span className={cn("text-sm", checked ? "text-primary font-medium" : "text-foreground")}>
                                                        {feature.name}
                                                    </span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                    {errors.features && <FieldError message={errors.features} />}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Step 4 : Médias ── */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Images du bien <span className="text-destructive">*</span></Label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleFileInputChange}
                                    className="hidden"
                                />
                                <div
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    className={cn(
                                        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                                        isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
                                        errors.images && "border-destructive"
                                    )}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="p-3 rounded-full bg-muted mb-4">
                                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium mb-1">Glissez-déposez vos images ici</p>
                                        <p className="text-xs text-muted-foreground mb-4">PNG, JPG jusqu'à 10MB chacun</p>
                                        <Button variant="outline" type="button" onClick={() => fileInputRef.current?.click()}>
                                            <Upload className="mr-2 h-4 w-4" />
                                            Parcourir les fichiers
                                        </Button>
                                    </div>
                                </div>
                                {errors.images && <FieldError message={errors.images} />}
                            </div>

                            {uploadedImages.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Images téléchargées ({uploadedImages.length})</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {uploadedImages.map((image, index) => (
                                            <div key={image.id} className="relative group">
                                                <div className="aspect-square rounded-lg overflow-hidden border border-border">
                                                    <Image
                                                        src={resolveImageUrl(image.url)}
                                                        alt={`Image du bien ${index + 1}`}
                                                        fill
                                                        className="object-cover"
                                                        loading={index === 0 ? "eager" : "lazy"}
                                                        priority={index === 0}
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(image.id)}
                                                    className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                                {index === 0 && <Badge className="absolute bottom-2 left-2" variant="secondary">Couverture</Badge>}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            <Plus className="h-6 w-6 mb-1" />
                                            <span className="text-xs">Ajouter plus</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            <Separator />

                            <div className="space-y-2">
                                <Label>Visite virtuelle (Optionnel)</Label>
                                <div className="border-2 border-dashed rounded-lg p-6 text-center border-border hover:border-primary/50 transition-colors">
                                    <div className="flex flex-col items-center">
                                        <div className="p-3 rounded-full bg-muted mb-3">
                                            <Video className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium mb-1">Télécharger une visite virtuelle</p>
                                        <p className="text-xs text-muted-foreground mb-3">MP4, MOV jusqu'à 100MB</p>
                                        <Button variant="outline" size="sm" type="button">
                                            <Upload className="mr-2 h-3 w-3" />
                                            Télécharger une vidéo
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Step 5 : Propriétaire ── */}
                    {currentStep === 5 && (
                        <div className="space-y-6">
                            {/* ✅ FIX 3 — Afficher un loader pendant que les owners se chargent */}
                            {ownersLoading ? (
                                <div className="flex items-center justify-center py-12 gap-2 text-muted-foreground">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span className="text-sm">Chargement des propriétaires...</span>
                                </div>
                            ) : (
                                <>
                                    {/* ✅ FIX 4 — Bannière "propriétaire actuel" clairement identifié */}
                                    {selectedOwner && (
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                                            <Check className="h-4 w-4 text-primary shrink-0" />
                                            <span>
                                                Propriétaire actuel :{" "}
                                                <strong>{selectedOwner.firstName} {selectedOwner.lastName}</strong>
                                            </span>
                                            <span className="text-muted-foreground ml-auto">{selectedOwner.email}</span>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <Label>Sélectionner le propriétaire <span className="text-destructive">*</span></Label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Rechercher par nom ou email..."
                                                value={ownerSearch}
                                                onChange={(e) => setOwnerSearch(e.target.value)}
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                                        {filteredOwners.length === 0 ? (
                                            <p className="text-sm text-muted-foreground text-center py-6">
                                                Aucun propriétaire trouvé
                                            </p>
                                        ) : (
                                            filteredOwners.map((o) => (
                                                <button
                                                    key={o.id}
                                                    type="button"
                                                    onClick={() => setSelectedOwner(o)}
                                                    className={cn(
                                                        "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
                                                        selectedOwner?.id === o.id
                                                            ? "border-primary bg-primary/5"
                                                            : "border-border hover:border-primary/50"
                                                    )}
                                                >
                                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                                                        <User className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        {/* ✅ FIX 5 — firstName + lastName (plus .name qui n'existe pas) */}
                                                        <p className="font-medium">{o.firstName} {o.lastName}</p>
                                                        <p className="text-sm text-muted-foreground truncate">{o.email}</p>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground shrink-0">{o.phone}</p>
                                                    {selectedOwner?.id === o.id && (
                                                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                                                            <Check className="h-4 w-4 text-primary-foreground" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))
                                        )}
                                    </div>

                                    {errors.owner && <FieldError message={errors.owner} />}

                                    <Separator />

                                    {/* <Dialog open={showNewOwnerDialog} onOpenChange={setShowNewOwnerDialog}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" className="w-full">
                                                <Plus className="mr-2 h-4 w-4" />
                                                Créer un nouveau propriétaire
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Créer un nouveau propriétaire</DialogTitle>
                                                <DialogDescription>Ajouter un nouveau propriétaire à votre base de données</DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="ownerFirstName">Prénom</Label>
                                                        <Input id="ownerFirstName" placeholder="Jean" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="ownerLastName">Nom</Label>
                                                        <Input id="ownerLastName" placeholder="Dupont" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="ownerEmail">Email</Label>
                                                    <Input id="ownerEmail" type="email" placeholder="jean@example.com" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="ownerPhone">Numéro de téléphone</Label>
                                                    <Input id="ownerPhone" placeholder="+33 1 23 45 67 89" />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button variant="outline" onClick={() => setShowNewOwnerDialog(false)}>Annuler</Button>
                                                <Button onClick={() => setShowNewOwnerDialog(false)}>Créer propriétaire</Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog> */}
                                </>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* ── Navigation ── */}
            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Précédent
                </Button>

                <div className="flex gap-3">
                    {/* <Button variant="outline">
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les modifications
                    </Button> */}

                    {currentStep < steps.length ? (
                        <Button onClick={handleNext}>
                            Suivant
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Mise à jour...
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Mettre à jour le bien
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Petit composant utilitaire ───────────────────────────────────────────────

function FieldError({ message }: { message: string }) {
    return (
        <p className="text-sm text-destructive flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {message}
        </p>
    )
}
