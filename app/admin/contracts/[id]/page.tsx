"use client"

import { use } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft,
  FileText,
  Building2,
  UserCircle,
  User,
  Home,
  Calendar,
  CreditCard,
  Banknote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { StatsCard } from "@/components/admin/stats-card"
import { useAdminContractDetail } from "@/hooks/useAdminContractDetail"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const TYPE_LABELS: Record<string, string> = {
  rental: "Location",
  sale: "Vente",
  management: "Gestion",
}

const STATUT_FACTURE: Record<string, string> = {
  payee: "paid",
  non_payee: "unpaid",
  partiellement_payee: "partially_paid",
  en_retard: "overdue",
}

const STATUT_PAIEMENT: Record<string, string> = {
  confirme: "completed",
  en_attente: "pending",
  echoue: "failed",
  rembourse: "refunded",
}

const MODE_PAIEMENT_LABELS: Record<string, string> = {
  carte_bancaire: "Carte bancaire",
  virement: "Virement",
  wave: "Mobile Money",
  mobile_money: "Mobile Money",
  especes: "Espèces",
  cheque: "Chèque",
}

export default function AdminContractDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data, loading, error } = useAdminContractDetail(id)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement du contrat...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error ?? "Contrat introuvable"}</p>
      </div>
    )
  }

  const { stats, informations, parties, factures, paiements } = data

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/contracts">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-foreground">{informations.titreBien}</h1>
            <Badge variant="outline">{TYPE_LABELS[informations.type] ?? informations.type}</Badge>
          </div>
          {informations.dateSigned && (
            <p className="text-muted-foreground text-sm">
              Signé le {format(new Date(informations.dateSigned), "d MMMM yyyy", { locale: fr })}
            </p>
          )}
        </div>
        <StatusBadge status={informations.statut} />
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Montant contrat"
          value={formatCurrency(parseFloat(stats.montantContrat))}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title="Total payé"
          value={formatCurrency(stats.totalPaye)}
          icon={<Banknote className="h-4 w-4" />}
        />
        <StatsCard
          title="Factures"
          value={stats.nombreFactures}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title="Paiements"
          value={stats.nombrePaiements}
          icon={<CreditCard className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Informations du contrat */}
        <Card>
          <CardHeader>
            <CardTitle>Informations du contrat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium">
                  {format(new Date(informations.dateDebut), "dd/MM/yyyy")}
                  {informations.dateFin && (
                    <> → {format(new Date(informations.dateFin), "dd/MM/yyyy")}</>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">Période du contrat</p>
              </div>
            </div>
            {informations.dateSigned && (
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium">
                    {format(new Date(informations.dateSigned), "d MMMM yyyy", { locale: fr })}
                  </p>
                  <p className="text-xs text-muted-foreground">Date de signature</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Home className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium">{informations.titreBien}</p>
                <p className="text-xs text-muted-foreground">Bien concerné</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Type de contrat</span>
              <Badge variant="outline">{TYPE_LABELS[informations.type] ?? informations.type}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Statut</span>
              <StatusBadge status={informations.statut} />
            </div>
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Montant mensuel</span>
              <span>{formatCurrency(parseFloat(informations.montantMensuel))}</span>
            </div>
          </CardContent>
        </Card>

        {/* Parties prenantes */}
        <Card>
          <CardHeader>
            <CardTitle>Parties prenantes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted shrink-0">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">{parties.client}</p>
                  <p className="text-xs text-muted-foreground">Client</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted shrink-0">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">{parties.proprietaire}</p>
                  <p className="text-xs text-muted-foreground">Propriétaire</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted shrink-0">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">{parties.agence}</p>
                  <p className="text-xs text-muted-foreground">Agence</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Factures */}
      <Card>
        <CardHeader>
          <CardTitle>Factures liées</CardTitle>
          <CardDescription>
            {factures.length} facture{factures.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {factures.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucune facture pour ce contrat.
            </p>
          ) : (
            <div className="space-y-3">
              {factures.map((facture, i) => {
                const montantPaye = facture.montant - facture.resteAPayer
                return (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg border gap-4"
                  >
                    <div>
                      <p className="font-medium font-mono text-sm">{facture.numero}</p>
                      <p className="text-xs text-muted-foreground">
                        Échéance : {format(new Date(facture.dateEcheance), "dd/MM/yyyy")}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium text-sm">{formatCurrency(facture.montant)}</p>
                        <p className="text-xs text-muted-foreground">
                          Payé : {formatCurrency(montantPaye)}
                        </p>
                      </div>
                      <StatusBadge status={STATUT_FACTURE[facture.statut] ?? facture.statut} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paiements */}
      <Card>
        <CardHeader>
          <CardTitle>Paiements associés</CardTitle>
          <CardDescription>
            {paiements.length} paiement{paiements.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {paiements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucun paiement pour ce contrat.
            </p>
          ) : (
            <div className="space-y-3">
              {paiements.map((paiement, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-lg border gap-4"
                >
                  <div>
                    <p className="font-medium font-mono text-sm">
                      {paiement.reference ??
                        `REG-${(paiement.date ?? "").slice(0, 4)}-${String(i + 1).padStart(2, "0")}`}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(paiement.date), "d MMM yyyy", { locale: fr })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {MODE_PAIEMENT_LABELS[paiement.modePaiement] ?? paiement.modePaiement}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium text-sm">{formatCurrency(paiement.montant)}</p>
                    <StatusBadge status={STATUT_PAIEMENT[paiement.statut] ?? "completed"} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}