// ============================================================
// COMPOSANT – TaskDetailModal
// Modale de détail d'une tâche.
// – Agent assigné commenté (prochaine version)
// – Client et bien chargés depuis le serveur si IDs dispo
// ============================================================

import Image from "next/image"
import Link from "next/link"
import {
  CheckCircle,
  Trash2,
  Calendar,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  Loader2,
  FileText,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { getTypeConfig } from "@/config/taskConfig"
import { useTaskRelated } from "@/hooks/agence/useTaskRelated"
import type { ServerTask } from "@/types/task.types"

// ── helpers ──────────────────────────────────────────────────

function getDueDate(task: ServerTask): Date {
  return new Date(new Date(task.created_at).getTime() + 24 * 60 * 60 * 1000)
}

function isOverdue(task: ServerTask): boolean {
  return task.status === "pending" && getDueDate(task) < new Date()
}

function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ── composant ────────────────────────────────────────────────

type Props = {
  task: ServerTask | null
  onClose: () => void
  onMarkDone: (id: number) => void
  onDelete: (id: number) => void
}

export function TaskDetailModal({ task, onClose, onMarkDone, onDelete }: Props) {
  const { client, property, isLoadingClient, isLoadingProperty } =
    useTaskRelated(task)

  if (!task) return null

  const { icon: TypeIcon, label: typeLabel } = getTypeConfig(task.type)
  const due = getDueDate(task)
  const overdue = isOverdue(task)

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
      <DialogContent style={{ maxWidth: "52rem" }} className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>
            Créée le {formatDate(task.created_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Statut + Type */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={task.status === "done" ? "default" : "secondary"}>
              {task.status === "done" ? "Complétée" : "En Attente"}
            </Badge>

            {/* Priorité – commenté, prochaine version */}
            {/*
            <Badge variant="outline" className={priorityConfig[task.priority].color}>
              Priorité {priorityConfig[task.priority].label}
            </Badge>
            */}

            <Badge variant="outline" className="gap-1">
              <TypeIcon className="h-3 w-3" />
              {typeLabel}
            </Badge>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Description
            </h4>
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              {task.description}
            </p>
          </div>

          <Separator />

          {/* Échéance */}
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Date d'Échéance (24 h)</p>
            <p className={cn(
              "text-sm font-medium flex items-center gap-1",
              overdue && "text-destructive",
            )}>
              <Calendar className="h-4 w-4" />
              {formatDate(due)}
              {overdue && " (En Retard)"}
            </p>
          </div>

          {/* Agent assigné – commenté, prochaine version */}
          {/*
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Assigné à</p>
            <p className="text-sm font-medium flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-[10px]">
                  {task.creator.prenom[0]}{task.creator.nom[0]}
                </AvatarFallback>
              </Avatar>
              {task.creator.prenom} {task.creator.nom}
            </p>
          </div>
          */}

          {/* ── Client associé ──────────────────────────── */}
          {isLoadingClient && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement du client…
            </div>
          )}
          {client && !isLoadingClient && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Client Associé
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <p className="font-medium text-foreground">
                    {client.prenom} {client.nom}
                  </p>
                  <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Mail className="h-3 w-3" />
                      {client.email}
                    </span>
                    <span className="flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {client.phone}
                    </span>
                  </div>
                  <Button size="sm" variant="outline" className="mt-2 bg-transparent" asChild>
                    <Link href={`/dashboard/clients/${client.id}`}>
                      Voir le Profil du Client
                    </Link>
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* ── Bien associé ────────────────────────────── */}
          {isLoadingProperty && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement du bien…
            </div>
          )}
          {property && !isLoadingProperty && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  Bien Associé
                </h4>
                <div className="bg-muted/50 rounded-lg p-3 flex gap-3">
                  {property.images.length > 0 && (
                    <div className="relative h-16 w-20 rounded-md overflow-hidden shrink-0">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL ?? ""}${property.images[0].url}`}
                        alt={property.images[0].alt ?? property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{property.title}</p>
                    {property.address && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {property.address}
                      </p>
                    )}
                    <Button size="sm" variant="outline" className="mt-2 bg-transparent" asChild>
                      <Link href={`/dashboard/biens/${property.id}`}>
                        Voir le Bien
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {/* Bouton Créer le contrat — tâches de type interest ou contract en attente */}
          {(task.type === "interest" || task.type === "contract") && task.status === "pending" && (() => {
            const t        = task.taskable as Record<string, unknown> | null
            const clientId = typeof t?.["client_id"] === "number" ? t["client_id"] : null
            const bienId   = typeof t?.["bien_id"]   === "number" ? t["bien_id"]   : null
            const params   = new URLSearchParams()
            if (clientId) params.set("client_id", String(clientId))
            if (bienId)   params.set("bien_id",   String(bienId))
            return (
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href={`/dashboard/contracts/new?${params.toString()}`}>
                  <FileText className="mr-2 h-4 w-4" />
                  Créer le Contrat
                </Link>
              </Button>
            )
          })()}

          {task.status === "pending" && (
            <Button
              className="bg-emerald-600 hover:bg-emerald-700"
              onClick={() => { onMarkDone(task.id); onClose() }}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Marquer comme Complétée
            </Button>
          )}
          <Button
            variant="outline"
            className="bg-transparent text-destructive border-destructive hover:bg-destructive/10"
            onClick={() => { onDelete(task.id); onClose() }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer la Tâche
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}