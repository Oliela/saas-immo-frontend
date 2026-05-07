"use client"

import Link from "next/link"
import {
  ArrowLeft, FileText, Pencil, Download, Printer, Send,
  User, Building2, DollarSign, Calendar, History, Copy,
  MapPin, Home, Waves, Layers, CheckCircle, Phone,
  FilePen, FileCheck, FileX, Clock, CircleDot,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Contract, ContractStatus } from "@/types/contracts"
import { usePdfDownload } from "@/hooks/usePdfDownload"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatAmount = (value: string) => Number(value).toLocaleString("fr-FR") + " €"

const getProgress = (status: ContractStatus): number => {
  const map: Record<ContractStatus, number> = {
    draft: 20, sent: 40, revision: 60, approved: 80,
    signed: 100, expired: 0, cancelled: 0,
  }
  return map[status] ?? 0
}

const getInitials = (prenom: string, nom: string) =>
  `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase()

// ─── Workflow ─────────────────────────────────────────────────────────────────

const WORKFLOW_STEPS: { status: ContractStatus; label: string; description: string; icon: React.ElementType }[] = [
  { status: "draft",     label: "Brouillon",  description: "Contrat créé et en cours de rédaction",  icon: FilePen },
  { status: "sent",      label: "Envoyé",     description: "Contrat envoyé au client pour signature", icon: Send },
  { status: "revision",  label: "En Révision",description: "Le client a demandé des modifications",   icon: FileText },
  { status: "approved",  label: "Approuvé",   description: "Contrat approuvé par toutes les parties", icon: FileCheck },
  { status: "signed",    label: "Signé",      description: "Contrat signé et finalisé",               icon: CheckCircle },
  { status: "cancelled", label: "Annulé",     description: "Contrat annulé par le client",            icon: FileX },
]

const TERMINAL_STATUSES: ContractStatus[] = ["expired"]

interface ContractViewPageProps { contract: Contract }

export default function ContractViewPage({ contract }: ContractViewPageProps) {
  const { client, bien, contract_clauses, histories } = contract
  const { open: openPdf, isLoading: isPdfLoading } = usePdfDownload()

  const isTerminal          = TERMINAL_STATUSES.includes(contract.status)
  const isContractCancelled = contract.status === "cancelled"
  const normalSteps         = WORKFLOW_STEPS.filter(s => s.status !== "cancelled")
  const normalCurrentIndex  = normalSteps.findIndex(s => s.status === contract.status)

  // ── PDF ────────────────────────────────────────────────────────────────────
  const pdfPath = `/api/contracts/${contract.id}/pdf`

  const getStatusBadge = (status: ContractStatus) => {
    const config: Record<ContractStatus, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      signed: { variant: "default", label: "Signé" }, sent: { variant: "secondary", label: "Envoyé" },
      draft: { variant: "outline", label: "Brouillon" }, revision: { variant: "secondary", label: "En Révision" },
      approved: { variant: "default", label: "Approuvé" }, expired: { variant: "destructive", label: "Expiré" },
      cancelled: { variant: "destructive", label: "Annulé" },
    }
    const { variant, label } = config[status] ?? { variant: "outline", label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  const paymentFrequencyMultiplier: Record<string, number> = { monthly: 1, quarterly: 3, biannual: 6, annual: 12 }
  const paymentFrequencyLabel: Record<string, string>      = { monthly: "Mensuel", quarterly: "Trimestriel", biannual: "Semestriel", annual: "Annuel" }

  const rentAmount       = Number(contract.amount)
  const depositAmount    = Number(contract.deposit)
  const commissionRate   = Number(contract.commission)
  const rentMultiplier   = paymentFrequencyMultiplier[contract.payment_frequency] ?? 1
  const commissionAmount = (rentAmount * commissionRate) / 100
  const cautionTotal     = contract.type === "rental" ? depositAmount * contract.cautionMonths : depositAmount
  const rentAtSignature  = contract.type === "rental" ? rentAmount * rentMultiplier : 0
  const totalSignature   = cautionTotal + commissionAmount + rentAtSignature

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/contracts"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{contract.contract_number}</h1>
              {getStatusBadge(contract.status)}
              <Badge variant="outline">{contract.type === "rental" ? "Location" : "Vente"}</Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Créé le {new Date(contract.created_at).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* ── Un seul bouton PDF dans le header ── */}
          <Button
            variant="outline" size="sm" className="bg-transparent"
            onClick={() => openPdf(pdfPath, contract.id)}
            disabled={isPdfLoading(contract.id)}
          >
            <Download className="mr-2 h-4 w-4" />
            {isPdfLoading(contract.id) ? "Ouverture..." : "Voir / Télécharger PDF"}
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Send className="mr-2 h-4 w-4" />Envoyer
          </Button>
          <Button size="sm" asChild>
            <Link href={`/dashboard/contracts/${contract.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />Modifier
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Progression ── */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-foreground">Progression du Contrat</p>
            <p className="text-sm text-muted-foreground">{getProgress(contract.status)}% complété</p>
          </div>
          <Progress value={getProgress(contract.status)} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details"><FileText className="mr-2 h-4 w-4" />Détails</TabsTrigger>
              <TabsTrigger value="clauses"><Copy className="mr-2 h-4 w-4" />Clauses ({contract_clauses.length})</TabsTrigger>
              <TabsTrigger value="history"><History className="mr-2 h-4 w-4" />Historique</TabsTrigger>
            </TabsList>

            {/* ── Détails ── */}
            <TabsContent value="details" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5" />Bien Immobilier
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Titre</span>
                    <span className="font-medium text-foreground">{bien.title}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="font-medium text-foreground capitalize">{bien.propertyType}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-muted-foreground shrink-0">Adresse</span>
                    <span className="font-medium text-foreground text-right">
                      {bien.address}, {bien.neighborhood}, {bien.city} — {bien.country}
                    </span>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Surface</span>
                      <span className="text-sm font-semibold text-foreground">{bien.surface} m²</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50">
                      <Layers className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Pièces</span>
                      <span className="text-sm font-semibold text-foreground">{bien.rooms}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50">
                      <Waves className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">SDB</span>
                      <span className="text-sm font-semibold text-foreground">{bien.bathrooms}</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">Étage</span>
                      <span className="text-sm font-semibold text-foreground">{bien.floor}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Prix affiché</span>
                    <span className="font-bold text-foreground">{formatAmount(bien.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Meublé</span>
                    <span className="font-medium text-foreground">{bien.furnished ? "Oui" : "Non"}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5" />Conditions Financières
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {contract.type === "rental" ? "Loyer Mensuel" : "Prix de Vente"}
                    </span>
                    <span className="font-bold text-foreground text-lg">
                      {formatAmount(contract.amount)}
                      {contract.type === "rental" && <span className="text-sm font-normal text-muted-foreground">/mois</span>}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Commission Agence</span>
                    <span className="font-medium text-foreground">{contract.commission}% — {formatAmount(commissionAmount.toString())}</span>
                  </div>
                  <Separator />
                  {contract.type === "rental" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Caution ({contract.cautionMonths} mois × {formatAmount(contract.deposit)})</span>
                        <span className="font-medium text-foreground">{formatAmount(cautionTotal.toString())}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Loyer à la signature{" "}
                          <span className="text-xs text-muted-foreground">({rentMultiplier} mois — {paymentFrequencyLabel[contract.payment_frequency]})</span>
                        </span>
                        <span className="font-medium text-foreground">{formatAmount(rentAtSignature.toString())}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Fréquence de Paiement</span>
                        <span className="font-medium text-foreground">{paymentFrequencyLabel[contract.payment_frequency]}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  {contract.type === "sale" && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dépôt de Garantie</span>
                        <span className="font-medium text-foreground">{formatAmount(contract.deposit)}</span>
                      </div>
                      <Separator />
                    </>
                  )}
                  <div className="flex justify-between bg-muted/50 rounded-lg p-3">
                    <span className="font-semibold text-foreground">Total à la Signature</span>
                    <span className="font-bold text-foreground text-lg">{formatAmount(totalSignature.toString())}</span>
                  </div>
                  {contract.type === "rental" && (
                    <p className="text-xs text-muted-foreground">
                      Caution ({formatAmount(cautionTotal.toString())}) + Commission ({formatAmount(commissionAmount.toString())}) + Loyer ({formatAmount(rentAtSignature.toString())})
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg"><Calendar className="h-5 w-5" />Dates Clés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date de Début</span>
                    <span className="font-medium text-foreground">{new Date(contract.start_date).toLocaleDateString("fr-FR")}</span>
                  </div>
                  {contract.type === "rental" && (<><Separator />
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Durée</span>
                      <span className="font-medium text-foreground">{contract.duration} mois</span>
                    </div>
                  </>)}
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Envoyé le</span>
                    <span className="font-medium text-foreground">{contract.sent_at ? new Date(contract.sent_at).toLocaleDateString("fr-FR") : "—"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Signé le</span>
                    <span className="font-medium text-foreground">{contract.signed_at ? new Date(contract.signed_at).toLocaleDateString("fr-FR") : "—"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expire le</span>
                    <span className="font-medium text-foreground">{contract.expired_at ? new Date(contract.expired_at).toLocaleDateString("fr-FR") : "—"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Créé le</span>
                    <span className="font-medium text-foreground">{new Date(contract.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Clauses ── */}
            <TabsContent value="clauses" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Clauses du Contrat</CardTitle>
                  <CardDescription>{contract_clauses.length} clause{contract_clauses.length > 1 ? "s" : ""} dans ce contrat</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contract_clauses.slice().sort((a, b) => a.order - b.order).map((clause, index) => (
                    <div key={clause.id} className="p-4 rounded-lg border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">{index + 1}</span>
                        <h4 className="font-semibold text-foreground">{clause.title}</h4>
                        {clause.is_custom === 1 && <Badge variant="secondary" className="text-xs">Personnalisée</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed pl-8">{clause.content}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Historique ── */}
            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historique & Suivi</CardTitle>
                  <CardDescription>Progression du contrat à travers les étapes du workflow</CardDescription>
                </CardHeader>
                <CardContent>
                  {isTerminal ? (
                    <div className="space-y-4">
                      {histories && histories.length > 0 && (
                        <div className="space-y-3 mb-6">
                          {histories.map((event, index) => (
                            <div key={event.id} className="flex gap-3">
                              <div className="flex flex-col items-center">
                                <div className="h-3 w-3 rounded-full bg-destructive mt-1" />
                                {index < histories.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                              </div>
                              <div className="pb-4">
                                <p className="text-sm font-medium text-foreground">{event.description}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs capitalize">{event.action}</Badge>
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(event.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <FileX className="h-5 w-5 text-destructive" />
                        <div>
                          <p className="text-sm font-semibold text-destructive">Contrat Expiré</p>
                          <p className="text-xs text-muted-foreground">Ce contrat ne suit plus le workflow standard.</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-0">
                      {WORKFLOW_STEPS.map((step) => {
                        const isCancelledStep = step.status === "cancelled"
                        if (isCancelledStep && !isContractCancelled) return null
                        const normalIndex = normalSteps.findIndex(s => s.status === step.status)
                        const isCompleted = !isCancelledStep && normalIndex <= normalCurrentIndex && !isContractCancelled
                        const isCurrent   = isCancelledStep ? isContractCancelled : step.status === contract.status
                        const isFuture    = !isCompleted && !isCurrent && !isCancelledStep
                        const matchingEvent = histories?.find(h => h.action === step.status || (h.action === "created" && step.status === "draft"))
                        const StepIcon = step.icon
                        const visibleSteps  = WORKFLOW_STEPS.filter(s => s.status !== "cancelled" || isContractCancelled)
                        const isLastVisible = visibleSteps[visibleSteps.length - 1].status === step.status
                        const dotStyle = (): React.CSSProperties => {
                          if (isCancelledStep && isCurrent) return { backgroundColor: "#ef4444", borderColor: "#ef4444", color: "white" }
                          if (isCompleted) return { backgroundColor: "#22c55e", borderColor: "#22c55e", color: "white" }
                          return {}
                        }
                        const lineStyle = (): React.CSSProperties => isCompleted ? { backgroundColor: "#22c55e" } : {}
                        return (
                          <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
                            <div className="flex flex-col items-center">
                              <div style={dotStyle()} className={cn("h-9 w-9 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors", !isCompleted && !(isCancelledStep && isCurrent) ? "bg-muted border-border text-muted-foreground" : "")}>
                                {isCancelledStep && isCurrent ? <FileX className="h-5 w-5" /> : isCurrent ? <CircleDot className="h-5 w-5" /> : isCompleted ? <CheckCircle className="h-5 w-5" /> : <StepIcon className="h-4 w-4" />}
                              </div>
                              {!isLastVisible && <div style={lineStyle()} className={cn("w-0.5 flex-1 mt-1 min-h-[24px]", !isCompleted && "bg-border")} />}
                            </div>
                            <div className="flex-1 pb-2 pt-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className={cn("text-sm font-semibold", isCancelledStep && isCurrent ? "text-destructive" : isCompleted ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
                                {isCompleted && <Badge variant="outline" className="text-xs" style={{ color: "#16a34a", borderColor: "#86efac", backgroundColor: "#f0fdf4" }}>Complété</Badge>}
                                {isCurrent && !isCancelledStep && !isCompleted && <Badge className="text-xs bg-primary/10 text-primary border-primary/20">Étape actuelle</Badge>}
                                {isFuture && <Badge variant="outline" className="text-xs text-muted-foreground">À venir</Badge>}
                                {isCancelledStep && isCurrent && <Badge variant="destructive" className="text-xs">Annulé par le client</Badge>}
                              </div>
                              <p className={cn("text-xs mt-0.5", isCancelledStep && isCurrent ? "text-destructive/70" : isCompleted ? "text-muted-foreground" : "text-muted-foreground/50")}>{step.description}</p>
                              {matchingEvent && (
                                <div className="mt-2 flex items-center gap-2">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{new Date(matchingEvent.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                                  {matchingEvent.description && <span className="text-xs text-muted-foreground">— {matchingEvent.description}</span>}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  {!isTerminal && histories && histories.length > 0 && (() => {
                    const workflowActions = new Set([...WORKFLOW_STEPS.map(s => s.status), "created"])
                    const extraEvents = histories.filter(h => !workflowActions.has(h.action as ContractStatus))
                    if (extraEvents.length === 0) return null
                    return (
                      <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wide">Autres événements</p>
                        <div className="space-y-3">
                          {extraEvents.map((event) => (
                            <div key={event.id} className="flex items-start gap-3">
                              <div className="h-2 w-2 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
                              <div>
                                <p className="text-sm text-foreground">{event.description}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Badge variant="outline" className="text-xs capitalize">{event.action}</Badge>
                                  <span className="text-xs text-muted-foreground">{new Date(event.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><User className="h-5 w-5" />Client</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-12 w-12"><AvatarFallback>{getInitials(client.prenom, client.nom)}</AvatarFallback></Avatar>
                <div>
                  <p className="font-semibold text-foreground">{client.prenom} {client.nom}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    <Badge variant="outline" className="text-xs capitalize">{client.occupation}</Badge>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="h-4 w-4 shrink-0" />{client.phone}</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 shrink-0" />{client.address}</div>
              </div>
              <Separator className="my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Employeur</span><span className="font-medium text-foreground">{client.employer}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Revenu Mensuel</span><span className="font-medium text-foreground">{formatAmount(client.monthly_income)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Budget</span><span className="font-medium text-foreground">{formatAmount(client.monthly_budget)}</span></div>
              </div>
              <Separator className="my-3" />
              <p className="text-xs font-medium text-muted-foreground mb-2">Documents fournis</p>
              <div className="flex flex-wrap gap-1">
                {client.id_document === "true" && <Badge variant="secondary" className="text-xs"><CheckCircle className="h-3 w-3 mr-1" />Pièce d'identité</Badge>}
                {client.income_proof === "true" && <Badge variant="secondary" className="text-xs"><CheckCircle className="h-3 w-3 mr-1" />Justif. revenus</Badge>}
                {client.bank_statement === "true" && <Badge variant="secondary" className="text-xs"><CheckCircle className="h-3 w-3 mr-1" />Relevé bancaire</Badge>}
                {client.recommendation_letter === "true" && <Badge variant="secondary" className="text-xs"><CheckCircle className="h-3 w-3 mr-1" />Lettre de recommandation</Badge>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Infos Contrat</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Ville</span><span className="font-medium text-foreground">{contract.city}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">N° Contrat</span><span className="font-medium text-foreground text-xs">{contract.contract_number}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Statut</span>{getStatusBadge(contract.status)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Actions Rapides</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm" asChild>
                <Link href={`/dashboard/contracts/${contract.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />Modifier le Contrat
                </Link>
              </Button>
              {/* ── Un seul bouton PDF dans la sidebar ── */}
              <Button
                variant="outline" className="w-full bg-transparent" size="sm"
                onClick={() => openPdf(pdfPath, contract.id)}
                disabled={isPdfLoading(contract.id)}
              >
                <Download className="mr-2 h-4 w-4" />
                {isPdfLoading(contract.id) ? "Ouverture..." : "Voir / Télécharger PDF"}
              </Button>
              <Button variant="outline" className="w-full bg-transparent" size="sm">
                <Send className="mr-2 h-4 w-4" />Envoyer au Client
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}