"use client"

import React, { useRef, useState } from "react"
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
  Send,
  Star,
  Trash,
  UserPlus,
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
import { cn } from "@/lib/utils"
import PropertiesNewHeader from "./PropertiesNewHeader"
import PropertiesNewStepper from "./PropertiesNewStepper"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

// ─── Types ────────────────────────────────────────────────────────────────────

interface UploadedImage {
  preview: string
  file: File
  name: string
  size: number
}

interface UploadedVideo {
  preview: string
  file: File
  name: string
  size: number
}

interface Owner {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface Feature {
  id: number
  name: string
  icon: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE_MB = 4  // aligné avec le backend (max:4096 KB)
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"]

const MAX_VIDEO_SIZE_MB = 20  // aligné avec le backend (max:20000 KB)
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/quicktime", "video/x-msvideo"]

// ─── Steps ────────────────────────────────────────────────────────────────────

const steps = [
  { id: 1, name: "Informations de base", description: "Détails de la propriété" },
  { id: 2, name: "Emplacement", description: "Adresse et carte" },
  { id: 3, name: "Détails", description: "Spécifications" },
  { id: 4, name: "Médias", description: "Photos et vidéos" },
  { id: 5, name: "Propriétaire", description: "Propriétaire de la propriété" },
]

type PropertyFormData = {
  agency_id: number
  title: string
  propertyType: string
  listingType: "sale" | "rent"
  price: number
  status: "available" | "pending" | "sold"

  city: string
  neighborhood: string
  address: string

  surface: number | ""
  rooms: number | ""
  bathrooms: number | ""
  // floor est nullable integer côté backend — on stocke number | null
  floor: number | null
  furnished: boolean
  description: string

  // features: tableau d'IDs (number[])
  features: number[]

  owners_id: number | ""

  images: File[]
  video: File | null
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PropertiesNew({
  propertyTypes,
  owners,
  agencyId,
  features,
}: {
  propertyTypes: { value: string; label: string; icon: React.ComponentType<any> }[]
  owners: Owner[]
  agencyId?: number
  features: Feature[]
}) {
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState<PropertyFormData>({
    agency_id: agencyId ?? 0,
    title: "",
    propertyType: "",
    listingType: "sale",
    price: 0,
    status: "available",
    city: "",
    neighborhood: "",
    address: "",
    surface: "",
    rooms: "",
    bathrooms: "",
    floor: null,
    furnished: false,
    description: "",
    features: [],
    images: [],
    video: null,
    owners_id: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverErrors, setServerErrors] = useState<Record<string, string[]>>({})

  // ─── Image state ──────────────────────────────────────────────────────────────
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── Video state ──────────────────────────────────────────────────────────────
  const [uploadedVideo, setUploadedVideo] = useState<UploadedVideo | null>(null)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [isDraggingVideo, setIsDraggingVideo] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // ─── Owner state ──────────────────────────────────────────────────────────────
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
  const [ownerSearch, setOwnerSearch] = useState("")

  // ─── Image helpers ────────────────────────────────────────────────────────────

  const processFiles = (files: FileList | File[]): { valid: UploadedImage[]; error: string | null } => {
    const fileArray = Array.from(files)
    const errs: string[] = []
    const valid: UploadedImage[] = []

    for (const file of fileArray) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        errs.push(`"${file.name}" : format non supporté (PNG, JPG, WEBP uniquement)`)
        continue
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        errs.push(`"${file.name}" : dépasse ${MAX_FILE_SIZE_MB}Mo`)
        continue
      }
      valid.push({
        preview: URL.createObjectURL(file),
        file,
        name: file.name,
        size: file.size,
      })
    }

    return { valid, error: errs.length > 0 ? errs.join(" • ") : null }
  }

  const addImages = (files: FileList | File[]) => {
    const { valid, error } = processFiles(files)
    setUploadError(error)
    if (valid.length === 0) return
    setUploadedImages((prev) => {
      const next = [...prev, ...valid]
      setFormData((fd) => ({ ...fd, images: next.map((img) => img.file) }))
      return next
    })
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      URL.revokeObjectURL(prev[index].preview)
      const next = prev.filter((_, i) => i !== index)
      setFormData((fd) => ({ ...fd, images: next.map((img) => img.file) }))
      return next
    })
  }

  const setCover = (index: number) => {
    if (index === 0) return
    setUploadedImages((prev) => {
      const next = [...prev]
      const [item] = next.splice(index, 1)
      next.unshift(item)
      setFormData((fd) => ({ ...fd, images: next.map((img) => img.file) }))
      return next
    })
  }

  // ─── Video helpers ────────────────────────────────────────────────────────────

  const processVideo = (file: File): string | null => {
    if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
      return `Format non supporté — MP4, MOV ou AVI uniquement`
    }
    if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
      return `La vidéo dépasse ${MAX_VIDEO_SIZE_MB}Mo`
    }
    return null
  }

  const addVideo = (file: File) => {
    const error = processVideo(file)
    if (error) { setVideoError(error); return }
    setVideoError(null)
    if (uploadedVideo) URL.revokeObjectURL(uploadedVideo.preview)
    const video: UploadedVideo = { preview: URL.createObjectURL(file), file, name: file.name, size: file.size }
    setUploadedVideo(video)
    setFormData((fd) => ({ ...fd, video: file }))
  }

  const removeVideo = () => {
    if (uploadedVideo) URL.revokeObjectURL(uploadedVideo.preview)
    setUploadedVideo(null)
    setFormData((fd) => ({ ...fd, video: null }))
    if (videoInputRef.current) videoInputRef.current.value = ""
  }

  // ─── Drag & Drop ─────────────────────────────────────────────────────────────

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = () => setIsDragging(false)
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); addImages(e.dataTransfer.files) }
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files) { addImages(e.target.files); e.target.value = "" } }
  const openFilePicker = () => fileInputRef.current?.click()

  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (file) addVideo(file); e.target.value = "" }
  const handleVideoDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDraggingVideo(false); const file = e.dataTransfer.files?.[0]; if (file) addVideo(file) }
  const openVideoPicker = () => videoInputRef.current?.click()

  // ─── Feature toggle ───────────────────────────────────────────────────────────

  const toggleFeature = (id: number, checked: boolean) => {
    setFormData((fd) => ({
      ...fd,
      features: checked ? [...fd.features, id] : fd.features.filter((f) => f !== id),
    }))
  }

  // ─── Validation client ────────────────────────────────────────────────────────

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Le titre est requis"
      if (!formData.propertyType) newErrors.propertyType = "Le type de propriété est requis"
      if (!formData.price || formData.price <= 0) newErrors.price = "Le prix est requis"
    } else if (step === 2) {
      if (!formData.city.trim()) newErrors.city = "La ville est requise"
      if (!formData.address.trim()) newErrors.address = "L'adresse est requise"
    } else if (step === 3) {
      if (formData.surface === "" || Number(formData.surface) <= 0) newErrors.surface = "La superficie est requise"
      if (formData.rooms === "") newErrors.rooms = "Le nombre de pièces est requis"
    } else if (step === 4) {
      if (formData.images.length === 0) newErrors.images = "Au moins une image est requise"
    } else if (step === 5) {
      if (!selectedOwner) newErrors.owner = "Le propriétaire est requis"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => { if (validateStep(currentStep)) setCurrentStep((prev) => Math.min(prev + 1, steps.length)) }
  const handlePrevious = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  // ─── Owner filter ─────────────────────────────────────────────────────────────

  const filteredOwners =  (owners ?? []).filter(
    (o) =>
      `${o.firstName} ${o.lastName}`.toLowerCase().includes(ownerSearch.toLowerCase()) ||
      o.email.toLowerCase().includes(ownerSearch.toLowerCase())
  )

  // ─── Submit ───────────────────────────────────────────────────────────────────

  /**
   * Construit un FormData complet respectant la validation Laravel :
   * - Tous les champs texte/number en string via append()
   * - Les booléens en "1" / "0" (PHP cast boolean)
   * - features[] en entrées séparées
   * - images[] en entrées séparées
   * - floor : null → on n'append pas (nullable)
   */
  const buildPayload = (): FormData => {
    const payload = new FormData()

    payload.append("agency_id", String(formData.agency_id))
    payload.append("title", formData.title)
    payload.append("propertyType", formData.propertyType)
    payload.append("listingType", formData.listingType)
    payload.append("price", String(formData.price))
    payload.append("status", formData.status)

    payload.append("city", formData.city)
    if (formData.neighborhood) payload.append("neighborhood", formData.neighborhood)
    payload.append("address", formData.address)

    if (formData.surface !== "") payload.append("surface", String(formData.surface))
    if (formData.rooms !== "") payload.append("rooms", String(formData.rooms))
    if (formData.bathrooms !== "") payload.append("bathrooms", String(formData.bathrooms))
    if (formData.floor !== null) payload.append("floor", String(formData.floor))

    // Laravel interprète "1"/"0" comme boolean pour furnished
    payload.append("furnished", formData.furnished ? "1" : "0")

    if (formData.description) payload.append("description", formData.description)

    // owners_id : Laravel attend un entier (exists:owners,id)
    payload.append("owners_id", String(formData.owners_id))

    // features[] : un append par ID
    formData.features.forEach((id) => payload.append("features[]", String(id)))

    // images[] : un append par File
    formData.images.forEach((file) => payload.append("images[]", file))

    // video : fichier unique
    if (formData.video) payload.append("video", formData.video)

    return payload
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return
    setIsSubmitting(true)
    setServerErrors({})

    try {
      const res = await axiosInstance.post("/api/biens", buildPayload(), {
        headers: { "Content-Type": "multipart/form-data" },
      })
      console.log("Bien créé :", res.data)
      toast.success("Propriété créée avec succès !")
      window.location.href = `/dashboard/properties/`
      // TODO: redirection ou notification de succès
    } catch (error: any) {
      if (error?.response?.status === 422) {
        // Erreurs de validation Laravel — shape : { errors: { field: string[] } }
        const laravelErrors: Record<string, string[]> = error.response.data?.errors ?? {}
        setServerErrors(laravelErrors)
        console.warn("Erreurs de validation serveur :", laravelErrors)
        toast.error("Le serveur a retourné des erreurs de validation. Veuillez vérifier les champs.")
      } else {
        console.error("Erreur lors de la soumission :", error)
        toast.error("Une erreur est survenue lors de la création de la propriété.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper pour afficher les erreurs serveur d'un champ
  const serverFieldError = (field: string) =>
    serverErrors[field]?.[0] ?? null

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      <PropertiesNewHeader />
      <PropertiesNewStepper currentStep={currentStep} steps={steps} setCurrentStep={setCurrentStep} />

      {/* Bannière erreurs serveur globales */}
      {Object.keys(serverErrors).length > 0 && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 space-y-1">
          <p className="text-sm font-semibold text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Le serveur a retourné des erreurs de validation :
          </p>
          {Object.entries(serverErrors).map(([field, msgs]) => (
            msgs.map((msg, i) => (
              <p key={`${field}-${i}`} className="text-sm text-destructive ml-6">• {msg}</p>
            ))
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* ── Step 1 ── */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre de la propriété <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  placeholder="ex. : Appartement moderne avec vue sur la ville"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={errors.title || serverFieldError("title") ? "border-destructive" : ""}
                />
                {errors.title && <FieldError message={errors.title} />}
                {serverFieldError("title") && <FieldError message={serverFieldError("title")!} />}
                <p className="text-xs text-muted-foreground">Un titre descriptif aide à attirer les clients potentiels</p>
              </div>

              <div className="space-y-2">
                <Label>Type de propriété <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, propertyType: type.value })}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                        formData.propertyType === type.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
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
                {serverFieldError("propertyType") && <FieldError message={serverFieldError("propertyType")!} />}
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
                        formData.listingType === type ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"
                      )}
                    >
                      {type === "sale" ? "À vendre" : "À louer"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      placeholder="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className={cn("pl-7", errors.price || serverFieldError("price") ? "border-destructive" : "")}
                    />
                    {formData.listingType === "rent" && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/mois</span>
                    )}
                  </div>
                  {errors.price && <FieldError message={errors.price} />}
                  {serverFieldError("price") && <FieldError message={serverFieldError("price")!} />}
                </div>
                <div className="space-y-2">
                  <Label>Statut de disponibilité</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v) => setFormData({ ...formData, status: v as PropertyFormData["status"] })}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Disponible</SelectItem>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="sold">Vendu</SelectItem>
                    </SelectContent>
                  </Select>
                  {serverFieldError("status") && <FieldError message={serverFieldError("status")!} />}
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville <span className="text-destructive">*</span></Label>
                  <Input
                    id="city"
                    placeholder="ex. : Dakar, Thiés, Saint-Louis"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={errors.city || serverFieldError("city") ? "border-destructive" : ""}
                  />
                  {errors.city && <FieldError message={errors.city} />}
                  {serverFieldError("city") && <FieldError message={serverFieldError("city")!} />}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Quartier</Label>
                  <Input
                    id="neighborhood"
                    placeholder="ex. : Centre-ville, Plateau"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  />
                  {serverFieldError("neighborhood") && <FieldError message={serverFieldError("neighborhood")!} />}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse complète <span className="text-destructive">*</span></Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    placeholder="Entrez l'adresse complète de la propriété"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={cn("pl-9 min-h-[80px]", errors.address || serverFieldError("address") ? "border-destructive" : "")}
                  />
                </div>
                {errors.address && <FieldError message={errors.address} />}
                {serverFieldError("address") && <FieldError message={serverFieldError("address")!} />}
              </div>

              <div className="space-y-2">
                <Label>Localisation sur la carte</Label>
                <div className="relative aspect-video rounded-lg border border-border bg-muted overflow-hidden">
                  {formData.city && formData.neighborhood ? (
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
                        <p className="text-sm text-muted-foreground">Renseignez la ville et le quartier pour afficher la carte</p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">La carte sera affichée sur la page de l'annonce</p>
              </div>
            </div>
          )}

          {/* ── Step 3 ── */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="surface">Superficie (m²) <span className="text-destructive">*</span></Label>
                  <Input
                    id="surface"
                    type="number"
                    min={0}
                    placeholder="0"
                    value={formData.surface}
                    onChange={(e) => setFormData({ ...formData, surface: e.target.value === "" ? "" : Number(e.target.value) })}
                    className={errors.surface || serverFieldError("surface") ? "border-destructive" : ""}
                  />
                  {errors.surface && <FieldError message={errors.surface} />}
                  {serverFieldError("surface") && <FieldError message={serverFieldError("surface")!} />}
                </div>

                <div className="space-y-2">
                  <Label>Chambres/ Pièces <span className="text-destructive">*</span></Label>
                  <Select
                    value={formData.rooms === "" ? "" : String(formData.rooms)}
                    onValueChange={(v) => setFormData({ ...formData, rooms: Number(v) })}
                  >
                    <SelectTrigger className={errors.rooms || serverFieldError("rooms") ? "border-destructive" : ""}>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "chambre/pièce" : "chambres/pièces"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.rooms && <FieldError message={errors.rooms} />}
                  {serverFieldError("rooms") && <FieldError message={serverFieldError("rooms")!} />}
                </div>

                <div className="space-y-2">
                  <Label>Salles de bain</Label>
                  <Select
                    value={formData.bathrooms === "" ? "" : String(formData.bathrooms)}
                    onValueChange={(v) => setFormData({ ...formData, bathrooms: Number(v) })}
                  >
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "salle de bain" : "salles de bain"}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {serverFieldError("bathrooms") && <FieldError message={serverFieldError("bathrooms")!} />}
                </div>

                <div className="space-y-2">
                  <Label>Étage</Label>
                  {/*
                    Le backend attend nullable|integer.
                    On stocke null quand rien n'est sélectionné,
                    0 pour rez-de-chaussée, et le numéro pour les étages.
                    "penthouse" n'est pas un integer valide → on utilise une valeur arbitraire (ex: 99).
                  */}
                  <Select
                    value={formData.floor === null ? "" : String(formData.floor)}
                    onValueChange={(v) => setFormData({ ...formData, floor: v === "" ? null : Number(v) })}
                  >
                    <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Rez-de-chaussée</SelectItem>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((n) => (
                        <SelectItem key={n} value={String(n)}>Étage {n}</SelectItem>
                      ))}
                      <SelectItem value="99">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                  {serverFieldError("floor") && <FieldError message={serverFieldError("floor")!} />}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-0.5">
                  <Label htmlFor="furnished" className="cursor-pointer">Meublé</Label>
                  <p className="text-sm text-muted-foreground">Cette propriété est-elle meublée ?</p>
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
                  placeholder="Décrivez les caractéristiques, commodités et particularités de la propriété..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground">Une description détaillée aide les clients à mieux comprendre la propriété</p>
              </div>

              {/* ── Commodités / Features ── */}
              {features.length > 0 && (
                <div className="space-y-3">
                  <Label>Commodités</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {features.map((feature) => {
                      const checked = formData.features.includes(feature.id)
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
                  {serverFieldError("features") && <FieldError message={serverFieldError("features")!} />}
                </div>
              )}
            </div>
          )}

          {/* ── Step 4 : Médias ── */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                multiple
                className="hidden"
                onChange={handleFileInputChange}
              />

              <div className="space-y-2">
                <Label>
                  Images de la propriété <span className="text-destructive">*</span>
                </Label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={openFilePicker}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                    isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30",
                    (errors.images || serverFieldError("images")) && "border-destructive"
                  )}
                >
                  <div className="flex flex-col items-center pointer-events-none">
                    <div className="p-3 rounded-full bg-muted mb-4">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">Glissez-déposez vos images ici</p>
                    <p className="text-xs text-muted-foreground mb-4">PNG, JPG, WEBP — max {MAX_FILE_SIZE_MB}Mo par fichier</p>
                    <Button
                      variant="outline"
                      type="button"
                      className="pointer-events-auto"
                      onClick={(e) => { e.stopPropagation(); openFilePicker() }}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Parcourir les fichiers
                    </Button>
                  </div>
                </div>
                {errors.images && <FieldError message={errors.images} />}
                {serverFieldError("images") && <FieldError message={serverFieldError("images")!} />}
                {uploadError && (
                  <p className="text-sm text-destructive flex items-start gap-1">
                    <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                    {uploadError}
                  </p>
                )}
              </div>

              {uploadedImages.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>
                      Images sélectionnées{" "}
                      <span className="font-normal text-muted-foreground">({uploadedImages.length})</span>
                    </Label>
                    <p className="text-xs text-muted-foreground">Cliquez sur ★ pour définir comme couverture</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((img, index) => (
                      <div key={img.name + index} className="relative group">
                        <div className={cn(
                          "aspect-square rounded-lg overflow-hidden border-2 transition-colors",
                          index === 0 ? "border-primary" : "border-border"
                        )}>
                          <img src={img.preview} alt={img.name} className="w-full h-full object-cover" />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          <Trash className="h-3 w-3" />
                        </button>
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => setCover(index)}
                            className="absolute top-2 left-2 p-1 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          >
                            <Star className="h-3 w-3" />
                          </button>
                        )}
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2 text-xs" variant="default">Couverture</Badge>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs p-1.5 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg truncate">
                          {img.name} · {(img.size / 1024).toFixed(0)}Ko
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={openFilePicker}
                      className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 hover:bg-muted/30 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="h-6 w-6 mb-1" />
                      <span className="text-xs">Ajouter</span>
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {formData.images.length} image{formData.images.length > 1 ? "s" : ""} prête{formData.images.length > 1 ? "s" : ""} à être envoyées
                  </p>
                </div>
              )}

              <Separator />

              {/* ── Vidéo ── */}
              <input
                ref={videoInputRef}
                type="file"
                accept={ACCEPTED_VIDEO_TYPES.join(",")}
                className="hidden"
                onChange={handleVideoInputChange}
              />

              <div className="space-y-3">
                <Label>
                  Visite virtuelle{" "}
                  <span className="text-muted-foreground font-normal">(optionnel)</span>
                </Label>

                {!uploadedVideo ? (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingVideo(true) }}
                    onDragLeave={() => setIsDraggingVideo(false)}
                    onDrop={handleVideoDrop}
                    onClick={openVideoPicker}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer",
                      isDraggingVideo ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
                    )}
                  >
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className="p-3 rounded-full bg-muted mb-3">
                        <Video className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-sm font-medium mb-1">Glissez-déposez votre vidéo ici</p>
                      <p className="text-xs text-muted-foreground mb-3">MP4, MOV, AVI — max {MAX_VIDEO_SIZE_MB}Mo</p>
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        className="pointer-events-auto"
                        onClick={(e) => { e.stopPropagation(); openVideoPicker() }}
                      >
                        <Upload className="mr-2 h-3 w-3" />
                        Choisir une vidéo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-border overflow-hidden">
                    <div className="relative bg-black aspect-video">
                      <video src={uploadedVideo.preview} controls className="w-full h-full object-contain" />
                    </div>
                    <div className="flex items-center justify-between gap-3 px-4 py-3 bg-muted/40">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-md bg-muted shrink-0">
                          <Video className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{uploadedVideo.name}</p>
                          <p className="text-xs text-muted-foreground">{(uploadedVideo.size / (1024 * 1024)).toFixed(1)}Mo</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm" type="button" onClick={openVideoPicker}>
                          <Upload className="mr-1.5 h-3 w-3" />
                          Remplacer
                        </Button>
                        <Button variant="destructive" size="sm" type="button" onClick={removeVideo}>
                          <X className="mr-1.5 h-3 w-3" />
                          Retirer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {videoError && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    {videoError}
                  </p>
                )}
                {serverFieldError("video") && <FieldError message={serverFieldError("video")!} />}
              </div>
            </div>
          )}

          {/* ── Step 5 : Propriétaire ── */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Sélectionnez le propriétaire <span className="text-destructive">*</span></Label>
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

              <div className="space-y-3">
                {/* si il ya pas de proprietaire affricher un button creer un proprietaire sinon afficher les proprietaire dans une liste et selectionner le proprietaire pour l'afficher dans une card en bas */}
                {owners.length === 0 && (
                  <div className="text-center py-10">
                    <p className="text-sm text-muted-foreground mb-4">Aucun propriétaire trouvé. Veuillez en créer un avant d'assigner une propriété.</p>
                    <Button onClick={() => window.location.href = "/dashboard/owners/new"}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Créer un propriétaire
                    </Button>
                  </div>
                )}  

                {filteredOwners.map((owner) => (
                  <button
                    key={owner.id}
                    type="button"
                    onClick={() => {
                      setSelectedOwner(owner)
                      // owners_id doit être un entier pour Laravel (exists:owners,id)
                      setFormData((fd) => ({ ...fd, owners_id: Number(owner.id) }))
                    }}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
                      selectedOwner?.id === owner.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{`${owner.firstName} ${owner.lastName}`}</p>
                      <p className="text-sm text-muted-foreground truncate">{owner.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{owner.phone}</p>
                    </div>
                    {selectedOwner?.id === owner.id && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {errors.owner && <FieldError message={errors.owner} />}
              {serverFieldError("owners_id") && <FieldError message={serverFieldError("owners_id")!} />}

              <Separator />

              {selectedOwner && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{`${selectedOwner.firstName} ${selectedOwner.lastName}`}</p>
                        <p className="text-sm text-muted-foreground">{selectedOwner.email}</p>
                        <p className="text-sm text-muted-foreground">{selectedOwner.phone}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
          <Button variant="outline" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer le brouillon
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Suivant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Publication...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Publier la propriété
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Utilitaire ───────────────────────────────────────────────────────────────

function FieldError({ message }: { message: string }) {
  return (
    <p className="text-sm text-destructive flex items-center gap-1">
      <AlertCircle className="h-3 w-3" />
      {message}
    </p>
  )
}
