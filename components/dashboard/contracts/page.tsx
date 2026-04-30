"use client"

// components/dashboard/contracts/page.tsx

import { useState } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  FileText,
  Download,
  MoreHorizontal,
  Eye,
  Pencil,
  Send,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import type { Contract, ContractsStats, ContractStatus } from "@/types/contracts"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatAmount = (value: string) =>
  Number(value).toLocaleString("fr-FR") + " €"

const getProgress = (status: ContractStatus): number => {
  const map: Record<ContractStatus, number> = {
    draft: 25,
    revision: 50,
    sent: 90,
    approved: 75,
    signed: 100,
    expired: 0,
    cancelled: 0,
  }
  return map[status] ?? 0
}

const getDisplayAmount = (contract: Contract) => {
  const amount = Number(contract.amount).toLocaleString("fr-FR") + " €"
  return contract.type === "rental" ? `${amount}/mois` : amount
}

// ─── Sous-composant : Stats ───────────────────────────────────────────────────

function ContractStats({ stats }: { stats: ContractsStats }) {
  const items = [
    {
      label: "Contrats Totaux",
      value: stats.total.toString(),
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "En Attente de Signature",
      value: stats.pending.toString(),
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      label: "Signés",
      value: stats.signed.toString(),
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Valeur Totale",
      value: formatAmount(stats.value),
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ─── Sous-composant : Filtres ─────────────────────────────────────────────────

interface ContractFiltersProps {
  search: string
  onSearchChange: (v: string) => void
  statusFilter: string
  onStatusChange: (v: string) => void
  typeFilter: string
  onTypeChange: (v: string) => void
}

interface ActionState {
  loading: boolean
  error: string | null
}

function ContractFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
}: ContractFiltersProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher un contrat, client, bien..."
              className="pl-9"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={onStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les Statuts</SelectItem>
                <SelectItem value="draft">Brouillon</SelectItem>
                <SelectItem value="revision">En Révision</SelectItem>
                <SelectItem value="sent">En Attente de Signature</SelectItem>
                <SelectItem value="signed">Signé</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={onTypeChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les Types</SelectItem>
                <SelectItem value="sale">Vente</SelectItem>
                <SelectItem value="rental">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



// ─── Sous-composant : Tableau ─────────────────────────────────────────────────

function ContractTable({ contracts }: { contracts: Contract[] }) {
  const [loading, setLoading] = useState<Record<number, ActionState>>({})

  const getStatusBadge = (status: ContractStatus) => {
    const config: Record<ContractStatus, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
      signed: { variant: "default", label: "Signé" },
      sent: { variant: "secondary", label: "En Attente de Signature" },
      draft: { variant: "outline", label: "Brouillon" },
      revision: { variant: "secondary", label: "En Révision" },
      approved: { variant: "default", label: "Approuvé" },
      expired: { variant: "destructive", label: "Expiré" },
      cancelled: { variant: "destructive", label: "Annulé" },
    }
    const { variant, label } = config[status] ?? { variant: "outline", label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  if (contracts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <p className="text-muted-foreground font-medium">Aucun contrat trouvé</p>
          <p className="text-sm text-muted-foreground mt-1">
            Modifiez vos filtres ou créez un nouveau contrat.
          </p>
        </CardContent>
      </Card>
    )
  }

  const handleSendContract = async (id: number) => {
    console.log("Envoyer le contrat ID", id)
    setLoading((prev) => ({ ...prev, [id]: { loading: true, error: null } }))
    try {
      await axiosInstance.patch(`/api/contracts/send/${id}`, {

      })
      setLoading((prev) => ({ ...prev, [id]: { loading: false, error: null } }))
      toast.success("Contrat envoyé pour signature !")
    } catch (err: any) {
      const message = err?.response?.data?.message ?? "Erreur lors de l'envoi"
      setLoading((prev) => ({ ...prev, [id]: { loading: false, error: message } }))
      toast.error(message)
      console.error("Erreur lors de l'envoi du contrat ID", message)
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">N° Contrat</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Bien / Client</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Type</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Montant</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Ville</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden xl:table-cell">Progression</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((contract) => (
                <tr
                  key={contract.id}
                  className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                >
                  {/* N° Contrat */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{contract.contract_number}</p>
                        <p className="text-xs text-muted-foreground">
                          Créé le {new Date(contract.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Bien / Client */}
                  <td className="py-4 px-4">
                    <p className="font-medium text-foreground truncate max-w-[200px]">
                      {contract.bien.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {contract.client.prenom} {contract.client.nom}
                    </p>
                  </td>

                  {/* Type */}
                  <td className="py-4 px-4 hidden md:table-cell">
                    <Badge variant="outline">
                      {contract.type === "rental" ? "Location" : "Vente"}
                    </Badge>
                  </td>

                  {/* Montant */}
                  <td className="py-4 px-4 hidden lg:table-cell">
                    <p className="font-medium text-foreground">{getDisplayAmount(contract)}</p>
                  </td>

                  {/* Ville */}
                  <td className="py-4 px-4 hidden lg:table-cell">
                    <p className="text-sm text-muted-foreground capitalize">{contract.city}</p>
                  </td>

                  {/* Statut */}
                  <td className="py-4 px-4">{getStatusBadge(contract.status)}</td>

                  {/* Progression */}
                  <td className="py-4 px-4 hidden xl:table-cell">
                    <div className="w-[100px]">
                      <Progress value={getProgress(contract.status)} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {getProgress(contract.status)}% complété
                      </p>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/contracts/${contract.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir le Contrat
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/contracts/${contract.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Télécharger PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => handleSendContract(contract.id)} disabled={loading[contract.id]?.loading}>
                          <Send className="mr-2 h-4 w-4" />
                          Envoyer pour Signature
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Annuler le Contrat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Page principale (reçoit les données en props) ────────────────────────────

interface ListingContractsPageProps {
  contracts: Contract[]
  stats: ContractsStats
  loading?: boolean
}

export default function ListingContractsPage({
  contracts,
  stats,
  loading = false,
}: ListingContractsPageProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredContracts = contracts.filter((contract) => {
    const matchStatus = statusFilter === "all" || contract.status === statusFilter
    const matchType = typeFilter === "all" || contract.type === typeFilter
    const matchSearch =
      search === "" ||
      contract.contract_number.toLowerCase().includes(search.toLowerCase()) ||
      contract.bien.title.toLowerCase().includes(search.toLowerCase()) ||
      `${contract.client.prenom} ${contract.client.nom}`
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      contract.city.toLowerCase().includes(search.toLowerCase())

    return matchStatus && matchType && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gestion des Contrats</h1>
          <p className="text-muted-foreground">Créer et gérer les contrats immobiliers</p>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button> */}
          <Button asChild>
            <Link href="/dashboard/contracts/new">
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Contrat
            </Link>
          </Button>
        </div>
      </div>

      {/* 1. Stats */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-32" />
                    <Skeleton className="h-7 w-16" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <ContractStats stats={stats} />
      )}


      {/* 2. Filtres */}
      <ContractFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
      />

      {/* 3. Tableau */}
      {loading ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    {["N° Contrat", "Bien / Client", "Type", "Montant", "Ville", "Statut", "Progression", ""].map((h, i) => (
                      <th key={i} className="py-4 px-4 text-left">
                        <Skeleton className="h-3 w-20" />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...Array(6)].map((_, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      {/* N° Contrat */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                          <div className="space-y-1.5">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </td>
                      {/* Bien / Client */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-28" />
                        </div>
                      </td>
                      {/* Type */}
                      <td className="py-4 px-4 hidden md:table-cell">
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </td>
                      {/* Montant */}
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      {/* Ville */}
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <Skeleton className="h-4 w-20" />
                      </td>
                      {/* Statut */}
                      <td className="py-4 px-4">
                        <Skeleton className="h-5 w-24 rounded-full" />
                      </td>
                      {/* Progression */}
                      <td className="py-4 px-4 hidden xl:table-cell">
                        <div className="w-[100px] space-y-1">
                          <Skeleton className="h-2 w-full rounded-full" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ContractTable contracts={filteredContracts} />
      )}
    </div>
  )
}