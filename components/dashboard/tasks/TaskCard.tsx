// ============================================================
// COMPOSANT – TaskCard
// Ligne d'une tâche dans la liste (en attente ou complétée).
// ============================================================

import { Eye, CheckCircle, Trash2, MoreHorizontal, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { getTypeConfig } from "@/config/taskConfig"
import type { ServerTask } from "@/types/task.types"

// Calcule la date d'échéance = created_at + 24 h
function getDueDate(task: ServerTask): Date {
  return new Date(new Date(task.created_at).getTime() + 24 * 60 * 60 * 1000)
}

function isOverdue(task: ServerTask): boolean {
  return task.status === "pending" && getDueDate(task) < new Date()
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

type Props = {
  task: ServerTask
  onView: (task: ServerTask) => void
  onMarkDone: (id: number) => void
  onDelete: (id: number) => void
}

export function TaskCard({ task, onView, onMarkDone, onDelete }: Props) {
  const { icon: TypeIcon, label: typeLabel } = getTypeConfig(task.type)
  const due = getDueDate(task)
  const overdue = isOverdue(task)
  const isDone = task.status === "done"

  return (
    <Card className={cn(
      "transition-colors",
      overdue && "border-destructive/50",
      isDone && "opacity-60",
    )}>
      <CardContent className="py-4">
        <div className="flex items-start gap-4">
          {/* Checkbox */}
          <Checkbox
            checked={isDone}
            disabled={isDone}
            onCheckedChange={() => !isDone && onMarkDone(task.id)}
            className="mt-1"
          />

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                {/* Titre */}
                <h3 className={cn(
                  "font-medium text-foreground",
                  isDone && "line-through",
                )}>
                  {task.title}
                </h3>

                {/* Description (tâches en attente seulement) */}
                {!isDone && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {task.description}
                  </p>
                )}

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* Type */}
                  <Badge variant="outline" className="gap-1">
                    <TypeIcon className="h-3 w-3" />
                    {typeLabel}
                  </Badge>

                  {/* Priorité – commenté, prochaine version */}
                  {/*
                  <Badge variant="outline" className={priorityConfig[task.priority].color}>
                    {priorityConfig[task.priority].label}
                  </Badge>
                  */}

                  {/* Agent assigné – commenté, prochaine version */}
                  {/*
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {task.creator.prenom} {task.creator.nom}
                  </span>
                  */}

                  {/* Échéance (24 h par défaut) */}
                  {!isDone && (
                    <span className={cn(
                      "text-xs flex items-center gap-1",
                      overdue ? "text-destructive font-medium" : "text-muted-foreground",
                    )}>
                      <Calendar className="h-3 w-3" />
                      Échéance {formatDate(due)}
                      {overdue && " (En Retard)"}
                    </span>
                  )}
                </div>
              </div>

              {/* Menu actions */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onView(task)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Voir les Détails
                  </DropdownMenuItem>
                  {!isDone && (
                    <DropdownMenuItem onClick={() => onMarkDone(task.id)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Marquer comme Complétée
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onDelete(task.id)}
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
}
