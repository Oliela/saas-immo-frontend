"use client"

import Link from "next/link"
import React, { useState, useEffect } from "react"
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Star,
  Users,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Types ────────────────────────────────────────────────────────────────────

interface AgentProfile {
  id: number
  user_id: number
  first_name: string
  last_name: string
  address: string | null
  phone: string
  commission_rate: number | null
  bio: string | null
  specialization: string | null
  license_number: string
  created_at: string
  updated_at: string
}

interface AgentRole {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
}

interface Agent {
  id: number
  nom: string
  prenom: string
  phone: string
  email: string
  email_verified_at: string | null
  account_type: string
  is_active: number
  created_at: string
  updated_at: string
  profile: AgentProfile
  roles: AgentRole[]
}

interface Stats {
  nombreAgents?: number
  agentsActifs?: number
  notesMoyennes?: number
  totalVentes?: number
}

interface ListingAgentsPageProps {
  agents?: Agent[]
  stats?: Stats
  loading?: boolean
  currentUserRole?: string
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListingAgentsPage({
  agents = [],
  stats = {},
  loading = false,
  currentUserRole = '',
}: ListingAgentsPageProps) {
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [agentsList, setAgentsList] = useState<Agent[]>(agents)
  const [deletingAgentId, setDeletingAgentId] = useState<number | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState<Agent | null>(null)

  // ← FIX : synchroniser agentsList quand agents change (chargement asynchrone)
  useEffect(() => {
    setAgentsList(agents)
  }, [agents])

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
    commission_rate: 0,
    bio: "",
    specialization: "",
    license_number: "",
    role: "agent",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await axiosInstance.post("/api/create/agent", formData)
      setIsDialogOpen(false)
      setFormData({
        nom: "",
        prenom: "",
        phone: "",
        email: "",
        password: "",
        password_confirmation: "",
        commission_rate: 0,
        bio: "",
        specialization: "",
        license_number: "",
        role: "agent",
      })
      toast.success("Agent créé avec succès. Un mail lui sera envoyé avec ses informations de connexion !")
      window.location.reload()
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const validationErrors = error.response?.data?.errors as
          | Record<string, string[]>
          | undefined

        const firstValidationMessage = validationErrors
          ? Object.values(validationErrors).flat()[0]
          : undefined

        const message =
          firstValidationMessage ||
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Impossible de créer l’agent."

        toast.error(message)
        return
      }

      toast.error("Une erreur inattendue est survenue.")
    } finally {
    setIsSubmitting(false)
  }
}

const handleInputChange = (field: string, value: string) => {
  const processedValue =
    field === "commission_rate" ? (value === "" ? 0 : parseFloat(value) || 0) : value
  setFormData(prev => ({ ...prev, [field]: processedValue }))
}

// ── Suppression ─────────────────────────────────────────────────────────────
const openDeleteDialog = (agent: Agent) => {
  setAgentToDelete(agent)
  setDeleteDialogOpen(true)
}

const handleDeleteAgent = async () => {
  if (!agentToDelete) return
  setDeletingAgentId(agentToDelete.id)
  try {
    await axiosInstance.delete(`/api/agent/delete/${agentToDelete.id}`)
    setAgentsList(prev => prev.filter(a => a.id !== agentToDelete.id))
    toast.success(
      `L'agent ${agentToDelete.profile?.first_name ?? agentToDelete.nom} a été supprimé.`
    )
    setDeleteDialogOpen(false)
    setAgentToDelete(null)
  } catch (error: any) {
    toast.error(error.response?.data?.error ?? "Erreur lors de la suppression.")
  } finally {
    setDeletingAgentId(null)
  }
}
// ────────────────────────────────────────────────────────────────────────────

const statsCards = [
  { label: "Agents Totaux", value: stats?.nombreAgents ?? 0, icon: Users },
  { label: "Actifs Maintenant", value: stats?.agentsActifs ?? 0, icon: ShieldCheck },
  { label: "Note Moyenne", value: stats?.notesMoyennes ?? 0, icon: Star },
  { label: "Total des Ventes", value: stats?.totalVentes ?? 0, icon: TrendingUp },
]

const filteredAgents = agentsList.filter((agent) => {
  const role = agent.roles?.[0]?.name ?? "agent"
  const isActive = agent.is_active === 1 ? "active" : "inactive"
  if (roleFilter !== "all" && role !== roleFilter) return false
  if (statusFilter !== "all" && isActive !== statusFilter) return false
  return true
})

const getRoleBadge = (role: string) => {
  const config: Record<
    string,
    { variant: "default" | "secondary" | "outline"; label: string; icon: React.ReactNode }
  > = {
    admin_agence: {
      variant: "default",
      label: "Admin Agence",
      icon: <ShieldCheck className="h-3 w-3 mr-1" />,
    },
    agent: {
      variant: "secondary",
      label: "Agent",
      icon: <Shield className="h-3 w-3 mr-1" />,
    },
    agent_junior: {
      variant: "outline",
      label: "Agent Junior",
      icon: <ShieldAlert className="h-3 w-3 mr-1" />,
    },
  }
  const { variant, label, icon } = config[role] ?? {
    variant: "outline",
    label: role,
    icon: null,
  }
  return (
    <Badge variant={variant} className="flex items-center w-fit">
      {icon}
      {label}
    </Badge>
  )
}

return (
  <div className="space-y-6">

    {/* Dialog de confirmation suppression — global, en dehors de la liste */}
    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer lagent</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer{" "}
            <strong>
              {agentToDelete?.profile?.first_name ?? agentToDelete?.nom}{" "}
              {agentToDelete?.profile?.last_name ?? agentToDelete?.prenom}
            </strong>{" "}
            ? Cette action est irréversible. Toutes ses données seront supprimées.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(false)}
            disabled={!!deletingAgentId}
          >
            Annuler
          </Button>
          <Button
            variant="destructive"
            disabled={!!deletingAgentId}
            onClick={handleDeleteAgent}
          >
            {deletingAgentId ? "Suppression..." : "Confirmer la suppression"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Page Header */}
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Agents et Permissions</h1>
        <p className="text-muted-foreground">Gérer les membres de l'équipe et les contrôles d'accès</p>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un Agent
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un Nouvel Agent</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour ajouter un nouvel agent à votre équipe.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={(e) => handleInputChange("prenom", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Adresse Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirmer le mot de passe *</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commission_rate">Taux de commission</Label>
                <Input
                  id="commission_rate"
                  type="number"
                  step="0.01"
                  value={formData.commission_rate}
                  onChange={(e) => handleInputChange("commission_rate", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license_number">Numéro de licence</Label>
                <Input
                  id="license_number"
                  value={formData.license_number}
                  onChange={(e) => handleInputChange("license_number", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Spécialisation</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={(e) => handleInputChange("specialization", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle *</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                placeholder="Entrez le rôle"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer l'Agent"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    {/* Stats Cards */}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {loading ? (
        [...Array(4)].map((_, i) => (
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
        ))
      ) : (
        statsCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>

    {/* Filters */}
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher des agents..." className="pl-9" />
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les Rôles</SelectItem>
                <SelectItem value="admin_agence">Admin Agence</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les Statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Agents List */}
    <div className="grid gap-4">
      {loading ? (
        [...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative shrink-0">
                    <Skeleton className="h-14 w-14 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                    <div className="flex gap-4">
                      <Skeleton className="h-3 w-40" />
                      <Skeleton className="h-3 w-28 hidden sm:block" />
                    </div>
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-28 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : filteredAgents.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center py-8">Aucun agent trouvé.</p>
      ) : (
        filteredAgents.map((agent) => {
          const fullName = `${agent.profile?.first_name ?? agent.nom} ${agent.profile?.last_name ?? agent.prenom}`
          const role = agent.roles?.[0]?.name ?? "agent"
          const isActive = agent.is_active === 1

          return (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">

                  {/* Agent Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative">
                      <Avatar className="h-14 w-14">
                        <AvatarFallback className="text-lg">
                          {fullName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background ${isActive ? "bg-green-500" : "bg-gray-400"
                          }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-foreground">{fullName}</p>
                        {getRoleBadge(role)}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {agent.email}
                        </span>
                        <span className="hidden sm:flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {agent.phone}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {isActive ? "Actif" : "Inactif"}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="bg-transparent">
                          Permissions
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier les Permissions — {fullName}</DialogTitle>
                          <DialogDescription>
                            Contrôlez ce que cet agent peut accéder et modifier.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          {[
                            { key: "properties", label: "Propriétés" },
                            { key: "clients", label: "Clients" },
                            { key: "contracts", label: "Contrats" },
                            { key: "invoices", label: "Factures" },
                            { key: "settings", label: "Paramètres" },
                            { key: "team", label: "Équipe" },
                          ].map(({ key, label }) => (
                            <div key={key} className="flex items-center justify-between">
                              <Label htmlFor={`perm-${agent.id}-${key}`}>{label}</Label>
                              <Switch id={`perm-${agent.id}-${key}`} defaultChecked={false} />
                            </div>
                          ))}
                        </div>
                        <DialogFooter>
                          <Button type="submit">Sauvegarder les Modifications</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/agents/${agent.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir le Profil
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/agents/${agent.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Modifier les Détails
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Envoyer un Message
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onSelect={(e) => {
                            e.preventDefault()
                            openDeleteDialog(agent)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Supprimer l'Agent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                </div>
              </CardContent>
            </Card>
          )
        })
      )}
    </div>
  </div>
)
}