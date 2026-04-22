"use client"

// cspell:ignore bien
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  PenTool,
  Calendar,
  MapPin,
  XCircle,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  Home,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import type { Contract, ContractsStats } from "@/types/contracts"

// ─── Mappers ────────────────────────────────────────────────────────────────

/** Convertit le statut serveur en statut UI */
function mapStatus(status: Contract["status"]): string {
  switch (status) {
    case "draft":
      return "pending_review"
    case "sent":
      return "pending_signature"
    case "signed":
      return "active"
    case "revision":
      return "pending_requested"
    case "approved":
      return "approved"
    case "expired":
      return "expired"
    case "cancelled":
      return "cancelled"
    default:
      return status
  }
}

/** Convertit le type serveur en libellé UI */
function mapType(type: Contract["type"]): string {
  return type === "rental" ? "Contrat de location" : "Contrat de vente"
}

/** Formate un montant en FCFA */
function formatAmount(value: string): string {
  const num = parseFloat(value)
  if (isNaN(num)) return "—"
  return new Intl.NumberFormat("fr-FR").format(num) + " FCFA"
}

// ─── Status badge ────────────────────────────────────────────────────────────

function getStatusBadge(status: Contract["status"]) {
  const uiStatus = mapStatus(status)
  switch (uiStatus) {
    case "pending_signature":
      return (
        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400">
          <PenTool className="mr-1 h-3 w-3" />
          En attente de signature
        </Badge>
      )
    case "pending_requested":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400">
          <Eye className="mr-1 h-3 w-3" />
          En attente de révision
        </Badge>
      )
    case "approved":
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400">
          <CheckCircle className="mr-1 h-3 w-3" />
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

// ─── Skeleton loader ─────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 4 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-28" /></TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-6 w-32 rounded-full" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 rounded" /></TableCell>
        </TableRow>
      ))}
    </>
  )
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface PortalContractsTableProps {
  contracts: Contract[]
  stats: ContractsStats
  loading?: boolean
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function PortalContractsTable({
  contracts,
  stats,
  loading = false,
}: PortalContractsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  const filteredContracts = contracts.filter((contract) => {
    const search = searchTerm.toLowerCase()
    const matchesSearch =
      contract.contract_number.toLowerCase().includes(search) ||
      contract.bien.title.toLowerCase().includes(search) ||
      contract.bien.address.toLowerCase().includes(search) ||
      contract.bien.city.toLowerCase().includes(search)

    const uiStatus = mapStatus(contract.status)
    const matchesStatus = statusFilter === "all" || uiStatus === statusFilter

    const uiType = mapType(contract.type)
    const matchesType = typeFilter === "all" || uiType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  // Contrats nécessitant une action (sent ou draft)
  const firstPendingId = contracts.find(
    (c) => c.status === "sent" || c.status === "draft"
  )?.contract_number

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mes contrats</h1>
        <p className="text-muted-foreground">
          Consultez et gérez vos contrats de location et de vente.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                <p className="text-xs text-muted-foreground">Action en attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.signed}</p>
                <p className="text-xs text-muted-foreground">Contrats signés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <AlertCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.revision}</p>
                <p className="text-xs text-muted-foreground">Révisions en attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total des contrats</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par numéro, bien ou adresse..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending_signature">En attente de signature</SelectItem>
                  <SelectItem value="pending_review">En attente de révision</SelectItem>
                  <SelectItem value="revision_requested">Révision demandée</SelectItem>
                  <SelectItem value="active">Signé</SelectItem>
                  <SelectItem value="expired">Expiré</SelectItem>
                  <SelectItem value="cancelled">Annulé</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="Contrat de location">Location</SelectItem>
                  <SelectItem value="Contrat de vente">Vente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contracts Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">
                  <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent">
                    Numéro
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Bien</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>
                  <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent">
                    Créé le
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">Montant mensuel</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableSkeleton />
              ) : filteredContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground">Aucun contrat trouvé</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredContracts.map((contract) => {
                  const isPending =
                    contract.status === "sent" || contract.status === "draft"
                  return (
                    <TableRow key={contract.id}>
                      <TableCell>
                        <Link
                          href={`/portal/contracts/${contract.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {contract.contract_number}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded">
                            {contract.bien.images?.[0]?.url ? (
                              <Image
                                src={`${process.env.NEXT_PUBLIC_API_URL}${contract.bien.images[0].url}`}
                                alt={contract.bien.images[0].alt ?? contract.bien.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <Home className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">
                              {contract.bien.title}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {contract.bien.neighborhood}, {contract.bien.city}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{mapType(contract.type)}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(contract.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {new Date(contract.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className="font-medium">{formatAmount(contract.amount)}</span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/portal/contracts/${contract.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Voir les détails
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Télécharger le PDF
                            </DropdownMenuItem>
                            {isPending && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                  <Link
                                    href={`/portal/contracts/${contract.id}?action=sign`}
                                  >
                                    <PenTool className="mr-2 h-4 w-4" />
                                    Signer le contrat
                                  </Link>
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Required Banner */}
      {!loading && stats.pending > 0 && firstPendingId && (
        <Card className="border-amber-500/50 bg-amber-500/5">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Action requise</h3>
                <p className="text-sm text-muted-foreground">
                  Vous avez {stats.pending} contrat{stats.pending > 1 ? "s" : ""} nécessitant
                  votre attention. Veuillez les consulter et intervenir pour continuer.
                </p>
              </div>
              <Button asChild>
                <Link href={`/portal/contracts/${firstPendingId}`}>Voir maintenant</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}