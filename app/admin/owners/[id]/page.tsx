"use client"

import { use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  Home,
  FileText,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/admin/status-badge"
import { StatsCard } from "@/components/admin/stats-card"
import { useAdminOwnerDetail } from "@/hooks/useAdminOwnerDetail"

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

export default function AdminOwnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data, loading, error } = useAdminOwnerDetail(id)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement du propriétaire...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error ?? "Propriétaire introuvable"}</p>
      </div>
    )
  }

  const { info, stats, contracts } = data

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/owners">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            {info.firstName} {info.lastName}
          </h1>
          <p className="text-muted-foreground text-sm">Détails du propriétaire</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Biens"
          value={stats.nombreBiens}
          icon={<Home className="h-4 w-4" />}
        />
        <StatsCard
          title="Contrats"
          value={stats.nombreContrats}
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title="Valeur portefeuille"
          value={formatCurrency(stats.valeurPortefeuille)}
          icon={<Wallet className="h-4 w-4" />}
        />
        <StatsCard
          title="Agences liées"
          value={stats.nombreAgences}
          icon={<Building2 className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informations de contact */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium">{info.email}</p>
                <p className="text-xs text-muted-foreground">Email</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
              <div>
                <p className="text-sm font-medium">{info.phone}</p>
                <p className="text-xs text-muted-foreground">Téléphone</p>
              </div>
            </div>
            {(info.address || info.city) && (
              <>
                <Separator />
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    {info.address && (
                      <p className="text-sm font-medium">{info.address}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {[info.city, info.state, info.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Contrats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Contrats</CardTitle>
            <CardDescription>Tous les contrats de ce propriétaire</CardDescription>
          </CardHeader>
          <CardContent>
            {contracts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucun contrat trouvé pour ce propriétaire.
              </p>
            ) : (
              <div className="space-y-3">
                {contracts.map((contract, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-4 p-4 rounded-lg border"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm font-mono">{contract.reference}</p>
                      <p className="text-sm text-muted-foreground">{contract.titreBien}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Client : {contract.nomClient} · Agence : {contract.agence}
                      </p>
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <p className="font-medium text-sm">
                        {formatCurrency(parseFloat(contract.montant))}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {TYPE_LABELS[contract.type] ?? contract.type}
                      </Badge>
                      <div>
                        <StatusBadge status={contract.statut} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}