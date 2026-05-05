"use client"

import { useState, useMemo } from "react"
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  CheckCircle,
  Trash2,
  Clock,
  User,
  Building2,
  Calendar,
  AlertCircle,
  FileText,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
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
import { cn } from "@/lib/utils"

import { useTasks } from "@/hooks/agence/useTasks"
import { TaskDetailModal } from "@/components/dashboard/tasks/TaskDetailModal"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import type { ServerTask } from "@/types/task.types"

// ── Config types ─────────────────────────────────────────────

const typeConfig: Record<string, { label: string; icon: React.ElementType }> = {
  client:   { label: "Client",    icon: User },
  property: { label: "Propriété", icon: Building2 },
  contract: { label: "Contrat",   icon: FileText },
  invoice:  { label: "Facture",   icon: FileText },
  visit:    { label: "Visite",    icon: Calendar },
  interest: { label: "Intérêt",   icon: User },
}

function getTypeConfig(type: string) {
  return typeConfig[type] ?? { label: type, icon: FileText }
}

// ── Priorité calculée ────────────────────────────────────────
//   Échéance    = created_at + 48 h
//   soft        = plus de 6 h avant échéance
//   high        = moins de 6 h OU échéance dépassée

type ComputedPriority = "soft" | "high"

const priorityConfig: Record<ComputedPriority, { label: string; color: string }> = {
  soft: { label: "Normal", color: "bg-muted text-muted-foreground border-border" },
  high: { label: "Urgent", color: "bg-destructive/10 text-destructive border-destructive/20" },
}

const DEADLINE_MS       = 48 * 60 * 60 * 1000  // 48 h
const HIGH_THRESHOLD_MS =  6 * 60 * 60 * 1000  //  6 h

function getDueDate(task: ServerTask): Date {
  return new Date(new Date(task.created_at).getTime() + DEADLINE_MS)
}

function getComputedPriority(task: ServerTask): ComputedPriority {
  if (task.status !== "pending") return "soft"
  const remaining = getDueDate(task).getTime() - Date.now()
  return remaining <= HIGH_THRESHOLD_MS ? "high" : "soft"
}

function isOverdue(task: ServerTask): boolean {
  return task.status === "pending" && getDueDate(task) < new Date()
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

// ── Page ─────────────────────────────────────────────────────

export default function TasksPage() {
  const { user } = useAuthAgent()
  const { tasks, isLoading, error, markDone, deleteTask } = useTasks({
    agency_id: user?.agency?.id,
  })

  const [searchQuery, setSearchQuery]     = useState("")
  const [statusFilter, setStatusFilter]   = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all") // "all" | "soft" | "high"

  // selectedTaskId pour rester synchronisé avec le state après markDone
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const selectedTask = selectedTaskId
    ? (tasks.find((t) => t.id === selectedTaskId) ?? null)
    : null

  // ── Filtrage ─────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q)
      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter
      const matchesPriority =
        priorityFilter === "all" || getComputedPriority(task) === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [tasks, searchQuery, statusFilter, priorityFilter])

  const pendingTasks   = filteredTasks.filter((t) => t.status === "pending")
  const completedTasks = filteredTasks.filter((t) => t.status === "done")

  // ── Stats ────────────────────────────────────────────────
  const statPending   = tasks.filter((t) => t.status === "pending").length
  const statUrgent    = tasks.filter((t) => getComputedPriority(t) === "high").length
  const statOverdue   = tasks.filter(isOverdue).length
  const statCompleted = tasks.filter((t) => t.status === "done").length

  // ── Rendu ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Chargement des tâches…
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        Erreur : {error}
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tâches</h1>
          <p className="text-muted-foreground">
            Gérez les tâches et les listes de choses à faire de votre agence
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Tâche
        </Button>
      </div>

      {/* Stats — 4 colonnes comme le template */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statPending}</p>
                <p className="text-sm text-muted-foreground">Tâches en Attente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statUrgent}</p>
                <p className="text-sm text-muted-foreground">Urgentes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statOverdue}</p>
                <p className="text-sm text-muted-foreground">En Retard</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{statCompleted}</p>
                <p className="text-sm text-muted-foreground">Complétées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters — statut + priorité comme le template */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher des tâches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les Statuts</SelectItem>
                  <SelectItem value="pending">En Attente</SelectItem>
                  <SelectItem value="done">Complétée</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les Priorités</SelectItem>
                  <SelectItem value="high">Urgent</SelectItem>
                  <SelectItem value="soft">Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-6">

        {/* ── En attente ──────────────────────────────────── */}
        {pendingTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              En Attente ({pendingTasks.length})
            </h2>
            <div className="space-y-2">
              {pendingTasks.map((task) => {
                const { icon: TypeIcon, label: typeLabel } = getTypeConfig(task.type)
                const due      = getDueDate(task)
                const overdue  = isOverdue(task)
                const priority = getComputedPriority(task)
                return (
                  <Card
                    key={task.id}
                    className={cn(
                      "transition-colors",
                      priority === "high" && "border-destructive/50",
                    )}
                  >
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={false}
                          onCheckedChange={() => markDone(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <h3 className="font-medium text-foreground">{task.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {task.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                {/* Priorité calculée */}
                                <Badge variant="outline" className={priorityConfig[priority].color}>
                                  {priorityConfig[priority].label}
                                </Badge>
                                {/* Type */}
                                <Badge variant="outline" className="gap-1">
                                  <TypeIcon className="h-3 w-3" />
                                  {typeLabel}
                                </Badge>
                                {/* Agent assigné – commenté, prochaine version */}
                                {/*
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {task.creator.prenom} {task.creator.nom}
                                </span>
                                */}
                                {/* Échéance */}
                                <span className={cn(
                                  "text-xs flex items-center gap-1",
                                  overdue
                                    ? "text-destructive font-medium"
                                    : "text-muted-foreground",
                                )}>
                                  <Calendar className="h-3 w-3" />
                                  Échéance {formatDate(due)}
                                  {overdue && " (En Retard)"}
                                </span>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedTaskId(task.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir les Détails
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => markDone(task.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Marquer comme Complétée
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => deleteTask(task.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer la Tâche
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Complétées ──────────────────────────────────── */}
        {completedTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              Complétées ({completedTasks.length})
            </h2>
            <div className="space-y-2">
              {completedTasks.map((task) => {
                const { icon: TypeIcon, label: typeLabel } = getTypeConfig(task.type)
                return (
                  <Card key={task.id} className="opacity-60">
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        <Checkbox checked={true} disabled className="mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <h3 className="font-medium text-foreground line-through">
                                {task.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <Badge variant="outline" className="gap-1">
                                  <TypeIcon className="h-3 w-3" />
                                  {typeLabel}
                                </Badge>
                                {/* Agent assigné – commenté, prochaine version */}
                                {/*
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {task.creator.prenom} {task.creator.nom}
                                </span>
                                */}
                                {task.completed_at && (
                                  <span className="text-xs text-emerald-600 flex items-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Fait le {formatDate(task.completed_at)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSelectedTaskId(task.id)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir les Détails
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => deleteTask(task.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Supprimer la Tâche
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* ── État vide ────────────────────────────────────── */}
        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Aucune tâche trouvée
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Essayez d'ajuster vos filtres"
                  : "Créez une nouvelle tâche pour commencer"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modale de détail */}
      <TaskDetailModal
        task={selectedTask}
        onClose={() => setSelectedTaskId(null)}
        onMarkDone={markDone}
        onDelete={deleteTask}
      />
    </div>
  )
}