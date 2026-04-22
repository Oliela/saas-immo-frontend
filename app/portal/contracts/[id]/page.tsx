"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  PenTool,
  Calendar,
  MapPin,
  XCircle,
  User,
  Building2,
  DollarSign,
  Eye,
  MessageSquare,
  Send,
  Printer,
  Shield,
  Home,
  Mail,
  Phone,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import axiosInstance from "@/lib/axios"
import {
  useGetContractDetail,
  type ContractDetail,
  type ContractHistory,
} from "@/hooks/clients/useGetContractDetail"
import { toast } from "sonner"
import axios from "axios"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAmount(value: string): string {
  const num = parseFloat(value)
  if (isNaN(num)) return "—"
  return new Intl.NumberFormat("fr-FR").format(num) + " FCFA"
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—"
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/** Durée en mois → libellé */
function formatDuration(months: number): string {
  if (months === 1) return "1 mois"
  if (months < 12) return `${months} mois`
  const years = Math.floor(months / 12)
  const rest = months % 12
  if (rest === 0) return `${years} an${years > 1 ? "s" : ""}`
  return `${years} an${years > 1 ? "s" : ""} et ${rest} mois`
}

/** Date de fin calculée depuis start_date + duration */
function computeEndDate(startDate: string, durationMonths: number): string {
  const d = new Date(startDate)
  d.setMonth(d.getMonth() + durationMonths)
  return formatDate(d.toISOString())
}

// ─── Status helpers ───────────────────────────────────────────────────────────

type ServerStatus = ContractDetail["status"]

function mapStatusToUI(status: ServerStatus): string {
  switch (status) {
    case "sent": return "pending_signature"
    case "draft": return "pending_review"
    case "approved": return "approved" // approuvé mais pas encore signé
    case "signed": return "active"
    case "revision": return "revision_requested"
    case "expired": return "expired"
    case "cancelled": return "cancelled"
    default: return status
  }
}

function getStatusBadge(status: ServerStatus) {
  const ui = mapStatusToUI(status)
  switch (ui) {
    case "pending_signature":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
          <PenTool className="mr-1 h-3 w-3" />
          En attente de signature
        </Badge>
      )
    case "revision_requested":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
          <Eye className="mr-1 h-3 w-3" />
          En attente de révision
        </Badge>
      )
    case "approved":
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400">
          <AlertCircle className="mr-1 h-3 w-3" />
          Contract approuvé
        </Badge>
      )
    case "active":
      return (
        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400">
          <CheckCircle className="mr-1 h-3 w-3" />
          Actif
        </Badge>
      )
    case "expired":
      return (
        <Badge variant="secondary">
          <Clock className="mr-1 h-3 w-3" />
          Expiré
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400">
          <XCircle className="mr-1 h-3 w-3" />
          Annulé
        </Badge>
      )
    default:
      return null
  }
}

// ─── Progress steps dérivés du status serveur ─────────────────────────────────

type StepStatus = "completed" | "current" | "pending"

interface Step {
  key: string
  name: string
  status: StepStatus
  date: string | null
}

function buildSteps(contract: ContractDetail): Step[] {
  const { status, created_at, sent_at, signed_at } = contract

  const order: ServerStatus[] = ["draft", "sent", "revision", "approved", "signed"]
  const currentIndex = order.indexOf(status)

  const steps: Step[] = [
    {
      key: "created",
      name: "Contrat créé par l'agence",
      status: "completed",
      date: created_at,
    },
    {
      key: "sent",
      name: "Contrat envoyé au locataire",
      status: status === "draft" ? "current" : "completed",
      date: sent_at,
    },
    {
      key: "revision",
      name: "Révision demandée",
      status:
        status === "revision"
          ? "current"
          : ["approved", "signed"].includes(status)
            ? "completed"
            : "pending",
      date: null,
    },
    {
      key: "approved",
      name: "Contrat approuvé",
      status:
        status === "approved"
          ? "current"
          : status === "signed"
            ? "completed"
            : "pending",
      date: null,
    },
    {
      key: "signed",
      name: "Contrat signé",
      status: status === "signed" ? "completed" : "pending",
      date: signed_at,
    },
  ]

  // Si le contrat est "sent", l'étape revision est pending (pas encore demandée)
  if (status === "sent") {
    steps[2].status = "pending"
    steps[3].status = "pending"
    steps[4].status = "pending"
  }

  return steps
}

// ─── History icon ─────────────────────────────────────────────────────────────

function getHistoryIcon(action: ContractHistory["action"]) {
  switch (action) {
    case "created": return <FileText className="h-4 w-4 text-blue-600" />
    case "sent": return <Send className="h-4 w-4 text-primary" />
    case "revision_requested": return <MessageSquare className="h-4 w-4 text-purple-600" />
    case "approved": return <CheckCircle className="h-4 w-4 text-emerald-600" />
    case "signed": return <PenTool className="h-4 w-4 text-emerald-600" />
    case "cancelled": return <XCircle className="h-4 w-4 text-red-600" />
    default: return <Clock className="h-4 w-4 text-muted-foreground" />
  }
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ContractDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ContractDetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const contractId = params.id ? Number(params.id) : null

  const { contract, loading, error, refetch } = useGetContractDetail(contractId)

  // Dialogs
  const [signDialogOpen, setSignDialogOpen] = useState(searchParams.get("action") === "sign")
  const [revisionDialogOpen, setRevisionDialogOpen] = useState(false)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)

  // Form state
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [revisionComment, setRevisionComment] = useState("")
  const [selectedClauses, setSelectedClauses] = useState<string[]>([])

  // Action loading states
  const [actionLoading, setActionLoading] = useState(false)

  // ── Action handlers ──────────────────────────────────────────────────────


  /** Signer le contrat */
  const handleSigned = async () => {
    if (!contract) return

    setActionLoading(true)

    try {
      await axiosInstance.patch(`/api/contracts/signed/${contract.id}`, {
        agency_id: contract.agency.id,
      })

      setSignDialogOpen(false)
      setTermsAccepted(false)

      toast.success("Contrat signé avec succès !")

      await refetch()

    } catch (err) {
      console.error("Erreur lors de la signature :", err)

      let message = "Une erreur s'est produite lors de la signature du contrat."

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message
      }
      toast.error(message)
    } finally {
      setActionLoading(false)
    }
  }
  /** Approuver le contrat */
  const handleApproved = async () => {
    if (!contract) return
    setActionLoading(true)
    try {
      await axiosInstance.patch(`/api/contracts/approved/${contract.id}`, {
        agency_id: contract.agency.id,
      })
      setApproveDialogOpen(false)
      toast.success("Contrat approuvé avec succès !")
      window.location.href = `/portal/contracts/`
    } catch (err) {
      console.error("Erreur lors de l'approbation :", err)
      let message = "Une erreur s'est produite lors de l'approbation du contrat."

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message
      }
      toast.error(message)
    } finally {
      setActionLoading(false)
    }
  }

  /** Demander une révision */
  const handleRevision = async () => {
    if (!contract || !revisionComment.trim()) return
    setActionLoading(true)
    console.log("Selected clauses for revision:", selectedClauses, "Comment:", revisionComment)
    try {
      await axiosInstance.patch(`/api/contracts/revision/${contract.id}`, {
        comment: revisionComment,
        clauses: selectedClauses,
        agency_id: contract.agency.id,
      })
      setRevisionDialogOpen(false)
      setRevisionComment("")
      setSelectedClauses([])
      toast.success("Demande de révision envoyée avec succès !")
      await refetch()
    } catch (err) {
      console.error("Erreur lors de la demande de révision :", err)
      let message = "Une erreur s'est produite lors de la demande de révision du contrat."

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message
      }
      toast.error(message)
    } finally {
      setActionLoading(false)
    }
  }

  /** Annuler le contrat */
  const handleCancel = async () => {
    if (!contract) return
    setActionLoading(true)
    try {
      await axiosInstance.patch(`/api/contracts/cancel/${contract.id}`, {
        agency_id: contract.agency.id,
      })
      setCancelDialogOpen(false)
      toast.success("Contrat annulé avec succès !")
      await refetch()
    } catch (err) {
      console.error("Erreur lors de l'annulation :", err)
      toast.error("Une erreur s'est produite lors de l'annulation du contrat.")
    } finally {
      setActionLoading(false)
    }
  }


  // ── Render ───────────────────────────────────────────────────────────────

  if (loading) return <ContractDetailSkeleton />

  if (error || !contract) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <p className="text-muted-foreground">{error ?? "Contrat introuvable."}</p>
        <Button asChild variant="outline">
          <Link href="/portal/contracts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux contrats
          </Link>
        </Button>
      </div>
    )
  }

  const steps = buildSteps(contract)
  const completedSteps = steps.filter((s) => s.status === "completed").length
  const progressPercentage = Math.round((completedSteps / steps.length) * 100)
  const historySteps = [...contract.histories].reverse() // du plus ancien au plus récent

  const isActionable = ["sent", "draft", "approved"].includes(contract.status)
  // ── Calcul financier ──────────────────────────────────────────────────────
  const loyer = parseFloat(contract.amount)
  const cautionMois = contract.cautionMonths ?? 1
  const caution = loyer * cautionMois

  // Loyer à payer selon la fréquence (mensuel=1x, trimestriel=3x, annuel=12x)
  const freqMultiplier =
    contract.payment_frequency === "quarterly" ? 3
      : contract.payment_frequency === "yearly" ? 12
        : 1
  const loyerDu = loyer * freqMultiplier

  // Commission = % du loyer mensuel
  const commissionPct = parseFloat(contract.commission)
  const commission = loyer * (commissionPct / 100)

  const totalDue = caution + loyerDu + commission
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? ""

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="icon" asChild className="mt-1">
            <Link href="/portal/contracts">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-semibold text-foreground">{contract.contract_number}</h1>
              {getStatusBadge(contract.status)}
            </div>
            <p className="text-muted-foreground">
              {contract.type === "rental" ? "Contrat de location" : "Contrat de vente"} —{" "}
              {contract.bien.title}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 ml-12 md:ml-0">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Télécharger le PDF
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main Content ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Progress Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Avancement du contrat</CardTitle>
                  <CardDescription>Suivez l'état de votre contrat</CardDescription>
                </div>
                <Badge variant="secondary">{progressPercentage}% terminé</Badge>
              </div>
              <Progress value={progressPercentage} className="h-2 mt-2" />
            </CardHeader>
            <CardContent>
              <div className="relative">
                {steps.map((step, index) => (
                  <div key={step.key} className="relative flex gap-4 pb-4 last:pb-0">
                    {index !== steps.length - 1 && (
                      <div
                        className={cn(
                          "absolute left-[9px] top-6 h-full w-0.5",
                          step.status === "completed" ? "bg-emerald-600" : "bg-border"
                        )}
                      />
                    )}
                    <div className="relative z-10 flex-shrink-0">
                      {step.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      ) : step.status === "current" ? (
                        <Clock className="h-5 w-5 text-primary" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h4
                          className={cn(
                            "text-sm font-medium",
                            step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                          )}
                        >
                          {step.name}
                        </h4>
                        {step.date && (
                          <span className="text-xs text-muted-foreground">
                            {formatDate(step.date)}
                          </span>
                        )}
                      </div>
                      {step.status === "current" && (
                        <p className="text-xs text-primary mt-1">Étape en cours</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Card>
            <Tabs defaultValue="preview" className="w-full">
              <CardHeader className="pb-0">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="preview">Aperçu</TabsTrigger>
                  <TabsTrigger value="clauses">Clauses</TabsTrigger>
                  <TabsTrigger value="history">Historique</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent className="pt-6">

                {/* ── Preview Tab ── */}
                <TabsContent value="preview" className="mt-0 space-y-6">

                  {/* Bien */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Détails du bien
                    </h3>
                    <div className="flex gap-4 p-4 rounded-lg border border-border bg-muted/30">
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                        {contract.bien.images?.[0]?.url ? (
                          <Image
                            src={`${apiUrl}${contract.bien.images[0].url}`}
                            alt={contract.bien.images[0].alt ?? contract.bien.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-muted rounded-lg">
                            <Home className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground">{contract.bien.title}</h4>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {contract.bien.neighborhood}, {contract.bien.city}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{contract.bien.rooms} pièce{contract.bien.rooms > 1 ? "s" : ""}</span>
                          <span>{contract.bien.bathrooms} salle{contract.bien.bathrooms > 1 ? "s" : ""} de bain</span>
                          <span>{contract.bien.surface} m²</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Parties */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Agence
                      </h3>
                      <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-2">
                        <p className="font-medium text-foreground">{contract.agency.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {contract.agency.email}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {contract.agency.phone}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {contract.agency.address}, {contract.agency.city}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Locataire
                      </h3>
                      <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-2">
                        <p className="font-medium text-foreground">
                          {contract.client.prenom} {contract.client.nom}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {contract.client.phone}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {contract.client.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Finances */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Conditions financières
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Loyer */}
                      <div className="p-4 rounded-lg border border-border bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">
                          Loyer{" "}
                          <span className="capitalize">
                            ({contract.payment_frequency === "monthly"
                              ? "mensuel"
                              : contract.payment_frequency === "quarterly"
                                ? "trimestriel"
                                : "annuel"})
                          </span>
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatAmount(loyerDu.toString())}
                        </p>
                        {freqMultiplier > 1 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatAmount(contract.amount)} × {freqMultiplier}
                          </p>
                        )}
                      </div>

                      {/* Caution */}
                      <div className="p-4 rounded-lg border border-border bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">
                          Caution ({cautionMois} mois)
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatAmount(caution.toString())}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatAmount(contract.amount)} × {cautionMois}
                        </p>
                      </div>

                      {/* Commission */}
                      <div className="p-4 rounded-lg border border-border bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">
                          Commission agence ({commissionPct}% du loyer)
                        </p>
                        <p className="text-lg font-semibold text-foreground">
                          {formatAmount(commission.toString())}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatAmount(contract.amount)} × {commissionPct}%
                        </p>
                      </div>
                    </div>

                    {/* Total à la signature */}
                    <div className="mt-4 p-4 rounded-lg border border-primary/30 bg-primary/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">Total dû à la signature</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Loyer + Caution ({cautionMois} mois) + Commission ({commissionPct}%)
                          </p>
                        </div>
                        <p className="text-xl font-bold text-primary">
                          {formatAmount(totalDue.toString())}
                        </p>
                      </div>
                      {/* Détail du calcul */}
                      <div className="mt-3 pt-3 border-t border-primary/20 grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span className="block font-medium text-foreground">Loyer dû</span>
                          {formatAmount(loyerDu.toString())}
                        </div>
                        <div>
                          <span className="block font-medium text-foreground">Caution</span>
                          {formatAmount(caution.toString())}
                        </div>
                        <div>
                          <span className="block font-medium text-foreground">Commission</span>
                          {formatAmount(commission.toString())}
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Période */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Période de location
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="p-4 rounded-lg border border-border bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">Date de début</p>
                        <p className="font-medium text-foreground">{formatDate(contract.start_date)}</p>
                      </div>
                      <div className="p-4 rounded-lg border border-border bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">Date de fin</p>
                        <p className="font-medium text-foreground">
                          {computeEndDate(contract.start_date, contract.duration)}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border border-border bg-muted/30">
                        <p className="text-xs text-muted-foreground mb-1">Durée</p>
                        <p className="font-medium text-foreground">{formatDuration(contract.duration)}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* ── Clauses Tab ── */}
                <TabsContent value="clauses" className="mt-0 space-y-4">
                  {contract.contract_clauses.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Aucune clause enregistrée.
                    </p>
                  ) : (
                    [...contract.contract_clauses]
                      .sort((a, b) => a.order - b.order)
                      .map((clause, index) => (
                        <div key={clause.id} className="p-4 rounded-lg border border-border">
                          <h4 className="font-medium text-foreground mb-2">
                            {index + 1}. {clause.title}
                          </h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {clause.content}
                          </p>
                        </div>
                      ))
                  )}
                </TabsContent>

                {/* ── History Tab ── */}
                <TabsContent value="history" className="mt-0">
                  {historySteps.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Aucune action enregistrée pour l'instant.
                    </p>
                  ) : (
                    <div className="relative">
                      {historySteps.map((event, index) => (
                        <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
                          {index !== historySteps.length - 1 && (
                            <div className="absolute left-[15px] top-8 h-full w-0.5 bg-border" />
                          )}
                          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background flex-shrink-0">
                            {getHistoryIcon(event.action)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                              <h4 className="font-medium text-foreground text-sm">
                                {event.description}
                              </h4>
                              <span className="text-xs text-muted-foreground">
                                {formatDateTime(event.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
              <CardDescription>Intervenez sur ce contrat</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {isActionable && (
                <>
                  <Button className="w-full" onClick={() => setApproveDialogOpen(true)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approuver le contrat
                  </Button>
                  <Button className="w-full" onClick={() => setSignDialogOpen(true)}>
                    <PenTool className="mr-2 h-4 w-4" />
                    Signer le contrat
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => setRevisionDialogOpen(true)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Demander une révision
                  </Button>
                  <Separator />
                  <Button
                    variant="outline"
                    className="w-full bg-transparent text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => setCancelDialogOpen(true)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Annuler le contrat
                  </Button>
                </>
              )}
              {contract.status === "signed" && (
                <>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Télécharger la copie signée
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/portal/messages">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contacter l'agence
                    </Link>
                  </Button>
                </>
              )}
              {!isActionable && contract.status !== "signed" && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  Aucune action disponible pour ce contrat.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Agence */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Votre agence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {contract.agency.logo ? (
                    <Image
                      src={`${apiUrl}${contract.agency.logo}`}
                      alt={contract.agency.name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <Shield className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-foreground">{contract.agency.name}</p>
                  <p className="text-sm text-muted-foreground">Agence immobilière</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {contract.agency.email}
                </p>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {contract.agency.phone}
                </p>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
                <Link href="/portal/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Envoyer un message
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Dates clés */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Dates clés</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Créé le</span>
                <span className="text-sm font-medium">{formatDate(contract.created_at)}</span>
              </div>
              {contract.sent_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Envoyé le</span>
                  <span className="text-sm font-medium text-amber-600">
                    {formatDate(contract.sent_at)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Début du bail</span>
                <span className="text-sm font-medium">{formatDate(contract.start_date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fin du bail</span>
                <span className="text-sm font-medium">
                  {computeEndDate(contract.start_date, contract.duration)}
                </span>
              </div>
              {contract.signed_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Signé le</span>
                  <span className="text-sm font-medium text-emerald-600">
                    {formatDate(contract.signed_at)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Dialog : Approuver ── */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Approuver le contrat</DialogTitle>
            <DialogDescription>
              Confirmez que vous avez relu toutes les clauses et que vous approuvez ce contrat.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Que se passe-t-il après l'approbation ?</h4>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>Le statut du contrat sera mis à jour comme approuvé</li>
                    <li>L'agence sera informée de votre approbation</li>
                    <li>Vous pourrez ensuite procéder à la signature</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button
              onClick={handleApproved}
              disabled={actionLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Approuver
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog : Signer ── */}
      <Dialog open={signDialogOpen} onOpenChange={setSignDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Signer le contrat</DialogTitle>
            <DialogDescription>
              Relisez le résumé ci-dessous avant de signer {contract.contract_number}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg border border-border p-4 bg-muted/30">
              <h4 className="font-medium text-foreground mb-2">Résumé du contrat</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bien</span>
                  <span className="font-medium">{contract.bien.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Loyer mensuel</span>
                  <span className="font-medium">{formatAmount(contract.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Caution ({cautionMois} mois)
                  </span>
                  <span className="font-medium">{formatAmount(caution.toString())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commission ({commissionPct}%)</span>
                  <span className="font-medium">{formatAmount(commission.toString())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Loyer ({contract.payment_frequency === "monthly" ? "mensuel" : contract.payment_frequency === "quarterly" ? "trimestriel" : "annuel"})
                  </span>
                  <span className="font-medium">{formatAmount(loyerDu.toString())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Durée</span>
                  <span className="font-medium">{formatDuration(contract.duration)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Total dû à la signature</span>
                  <span className="font-bold text-primary">{formatAmount(totalDue.toString())}</span>
                </div>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                J'ai lu et j'accepte toutes les clauses et conditions de ce contrat. Je comprends qu'il
                s'agit d'un accord juridiquement contraignant et que ma signature électronique a la même
                valeur légale qu'une signature manuscrite.
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button disabled={!termsAccepted || actionLoading} onClick={handleSigned}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenTool className="mr-2 h-4 w-4" />}
              Signer maintenant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog : Révision ── */}
      <Dialog open={revisionDialogOpen} onOpenChange={setRevisionDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Demander une révision</DialogTitle>
            <DialogDescription>
              Indiquez les clauses à modifier et ajoutez vos commentaires.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Clauses à réviser (optionnel)</Label>
              <div className="max-h-40 overflow-y-auto rounded-lg border border-border p-2 space-y-2">
                {contract.contract_clauses.map((clause) => (
                  <div key={clause.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`clause-${clause.id}`}
                      checked={selectedClauses.includes(clause.title)}
                      onCheckedChange={(checked) => {
                        setSelectedClauses((prev) =>
                          checked ? [...prev, clause.title] : prev.filter((t) => t !== clause.title)
                        )
                      }}
                    />
                    <Label htmlFor={`clause-${clause.id}`} className="text-sm font-normal">
                      {clause.title}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="revision-comment">Vos commentaires *</Label>
              <Textarea
                id="revision-comment"
                placeholder="Expliquez les modifications que vous souhaitez..."
                value={revisionComment}
                onChange={(e) => setRevisionComment(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevisionDialogOpen(false)} className="bg-transparent">
              Annuler
            </Button>
            <Button disabled={!revisionComment.trim() || actionLoading} onClick={handleRevision}>
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Envoyer la demande
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Dialog : Annuler ── */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Annuler le contrat</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir annuler ce contrat ? Cette action est irréversible et l'agence
              sera informée de votre décision.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Conserver le contrat</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={actionLoading}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Oui, annuler le contrat
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}