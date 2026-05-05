"use client"

import Link from "next/link"
import {
  Heart,
  Check,
  X,
  Building2,
  User,
  Calendar,
  Clock,
  MessageSquare,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Send,
  FileText,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import type { Interet, InteretStatus } from "@/types/interets"

// ─── helpers ────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

function propertyImageUrl(url: string) {
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

function clientInitials(nom: string, prenom: string) {
  return `${prenom[0] ?? ""}${nom[0] ?? ""}`.toUpperCase()
}

function clientFullName(nom: string, prenom: string) {
  return `${prenom} ${nom}`
}

// ─── Status badge ────────────────────────────────────────────────────────────

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
          Rejeté
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

// ─── Skeleton row ─────────────────────────────────────────────────────────────

function InterestRowSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 rounded-lg border border-border">
      <div className="flex gap-4 flex-1">
        <Skeleton className="h-20 w-28 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
      <div className="flex flex-col gap-3 lg:w-80 space-y-2">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

// ─── Suggestions ─────────────────────────────────────────────────────────────

function getRetourSuggestions(clientName: string, bienTitle: string) {
  return [
    {
      label: "Visite effectuée ✓",
      text: `Bonjour ${clientName}, la visite de "${bienTitle}" est effectuée. Merci de confirmer ou infirmer votre intérêt : cette étape est indispensable pour avancer sur votre dossier.`,
    },
    {
      label: "Confirmer votre intérêt 🔔",
      text: `Bonjour ${clientName}, merci de confirmer ou infirmer votre intérêt pour "${bienTitle}". Sans retour de votre part, nous ne pourrons pas avancer. Répondez-nous dès que possible.`,
    },
    {
      label: "Bien disponible",
      text: `Bonjour ${clientName}, le bien "${bienTitle}" est toujours disponible. Merci de nous confirmer votre intérêt pour passer à la prochaine étape.`,
    },
    {
      label: "Documents requis",
      text: `Bonjour ${clientName}, pour avancer sur "${bienTitle}", merci de confirmer votre intérêt et de nous transmettre vos documents. Contactez-nous pour la liste complète.`,
    },
    {
      label: "Planifier une visite",
      text: `Bonjour ${clientName}, nous souhaitons organiser une visite pour "${bienTitle}". Après la visite, une confirmation de votre intérêt sera nécessaire. Indiquez-nous vos disponibilités.`,
    },
    {
      label: "En cours de traitement",
      text: `Bonjour ${clientName}, votre demande pour "${bienTitle}" est en cours de traitement. Est-ce toujours une priorité pour vous ? Votre retour nous permettra d'avancer.`,
    },
  ]
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface InterestsListProps {
  interets: Interet[]
  loading?: boolean
  searchQuery: string
  statusFilter: InteretStatus | "all"
  selectedInteret: Interet | null
  responseMessage: string
  responseAction: "confirm" | "reject" | null
  actionLoading?: boolean
  onSelectInteret: (interet: Interet, action: "confirm" | "reject") => void
  onCloseDialog: () => void
  onResponseMessageChange: (value: string) => void
  onConfirm: (id: number) => void
  onReject: (id: number) => void
  retourInteret: Interet | null
  retourMessage: string
  retourLoading?: boolean
  onOpenRetour: (interet: Interet) => void
  onCloseRetour: () => void
  onRetourMessageChange: (value: string) => void
  onSendRetour: (id: number) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export function InterestsList({
  interets,
  loading,
  searchQuery,
  statusFilter,
  selectedInteret,
  responseMessage,
  responseAction,
  actionLoading,
  onSelectInteret,
  onCloseDialog,
  onResponseMessageChange,
  onConfirm,
  onReject,
  retourInteret,
  retourMessage,
  retourLoading,
  onOpenRetour,
  onCloseRetour,
  onRetourMessageChange,
  onSendRetour,
}: InterestsListProps) {
  const filtered = interets.filter((interet) => {
    const fullName = clientFullName(interet.client.nom, interet.client.prenom).toLowerCase()
    const matchesSearch =
      fullName.includes(searchQuery.toLowerCase()) ||
      interet.bien.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interet.bien.neighborhood.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || interet.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <>
      {/* ── Liste ─────────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes d'Intérêt ({loading ? "…" : filtered.length})</CardTitle>
          <CardDescription>
            Examinez et répondez à l'intérêt des clients pour vos propriétés
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && (
            <>
              <InterestRowSkeleton />
              <InterestRowSkeleton />
              <InterestRowSkeleton />
            </>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Aucun intérêt trouvé</h3>
              <p className="text-muted-foreground">
                Aucune demande d'intérêt ne correspond à vos filtres actuels.
              </p>
            </div>
          )}

          {!loading &&
            filtered.map((interet) => {
              const { bien, client } = interet
              const firstImage = bien.images[0]?.url
              const fullName = clientFullName(client.nom, client.prenom)

              return (
                <div
                  key={interet.id}
                  className="flex flex-col lg:flex-row gap-4 p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                  {/* Propriété */}
                  <div className="flex gap-4 flex-1">
                    <div className="h-20 w-28 rounded-lg bg-muted overflow-hidden shrink-0">
                      {firstImage ? (
                        <img
                          src={propertyImageUrl(firstImage)}
                          alt={bien.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/dashboard/properties/${bien.id}`}
                            className="font-medium text-foreground hover:text-primary transition-colors"
                          >
                            {bien.title}
                          </Link>
                          <p className="text-sm text-muted-foreground">
                            {bien.neighborhood}, {bien.city}
                          </p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs capitalize">
                              {bien.propertyType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {bien.listingType === "rent" ? "Location" : "Vente"}
                            </Badge>
                            <span className="text-sm font-semibold text-primary">
                              {formatPrice(bien.price, bien.listingType)}
                            </span>
                          </div>
                        </div>
                        <StatusBadge status={interet.status} />
                      </div>
                    </div>
                  </div>

                  {/* Client */}
                  <div className="flex flex-col gap-2 lg:w-80 lg:border-l lg:border-border lg:pl-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {clientInitials(client.nom, client.prenom)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/dashboard/clients/${client.id}`}
                          className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {fullName}
                        </Link>
                        <p className="text-xs text-muted-foreground truncate">
                          {client.user.email}
                        </p>
                      </div>
                    </div>

                    {interet.message ? (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {interet.message}
                      </p>
                    ) : (
                      client.note && (
                        <p className="text-sm text-muted-foreground italic line-clamp-2">
                          {client.note}
                        </p>
                      )
                    )}

                    {interet.agent_response && (
                      <div className="p-2 rounded-md bg-primary/5 border border-primary/20">
                        <p className="text-xs font-medium text-primary mb-0.5">Votre retour</p>
                        <p className="text-xs text-foreground line-clamp-2">
                          {interet.agent_response}
                        </p>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground">
                      Soumis : {formatDate(interet.created_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 lg:flex-col lg:justify-center">
                    {interet.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => onSelectInteret(interet, "confirm")}
                          className="flex-1 lg:flex-none"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Confirmer
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSelectInteret(interet, "reject")}
                          className="flex-1 lg:flex-none bg-transparent"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Rejeter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onOpenRetour(interet)}
                          className="flex-1 lg:flex-none bg-transparent"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Retour
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onOpenRetour(interet)}
                          className="flex-1 lg:flex-none bg-transparent"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          {interet.agent_response ? "Modifier retour" : "Retour"}
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/clients/${client.id}`}>
                                <User className="mr-2 h-4 w-4" />
                                Voir le client
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/properties/${bien.id}`}>
                                <Building2 className="mr-2 h-4 w-4" />
                                Voir la propriété
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {interet.status === "confirmed" && (
                              <DropdownMenuItem asChild>
                                <Link
                                  href={`/dashboard/contracts/new?client_id=${interet.client_id}&bien_id=${interet.bien_id}`}
                                >
                                  <FileText className="mr-2 h-4 w-4" />
                                  Rédiger le contrat
                                </Link>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
        </CardContent>
      </Card>

      {/* ── Dialog : Confirmer / Rejeter ──────────────────────────────────── */}
      <Dialog open={!!selectedInteret && !!responseAction} onOpenChange={onCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {responseAction === "confirm" ? "Confirmer l'intérêt" : "Rejeter l'intérêt"}
            </DialogTitle>
            <DialogDescription>
              {responseAction === "confirm"
                ? "Confirmez l'intérêt de ce client et envoyez-lui éventuellement un message."
                : "Rejetez cette demande d'intérêt et fournissez éventuellement une raison."}
            </DialogDescription>
          </DialogHeader>

          {selectedInteret && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar>
                  <AvatarFallback>
                    {clientInitials(selectedInteret.client.nom, selectedInteret.client.prenom)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {clientFullName(selectedInteret.client.nom, selectedInteret.client.prenom)}
                  </p>
                  <p className="text-sm text-muted-foreground">{selectedInteret.bien.title}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="response">Message de réponse (optionnel)</Label>
                <Textarea
                  id="response"
                  placeholder={
                    responseAction === "confirm"
                      ? "Merci pour votre intérêt ! Nous vous contacterons bientôt pour planifier une visite..."
                      : "Malheureusement, cette propriété n'est plus disponible..."
                  }
                  value={responseMessage}
                  onChange={(e) => onResponseMessageChange(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" className="bg-transparent" onClick={onCloseDialog}>
              Annuler
            </Button>
            {responseAction === "confirm" ? (
              <Button
                disabled={actionLoading}
                onClick={() => selectedInteret && onConfirm(selectedInteret.id)}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {actionLoading ? "Confirmation…" : "Confirmer l'intérêt"}
              </Button>
            ) : (
              <Button
                variant="destructive"
                disabled={actionLoading}
                onClick={() => selectedInteret && onReject(selectedInteret.id)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                {actionLoading ? "Rejet…" : "Rejeter l'intérêt"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog : Retour de l'agence ───────────────────────────────────── */}
      <Dialog open={!!retourInteret} onOpenChange={onCloseRetour}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {retourInteret?.agent_response ? "Modifier le retour" : "Envoyer un retour au client"}
            </DialogTitle>
            <DialogDescription>
              Ce message sera visible par le client dans son espace portal.
            </DialogDescription>
          </DialogHeader>

          {retourInteret && (() => {
            const clientName = clientFullName(retourInteret.client.nom, retourInteret.client.prenom)
            const suggestions = getRetourSuggestions(clientName, retourInteret.bien.title)

            return (
              <div className="space-y-4">
                {/* Récap */}
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Avatar>
                    <AvatarFallback>
                      {clientInitials(retourInteret.client.nom, retourInteret.client.prenom)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{clientName}</p>
                    <p className="text-sm text-muted-foreground">{retourInteret.bien.title}</p>
                  </div>
                </div>

                {/* Message original du client */}
                {retourInteret.message && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Message du client
                    </p>
                    <p className="text-sm text-foreground">{retourInteret.message}</p>
                  </div>
                )}

                {/* Suggestions */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Suggestions — cliquez pour pré-remplir
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => onRetourMessageChange(s.text)}
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors
                          ${retourMessage === s.text
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-secondary/50 text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary"
                          }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="retour">Votre retour</Label>
                  <Textarea
                    id="retour"
                    placeholder="Ex : La visite de la propriété effectuée, vous pouvez procéder à la validation de votre intérêt ou nous contacter pour plus d'informations..."
                    value={retourMessage}
                    onChange={(e) => onRetourMessageChange(e.target.value.slice(0, 255))}
                    rows={5}
                    maxLength={255}
                  />
                  <p className={`text-xs text-right ${retourMessage.length >= 240 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                    {retourMessage.length} / 255
                  </p>
                </div>
              </div>
            )
          })()}

          <DialogFooter>
            <Button variant="outline" className="bg-transparent" onClick={onCloseRetour}>
              Annuler
            </Button>
            <Button
              disabled={!retourMessage.trim() || retourLoading}
              onClick={() => retourInteret && onSendRetour(retourInteret.id)}
            >
              <Send className="mr-2 h-4 w-4" />
              {retourLoading ? "Envoi…" : retourInteret?.agent_response ? "Mettre à jour" : "Envoyer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}