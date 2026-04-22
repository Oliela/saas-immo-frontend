"use client"

import Link from "next/link"
import Image from "next/image"
import {
  CheckCircle,
  Circle,
  Clock,
  FileText,
  Heart,
  Calendar,
  ArrowRight,
  MessageSquare,
  MapPin,
  Bed,
  Bath,
  Square,
  Bell,
  PenLine,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useGetApercu } from "@/hooks/clients/useGetApercu"
import { useState } from "react"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { useTutorialModal } from "@/hooks/useTutorialModal"
import { WelcomeModal } from "@/components/portal/WelcomeModal"

function getStepIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "in-progress":
      return <Clock className="h-5 w-5 text-accent" />
    default:
      return <Circle className="h-5 w-5 text-muted-foreground" />
  }
}

export default function ClientPortal() {
  const { data, loading, error } = useGetApercu()
  const { loginCount } = useAuth()              // ← AJOUTER
  const { showModal, closeModal } = useTutorialModal(loginCount) // ← AJOUTER
  const [reclamationOpen, setReclamationOpen] = useState(false)
  const [reclamationSubject, setReclamationSubject] = useState("")
  const [reclamationMessage, setReclamationMessage] = useState("")
  const [reclamationLoading, setReclamationLoading] = useState(false)

  console.log("loginCount:", loginCount, "showModal:", showModal) ;

  const handleReclamation = async (contractId: number, agencyId: number) => {
    if (!reclamationSubject.trim() || !reclamationMessage.trim()) {
      toast.error("Veuillez remplir tous les champs")
      return
    }
    setReclamationLoading(true)
    try {
      await axiosInstance.post(`/api/contracts/${contractId}/reclamations`, {
        subject: reclamationSubject,
        message: reclamationMessage,
        agency_id: agencyId,
      })
      toast.success("Réclamation envoyée avec succès")
      setReclamationOpen(false)
      setReclamationSubject("")
      setReclamationMessage("")
    } catch (e: any) {
      toast.error(e.response?.data?.message ?? "Erreur lors de l'envoi")
    } finally {
      setReclamationLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-muted-foreground">Chargement...</div>
  if (error || !data) return <div className="p-8 text-center text-destructive">Erreur de chargement.</div>

  const {
    user,
    profile,
    statistics,
    recent_notifications,
    recent_favoris,
    recent_visites,
    recent_contract,
    recent_facture,
  } = data

  // Contrat signé = contrat dont le statut est "signed" ou "active"
  const signedContract = recent_contract.find(
    (c: any) => c.status === "signed" || c.status === "active"
  )
  const activeContracts = recent_contract.filter((c: any) => c.status === "active")

  const journeySteps = [
    {
      id: 1,
      title: "Profil créé",
      description: profile ? `${profile.prenom} ${profile.nom}` : "Non renseigné",
      status: profile ? "completed" : "pending",
      date: profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString("fr-FR")
        : undefined,
    },
    {
      id: 2,
      title: "Documents téléversés",
      description: `${statistics.total_documents} document(s) enregistré(s)`,
      status: statistics.total_documents > 0 ? "completed" : "pending",
      action:
        statistics.total_documents === 0
          ? { label: "Téléverser des documents", href: "/portal/documents" }
          : undefined,
    },
    {
      id: 3,
      title: "Bien sélectionné",
      description:
        statistics.total_favoris > 0
          ? `${statistics.total_favoris} bien(s) en favoris`
          : "Aucun bien favori",
      status: statistics.total_favoris > 0 ? "completed" : "pending",
    },
    {
      id: 4,
      title: "Visite programmée",
      description:
        recent_visites.length > 0
          ? `${recent_visites.filter((v: any) => v.status === "completed").length} complétée(s) · ${statistics.total_visites_non_completed} en attente`
          : "Aucune visite",
      status:
        recent_visites.length > 0
          ? statistics.total_visites_non_completed > 0
            ? "in-progress"
            : "completed"
          : "pending",
      date: recent_visites[0]?.created_at
        ? new Date(recent_visites[0].created_at).toLocaleDateString("fr-FR")
        : undefined,
    },
    {
      id: 5,
      title: "Contrat signé",
      description: signedContract
        ? `Contrat n° ${signedContract.contract_number}`
        : "En attente de signature",
      status: signedContract ? "completed" : recent_contract.length > 0 ? "in-progress" : "pending",
      date: signedContract?.signed_at
        ? new Date(signedContract.signed_at).toLocaleDateString("fr-FR")
        : signedContract?.created_at
          ? new Date(signedContract.created_at).toLocaleDateString("fr-FR")
          : undefined,
      action:
        !signedContract && recent_contract.length > 0
          ? { label: "Voir le contrat", href: "/portal/contracts" }
          : undefined,
    },
  ]

  const completedSteps = journeySteps.filter((s) => s.status === "completed").length
  const progressPercentage = Math.round((completedSteps / journeySteps.length) * 100)
  const isJourneyComplete = completedSteps === journeySteps.length

  const unreadNotifications = recent_notifications.filter((n: any) => !n.read_at)

  return (
    <div className="space-y-6">
       <WelcomeModal open={showModal} onClose={closeModal} loginCount={loginCount} userName={user?.prenom} />

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Bienvenue, {user.prenom}
          </h1>
          <p className="text-muted-foreground">
            Suivez votre parcours immobilier et gérez vos dossiers.
          </p>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{statistics.total_favoris}</p>
                <p className="text-xs text-muted-foreground">Biens enregistrés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{statistics.total_visites_non_completed}</p>
                <p className="text-xs text-muted-foreground">Visites à venir</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{statistics.total_documents}</p>
                <p className="text-xs text-muted-foreground">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{statistics.total_notifications_non_lues}</p>
                <p className="text-xs text-muted-foreground">Messages non lus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Parcours + Notifications ────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Parcours */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Votre parcours</CardTitle>
                <CardDescription>Suivez votre progression vers votre nouveau chez-vous</CardDescription>
              </div>
              <Badge variant={isJourneyComplete ? "default" : "secondary"}>
                {isJourneyComplete ? "✓ Complété" : `${progressPercentage}% complété`}
              </Badge>
            </div>
            <Progress value={progressPercentage} className="h-2 mt-2" />
          </CardHeader>
          <CardContent>
            {/* Étapes — masquées si parcours complet */}
            {!isJourneyComplete && (
              <div className="relative mb-6">
                {journeySteps.map((step, index) => (
                  <div key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
                    {index !== journeySteps.length - 1 && (
                      <div
                        className={`absolute left-[9px] top-6 h-full w-0.5 ${step.status === "completed" ? "bg-green-600" : "bg-border"
                          }`}
                      />
                    )}
                    <div className="relative z-10 flex-shrink-0">
                      {getStepIcon(step.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                        <div>
                          <h4
                            className={`text-sm font-medium ${step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                              }`}
                          >
                            {step.title}
                          </h4>
                          <p className="text-xs text-muted-foreground">{step.description}</p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {step.date && (
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {step.date}
                            </span>
                          )}
                          {step.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                              className="bg-transparent text-xs h-7 px-2"
                            >
                              <Link href={step.action.href}>
                                {step.action.label}
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Link>
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tableau récap — affiché seulement si parcours complet */}
            {isJourneyComplete && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600 mb-4">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Félicitations ! Votre parcours est complété.</span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/40">
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Contrat</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Bien</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground">Statut</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {recent_contract.map((contract: any) => (
                        <tr key={contract.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              <PenLine className="h-4 w-4 text-muted-foreground shrink-0" />
                              {contract.contract_number ?? `#${contract.id}`}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {contract.bien?.title ?? "—"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {contract.signed_at
                              ? new Date(contract.signed_at).toLocaleDateString("fr-FR")
                              : contract.created_at
                                ? new Date(contract.created_at).toLocaleDateString("fr-FR")
                                : "—"}
                          </td>
                          <td className="px-4 py-3">
                            {contract.status === "active" ? (
                              <Badge className="bg-green-500/15 text-green-700 border-green-200 hover:bg-green-500/20">
                                Actif
                              </Badge>
                            ) : contract.status === "signed" ? (
                              <Badge className="bg-blue-500/15 text-blue-700 border-blue-200 hover:bg-blue-500/20">
                                Signé
                              </Badge>
                            ) : (
                              <Badge variant="secondary">{contract.status}</Badge>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
                              <Link href="/portal/contracts">
                                Voir
                                <ArrowRight className="ml-1 h-3 w-3" />
                              </Link>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-1">
                  <Button variant="outline" size="sm" asChild className="bg-transparent">
                    <Link href="/portal/contracts">
                      Voir tous les contrats
                      <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </div>

                <Separator />

                {(() => {
                  const targetContract = signedContract ?? recent_contract[0]
                  if (!targetContract) return null
                  return (
                    <Dialog open={reclamationOpen} onOpenChange={setReclamationOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:border-orange-800 dark:hover:bg-orange-950/30">
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Faire une réclamation à l'agence
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Faire une réclamation</DialogTitle>
                          <DialogDescription>
                            Concernant le contrat n° <span className="font-medium text-foreground">{targetContract.contract_number ?? `#${targetContract.id}`}</span>.
                            Votre agence sera notifiée et recevra une tâche à traiter.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-2">
                          <div className="space-y-2">
                            <Label htmlFor="reclamation-subject">Objet</Label>
                            <Input
                              id="reclamation-subject"
                              placeholder="Ex : Problème de maintenance, litige de loyer..."
                              value={reclamationSubject}
                              onChange={e => setReclamationSubject(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="reclamation-message">Message</Label>
                            <Textarea
                              id="reclamation-message"
                              placeholder="Décrivez votre réclamation en détail..."
                              className="min-h-[120px]"
                              value={reclamationMessage}
                              onChange={e => setReclamationMessage(e.target.value)}
                            />
                          </div>
                        </div>
                        <DialogFooter className="gap-2">
                          <Button variant="outline" onClick={() => setReclamationOpen(false)}>
                            Annuler
                          </Button>
                          <Button
                            onClick={() => handleReclamation(targetContract.id, targetContract.agency_id)}
                            disabled={reclamationLoading}
                            className="bg-orange-600 hover:bg-orange-700 text-white"
                          >
                            {reclamationLoading ? "Envoi..." : "Envoyer"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )
                })()}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications récentes</CardTitle>
            <CardDescription>{unreadNotifications.length} non lue(s)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {unreadNotifications.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Aucune notification non lue
              </p>
            ) : (
              unreadNotifications.map((notif: any) => (
                <div
                  key={notif.id}
                  className="flex gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium">
                      {notif.data?.title ?? "Notification"}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notif.data?.message ?? notif.type.split("\\").pop()}
                    </p>
                    {notif.created_at && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(notif.created_at).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
            <Separator />
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/portal/notifications">
                Voir toutes les notifications
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ── Favoris ────────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Vos propriétés préférées</h2>
          <Button variant="ghost" asChild className="text-accent">
            <Link href="/portal/favorites">
              Voir tout
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {recent_favoris.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              Aucun bien en favori pour le moment.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
            {recent_favoris.map((favori: any) => {
              const bien = favori.bien
              const imageUrl = bien?.images?.[0]?.url
                ? `${process.env.NEXT_PUBLIC_API_URL}${bien.images[0].url}`
                : "/placeholder.svg"

              return (
                <Card key={favori.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-40 h-48 sm:h-auto flex-shrink-0">
                      <Image
                        src={imageUrl}
                        alt={bien?.title ?? "Bien"}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                        Favori
                      </Badge>
                    </div>
                    <CardContent className="p-4 flex-1">
                      <h3 className="font-medium text-foreground mb-1">
                        {bien?.title ?? `Bien #${favori.bien_id}`}
                      </h3>
                      {(bien?.address || bien?.city) && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {[bien.address, bien.city].filter(Boolean).join(", ")}
                          </span>
                        </div>
                      )}
                      {bien?.price && (
                        <p className="text-lg font-semibold text-foreground mb-3">
                          {Number(bien.price).toLocaleString("fr-FR")} FCFA
                          <span className="text-sm font-normal text-muted-foreground">/mois</span>
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {bien?.rooms && (
                          <span className="flex items-center gap-1">
                            <Bed className="h-3 w-3" />
                            {bien.rooms} chambre(s)
                          </span>
                        )}
                        {bien?.bathrooms && (
                          <span className="flex items-center gap-1">
                            <Bath className="h-3 w-3" />
                            {bien.bathrooms} salle(s) de bain
                          </span>
                        )}
                        {bien?.surface && (
                          <span className="flex items-center gap-1">
                            <Square className="h-3 w-3" />
                            {bien.surface} m²
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}