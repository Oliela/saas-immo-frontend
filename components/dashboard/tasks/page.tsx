"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Plus,
  Search,
  Filter,
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
  Phone,
  Mail,
  MapPin,
  MessageSquare,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type TaskPriority = "high" | "medium" | "low"
type TaskStatus = "pending" | "completed"
type TaskType = "client" | "property" | "contract" | "invoice" | "visit"

type TaskClient = {
  id: string
  name: string
  email: string
  phone: string
}

type TaskProperty = {
  id: string
  title: string
  address: string
  image: string
}

type Task = {
  id: string
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
  createdAt: string
  assignedTo: string
  type: TaskType
  client: TaskClient | null
  property: TaskProperty | null
}

// Mock tasks data
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Suivi client concernant la visite immobilière",
    description: "Appelez Marie Dupont pour confirmer sa disponibilité pour la visite d'appartement prévue la semaine prochaine. Elle a exprimé de l'intérêt pour l'Appartement Moderne du Centre-Ville.",
    priority: "high" as const,
    status: "pending" as const,
    dueDate: "2026-03-25",
    createdAt: "2026-03-20",
    assignedTo: "Sophie Martin",
    type: "client" as const,
    client: {
      id: "1",
      name: "Marie Dupont",
      email: "marie.dupont@email.com",
      phone: "+33 6 12 34 56 78",
    },
    property: {
      id: "1",
      title: "Appartement Moderne du Centre-Ville",
      address: "123 Rue Principale, Manhattan",
      image: "/images/property-1.jpg",
    },
  },
  {
    id: "2",
    title: "Préparer le contrat de vente du Condo Riverside",
    description: "Rédiger le contrat de vente pour Jean Martin. Inclure tous les termes convenus : prix de 710 000 $, date de clôture dans 30 jours et clause d'inclusion du mobilier.",
    priority: "high" as const,
    status: "pending" as const,
    dueDate: "2026-03-24",
    createdAt: "2026-03-19",
    assignedTo: "Pierre Durand",
    type: "contract" as const,
    client: {
      id: "2",
      name: "Jean Martin",
      email: "jean.martin@email.com",
      phone: "+33 6 98 76 54 32",
    },
    property: {
      id: "3",
      title: "Condo Riverside",
      address: "456 Avenue de la Rivière, Brooklyn",
      image: "/images/property-3.jpg",
    },
  },
  {
    id: "3",
    title: "Planifier une séance photo de la propriété",
    description: "Coordonner avec le photographe pour la nouvelle annonce de l'Avenue du Parc. Des photos haute qualité sont nécessaires pour l'annonce du penthouse de luxe.",
    priority: "medium" as const,
    status: "pending" as const,
    dueDate: "2026-03-26",
    createdAt: "2026-03-21",
    assignedTo: "Sophie Martin",
    type: "property" as const,
    client: null,
    property: {
      id: "5",
      title: "Penthouse de Luxe",
      address: "789 Avenue du Parc, Manhattan",
      image: "/images/property-5.jpg",
    },
  },
  {
    id: "4",
    title: "Envoyer un rappel de facture au client",
    description: "Claire Bernard a une facture impayée pour les frais de gestion immobilière. Envoyer un rappel poli concernant le paiement dû.",
    priority: "low" as const,
    status: "completed" as const,
    dueDate: "2026-03-22",
    createdAt: "2026-03-18",
    assignedTo: "Marc Lefebvre",
    type: "invoice" as const,
    client: {
      id: "3",
      name: "Claire Bernard",
      email: "claire.bernard@email.com",
      phone: "+33 6 11 22 33 44",
    },
    property: null,
  },
  {
    id: "5",
    title: "Mettre à jour les détails de l'annonce immobilière",
    description: "Le propriétaire a demandé des modifications à l'annonce Maison Familiale : mettre à jour la surface à 2 300 pi² et ajouter la nouvelle rénovation du patio à la description.",
    priority: "medium" as const,
    status: "pending" as const,
    dueDate: "2026-03-27",
    createdAt: "2026-03-22",
    assignedTo: "Pierre Durand",
    type: "property" as const,
    client: null,
    property: {
      id: "4",
      title: "Maison Familiale avec Jardin",
      address: "567 Rue de la Banlieue, Queens",
      image: "/images/property-4.jpg",
    },
  },
  {
    id: "6",
    title: "Examiner les documents de demande de location",
    description: "Thomas Petit a soumis sa demande de location pour l'appartement du centre-ville. Examiner ses preuves de revenu et ses références avant approbation.",
    priority: "high" as const,
    status: "pending" as const,
    dueDate: "2026-03-24",
    createdAt: "2026-03-21",
    assignedTo: "Sophie Martin",
    type: "client" as const,
    client: {
      id: "4",
      name: "Thomas Petit",
      email: "thomas.petit@email.com",
      phone: "+33 6 55 66 77 88",
    },
    property: {
      id: "1",
      title: "Appartement Moderne du Centre-Ville",
      address: "123 Rue Principale, Manhattan",
      image: "/images/property-1.jpg",
    },
  },
  {
    id: "7",
    title: "Confirmer la disponibilité des créneaux de visite",
    description: "Vérifier la disponibilité de l'agent pour les visites prévues le samedi. Assurer que toutes les propriétés sont prêtes pour les visites.",
    priority: "low" as const,
    status: "completed" as const,
    dueDate: "2026-03-21",
    createdAt: "2026-03-19",
    assignedTo: "Marc Lefebvre",
    type: "visit" as const,
    client: null,
    property: null,
  },
]

const priorityConfig = {
  high: { label: "Élevée", color: "bg-destructive/10 text-destructive border-destructive/20" },
  medium: { label: "Moyenne", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  low: { label: "Basse", color: "bg-muted text-muted-foreground border-border" },
}

const typeConfig = {
  client: { label: "Client", icon: User },
  property: { label: "Propriété", icon: Building2 },
  contract: { label: "Contrat", icon: FileText },
  invoice: { label: "Facture", icon: FileText },
  visit: { label: "Visite", icon: Calendar },
}

export default function ListingTasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  const pendingTasks = filteredTasks.filter((t) => t.status === "pending")
  const completedTasks = filteredTasks.filter((t) => t.status === "completed")

  const handleMarkDone = (id: string) => {
    setTasks((prevTasks) => prevTasks.map((t) => (t.id === id ? { ...t, status: "completed" } : t)))
  }

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
    if (selectedTask?.id === id) setSelectedTask(null)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const isOverdue = (dueDate: string, status: string) => {
    return status === "pending" && new Date(dueDate) < new Date()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tâches</h1>
          <p className="text-muted-foreground">Gérez les tâches et les listes de choses à faire de votre agence</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Tâche
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tasks.filter((t) => t.status === "pending").length}</p>
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
                <p className="text-2xl font-bold">{tasks.filter((t) => t.priority === "high" && t.status === "pending").length}</p>
                <p className="text-sm text-muted-foreground">Priorité Élevée</p>
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
                <p className="text-2xl font-bold">{tasks.filter((t) => isOverdue(t.dueDate, t.status)).length}</p>
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
                <p className="text-2xl font-bold">{tasks.filter((t) => t.status === "completed").length}</p>
                <p className="text-sm text-muted-foreground">Complétées</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
                  <SelectItem value="completed">Complétée</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priorité" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les Priorités</SelectItem>
                  <SelectItem value="high">Élevée</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <div className="space-y-6">
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              En Attente ({pendingTasks.length})
            </h2>
            <div className="space-y-2">
              {pendingTasks.map((task) => {
                const TypeIcon = typeConfig[task.type].icon
                return (
                  <Card key={task.id} className={cn("transition-colors", isOverdue(task.dueDate, task.status) && "border-destructive/50")}>
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={false}
                          onCheckedChange={() => handleMarkDone(task.id)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <h3 className="font-medium text-foreground">{task.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <Badge variant="outline" className={priorityConfig[task.priority].color}>
                                  {priorityConfig[task.priority].label}
                                </Badge>
                                <Badge variant="outline" className="gap-1">
                                  <TypeIcon className="h-3 w-3" />
                                  {typeConfig[task.type].label}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {task.assignedTo}
                                </span>
                                <span className={cn(
                                  "text-xs flex items-center gap-1",
                                  isOverdue(task.dueDate, task.status) ? "text-destructive font-medium" : "text-muted-foreground"
                                )}>
                                  <Calendar className="h-3 w-3" />
                                  Échéance {formatDate(task.dueDate)}
                                  {isOverdue(task.dueDate, task.status) && " (En Retard)"}
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
                                <DropdownMenuItem onClick={() => setSelectedTask(task)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir les Détails
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleMarkDone(task.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Marquer comme Complétée
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-destructive">
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

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              Complétées ({completedTasks.length})
            </h2>
            <div className="space-y-2">
              {completedTasks.map((task) => {
                const TypeIcon = typeConfig[task.type].icon
                return (
                  <Card key={task.id} className="opacity-60">
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={true}
                          className="mt-1"
                          disabled
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <h3 className="font-medium text-foreground line-through">{task.title}</h3>
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <Badge variant="outline" className="gap-1">
                                  <TypeIcon className="h-3 w-3" />
                                  {typeConfig[task.type].label}
                                </Badge>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {task.assignedTo}
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
                                <DropdownMenuItem onClick={() => setSelectedTask(task)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Voir les Détails
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-destructive">
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

        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Aucune tâche trouvée</h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                  ? "Essayez d'ajuster vos filtres"
                  : "Créez une nouvelle tâche pour commencer"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Task Detail Modal */}
      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedTask && (
            <>
              <DialogHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <DialogTitle>{selectedTask.title}</DialogTitle>
                    <DialogDescription>
                      Créée le {formatDate(selectedTask.createdAt)}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2">
                {/* Status & Priority */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant={selectedTask.status === "completed" ? "default" : "secondary"}>
                    {selectedTask.status === "completed" ? "Complétée" : "En Attente"}
                  </Badge>
                  <Badge variant="outline" className={priorityConfig[selectedTask.priority].color}>
                    Priorité {priorityConfig[selectedTask.priority].label}
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    {(() => { const TypeIcon = typeConfig[selectedTask.type].icon; return <TypeIcon className="h-3 w-3" /> })()}
                    {typeConfig[selectedTask.type].label}
                  </Badge>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    Descriptif
                  </h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                    {selectedTask.description}
                  </p>
                </div>

                <Separator />

                {/* Assignment & Due Date */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Assigné à</p>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-[10px]">{selectedTask.assignedTo.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      {selectedTask.assignedTo}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Date d'Échéance</p>
                    <p className={cn(
                      "text-sm font-medium flex items-center gap-1",
                      isOverdue(selectedTask.dueDate, selectedTask.status) && "text-destructive"
                    )}>
                      <Calendar className="h-4 w-4" />
                      {formatDate(selectedTask.dueDate)}
                      {isOverdue(selectedTask.dueDate, selectedTask.status) && " (En Retard)"}
                    </p>
                  </div>
                </div>

                {/* Client Info */}
                {selectedTask.client && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        Client Associé
                      </h4>
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <p className="font-medium text-foreground">{selectedTask.client.name}</p>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {selectedTask.client.email}
                          </span>
                          <span className="flex items-center gap-2">
                            <Phone className="h-3 w-3" />
                            {selectedTask.client.phone}
                          </span>
                        </div>
                        <Button size="sm" variant="outline" className="mt-2 bg-transparent" asChild>
                          <Link href={`/dashboard/clients/${selectedTask.client.id}`}>
                            Voir le Profil du Client
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* Property Info */}
                {selectedTask.property && (
                  <>
                    <Separator />
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        Propriété Associée
                      </h4>
                      <div className="bg-muted/50 rounded-lg p-3 flex gap-3">
                        <div className="relative h-16 w-20 rounded-md overflow-hidden shrink-0">
                          <Image
                            src={selectedTask.property.image}
                            alt={selectedTask.property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{selectedTask.property.title}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {selectedTask.property.address}
                          </p>
                          <Button size="sm" variant="outline" className="mt-2 bg-transparent" asChild>
                            <Link href={`/dashboard/properties/${selectedTask.property.id}`}>
                              Voir la Propriété
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <DialogFooter className="flex-col sm:flex-row gap-2">
                {selectedTask.status === "pending" && (
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => { handleMarkDone(selectedTask.id); setSelectedTask(null) }}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Marquer comme Complétée
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="bg-transparent text-destructive border-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(selectedTask.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer la Tâche
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
