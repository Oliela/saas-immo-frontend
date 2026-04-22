"use client"

import Link from "next/link"
import { Download, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { useClientFactures, type Facture } from "@/hooks/clients/useClientFactures"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusConfig(statut: string) {
  const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
    non_payee:           { variant: "secondary",  label: "En attente" },
    partiellement_payee: { variant: "outline",    label: "Partiellement payée" },
    soldee:              { variant: "default",     label: "Payée" },
    annulee:             { variant: "destructive", label: "Annulée" },
  }
  return config[statut] || { variant: "outline", label: statut }
}

function formatCurrency(amount: number | string, devise = "XOF") {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: devise,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(isNaN(num) ? 0 : num)
}

function getFactureDescription(facture: Facture): string {
  if (facture.categorie) return facture.categorie.replace(/_/g, " ")
  if (facture.type_facture) return facture.type_facture
  return "—"
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PortalInvoicesPage() {
  const { user, loading: loadingUser } = useAuth()

  const clientId = user?.profile?.id

  const { factures, stats, loading: loadingFactures, error } = useClientFactures(clientId)

  if (loadingUser || loadingFactures) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }
  console.log("Factures dans la page :", factures) // Debug: log factures data dans la page

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Factures et paiements</h1>
          <p className="text-muted-foreground">Consultez et gérez vos factures</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paiements en attente</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats ? formatCurrency(stats.paiement_attente) : "—"}
                </p>
              </div>
              <div className="text-2xl font-bold text-amber-600">
                {stats?.facture_reste_a_payer ?? 0}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total payé</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats ? formatCurrency(stats.tatol_payee) : "—"}
                </p>
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                {stats?.facture_payee ?? 0}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Montant total</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {stats ? formatCurrency(stats.total_paiement) : "—"}
                </p>
              </div>
              <div className="text-2xl font-bold text-primary">
                {stats?.total_factures ?? 0}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des factures */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Toutes les factures</CardTitle>
              <CardDescription>Consultez le détail et téléchargez vos factures</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {factures.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Aucune facture trouvée</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Facture</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Échéance</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Montant TTC</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Payé</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Restant</th>
                    <th className="text-center py-3 px-4 font-medium text-muted-foreground">Statut</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {factures.map((facture) => {
                    const statusConfig  = getStatusConfig(facture.statut)
                    const montantTtc    = parseFloat(facture.montant_ttc)
                    const montantRegle  = parseFloat(String(facture.montant_regle)) || 0
                    const montantRestant = parseFloat(String(facture.montant_restant)) || 0

                    return (
                      <tr
                        key={facture.id}
                        className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <p className="font-medium text-foreground">{facture.numero_facture}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(facture.date_emission).toLocaleDateString("fr-FR")}
                          </p>
                        </td>

                        <td className="py-3 px-4 hidden md:table-cell">
                          <p className="text-sm text-foreground capitalize">
                            {getFactureDescription(facture)}
                          </p>
                          {facture.bien && (
                            <p className="text-xs text-muted-foreground">{facture.bien.title}</p>
                          )}
                        </td>

                        <td className="py-3 px-4 hidden lg:table-cell">
                          <p className="text-sm text-foreground">
                            {facture.date_echeance
                              ? new Date(facture.date_echeance).toLocaleDateString("fr-FR")
                              : "—"}
                          </p>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <p className="font-semibold text-foreground">
                            {formatCurrency(montantTtc, facture.devise)}
                          </p>
                        </td>

                        <td className="py-3 px-4 text-right hidden sm:table-cell">
                          <p className="text-sm text-emerald-600 font-medium">
                            {formatCurrency(montantRegle, facture.devise)}
                          </p>
                        </td>

                        <td className="py-3 px-4 text-right hidden sm:table-cell">
                          <p className="text-sm text-amber-600 font-medium">
                            {formatCurrency(montantRestant, facture.devise)}
                          </p>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <Badge variant={statusConfig.variant as any}>
                            {statusConfig.label}
                          </Badge>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <Link href={`/portal/invoices/${facture.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}