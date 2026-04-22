"use client"

import Link from "next/link"
import {
  Heart,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MessageSquare,
  Eye,
  Trash2,
  MapPin,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Interet, InteretStatus } from "@/types/interetsClient"

// ─── helpers ────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

function imageUrl(url: string) {
  if (!url) return "/placeholder.jpg"
  return url.startsWith("http") ? url : `${BASE_URL}${url}`
}

function formatPrice(price: string, listingType: string) {
  const amount = parseFloat(price).toLocaleString("fr-FR")
  return listingType === "rent" ? `${amount} FCFA / mois` : `${amount} FCFA`
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: InteretStatus }) {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
          <CheckCircle className="mr-1 h-3 w-3" />
          Confirmé
        </Badge>
      )
    case "rejected":
      return (
        <Badge variant="destructive">
          <XCircle className="mr-1 h-3 w-3" />
          Non disponible
        </Badge>
      )
    default:
      return (
        <Badge className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20">
          <Clock className="mr-1 h-3 w-3" />
          En attente
        </Badge>
      )
  }
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

function InterestCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="h-48 sm:h-auto sm:w-48 shrink-0" />
        <div className="flex-1 p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <Skeleton className="h-16 w-full rounded-lg" />
          <div className="flex gap-2 pt-4 border-t border-border">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>
      </div>
    </Card>
  )
}

// ─── Interest card ────────────────────────────────────────────────────────────

interface InterestCardProps {
  interet: Interet
  /** undefined = pas d'interaction locale, utilise la valeur serveur */
  localConfirmed: boolean | null | undefined
  onWithdraw: (id: number) => void
  onClientConfirm: (id: number) => void
  onClientDecline: (id: number) => void
}

function InterestCard({
  interet,
  localConfirmed,
  onWithdraw,
  onClientConfirm,
  onClientDecline,
}: InterestCardProps) {
  const { bien } = interet
  const firstImage = bien.images[0]?.url

  // Priorité : interaction locale optimiste > valeur serveur
  // undefined et null sont tous les deux traités comme "pas encore répondu"
  const clientConfirmed = localConfirmed !== undefined
    ? localConfirmed
    : (interet.client_confirmed ?? null)

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="h-48 sm:h-auto sm:w-48 shrink-0 bg-muted">
          {firstImage ? (
            <img
              src={imageUrl(firstImage)}
              alt={bien.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Building2 className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6">
          {/* Title + status */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <Link
                href={`/property/${bien.id}`}
                className="text-lg font-semibold text-foreground hover:text-primary transition-colors"
              >
                {bien.title}
              </Link>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5" />
                {bien.neighborhood}, {bien.city}
              </div>
            </div>
            <StatusBadge status={interet.status} />
          </div>

          {/* Price + badges */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-lg font-bold text-primary">
              {formatPrice(bien.price, bien.listingType)}
            </span>
            <Badge variant="outline" className="capitalize">{bien.propertyType}</Badge>
            <Badge variant="outline">{bien.listingType === "rent" ? "Location" : "Vente"}</Badge>
            <span className="text-sm text-muted-foreground">
              {bien.rooms} ch · {bien.bathrooms} sdb · {bien.surface} m²
            </span>
          </div>

          {/* Agence */}
          <p className="text-xs text-muted-foreground mb-4">
            Agence :{" "}
            <span className="font-medium text-foreground">{bien.agence.name}</span>
          </p>

          {/* Fil de messages */}
          <div className="space-y-3">
            {/* Message du client */}
            {interet.message ? (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs font-medium text-muted-foreground mb-1">Votre message</p>
                <p className="text-sm text-foreground">{interet.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Envoyé : {formatDate(interet.created_at)}
                </p>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground italic">
                  Demande envoyée le {formatDate(interet.created_at)} — aucun message joint.
                </p>
              </div>
            )}

            {/* Réponse de l'agence */}
            {interet.agent_response && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs font-medium text-primary mb-1">Réponse de l'agence</p>
                <p className="text-sm text-foreground">{interet.agent_response}</p>
                {interet.responded_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Reçu : {formatDate(interet.responded_at)}
                  </p>
                )}
              </div>
            )}

            {/* Confirmation du client — uniquement si l'agence a déjà répondu */}
            {interet.status !== "confirmed" && interet.agent_response && (
              <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/30">
                <p className="text-xs font-medium text-amber-600 mb-2">
                  Confirmez-vous votre intérêt pour ce bien ?
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => onClientConfirm(interet.id)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Oui, je confirme
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => onClientDecline(interet.id)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Non, décliner
                  </Button>
                </div>
              </div>
            )}

            {clientConfirmed === true && (
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/30 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <p className="text-sm text-emerald-700 font-medium">
                  Vous avez confirmé votre intérêt pour ce bien.
                </p>
              </div>
            )}

            {clientConfirmed === false && (
              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/30 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive shrink-0" />
                <p className="text-sm text-destructive font-medium">
                  Vous avez décliné cet intérêt. L'agence en sera informée.
                </p>
              </div>
            )}

            {/* Rejeté sans message agence */}
            {interet.status === "rejected" && !interet.agent_response && (
              <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                <p className="text-xs text-muted-foreground italic">
                  Cette propriété n'est plus disponible pour votre demande.
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
            <Button variant="outline" size="sm" className="bg-transparent" asChild>
              <Link href={`/property/${bien.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                Voir la propriété
              </Link>
            </Button>

            {interet.status === "confirmed" && (
              <>
                <Button size="sm" asChild>
                  <Link href="/portal/visits">
                    <Calendar className="mr-2 h-4 w-4" />
                    Voir la visite
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent" asChild>
                  <Link href="/portal/messages">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contacter l'agence
                  </Link>
                </Button>
              </>
            )}

            {interet.status === "pending" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Retirer
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Retirer votre intérêt ?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Êtes-vous sûr de vouloir retirer votre intérêt pour "{bien.title}" ?
                      Cette action ne peut pas être annulée.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onWithdraw(interet.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Oui, retirer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({
  icon: Icon,
  title,
  description,
  showBrowse,
}: {
  icon: React.ElementType
  title: string
  description: string
  showBrowse?: boolean
}) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Icon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        {showBrowse && (
          <Button asChild>
            <Link href="/buy">Parcourir les propriétés</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface PortalInterestsTabsProps {
  interets: Interet[]
  loading?: boolean
  /**
   * Surcharges locales optimistes.
   * undefined = pas d'interaction locale → utilise interet.client_confirmed
   * true/false = interaction en attente de refetch
   */
  localConfirmations: Record<number, boolean | null>
  onWithdraw: (id: number) => void
  onClientConfirm: (id: number) => void
  onClientDecline: (id: number) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PortalInterestsTabs({
  interets,
  loading,
  localConfirmations,
  onWithdraw,
  onClientConfirm,
  onClientDecline,
}: PortalInterestsTabsProps) {
  const pending = interets.filter((i) => i.status === "pending")
  const confirmed = interets.filter((i) => i.status === "confirmed")
  const rejected = interets.filter((i) => i.status === "rejected")

  const renderCard = (interet: Interet) => (
    <InterestCard
      key={interet.id}
      interet={interet}
      localConfirmed={localConfirmations[interet.id]}
      onWithdraw={onWithdraw}
      onClientConfirm={onClientConfirm}
      onClientDecline={onClientDecline}
    />
  )

  if (loading) {
    return (
      <div className="space-y-4">
        <InterestCardSkeleton />
        <InterestCardSkeleton />
      </div>
    )
  }

  return (
    <Tabs defaultValue="all" className="space-y-6">
      <TabsList>
        <TabsTrigger value="all">Tous ({interets.length})</TabsTrigger>
        <TabsTrigger value="pending">En attente ({pending.length})</TabsTrigger>
        <TabsTrigger value="confirmed">Confirmé ({confirmed.length})</TabsTrigger>
        <TabsTrigger value="rejected">Non disponible ({rejected.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="space-y-4">
        {interets.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Aucun intérêt pour le moment"
            description="Commencez à explorer les propriétés et montrez votre intérêt pour commencer."
            showBrowse
          />
        ) : (
          interets.map(renderCard)
        )}
      </TabsContent>

      <TabsContent value="pending" className="space-y-4">
        {pending.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Aucun intérêt en attente"
            description="Toutes vos demandes d'intérêt ont été examinées."
          />
        ) : (
          pending.map(renderCard)
        )}
      </TabsContent>

      <TabsContent value="confirmed" className="space-y-4">
        {confirmed.length === 0 ? (
          <EmptyState
            icon={CheckCircle}
            title="Aucun intérêt confirmé"
            description="Vos demandes d'intérêt confirmées apparaîtront ici."
          />
        ) : (
          confirmed.map(renderCard)
        )}
      </TabsContent>

      <TabsContent value="rejected" className="space-y-4">
        {rejected.length === 0 ? (
          <EmptyState
            icon={XCircle}
            title="Aucune propriété non disponible"
            description="Les propriétés qui ne sont plus disponibles apparaîtront ici."
          />
        ) : (
          rejected.map(renderCard)
        )}
      </TabsContent>
    </Tabs>
  )
}