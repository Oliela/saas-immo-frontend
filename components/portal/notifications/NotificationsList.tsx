"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell, CheckCircle, FileText, Calendar, MessageSquare,
  Receipt, Check, Trash2, Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Notification {
  id: string        // ← UUID string
  type: string
  title: string
  message: string
  time: string
  read: boolean
  priority?: string
  actionUrl?: string
  actionLabel?: string
  content?: string
}

interface Props {
  notifications: Notification[]
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getNotificationIcon(type: string) {
  switch (type) {
    case "visit":    return <Calendar className="h-5 w-5" />
    case "document": return <FileText className="h-5 w-5" />
    case "contract": return <CheckCircle className="h-5 w-5" />
    case "message":  return <MessageSquare className="h-5 w-5" />
    case "invoice":  return <Receipt className="h-5 w-5" />
    default:         return <Bell className="h-5 w-5" />
  }
}

function getIconBgColor(type: string, priority?: string) {
  if (priority === "high") return "bg-destructive/10 text-destructive"
  switch (type) {
    case "visit":    return "bg-accent/10 text-accent"
    case "document": return "bg-amber-100 text-amber-600"
    case "contract": return "bg-green-100 text-green-600"
    case "message":  return "bg-blue-100 text-blue-600"
    case "invoice":  return "bg-primary/10 text-primary"
    default:         return "bg-secondary text-muted-foreground"
  }
}

// ─── Component ──────────────────────────────────────────────────────────────

export function NotificationsList({ notifications }: Props) {
  const [filterType, setFilterType] = useState("all")
  const [items, setItems]           = useState<Notification[]>(notifications)

  const unreadCount = items.filter((n) => !n.read).length

  const filtered = filterType === "all"
    ? items
    : items.filter((n) => n.type === filterType)

  // ── Marquer une notification comme lue ──────────────────────────────────
  const markAsRead = async (id: string) => {
    // Mise à jour optimiste
    setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
    try {
      await axiosInstance.patch(`/api/notifications/${id}/read`)
    } catch {
      // Rollback si erreur
      setItems((prev) => prev.map((n) => n.id === id ? { ...n, read: false } : n))
      toast.error("Impossible de marquer la notification comme lue.")
    }
  }

  // ── Marquer toutes comme lues ────────────────────────────────────────────
  const markAllAsRead = async () => {
    const previous = items
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await axiosInstance.patch("/api/notifications/read-all")
    } catch {
      setItems(previous)
      toast.error("Impossible de marquer toutes les notifications comme lues.")
    }
  }

  // ── Supprimer une notification ───────────────────────────────────────────
  const deleteNotification = async (id: string) => {
    const previous = items
    setItems((prev) => prev.filter((n) => n.id !== id))
    try {
      await axiosInstance.delete(`/api/notifications/${id}`)
      toast.success("Notification supprimée.")
    } catch {
      setItems(previous)
      toast.error("Impossible de supprimer la notification.")
    }
  }

  return (
    <div className="space-y-4">

      {/* ── Barre d'actions ── */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {unreadCount > 0
            ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
            : "Vous êtes à jour !"}
        </p>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" className="bg-transparent" onClick={markAllAsRead}>
              <Check className="mr-2 h-4 w-4" />
              Tout marquer comme lu
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                {filterType === "all" ? "Filtrer" : filterType}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilterType("all")}>Toutes</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("visit")}>Visites</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("document")}>Documents</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("contract")}>Contrats</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("message")}>Messages</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterType("invoice")}>Factures</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Liste ── */}
      {filtered.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Aucune notification</h3>
            <p className="text-muted-foreground">
              Lorsque vous recevez des notifications, elles apparaîtront ici.
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            {filtered.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.read && markAsRead(notification.id)}
                className={`flex items-start gap-4 p-4 transition-colors hover:bg-secondary/30 cursor-pointer ${
                  !notification.read ? "bg-accent/5" : ""
                }`}
              >
                {/* Icône */}
                <div className={`flex h-10 w-10 items-center justify-center rounded-full shrink-0 ${
                  getIconBgColor(notification.type, notification.priority)
                }`}>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-sm font-medium ${
                          !notification.read ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
                        )}
                        {notification.priority === "high" && (
                          <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/10 text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      {
                        notification.content && (
                          <p className="text-sm text-muted-foreground mt-1">{notification.content}</p>
                        )
                      }
                      

                  <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                        {notification.actionUrl && (
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-accent"
                            asChild
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Link href={notification.actionUrl}>
                              {notification.actionLabel}
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Supprimer */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id) }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}