"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/admin/status-badge"
import { StatsCard } from "@/components/admin/stats-card"
import { mockSubscriptions, mockAgencies } from "@/lib/admin-mock-data"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const planColors: Record<string, string> = {
  starter: "bg-slate-100 text-slate-700 border-slate-200",
  professional: "bg-blue-50 text-blue-700 border-blue-200",
  enterprise: "bg-amber-50 text-amber-700 border-amber-200",
}

export default function AdminSubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [planFilter, setPlanFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filteredSubscriptions = mockSubscriptions.filter((sub) => {
    const matchesSearch = sub.agencyName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || sub.status === statusFilter
    const matchesPlan = planFilter === "all" || sub.plan === planFilter
    return matchesSearch && matchesStatus && matchesPlan
  })

  const totalPages = Math.ceil(filteredSubscriptions.length / perPage)
  const paginatedSubscriptions = filteredSubscriptions.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  const activeCount = mockSubscriptions.filter((s) => s.status === "active").length
  const expiredCount = mockSubscriptions.filter((s) => s.status === "expired").length
  const totalMRR = mockSubscriptions
    .filter((s) => s.status === "active" && s.billingCycle === "monthly")
    .reduce((sum, s) => sum + s.price, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Abonnements</h1>
        <p className="text-muted-foreground">Gestion des abonnements des agences</p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Abonnements actifs"
          value={activeCount}
          trend="up"
          trendValue={`${activeCount} agences`}
          icon={<Crown className="h-4 w-4" />}
        />
        <StatsCard
          title="Expirés"
          value={expiredCount}
          icon={<Crown className="h-4 w-4" />}
        />
        <StatsCard
          title="MRR (mensuel)"
          value={formatCurrency(totalMRR)}
          trend="up"
          trendValue="+22%"
          description="vs mois précédent"
          icon={<Crown className="h-4 w-4" />}
        />
        <StatsCard
          title="Plans Enterprise"
          value={mockSubscriptions.filter((s) => s.plan === "enterprise").length}
          icon={<Crown className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par agence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Crown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Forfait" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les forfaits</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
                <SelectItem value="cancelled">Annulé</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tous les abonnements</CardTitle>
              <CardDescription>
                {filteredSubscriptions.length} abonnement{filteredSubscriptions.length !== 1 ? "s" : ""} trouvé{filteredSubscriptions.length !== 1 ? "s" : ""}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agence</TableHead>
                  <TableHead>Forfait</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Prix</TableHead>
                  <TableHead className="hidden lg:table-cell">Période</TableHead>
                  <TableHead className="hidden xl:table-cell">Expiration</TableHead>
                  <TableHead className="hidden xl:table-cell">Utilisation</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSubscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      Aucun abonnement trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedSubscriptions.map((sub) => {
                    const agency = mockAgencies.find((a) => a.id === sub.agencyId)
                    const usagePercent =
                      sub.limits.properties > 0
                        ? (sub.usage.properties / sub.limits.properties) * 100
                        : 0

                    return (
                      <TableRow key={sub.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={agency?.logo} alt={sub.agencyName} />
                              <AvatarFallback>
                                {sub.agencyName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <p className="font-medium">{sub.agencyName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={planColors[sub.plan] || ""}
                          >
                            {sub.planName}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-right">
                          <div>
                            <p className="font-medium">{formatCurrency(sub.price)}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              /{sub.billingCycle === "monthly" ? "mois" : "an"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <p className="text-sm">{format(new Date(sub.startDate), "dd/MM/yy")}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {sub.billingCycle === "monthly" ? "Mensuel" : "Annuel"}
                          </p>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          <p className="text-sm">{format(new Date(sub.expiryDate), "dd/MM/yyyy")}</p>
                        </TableCell>
                        <TableCell className="hidden xl:table-cell">
                          {sub.limits.properties > 0 ? (
                            <div className="w-24">
                              <Progress value={usagePercent} className="h-1.5" />
                              <p className="text-xs text-muted-foreground mt-1">
                                {sub.usage.properties}/{sub.limits.properties} biens
                              </p>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Illimité</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={sub.status} />
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/subscriptions/${sub.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Voir le détail
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Lignes par page :</span>
              <Select value={String(perPage)} onValueChange={(v) => setPerPage(Number(v))}>
                <SelectTrigger className="w-[70px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Page {currentPage} sur {totalPages || 1}
              </span>
              <div className="flex gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
