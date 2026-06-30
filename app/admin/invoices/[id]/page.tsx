"use client"

import { use } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft,
  Receipt,
  Building2,
  User,
  FileText,
  Calendar,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/admin/status-badge"
import { StatsCard } from "@/components/admin/stats-card"
import { useAdminInvoiceDetail } from "@/hooks/useAdminInvoiceDetail"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const STATUT_PAIEMENT: Record<string, string> = {
  confirme: "completed",
  en_attente: "pending",
  echoue: "failed",
  rembourse: "refunded",
}

const MODE_PAIEMENT_LABELS: Record<string, string> = {
  wave: "Mobile Money",
  mobile_money: "Mobile Money",
  virement: "Virement",
  carte_bancaire: "Carte bancaire",
  carte: "Carte bancaire",
  especes: "Espèces",
  cheque: "Chèque",
}

function getInvoiceStatus(montantRestant: number, totalPaye: number): string {
  if (montantRestant === 0) return "paid"
  if (totalPaye === 0) return "unpaid"
  return "partially_paid"
}

export default function AdminInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data, loading, error } = useAdminInvoiceDetail(id)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement de la facture...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error ?? "Facture introuvable"}</p>
      </div>
    )
  }

  const { stats, informations, lignes, historiquePaiements } = data
  const invoiceStatus = getInvoiceStatus(stats.montantRestant, stats.totalPaye)

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/invoices">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground">{informations.client}</h1>
          <p className="text-muted-foreground text-sm">
            {informations.agence} · Échéance :{" "}
            {format(new Date(informations.dateEcheance), "d MMMM yyyy", { locale: fr })}
          </p>
        </div>
        <StatusBadge status={invoiceStatus} />
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Montant total"
          value={formatCurrency(stats.montantTotal)}
          icon={<Receipt className="h-4 w-4" />}
        />
        <StatsCard
          title="Total payé"
          value={formatCurrency(stats.totalPaye)}
          icon={<Receipt className="h-4 w-4" />}
        />
        <StatsCard
          title="Reste à payer"
          value={formatCurrency(stats.montantRestant)}
          icon={<Receipt className="h-4 w-4" />}
        />
        <StatsCard
          title="Paiements reçus"
          value={stats.nombrePaiements}
          icon={<CreditCard className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informations de la facture */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de la facture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium">{informations.client}</p>
                <p className="text-xs text-muted-foreground">Client</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium">{informations.agence}</p>
                <p className="text-xs text-muted-foreground">Agence</p>
              </div>
            </div>
            {informations.numeroContrat && (
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-sm font-medium font-mono">{informations.numeroContrat}</p>
                  <p className="text-xs text-muted-foreground">Contrat associé</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium">
                  {format(new Date(informations.dateEcheance), "dd/MM/yyyy")}
                </p>
                <p className="text-xs text-muted-foreground">Date d&apos;échéance</p>
              </div>
            </div>
            <Separator />
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Recouvrement</span>
                <span className="font-medium">{stats.tauxRecouvrement.toFixed(1)}%</span>
              </div>
              <Progress value={stats.tauxRecouvrement} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Lignes de facturation */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Lignes de facturation</CardTitle>
            <CardDescription>
              {lignes.length} ligne{lignes.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center w-[80px]">Qté</TableHead>
                  <TableHead className="text-right">PU</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lignes.map((ligne, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <p className="font-medium text-sm">{ligne.libelle}</p>
                      {ligne.description && (
                        <p className="text-xs text-muted-foreground">{ligne.description}</p>
                      )}
                    </TableCell>
                    <TableCell className="text-center">{ligne.quantite}</TableCell>
                    <TableCell className="text-right">{formatCurrency(ligne.prixUnitaire)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(ligne.total)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Separator className="my-4" />
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{formatCurrency(stats.montantTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payé</span>
                <span className="text-green-600">{formatCurrency(stats.totalPaye)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Reste à payer</span>
                <span className={stats.montantRestant > 0 ? "text-destructive" : "text-green-600"}>
                  {formatCurrency(stats.montantRestant)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Historique des paiements */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
          <CardDescription>
            {historiquePaiements.length} paiement{historiquePaiements.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {historiquePaiements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucun paiement enregistré pour cette facture.
            </p>
          ) : (
            <div className="space-y-3">
              {historiquePaiements.map((paiement, i) => (
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