"use client"

import { useState, use } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  BadgeCheck,
  BadgeX,
  Home,
  Users,
  FileText,
  Banknote,
  ExternalLink,
  ShieldCheck,
  ShieldOff,
  CreditCard,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { StatusBadge } from "@/components/admin/status-badge"
import { StatsCard } from "@/components/admin/stats-card"
import { ConfirmModal } from "@/components/admin/confirm-modal"
import { EmptyState } from "@/components/admin/empty-state"
import { useAdminAgencyDetail } from "@/hooks/useAdminAgencyDetail"
import axiosInstance from "@/lib/axios"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const METHOD_LABELS: Record<string, string> = {
  virement: "Virement",
  wave: "Mobile Money",
  carte: "Carte bancaire",
  especes: "Espèces",
  cheque: "Chèque",
  mobile_money: "Mobile Money",
}

const ROLE_LABELS: Record<string, string> = {
  admin_agence: "Administrateur",
  agent: "Agent",
  director: "Directeur",
  manager: "Responsable",
}

const STATUT_REGLEMENT: Record<string, string> = {
  confirme: "completed",
  en_attente: "pending",
  echoue: "failed",
  rembourse: "refunded",
}

type ActionType = "activate" | "suspend" | "certify" | "uncertify"

const ACTION_CONFIG: Record<ActionType, {
  title: string
  message: (name: string) => string
  confirmLabel: string
  variant: "default" | "destructive"
}> = {
  activate: {
    title: "Activer le compte",
    message: (name) => `Voulez-vous activer le compte de "${name}" ? L'agence pourra de nouveau accéder à la plateforme.`,
    confirmLabel: "Activer",
    variant: "default",
  },
  suspend: {
    title: "Suspendre le compte",
    message: (name) => `Voulez-vous suspendre le compte de "${name}" ? L'agence ne pourra plus accéder à la plateforme.`,
    confirmLabel: "Suspendre",
    variant: "destructive",
  },
  certify: {
    title: "Certifier l'agence",
    message: (name) => `Voulez-vous certifier l'agence "${name}" ? Le badge de certification sera affiché sur son profil.`,
    confirmLabel: "Certifier",
    variant: "default",
  },
  uncertify: {
    title: "Retirer la certification",
    message: (name) => `Voulez-vous retirer la certification de "${name}" ? Le badge sera supprimé de son profil.`,
    confirmLabel: "Retirer",
    variant: "destructive",
  },
}

export default function AdminAgencyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data, loading, error } = useAdminAgencyDetail(id)

  const [isActive, setIsActive] = useState<boolean | null>(null)
  const [isCertified, setIsCertified] = useState<boolean | null>(null)
  const [pendingAction, setPendingAction] = useState<ActionType | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [contractStatusFilter, setContractStatusFilter] = useState("all")

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement de l&apos;agence...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error ?? "Agence introuvable"}</p>
      </div>
    )
  }

  const { informations, stats, proprietaires, agents, clients, contracts, reglements } = data

  const activeStatus = isActive ?? informations.isActive
  const certifiedStatus = isCertified ?? informations.informationCertified

  const filteredContracts =
    contractStatusFilter === "all"
      ? contracts
      : contracts.filter((c) => c.statut === contractStatusFilter)

  const totalPayments = reglements
    .filter((r) => r.statut === "confirme")
    .reduce((sum, r) => sum + r.montant, 0)

  async function handleConfirm() {
    if (!pendingAction) return
    setActionLoading(true)
    try {
      switch (pendingAction) {
        case "activate":
          await axiosInstance.patch(`/api/admin/agencies/${id}/status`, { isActive: true })
          setIsActive(true)
          break
        case "suspend":
          await axiosInstance.patch(`/api/admin/agencies/${id}/status`, { isActive: false })
          setIsActive(false)
          break
        case "certify":
          await axiosInstance.patch(`/api/admin/agencies/${id}/certify`, { certified: true })
          setIsCertified(true)
          break
        case "uncertify":
          await axiosInstance.patch(`/api/admin/agencies/${id}/certify`, { certified: false })
          setIsCertified(false)
          break
      }
    } catch {
      // pas d'update optimiste en cas d'erreur
    } finally {
      setActionLoading(false)
      setPendingAction(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild className="mt-1 shrink-0">
          <Link href="/admin/agencies">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <Avatar className="h-12 w-12 shrink-0">
            {informations.logo && (
              <AvatarImage src={informations.logo} alt={informations.name} />
            )}
            <AvatarFallback>{informations.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{informations.name}</h1>
              {certifiedStatus && (
                <BadgeCheck className="h-5 w-5 text-blue-600 shrink-0" />
              )}
            </div>
            <p className="text-muted-foreground text-sm">{informations.city}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <StatusBadge status={activeStatus ? "active" : "inactive"} />
          {!activeStatus ? (
            <Button size="sm" onClick={() => setPendingAction("activate")}>
              <ShieldCheck className="h-4 w-4 mr-2" />
              Activer
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setPendingAction("suspend")}>
              <ShieldOff className="h-4 w-4 mr-2" />
              Suspendre
            </Button>
          )}
          {certifiedStatus ? (
            <Button variant="outline" size="sm" onClick={() => setPendingAction("uncertify")}>
              <BadgeX className="h-4 w-4 mr-2" />
              Retirer certification
            </Button>
          ) : (
            <Button size="sm" onClick={() => setPendingAction("certify")}>
              <BadgeCheck className="h-4 w-4 mr-2" />
              Certifier
            </Button>
          )}
        </div>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="informations">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          <TabsTrigger value="proprietaires">
            Propriétaires
            <Badge variant="secondary" className="ml-1.5 text-xs">{proprietaires.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="agents">
            Agents
            <Badge variant="secondary" className="ml-1.5 text-xs">{agents.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="clients">
            Clients
            <Badge variant="secondary" className="ml-1.5 text-xs">{clients.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="contrats">
            Contrats
            <Badge variant="secondary" className="ml-1.5 text-xs">{contracts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="reglements">
            Règlements
            <Badge variant="secondary" className="ml-1.5 text-xs">{reglements.length}</Badge>
          </TabsTrigger>
        </TabsList>

        {/* Onglet 1 — Informations */}
        <TabsContent value="informations" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de l&apos;agence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{informations.email}</p>
                    <p className="text-xs text-muted-foreground">Email</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{informations.phone}</p>
                    <p className="text-xs text-muted-foreground">Téléphone</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{informations.address}</p>
                    <p className="text-xs text-muted-foreground">{informations.city}</p>
                  </div>
                </div>
                {informations.webSite && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <a
                        href={informations.webSite}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                      >
                        {informations.webSite}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <p className="text-xs text-muted-foreground">Site web</p>
                    </div>
                  </div>
                )}
                {informations.licenceNumber && (
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{informations.licenceNumber}</p>
                      <p className="text-xs text-muted-foreground">Numéro de licence</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <BadgeCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium capitalize">{informations.abonnement}</p>
                    <p className="text-xs text-muted-foreground">Abonnement</p>
                  </div>
                </div>
              </div>
              {informations.description && (
                <>
                  <Separator />
                  <p className="text-sm text-muted-foreground">{informations.description}</p>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 2 — Statistiques */}
        <TabsContent value="statistiques" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <StatsCard
              title="Biens"
              value={stats.nombreBiens}
              icon={<Home className="h-4 w-4" />}
            />
            <StatsCard
              title="Propriétaires"
              value={stats.nombreProprietaires}
              icon={<Users className="h-4 w-4" />}
            />
            <StatsCard
              title="Agents"
              value={stats.nombreAgents}
              icon={<Users className="h-4 w-4" />}
            />
            <StatsCard
              title="Contrats signés"
              value={stats.contratsSignes}
              icon={<FileText className="h-4 w-4" />}
            />
            <StatsCard
              title="Total encaissé"
              value={formatCurrency(stats.totalEncaisse)}
              icon={<Banknote className="h-4 w-4" />}
            />
          </div>
        </TabsContent>

        {/* Onglet 3 — Propriétaires */}
        <TabsContent value="proprietaires" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Propriétaires affiliés</CardTitle>
            </CardHeader>
            <CardContent>
              {proprietaires.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="Aucun propriétaire"
                  message="Aucun propriétaire n'est affilié à cette agence."
                />
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead className="hidden sm:table-cell">Téléphone</TableHead>
                        <TableHead className="text-center">Biens</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {proprietaires.map((owner, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <p className="font-medium text-sm">{owner.nomComplet}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">{owner.phone}</p>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{owner.email}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{owner.phone}</TableCell>
                          <TableCell className="text-center text-sm">{owner.nombreBiens}</TableCell>
                          <TableCell>
                            <StatusBadge status={owner.statut === "actif" ? "active" : "inactive"} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 4 — Agents */}
        <TabsContent value="agents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Agents de l&apos;agence</CardTitle>
            </CardHeader>
            <CardContent>
              {agents.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="Aucun agent"
                  message="Aucun agent n'est enregistré dans cette agence."
                />
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead>Rôle</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {agents.map((agent, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <p className="font-medium text-sm">{agent.nom}</p>
                            <p className="text-xs text-muted-foreground sm:hidden">{agent.email}</p>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{agent.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {ROLE_LABELS[agent.role] ?? agent.role}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 5 — Clients */}
        <TabsContent value="clients" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Clients affiliés</CardTitle>
            </CardHeader>
            <CardContent>
              {clients.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="Aucun client"
                  message="Aucun client n'est affilié à cette agence."
                />
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">Téléphone</TableHead>
                        <TableHead className="text-center">Contrats</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clients.map((client, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-sm">{client.nom}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{client.email}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm">{client.phone}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary">{client.nombreContrats}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 6 — Contrats */}
        <TabsContent value="contrats" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <CardTitle>Contrats signés</CardTitle>
                <Select value={contractStatusFilter} onValueChange={setContractStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="signed">Signé</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="cancelled">Annulé</SelectItem>
                    <SelectItem value="expired">Expiré</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {filteredContracts.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Aucun contrat"
                  message="Aucun contrat ne correspond aux critères sélectionnés."
                />
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Référence</TableHead>
                        <TableHead className="hidden sm:table-cell">Client</TableHead>
                        <TableHead className="hidden lg:table-cell">Bien</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="hidden md:table-cell">Date signature</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContracts.map((contract, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-sm font-mono">{contract.reference}</TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{contract.nomClient}</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">{contract.titreBien}</TableCell>
                          <TableCell className="text-right text-sm">
                            {formatCurrency(parseFloat(contract.montant))}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={contract.statut} />
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                            {contract.dateSigned
                              ? format(new Date(contract.dateSigned), "d MMM yyyy", { locale: fr })
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 7 — Règlements */}
        <TabsContent value="reglements" className="mt-6">
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Banknote className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total encaissé</p>
                    <p className="text-2xl font-bold">{formatCurrency(totalPayments)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historique des règlements</CardTitle>
              </CardHeader>
              <CardContent>
                {reglements.length === 0 ? (
                  <EmptyState
                    icon={CreditCard}
                    title="Aucun règlement"
                    message="Aucun règlement enregistré pour cette agence."
                  />
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Référence</TableHead>
                          <TableHead className="text-right">Montant</TableHead>
                          <TableHead className="hidden sm:table-cell">Mode</TableHead>
                          <TableHead className="hidden md:table-cell">Facture liée</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="hidden lg:table-cell">Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reglements.map((reglement, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium text-sm font-mono">
                              {reglement.reference ??
                                `REG-${(reglement.date ?? "").slice(0, 4)}-${String(i + 1).padStart(2, "0")}`}
                            </TableCell>
                            <TableCell className="text-right text-sm">
                              {formatCurrency(reglement.montant)}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm">
                              {METHOD_LABELS[reglement.modePaiement] ?? reglement.modePaiement}
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                              {reglement.referenceFacture}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={STATUT_REGLEMENT[reglement.statut] ?? "completed"} />
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                              {reglement.date
                                ? format(new Date(reglement.date), "d MMM yyyy", { locale: fr })
                                : "—"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modale de confirmation */}
      {pendingAction && (
        <ConfirmModal
          open={!!pendingAction}
          title={ACTION_CONFIG[pendingAction].title}
          message={ACTION_CONFIG[pendingAction].message(informations.name)}
          confirmLabel={ACTION_CONFIG[pendingAction].confirmLabel}
          variant={ACTION_CONFIG[pendingAction].variant}
          loading={actionLoading}
          onConfirm={handleConfirm}
          onCancel={() => setPendingAction(null)}
        />
      )}
    </div>
  )
}