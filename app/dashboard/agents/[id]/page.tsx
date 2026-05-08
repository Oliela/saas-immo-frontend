"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  Star,
  Calendar,
  CheckCircle,
  FileText,
  TrendingUp,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  ClipboardList,
  Building2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "next/navigation"
import { useGetAgentDetails } from "@/hooks/agence/useGetAgentDetails"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getRoleBadge = (role: string) => {
  const config: Record<string, { label: string; icon: React.ReactNode }> = {
    admin_agence: { label: "Admin Agence", icon: <ShieldCheck className="h-3 w-3 mr-1" /> },
    agent: { label: "Agent", icon: <Shield className="h-3 w-3 mr-1" /> },
    agent_junior: { label: "Agent Junior", icon: <ShieldAlert className="h-3 w-3 mr-1" /> },
  }
  const { label, icon } = config[role] ?? { label: role, icon: <Shield className="h-3 w-3 mr-1" /> }
  return (
    <Badge variant="default" className="flex items-center gap-1">
      {icon}{label}
    </Badge>
  )
}

const getVisiteStatusBadge = (status: string) => {
  const config: Record<string, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
    scheduled: { label: "Planifiée", variant: "secondary" },
    completed: { label: "Effectuée", variant: "default" },
    cancelled: { label: "Annulée", variant: "destructive" },
    confirmed: { label: "Confirmée", variant: "default" },
  }
  const { label, variant } = config[status] ?? { label: status, variant: "outline" }
  return <Badge variant={variant}>{label}</Badge>
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function AgentDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>
        ))}
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AgentViewPage() {
  const params = useParams()
  const id = params.id as string

  const { data, loading, error } = useGetAgentDetails(id)
  const { agent, stats, visitesRecentes, avis } = data

  if (loading) return <AgentDetailsSkeleton />

  if (error || !agent) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-muted-foreground">{error ?? "Agent introuvable."}</p>
        <Button variant="outline" asChild>
          <Link href="/dashboard/agents"><ArrowLeft className="mr-2 h-4 w-4" />Retour</Link>
        </Button>
      </div>
    )
  }

  const fullName = `${agent.profile?.first_name ?? agent.nom} ${agent.profile?.last_name ?? agent.prenom}`
  const initials = fullName.split(" ").map(n => n[0]).join("")
  const role = agent.roles?.[0]?.name ?? "agent"
  const isActive = agent.is_active === 1

  // Performance calculée depuis les stats
  const performanceMetrics = [
    {
      label: "Visites assignées",
      value: stats.totalVisites,
      target: 10,
      percentage: stats.totalVisites > 0 ? Math.round((stats.totalVisites / 10) * 100) : 0,
    },
    {
      label: "Visites effectuées",
      value: stats.visitesEffectuees,
      target: stats.totalVisites || 1,
      percentage: stats.totalVisites > 0
        ? Math.round((stats.visitesEffectuees / stats.totalVisites) * 100)
        : 0,
    },
    {
      label: "Intérêts confirmés",
      value: stats.interetsConfirmes,
      target: stats.visitesEffectuees || 1,
      percentage: stats.visitesEffectuees > 0
        ? Math.round((stats.interetsConfirmes / stats.visitesEffectuees) * 100)
        : 0,
    },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/agents"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
              <span className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-background ${isActive ? "bg-green-500" : "bg-gray-400"}`} />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{fullName}</h1>
                {getRoleBadge(role)}
              </div>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3" />{agent.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />{agent.phone}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Mail className="mr-2 h-4 w-4" />Email
          </Button>
          <Button size="sm" asChild>
            <Link href={`/dashboard/agents/${agent.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />Modifier
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visites Assignées</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.totalVisites}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Visites Effectuées</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.visitesEffectuees}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Intérêts Confirmés</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stats.interetsConfirmes}</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Tabs principales */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="visites">
            <TabsList>
              <TabsTrigger value="visites">
                <FileText className="mr-2 h-4 w-4" />Visites Récentes
              </TabsTrigger>
              <TabsTrigger value="performance">
                <TrendingUp className="mr-2 h-4 w-4" />Performance
              </TabsTrigger>
              <TabsTrigger value="avis">
                <Star className="mr-2 h-4 w-4" />Avis
              </TabsTrigger>
            </TabsList>

            {/* Visites récentes */}
            <TabsContent value="visites" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Visites Récentes</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {visitesRecentes.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      Aucune visite assignée pour le moment.
                    </p>
                  ) : (
                    visitesRecentes.map((visite) => {
                      const heure = (iso: string) =>
                        new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
                      const dateLabel = new Date(visite.date).toLocaleDateString("fr-FR", {
                        weekday: "short", day: "numeric", month: "short", year: "numeric",
                      })
                      return (
                        <div key={visite.id} className="p-4 rounded-lg border border-border space-y-3">
                          {/* Bien + statut */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-medium text-foreground">{visite.bien}</p>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />{dateLabel}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {heure(visite.start_time)} – {heure(visite.end_time)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  <Badge variant="outline" className="text-xs capitalize">{visite.type_bien}</Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {visite.listing_type === "rent" ? "Location" : "Vente"}
                                  </Badge>
                                  <span className="text-xs font-medium text-foreground">
                                    {Number(visite.prix).toLocaleString("fr-FR")} FCFA
                                  </span>
                                </div>
                              </div>
                            </div>
                            {getVisiteStatusBadge(visite.status)}
                          </div>
                          {/* Clients */}
                          {visite.clients.length > 0 && (
                            <div className="border-t border-border pt-3 space-y-2">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Clients ({visite.clients.length})
                              </p>
                              {visite.clients.map((client, i) => (
                                <div key={i} className="flex items-center justify-between gap-2 bg-muted/40 rounded-md px-3 py-2">
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-7 w-7">
                                      <AvatarFallback className="text-xs">
                                        {client.nom.split(" ").map((n: string) => n[0]).join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-medium text-foreground">{client.nom}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {getVisiteStatusBadge(client.status)}
                                    {client.done === 1 && (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Performance */}
            <TabsContent value="performance" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Performance</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                  {performanceMetrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{metric.label}</span>
                        <span className="text-sm text-muted-foreground">
                          {metric.value} / {metric.target} ({metric.percentage}%)
                        </span>
                      </div>
                      <Progress value={Math.min(metric.percentage, 100)} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Avis */}
            <TabsContent value="avis" className="mt-6">
              <Card>
                <CardHeader><CardTitle>Avis Clients</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {avis.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      Aucun avis pour le moment.
                    </p>
                  ) : (
                    avis.map((avis, index) => (
                      <div key={index} className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-foreground">{avis.client}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(avis.date).toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">{avis.feedback}</p>
                        {avis.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic">Note : {avis.notes}</p>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Contact */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Contact</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />{agent.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />{agent.phone}
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Statut</span>
                <span className={isActive ? "text-green-600 font-medium" : "text-muted-foreground"}>
                  {isActive ? "Actif" : "Inactif"}
                </span>
              </div>
              {agent.profile?.license_number && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Licence</span>
                  <span className="text-foreground">{agent.profile.license_number}</span>
                </div>
              )}
              {agent.profile?.commission_rate && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Commission</span>
                  <span className="text-foreground">{agent.profile.commission_rate}%</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* À propos */}
          {(agent.profile?.bio || agent.profile?.specialization) && (
            <Card>
              <CardHeader><CardTitle className="text-lg">À propos</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {agent.profile?.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed">{agent.profile.bio}</p>
                )}
                {agent.profile?.specialization && (
                  <Badge variant="secondary">{agent.profile.specialization}</Badge>
                )}
              </CardContent>
            </Card>
          )}

          {/* Rôles */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Rôles</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {agent.roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{role.name}</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}