"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Building2, Users, Eye, CheckSquare, ArrowUpRight,
  Calendar, MoreHorizontal, Heart, FileText,
  MessageSquare, Home,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Bien {
  id: number
  title: string
  propertyType: string
  listingType: string
  price: string
  status: string
  city: string
  images?: { url: string }[]
}

interface Prospect {
  id: number
  statut: string
  source: string
  client_id: number | null
  client?: { nom: string; prenom: string; email?: string } | null
  lead?: { nom: string; prenom: string; email?: string } | null
}

interface Task {
  id: number
  title: string
  description: string
  status: string
  type: string
  created_at: string
}

interface DashboardData {
  statistics: {
    totalBiens: number
    totalBiensVus: string | number
    totalProspects: number
    totalTasks: number
  }
  recentBiens: Bien[]
  recentProspects: Prospect[]
  recentTasks: Task[]
  agency?: { name: string }
}

interface Props {
  data: DashboardData | null
  user?: any
  loading?: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatPrice = (price: string, listingType: string) => {
  const num = parseFloat(price)
  const formatted = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(num)
  return listingType === "rent" ? `${formatted}/mois` : formatted
}

const statutColors: Record<string, string> = {
  prospect: "bg-blue-100 text-blue-700",
  "qualifié": "bg-purple-100 text-purple-700",
  en_negociation: "bg-amber-100 text-amber-700",
  converti: "bg-green-100 text-green-700",
  perdu: "bg-red-100 text-red-700",
}

const statutLabels: Record<string, string> = {
  prospect: "Prospect",
  "qualifié": "Qualifié",
  en_negociation: "En négociation",
  converti: "Converti",
  perdu: "Perdu",
}

const sourceIcon = (source: string) => {
  switch (source) {
    case "formulaire": return <FileText className="h-3 w-3" />
    case "favori": return <Heart className="h-3 w-3" />
    case "interaction":
    case "visite": return <Calendar className="h-3 w-3" />
    default: return <MessageSquare className="h-3 w-3" />
  }
}

const sourceLabel = (source: string) => {
  switch (source) {
    case "formulaire": return "Formulaire"
    case "favori": return "Favori"
    case "interaction": return "Visite"
    case "visite": return "Visite"
    case "contact_direct": return "Contact direct"
    default: return source
  }
}

const taskStatusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
}

const taskStatusLabel: Record<string, string> = {
  pending: "En attente",
  in_progress: "En cours",
  done: "Terminée",
}

const propertyTypeLabel: Record<string, string> = {
  appartement: "Appartement",
  villa: "Villa",
  studio: "Studio",
  bureau: "Bureau",
  terrain: "Terrain",
  maison: "Maison",
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ListingDashboardPage({ data, user, loading }: Props) {

  if (loading) {
    return (
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>

        {/* Actions rapides */}
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-9 w-36 rounded-md" />
              <Skeleton className="h-9 w-40 rounded-md" />
              <Skeleton className="h-9 w-44 rounded-md" />
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-7 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Biens + Tâches */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Biens récents */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-8 w-20 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg border border-border">
                    <Skeleton className="h-12 w-16 rounded-md shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <div className="hidden sm:flex flex-col items-end gap-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tâches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-5 w-20 rounded-full" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prospects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-56" />
            </div>
            <Skeleton className="h-8 w-20 rounded-md" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3 flex-1">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-40 hidden sm:block" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-20 hidden sm:block" />
                  <Skeleton className="h-5 w-24 rounded-full hidden md:block" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-8 w-14 rounded-md" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    )
  }

  if (!data) return null

  const { statistics, recentBiens, recentProspects, recentTasks } = data
  const pendingTasks = recentTasks.filter((t) => t.status !== "done").slice(0, 4)

  const stats = [
    {
      name: "Biens publiés",
      value: statistics.totalBiens,
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      name: "Vues totales",
      value: Number(statistics.totalBiensVus).toLocaleString("fr-FR"),
      icon: Eye,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      name: "Prospects",
      value: statistics.totalProspects,
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      name: "Tâches en cours",
      value: recentTasks.filter((t) => t.status !== "done").length,
      icon: CheckSquare,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Bienvenue, {data.agency?.name ?? user?.agency?.name ?? ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/properties/new">Ajouter un bien</Link>
        </Button>
      </div>

      {/* Actions rapides */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Actions rapides</CardTitle>
          <CardDescription>Tâches courantes pour gérer votre agence</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/dashboard/contracts/new">
                <FileText className="mr-2 h-4 w-4" />
                Nouveau contrat
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/dashboard/invoices/create">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Créer une facture
              </Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/dashboard/owners/new">
                <Users className="mr-2 h-4 w-4" />
                Ajouter propriétaire
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Biens + Tâches */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Biens récents */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Biens récents</CardTitle>
              <CardDescription>Vos biens ajoutés récemment</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild className="bg-transparent">
              <Link href="/dashboard/properties">Voir tous</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBiens.map((bien) => (
                <div
                  key={bien.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    {bien.images && bien.images.length > 0 ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${bien.images[0].url}`}
                        alt={bien.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Home className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{bien.title}</p>
                    <p className="text-sm text-muted-foreground">{bien.city} · {propertyTypeLabel[bien.propertyType] ?? bien.propertyType}</p>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="font-medium text-foreground text-sm">
                      {formatPrice(bien.price, bien.listingType)}
                    </p>
                    <Badge variant={bien.listingType === "rent" ? "secondary" : "default"} className="mt-1 text-xs">
                      {bien.listingType === "rent" ? "Location" : "Vente"}
                    </Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {/* <DropdownMenuItem >Modifier</DropdownMenuItem> */}
                       <DropdownMenuItem asChild>
                        <Link href={`/dashboard/properties/${bien.id}`}>
                           <Eye className="mr-2 h-4 w-4" />Voir détails
                        </Link>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tâches en cours */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Tâches en cours</CardTitle>
              <CardDescription>Tâches non terminées</CardDescription>
            </div>
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/tasks">
                <CheckSquare className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Aucune tâche en cours</p>
              )}
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm leading-snug">{task.title}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{task.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${taskStatusColor[task.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {taskStatusLabel[task.status] ?? task.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Prospects récents */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Prospects récents</CardTitle>
            <CardDescription>Personnes en contact avec votre agence</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild className="bg-transparent">
            <Link href="/dashboard/clients">Voir tous</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Origine</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Compte</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentProspects.map((prospect) => {
                  const contact = prospect.client ?? prospect.lead
                  const fullName = contact ? `${contact.prenom} ${contact.nom}` : "—"
                  const initials = contact ? `${contact.prenom?.[0] ?? ""}${contact.nom?.[0] ?? ""}` : "?"
                  return (
                    <tr key={prospect.id} className="border-b border-border last:border-0">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground text-sm">{fullName}</p>
                            {contact?.email && (
                              <p className="text-xs text-muted-foreground hidden sm:block">{contact.email}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          {sourceIcon(prospect.source)}
                          <span>{sourceLabel(prospect.source)}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {prospect.client_id ? (
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-green-100 text-green-700">
                            Compte actif
                          </span>
                        ) : (
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-500">
                            Sans compte
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statutColors[prospect.statut] ?? "bg-gray-100 text-gray-600"}`}>
                          {statutLabels[prospect.statut] ?? prospect.statut}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/clients/${prospect.id}`}>Voir</Link>
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}