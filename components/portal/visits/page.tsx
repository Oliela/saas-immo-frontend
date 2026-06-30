"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    Calendar, Clock, MapPin, User, CheckCircle, XCircle,
    MessageSquare, Star, ChevronDown, Phone, Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog"
import {
    Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import axiosInstance from "@/lib/axios"

// ─── Types ──────────────────────────────────────────────────────────────────

interface BienImage {
    id: number
    url: string
    alt: string | null
    bien_id: number
}

interface Agent {
    id: number
    nom: string
    prenom: string
    phone: string
    email: string
    account_type: string
}

interface Bien {
    id: number
    title: string
    propertyType: string
    listingType: string
    price: string
    city: string
    neighborhood: string
    address: string
    surface: string
    rooms: number
    images: BienImage[]
}

interface Visit {
    id: number
    status: string
    notes: string | null
    feedback: string | null
    note: number | null
    created_at: string
    visit_schedule: {
        visit_date: string
        start_time: string
        end_time: string
        bien: Bien
        agent: Agent
        agency: {
            name: string
            phone: string
        }
    }
}

interface Props {
    visits: Visit[]
    loading?: boolean
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const STORAGE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const isPast = (visit: Visit): boolean => {
    const { visit_date, end_time } = visit.visit_schedule
    const dateDepasee = new Date(`${visit_date}T${end_time}`) < new Date()
    const aujourdhui = new Date()
    aujourdhui.setHours(0, 0, 0, 0)
    const dateVisite = new Date(visit_date)
    dateVisite.setHours(0, 0, 0, 0)
    const jourDepasse = dateVisite < aujourdhui
    return dateDepasee || (jourDepasse && (visit.status === "pending" || visit.status === "confirmed"))
}

const formatTime = (t: string) => t.slice(0, 5)

const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
    })

const formatPrice = (price: string, listingType: string) => {
    const num = Number(price).toLocaleString("fr-FR")
    return listingType === "rent" ? `${num} FCFA / mois` : `${num} FCFA`
}

function getStatusBadge(status: string) {
    switch (status) {
        case "confirmed": return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Confirmée</Badge>
        case "pending":   return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">En attente</Badge>
        case "completed": return <Badge variant="secondary">Terminée</Badge>
        case "cancelled": return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Annulée</Badge>
        default:          return <Badge variant="outline">{status}</Badge>
    }
}

function StarRating({ rating, interactive = false, onRate }: {
    rating: number
    interactive?: boolean
    onRate?: (r: number) => void
}) {
    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={!interactive}
                    onClick={() => onRate?.(star)}
                    className={interactive ? "p-1 cursor-pointer" : "cursor-default"}
                >
                    <Star className={`${interactive ? "h-6 w-6" : "h-4 w-4"} ${
                        star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground"
                    }`} />
                </button>
            ))}
        </div>
    )
}

// ─── Composant image bien ────────────────────────────────────────────────────

function BienThumbnail({ bien, size = "lg" }: { bien: Bien; size?: "sm" | "lg" }) {
    const imageUrl = bien.images?.length > 0 ? `${STORAGE_URL}${bien.images[0].url}` : null

    return (
        <div className="relative w-full md:w-48 h-48 md:h-auto flex-shrink-0 bg-muted rounded-t-lg md:rounded-l-lg md:rounded-t-none flex items-center justify-center">
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={bien.images[0].alt ?? bien.title}
                    className="h-full w-full object-cover"
                />
            ) : (
                <Building2 className={size === "lg" ? "h-12 w-12 text-muted-foreground" : "h-8 w-8 text-muted-foreground"} />
            )}
        </div>
    )
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ListingVisitsPage({ visits, loading }: Props) {

    const [cancelDialogId, setCancelDialogId]     = useState<number | null>(null)
    const [feedbackDialogId, setFeedbackDialogId] = useState<number | null>(null)
    const [cancelReason, setCancelReason]         = useState("")
    const [isCancelling, setIsCancelling]         = useState(false)

    // ── État du formulaire de feedback ───────────────────────────────────────
    const [selectedRating, setSelectedRating]     = useState(0)      // → champ "note"
    const [agentPonctuel, setAgentPonctuel]       = useState("")
    const [agentDisponible, setAgentDisponible]   = useState("")
    const [visitConforme, setVisitConforme]       = useState("")
    const [commentaires, setCommentaires]         = useState("")
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)

    // Suivre les visites dont le feedback vient d'être soumis (sans recharger la page)
    const [submittedFeedbacks, setSubmittedFeedbacks] = useState<Record<number, string>>({})

    // ── Réinitialiser le formulaire de feedback ──────────────────────────────
    const resetFeedbackForm = () => {
        setSelectedRating(0)
        setAgentPonctuel("")
        setAgentDisponible("")
        setVisitConforme("")
        setCommentaires("")
    }

    // ── Soumettre le feedback ────────────────────────────────────────────────
    const handleSubmitFeedback = async (visitId: number, bienTitle: string) => {
        if (selectedRating === 0) {
            toast.error("Veuillez attribuer une note à la visite.")
            return
        }

        // Construire le texte structuré du feedback
        const parts: string[] = []
        if (agentPonctuel)   parts.push(`Ponctualité de l'agent : ${agentPonctuel}`)
        if (agentDisponible) parts.push(`Disponibilité / écoute de l'agent : ${agentDisponible}`)
        if (visitConforme)   parts.push(`Bien conforme à l'annonce : ${visitConforme}`)
        if (commentaires)    parts.push(`Commentaires : ${commentaires}`)

        const feedbackText = parts.join("\n")

        setIsSubmittingFeedback(true)
        // console.log("Feedback à soumettre pour la visite", visitId, {
        //     rating: selectedRating,
        //     agentPonctuel,
        //     agentDisponible,
        //     visitConforme,
        //     commentaires,
        // }, "Texte structuré envoyé au backend:", feedbackText)
        // console.log('note envoyée:', selectedRating)  // Vérifier que la note est bien prise en compte
        try {
            await axiosInstance.patch(`/api/visit-reservations/${visitId}/feedback`, {
                feedback: feedbackText,
                note:     selectedRating,  // → champ "note" dans la table visite
            })

            toast.success(`Avis envoyé pour ${bienTitle}`)

            // Mettre à jour localement pour masquer le bouton sans recharger
            setSubmittedFeedbacks((prev) => ({ ...prev, [visitId]: feedbackText }))
            setFeedbackDialogId(null)
            resetFeedbackForm()
        } catch (err: any) {
            toast.error(err.response?.data?.message ?? "Erreur lors de l'envoi de l'avis.")
        } finally {
            setIsSubmittingFeedback(false)
        }
    }

    // ── Annuler une visite ───────────────────────────────────────────────────
    const handleCancelVisit = async (visitId: number, bien: Bien) => {
        try {
            setIsCancelling(true)
            await axiosInstance.patch(`/api/visit-reservations/${visitId}/client-cancel`, {
                reason: cancelReason || null,
            })
            toast.success(`Visite pour ${bien.title} annulée avec succès`)
            window.location.reload()
            setCancelDialogId(null)
            setCancelReason("")
        } catch (error) {
            console.error("Erreur lors de l'annulation:", error)
            toast.error("Impossible d'annuler la visite. Veuillez réessayer.")
        } finally {
            setIsCancelling(false)
        }
    }

    const upcoming = visits.filter((v) =>
        !isPast(v) && v.status !== "cancelled" && v.status !== "completed"
    )
    const past = visits.filter((v) =>
        isPast(v) || v.status === "cancelled" || v.status === "completed"
    )

    return (
        <div className="space-y-6">

            {/* ── Header ── */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Mes Visites</h1>
                    <p className="text-muted-foreground">Gérez vos visites de propriétés et partagez vos avis.</p>
                </div>
                <Button asChild>
                    <Link href="/portal/favorites">
                        <Calendar className="mr-2 h-4 w-4" />
                        Planifier une nouvelle visite
                    </Link>
                </Button>
            </div>

            {/* ── Skeleton ── */}
            {loading ? (
                <div className="space-y-6">
                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-32 rounded-md" />
                        <Skeleton className="h-9 w-28 rounded-md" />
                    </div>
                    {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-0">
                                <div className="flex flex-col md:flex-row">
                                    <Skeleton className="w-full md:w-48 h-48 rounded-t-lg md:rounded-l-lg md:rounded-t-none shrink-0" />
                                    <div className="p-6 flex-1 space-y-4">
                                        <div className="flex justify-between gap-4">
                                            <div className="space-y-2">
                                                <Skeleton className="h-5 w-48" />
                                                <Skeleton className="h-4 w-64" />
                                            </div>
                                        </div>
                                        <Skeleton className="h-16 w-full rounded-lg" />
                                        <Skeleton className="h-8 w-32 rounded-md" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Tabs defaultValue="upcoming" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="upcoming">À venir ({upcoming.length})</TabsTrigger>
                        <TabsTrigger value="past">Passées ({past.length})</TabsTrigger>
                    </TabsList>

                    {/* ── Visites à venir ── */}
                    <TabsContent value="upcoming" className="space-y-4">
                        {upcoming.length === 0 ? (
                            <Card className="p-12">
                                <div className="text-center">
                                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium text-foreground mb-2">Aucune visite prévue</h3>
                                    <p className="text-muted-foreground mb-4">
                                        Planifiez une visite pour découvrir vos propriétés préférées en personne.
                                    </p>
                                    <Button asChild>
                                        <Link href="/portal/favorites">Consulter les favoris</Link>
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            upcoming.map((visit) => {
                                const { bien, agent, agency, visit_date, start_time, end_time } = visit.visit_schedule
                                return (
                                    <Card key={visit.id}>
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row">
                                                <BienThumbnail bien={bien} size="lg" />
                                                <div className="p-6 flex-1">
                                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                <h3 className="font-semibold text-foreground">{bien.title}</h3>
                                                                {getStatusBadge(visit.status)}
                                                            </div>
                                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                                <MapPin className="h-3 w-3 shrink-0" />
                                                                {bien.address}, {bien.neighborhood}, {bien.city}
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <p className="text-sm font-semibold text-foreground capitalize">
                                                                {formatDate(visit_date)}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground flex items-center justify-end gap-1 mt-0.5">
                                                                <Clock className="h-3 w-3" />
                                                                {formatTime(start_time)} – {formatTime(end_time)}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Agent */}
                                                    <div className="flex items-center gap-4 mb-4 p-3 bg-secondary/50 rounded-lg">
                                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 shrink-0">
                                                            <User className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-foreground">
                                                                {agent ? `${agent.prenom} ${agent.nom}` : agency.name}
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">{agency.name}</p>
                                                        </div>
                                                        <Button variant="outline" size="sm" className="bg-transparent shrink-0" asChild>
                                                            {agent ? (
                                                                <a href={`tel:${agent?.phone}`}>
                                                                    <Phone className="mr-2 h-4 w-4" />Appeler
                                                                </a>
                                                            ) : (
                                                                <a href={`tel:${agency?.phone}`}>
                                                                    <Phone className="mr-2 h-4 w-4" />Appeler
                                                                </a>
                                                            )}
                                                        </Button>
                                                    </div>

                                                    {/* Prix + type */}
                                                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                                                        <Badge variant="outline" className="capitalize">{bien.propertyType}</Badge>
                                                        <Badge variant={bien.listingType === "rent" ? "secondary" : "default"}>
                                                            {bien.listingType === "rent" ? "À louer" : "À vendre"}
                                                        </Badge>
                                                        <span className="text-sm font-semibold text-foreground">
                                                            {formatPrice(bien.price, bien.listingType)}
                                                        </span>
                                                    </div>

                                                    {visit.notes && (
                                                        <div className="mb-4 p-3 bg-accent/10 rounded-lg">
                                                            <p className="text-sm text-foreground">
                                                                <span className="font-medium">Note :</span> {visit.notes}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Actions */}
                                                    <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
                                                        <Button variant="outline" size="sm" className="bg-transparent" asChild>
                                                            <Link href={`/property/${bien.id}`}>Voir la propriété</Link>
                                                        </Button>
                                                        <Button variant="outline" size="sm" className="bg-transparent">
                                                            <MessageSquare className="mr-2 h-4 w-4" />
                                                            Contacter l'agent
                                                        </Button>
                                                        <Dialog
                                                            open={cancelDialogId === visit.id}
                                                            onOpenChange={(open) => {
                                                                setCancelDialogId(open ? visit.id : null)
                                                                if (!open) setCancelReason("")
                                                            }}
                                                        >
                                                            <DialogTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="text-destructive">
                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                    Annuler la visite
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Annuler la visite</DialogTitle>
                                                                    <DialogDescription>
                                                                        Êtes-vous sûr d'annuler votre visite pour{" "}
                                                                        <span className="font-medium">{bien.title}</span>{" "}
                                                                        le {formatDate(visit_date)} ?
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="space-y-4 py-4">
                                                                    <div className="space-y-2">
                                                                        <Label>Raison de l'annulation (optionnel)</Label>
                                                                        <Textarea
                                                                            placeholder="Dites-nous pourquoi vous annulez..."
                                                                            value={cancelReason}
                                                                            onChange={(e) => setCancelReason(e.target.value)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <Button variant="outline" className="bg-transparent" onClick={() => setCancelDialogId(null)} disabled={isCancelling}>
                                                                        Garder la visite
                                                                    </Button>
                                                                    <Button variant="destructive" onClick={() => handleCancelVisit(visit.id, bien)} disabled={isCancelling}>
                                                                        {isCancelling ? "Annulation en cours..." : "Confirmer l'annulation"}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        )}
                    </TabsContent>

                    {/* ── Visites passées ── */}
                    <TabsContent value="past" className="space-y-4">
                        {past.length === 0 ? (
                            <Card className="p-12">
                                <div className="text-center text-muted-foreground">
                                    <Calendar className="mx-auto h-12 w-12 mb-4 opacity-40" />
                                    <p>Aucune visite passée.</p>
                                </div>
                            </Card>
                        ) : (
                            past.map((visit) => {
                                const { bien, agent, visit_date, start_time, end_time, agency } = visit.visit_schedule

                                // Le feedback peut venir de la BDD ou d'une soumission locale
                                const feedbackExistant = visit.feedback ?? submittedFeedbacks[visit.id] ?? null

                                return (
                                    <Collapsible key={visit.id}>
                                        <Card>
                                            <CardContent className="p-0">
                                                <div className="flex flex-col sm:flex-row">
                                                    <BienThumbnail bien={bien} size="sm" />
                                                    <div className="p-4 flex-1">
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                            <div>
                                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                                    <h3 className="font-medium text-foreground">{bien.title}</h3>
                                                                    {getStatusBadge(visit.status)}
                                                                </div>
                                                                <p className="text-sm text-muted-foreground capitalize">
                                                                    {formatDate(visit_date)} · {formatTime(start_time)} – {formatTime(end_time)}
                                                                </p>
                                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                                    {agent ? `${agent.prenom} ${agent.nom}` : agency?.name || "Agence"}
                                                                </p>
                                                            </div>
                                                            <CollapsibleTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="shrink-0">
                                                                    Détails
                                                                    <ChevronDown className="ml-1 h-4 w-4" />
                                                                </Button>
                                                            </CollapsibleTrigger>
                                                        </div>
                                                    </div>
                                                </div>

                                                <CollapsibleContent>
                                                    <div className="border-t border-border p-4 space-y-4">
                                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                                            <div>
                                                                <p className="text-muted-foreground text-xs">Adresse</p>
                                                                <p className="font-medium">{bien.address}, {bien.neighborhood}, {bien.city}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-muted-foreground text-xs">Prix</p>
                                                                <p className="font-medium">{formatPrice(bien.price, bien.listingType)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-muted-foreground text-xs">Type</p>
                                                                <p className="font-medium capitalize">{bien.propertyType}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-muted-foreground text-xs">Surface / Pièces</p>
                                                                <p className="font-medium">{bien.surface} m² · {bien.rooms} pièces</p>
                                                            </div>
                                                        </div>

                                                        {visit.notes && (
                                                            <div className="p-3 bg-muted/50 rounded-lg text-sm">
                                                                <span className="font-medium">Notes : </span>
                                                                <span className="text-muted-foreground">{visit.notes}</span>
                                                            </div>
                                                        )}

                                                        {visit.status === "cancelled" && (
                                                            <p className="text-sm text-muted-foreground italic">
                                                                Cette visite a été annulée.
                                                            </p>
                                                        )}

                                                        {/* Feedback existant → afficher avec la note */}
                                                        {feedbackExistant && (
                                                            <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="font-medium">Votre avis</span>
                                                                    {visit.note && (
                                                                        <StarRating rating={visit.note} />
                                                                    )}
                                                                </div>
                                                                <p className="text-muted-foreground whitespace-pre-line">
                                                                    {feedbackExistant}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Bouton feedback — masqué si déjà soumis */}
                                                        {!feedbackExistant && visit.status !== "cancelled" && (
                                                            <div className="flex items-center justify-between gap-4">
                                                                <p className="text-sm text-muted-foreground">
                                                                    Vous n'avez pas encore partagé votre avis.
                                                                </p>
                                                                <Dialog
                                                                    open={feedbackDialogId === visit.id}
                                                                    onOpenChange={(open) => {
                                                                        setFeedbackDialogId(open ? visit.id : null)
                                                                        if (!open) resetFeedbackForm()
                                                                    }}
                                                                >
                                                                    <DialogTrigger asChild>
                                                                        <Button size="sm">
                                                                            <Star className="mr-2 h-4 w-4" />
                                                                            Partager votre avis
                                                                        </Button>
                                                                    </DialogTrigger>
                                                                    <DialogContent className="sm:max-w-lg">
                                                                        <DialogHeader>
                                                                            <DialogTitle>Avis sur la visite</DialogTitle>
                                                                            <DialogDescription>
                                                                                Partagez vos impressions sur {bien.title}
                                                                            </DialogDescription>
                                                                        </DialogHeader>
                                                                        <div className="space-y-5 py-4">

                                                                            {/* Note globale — obligatoire */}
                                                                            <div className="space-y-2">
                                                                                <Label>
                                                                                    Note globale de la visite
                                                                                    <span className="text-destructive ml-1">*</span>
                                                                                </Label>
                                                                                <StarRating
                                                                                    rating={selectedRating}
                                                                                    interactive
                                                                                    onRate={setSelectedRating}
                                                                                />
                                                                                {selectedRating === 0 && (
                                                                                    <p className="text-xs text-muted-foreground">Cliquez sur une étoile pour noter</p>
                                                                                )}
                                                                            </div>

                                                                            <div className="border-t border-border pt-4 space-y-4">
                                                                                <p className="text-sm font-medium text-foreground">
                                                                                    À propos de l'agent{agent ? ` — ${agent.prenom} ${agent.nom}` : ""}
                                                                                </p>

                                                                                {/* Ponctualité */}
                                                                                <div className="space-y-2">
                                                                                    <Label>L'agent était-il ponctuel ?</Label>
                                                                                    <RadioGroup value={agentPonctuel} onValueChange={setAgentPonctuel} className="flex gap-4">
                                                                                        <div className="flex items-center space-x-2">
                                                                                            <RadioGroupItem value="oui" id={`ponctuel-oui-${visit.id}`} />
                                                                                            <Label htmlFor={`ponctuel-oui-${visit.id}`} className="font-normal">Oui</Label>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-2">
                                                                                            <RadioGroupItem value="non" id={`ponctuel-non-${visit.id}`} />
                                                                                            <Label htmlFor={`ponctuel-non-${visit.id}`} className="font-normal">Non</Label>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-2">
                                                                                            <RadioGroupItem value="leger-retard" id={`ponctuel-retard-${visit.id}`} />
                                                                                            <Label htmlFor={`ponctuel-retard-${visit.id}`} className="font-normal">Léger retard</Label>
                                                                                        </div>
                                                                                    </RadioGroup>
                                                                                </div>

                                                                                {/* Disponibilité / écoute */}
                                                                                <div className="space-y-2">
                                                                                    <Label>L'agent a-t-il bien répondu à vos questions ?</Label>
                                                                                    <RadioGroup value={agentDisponible} onValueChange={setAgentDisponible} className="flex gap-4">
                                                                                        <div className="flex items-center space-x-2">
                                                                                            <RadioGroupItem value="tres-bien" id={`dispo-tres-bien-${visit.id}`} />
                                                                                            <Label htmlFor={`dispo-tres-bien-${visit.id}`} className="font-normal">Très bien</Label>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-2">
                                                                                            <RadioGroupItem value="bien" id={`dispo-bien-${visit.id}`} />
                                                                                            <Label htmlFor={`dispo-bien-${visit.id}`} className="font-normal">Bien</Label>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-2">
                                                                                            <RadioGroupItem value="insuffisant" id={`dispo-insuffisant-${visit.id}`} />
                                                                                            <Label htmlFor={`dispo-insuffisant-${visit.id}`} className="font-normal">Insuffisant</Label>
                                                                                        </div>
                                                                                    </RadioGroup>
                                                                                </div>
                                                                            </div>

                                                                            <div className="border-t border-border pt-4 space-y-4">
                                                                                <p className="text-sm font-medium text-foreground">À propos du bien visité</p>

                                                                                {/* Conforme à l'annonce */}
                                                                                <div className="space-y-2">
                                                                                    <Label>Le bien correspondait-il à l'annonce ?</Label>
                                                                                    <RadioGroup value={visitConforme} onValueChange={setVisitConforme} className="flex gap-4">
                                                                                        <div className="flex items-center space-x-2">
                                                                                            <RadioGroupItem value="oui" id={`conforme-oui-${visit.id}`} />
                                                                                            <Label htmlFor={`conforme-oui-${visit.id}`} className="font-normal">Oui</Label>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-2">
                                                                                            <RadioGroupItem value="partiellement" id={`conforme-partiel-${visit.id}`} />
                                                                                            <Label htmlFor={`conforme-partiel-${visit.id}`} className="font-normal">Partiellement</Label>
                                                                                        </div>
                                                                                        <div className="flex items-center space-x-2">
                                                                                            <RadioGroupItem value="non" id={`conforme-non-${visit.id}`} />
                                                                                            <Label htmlFor={`conforme-non-${visit.id}`} className="font-normal">Non</Label>
                                                                                        </div>
                                                                                    </RadioGroup>
                                                                                </div>

                                                                                {/* Commentaire libre */}
                                                                                <div className="space-y-2">
                                                                                    <Label>Commentaires libres</Label>
                                                                                    <Textarea
                                                                                        placeholder="Partagez tout autre retour sur la visite ou l'agent..."
                                                                                        value={commentaires}
                                                                                        onChange={(e) => setCommentaires(e.target.value)}
                                                                                        rows={3}
                                                                                    />
                                                                                </div>
                                                                            </div>

                                                                        </div>

                                                                        <DialogFooter>
                                                                            <Button
                                                                                variant="outline"
                                                                                className="bg-transparent"
                                                                                onClick={() => {
                                                                                    setFeedbackDialogId(null)
                                                                                    resetFeedbackForm()
                                                                                }}
                                                                                disabled={isSubmittingFeedback}
                                                                            >
                                                                                Annuler
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() => handleSubmitFeedback(visit.id, bien.title)}
                                                                                disabled={isSubmittingFeedback || selectedRating === 0}
                                                                            >
                                                                                {isSubmittingFeedback ? "Envoi en cours..." : "Envoyer mon avis"}
                                                                            </Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CollapsibleContent>
                                            </CardContent>
                                        </Card>
                                    </Collapsible>
                                )
                            })
                        )}
                    </TabsContent>
                </Tabs>
            )}

            {/* ── Conseils ── */}
            <Card className="bg-secondary/30">
                <CardContent className="p-6">
                    <h3 className="font-medium text-foreground mb-3">Conseils pour les visites de propriétés</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        {[
                            "Arrivez 5-10 minutes en avance pour explorer le quartier",
                            "Préparez une liste de questions sur la propriété",
                            "Prenez des photos et des notes pendant la visite (avec permission)",
                            "Vérifiez la pression d'eau, les prises, et l'espace de rangement",
                        ].map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                                {tip}
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}