"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  BadgeCheck,
  BadgeX,
  CircleCheck,
  CircleX,
  ShieldCheck,
  ShieldOff,
  ChevronLeft,
  ChevronRight,
  Building2,
  Users,
  Home,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/admin/status-badge"
import { ConfirmModal } from "@/components/admin/confirm-modal"
import { useAdminAgencies } from "@/hooks/admin/useAdminAgencies"
import type { Agency } from "@/lib/admin-types"
import axios from "axios"
import { toast } from "sonner"
import {
  approveAgency,
  certifyAgency,
  reactivateAgency,
  rejectAgency,
  suspendAgency,
  uncertifyAgency,
} from "@/services/adminAgencyApprovalService"
import { RejectAgencyModal } from "@/components/admin/reject-agency-modal"

type ActionType =
  | "approve"
  | "reject"
  | "suspend"
  | "reactivate"
  | "certify"
  | "uncertify"

type OperationalAction = Exclude<ActionType, "approve" | "reject">

interface PendingAction {
  agencyId: string
  agencyName: string
  type: ActionType
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ??
      "Une erreur est survenue pendant l’opération."
    )
  }

  return "Une erreur est survenue pendant l’opération."
}

const OPERATIONAL_ACTION_CONFIG: Record<
  OperationalAction,
  {
    title: string
    message: string
    confirmLabel: string
    variant: "default" | "destructive"
  }
> = {
  suspend: {
    title: "Suspendre le compte ?",
    message: "L’agence ne pourra plus accéder à son dashboard et recevra un email de suspension.",
    confirmLabel: "Suspendre",
    variant: "destructive",
  },
  reactivate: {
    title: "Réactiver le compte ?",
    message: "L’agence pourra de nouveau accéder à son dashboard et recevra un email de réactivation.",
    confirmLabel: "Réactiver",
    variant: "default",
  },
  certify: {
    title: "Certifier l’agence ?",
    message: "Le badge de certification sera affiché pour cette agence.",
    confirmLabel: "Certifier",
    variant: "default",
  },
  uncertify: {
    title: "Retirer la certification ?",
    message: "Le badge de certification sera retiré de cette agence.",
    confirmLabel: "Retirer",
    variant: "destructive",
  },
}

export default function AdminAgenciesPage() {
  const { agencies, setAgencies, loading, error } = useAdminAgencies()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [certifiedFilter, setCertifiedFilter] = useState<string>("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const filteredAgencies = agencies.filter((agency) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      agency.name.toLowerCase().includes(q) ||
      agency.city.toLowerCase().includes(q) ||
      agency.email.toLowerCase().includes(q)
    const matchesStatus = statusFilter === "all" || agency.approvalStatus === statusFilter
    const matchesCertified =
      certifiedFilter === "all" ||
      (certifiedFilter === "certified" && agency.isCertified) ||
      (certifiedFilter === "not_certified" && !agency.isCertified)
    return matchesSearch && matchesStatus && matchesCertified
  })

  const totalPages = Math.ceil(filteredAgencies.length / perPage)
  const paginatedAgencies = filteredAgencies.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  )

  function openAction(agency: Agency, type: ActionType) {
    setPendingAction({ agencyId: agency.id, agencyName: agency.name, type })
  }

  async function handleApprove() {
    if (!pendingAction || pendingAction.type !== "approve") return

    setActionLoading(true)

    try {
      await approveAgency(pendingAction.agencyId)

      setAgencies((agencies) =>
        agencies.map((agency) =>
          agency.id === pendingAction.agencyId
            ? {
                ...agency,
                approvalStatus: "approved",
                rejectionReason: null,
              }
            : agency
        )
      )

      toast.success(`L’agence ${pendingAction.agencyName} a été validée.`)
      setPendingAction(null)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error))
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReject(reason: string) {
    if (!pendingAction || pendingAction.type !== "reject") return

    setActionLoading(true)

    try {
      await rejectAgency(pendingAction.agencyId, reason)

      setAgencies((agencies) =>
        agencies.map((agency) =>
          agency.id === pendingAction.agencyId
            ? {
                ...agency,
                approvalStatus: "rejected",
                rejectionReason: reason,
              }
            : agency
        )
      )

      toast.success(`La demande de l’agence ${pendingAction.agencyName} a été refusée.`)
      setPendingAction(null)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error))
    } finally {
      setActionLoading(false)
    }
  }

  async function handleOperationalAction() {
    if (
      !pendingAction ||
      pendingAction.type === "approve" ||
      pendingAction.type === "reject"
    ) {
      return
    }

    setActionLoading(true)

    try {
      switch (pendingAction.type) {
        case "suspend":
          await suspendAgency(pendingAction.agencyId)
          setAgencies((agencies) =>
            agencies.map((agency) =>
              agency.id === pendingAction.agencyId
                ? { ...agency, status: "suspended" }
                : agency
            )
          )
          toast.success(`Le compte de l’agence ${pendingAction.agencyName} a été suspendu.`)
          break

        case "reactivate":
          await reactivateAgency(pendingAction.agencyId)
          setAgencies((agencies) =>
            agencies.map((agency) =>
              agency.id === pendingAction.agencyId
                ? { ...agency, status: "active" }
                : agency
            )
          )
          toast.success(`Le compte de l’agence ${pendingAction.agencyName} a été réactivé.`)
          break

        case "certify":
          await certifyAgency(pendingAction.agencyId)
          setAgencies((agencies) =>
            agencies.map((agency) =>
              agency.id === pendingAction.agencyId
                ? { ...agency, isCertified: true }
                : agency
            )
          )
          toast.success(`L’agence ${pendingAction.agencyName} a été certifiée.`)
          break

        case "uncertify":
          await uncertifyAgency(pendingAction.agencyId)
          setAgencies((agencies) =>
            agencies.map((agency) =>
              agency.id === pendingAction.agencyId
                ? { ...agency, isCertified: false }
                : agency
            )
          )
          toast.success(`La certification de l’agence ${pendingAction.agencyName} a été retirée.`)
          break
      }

      setPendingAction(null)
    } catch (error: unknown) {
      toast.error(getErrorMessage(error))
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement des agences...</p>
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

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">Agences</h1>
        <p className="text-muted-foreground">Gérer toutes les agences inscrites sur la plateforme</p>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Recherche et filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, ville ou email…"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Validée</SelectItem>
                <SelectItem value="rejected">Refusée</SelectItem>
              </SelectContent>
            </Select>
            <Select value={certifiedFilter} onValueChange={(v) => { setCertifiedFilter(v); setCurrentPage(1) }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <BadgeCheck className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Certification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes</SelectItem>
                <SelectItem value="certified">Certifiées</SelectItem>
                <SelectItem value="not_certified">Non certifiées</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Liste des agences</CardTitle>
              <CardDescription>
                {filteredAgencies.length} agence{filteredAgencies.length !== 1 ? "s" : ""} trouvée{filteredAgencies.length !== 1 ? "s" : ""}
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
                  <TableHead className="hidden md:table-cell">Ville</TableHead>
                  <TableHead className="hidden lg:table-cell text-center">
                    <span className="flex items-center justify-center gap-1">
                      <Home className="h-3.5 w-3.5" /> Biens
                    </span>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell text-center">
                    <span className="flex items-center justify-center gap-1">
                      <Users className="h-3.5 w-3.5" /> Propriétaires
                    </span>
                  </TableHead>
                  <TableHead className="hidden xl:table-cell text-center">
                    <span className="flex items-center justify-center gap-1">
                      <Users className="h-3.5 w-3.5" /> Agents
                    </span>
                  </TableHead>
                  <TableHead>Validation</TableHead>
                  <TableHead>Compte</TableHead>
                  <TableHead className="hidden sm:table-cell">Certification</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedAgencies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      Aucune agence trouvée.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAgencies.map((agency) => (
                    <TableRow key={agency.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={agency.logo} alt={agency.name} />
                            <AvatarFallback>
                              <Building2 className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-medium text-sm">{agency.name}</p>
                              {agency.isCertified && (
                                <BadgeCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{agency.email}</p>
                            <p className="text-xs text-muted-foreground md:hidden">{agency.city}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{agency.city}</TableCell>
                      <TableCell className="hidden lg:table-cell text-center text-sm">
                        {agency.propertiesCount}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-center text-sm">
                        {agency.ownersCount}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-center text-sm">
                        {agency.agentsCount}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={agency.approvalStatus} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={agency.status} />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {agency.isCertified ? (
                          <StatusBadge status="certified" />
                        ) : (
                          <StatusBadge status="not_certified" />
                        )}
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
                              <Link href={`/admin/agencies/${agency.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                Voir le détail
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {agency.approvalStatus === "pending" && (
                              <>
                                <DropdownMenuItem onClick={() => openAction(agency, "approve")}>
                                  <CircleCheck className="h-4 w-4 mr-2" />
                                  Valider la demande
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => openAction(agency, "reject")}
                                >
                                  <CircleX className="h-4 w-4 mr-2" />
                                  Refuser la demande
                                </DropdownMenuItem>
                              </>
                            )}
                            {agency.approvalStatus === "rejected" && (
                              <DropdownMenuItem onClick={() => openAction(agency, "approve")}>
                                <CircleCheck className="h-4 w-4 mr-2" />
                                Valider finalement l&apos;agence
                              </DropdownMenuItem>
                            )}
                            {agency.approvalStatus === "approved" && (
                              <>
                                {agency.status === "suspended" || agency.status === "inactive" ? (
                                  <DropdownMenuItem onClick={() => openAction(agency, "reactivate")}>
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Réactiver le compte
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => openAction(agency, "suspend")}
                                  >
                                    <ShieldOff className="h-4 w-4 mr-2" />
                                    Suspendre le compte
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                {agency.isCertified ? (
                                  <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => openAction(agency, "uncertify")}
                                  >
                                    <BadgeX className="h-4 w-4 mr-2" />
                                    Retirer la certification
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem onClick={() => openAction(agency, "certify")}>
                                    <BadgeCheck className="h-4 w-4 mr-2" />
                                    Certifier l&apos;agence
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Lignes par page :</span>
              <Select value={String(perPage)} onValueChange={(v) => { setPerPage(Number(v)); setCurrentPage(1) }}>
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

      {pendingAction?.type === "approve" && (
        <ConfirmModal
          open
          title="Valider cette agence ?"
          message={`L’agence ${pendingAction.agencyName} pourra accéder à son dashboard. Un email de validation lui sera envoyé.`}
          confirmLabel="Valider l’agence"
          variant="default"
          loading={actionLoading}
          onConfirm={handleApprove}
          onCancel={() => setPendingAction(null)}
        />
      )}

      {pendingAction?.type === "reject" && (
        <RejectAgencyModal
          key={pendingAction.agencyId}
          open
          agencyName={pendingAction.agencyName}
          loading={actionLoading}
          onCancel={() => setPendingAction(null)}
          onConfirm={handleReject}
        />
      )}

      {pendingAction &&
        pendingAction.type !== "approve" &&
        pendingAction.type !== "reject" && (
          <ConfirmModal
            open
            title={OPERATIONAL_ACTION_CONFIG[pendingAction.type].title}
            message={`${OPERATIONAL_ACTION_CONFIG[pendingAction.type].message} Agence concernée : ${pendingAction.agencyName}.`}
            confirmLabel={OPERATIONAL_ACTION_CONFIG[pendingAction.type].confirmLabel}
            variant={OPERATIONAL_ACTION_CONFIG[pendingAction.type].variant}
            loading={actionLoading}
            onConfirm={handleOperationalAction}
            onCancel={() => setPendingAction(null)}
          />
        )}
    </div>
  )
}
