"use client"

import Link from "next/link"
import Image from "next/image"
import {
  CheckCircle,
  Circle,
  Clock,
  FileText,
  Heart,
  Calendar,
  ArrowRight,
  Upload,
  MessageSquare,
  AlertCircle,
  MapPin,
  Bed,
  Bath,
  Square,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import ProtectedRoute from "@/components/guard/ProtectedRoute"

// Journey steps data
const journeySteps = [
  {
    id: 1,
    title: "Profil créé",
    description: "Configuration du compte terminée",
    status: "completed",
    date: "Jan 15, 2026",
  },
  {
    id: 2,
    title: "Documents téléversés",
    description: "3 sur 4 documents requis",
    status: "completed",
    date: "Jan 20, 2026",
    action: {
      label: "Téléverser les documents restants",
      href: "/portal/documents",
    },
  },
  {
    id: 3,
    title: "Bien sélectionné",
    description: "Modern Loft in Downtown",
    status: "completed",
    date: "Jan 25, 2026",
  },
  {
    id: 4,
    title: "Visite programmée",
    description: "5 févr. 2026 à 14:00",
    status: "in-progress",
    date: "Feb 1, 2026",
  },
  {
    id: 5,
    title: "Relecture du contrat",
    description: "En attente de la fin de la visite",
    status: "pending",
  },
  {
    id: 6,
    title: "Emménagement",
    description: "Étape finale",
    status: "pending",
  },
]

// Upcoming activities
const upcomingActivities = [
  {
    id: 1,
    type: "visit",
    title: "Visite de propriété",
    property: "Modern Loft in Downtown",
    date: "5 févr. 2026",
    time: "14:00",
    agent: "Sarah Johnson",
  },
  {
    id: 2,
    type: "document",
    title: "Document requis",
    description: "Téléversez une preuve de revenus",
    dueDate: "8 févr. 2026",
    priority: "high",
  },
  {
    id: 3,
    type: "message",
    title: "Nouveau message",
    from: "Elite Properties",
    preview: "Merci pour votre intérêt...",
    time: "il y a 2 heures",
  },
]

// Favorite properties
const favoriteProperties = [
  {
    id: 1,
    title: "Modern Loft in Downtown",
    price: 2500,
    location: "Downtown, Los Angeles",
    beds: 2,
    baths: 2,
    sqft: 1200,
    image: "/images/property-1.jpg",
    status: "Visite prévue",
  },
  {
    id: 2,
    title: "Cozy Studio Apartment",
    price: 1800,
    location: "Arts District, LA",
    beds: 1,
    baths: 1,
    sqft: 650,
    image: "/images/property-3.jpg",
    status: "Enregistré",
  },
]

function getStepIcon(status: string) {
  switch (status) {
    case "completed":
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case "in-progress":
      return <Clock className="h-5 w-5 text-accent" />
    default:
      return <Circle className="h-5 w-5 text-muted-foreground" />
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case "visit":
      return <Calendar className="h-4 w-4" />
    case "document":
      return <FileText className="h-4 w-4" />
    case "message":
      return <MessageSquare className="h-4 w-4" />
    default:
      return <Circle className="h-4 w-4" />
  }
}

export default function ClientPortal() {
  const completedSteps = journeySteps.filter((s) => s.status === "completed").length
  const totalSteps = journeySteps.length
  const progressPercentage = Math.round((completedSteps / totalSteps) * 100)

  return (

    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Bon retour, John</h1>
          <p className="text-muted-foreground">Suivez votre parcours immobilier et gérez vos dossiers.</p>
        </div>
        <Button asChild>
          <Link href="/buy">
            <Heart className="mr-2 h-4 w-4" />
            Parcourir les biens
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">5</p>
                <p className="text-xs text-muted-foreground">Biens enregistrés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-semibold">2</p>
                <p className="text-xs text-muted-foreground">Visites à venir</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">3/4</p>
                <p className="text-xs text-muted-foreground">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">3</p>
                <p className="text-xs text-muted-foreground">Messages non lus</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Journey Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Votre parcours</CardTitle>
                <CardDescription>Suivez votre progression vers votre nouveau chez-vous</CardDescription>
              </div>
              <Badge variant="secondary">{progressPercentage}% complété</Badge>
            </div>
            <Progress value={progressPercentage} className="h-2 mt-2" />
          </CardHeader>
          <CardContent>
            <div className="relative">
              {journeySteps.map((step, index) => (
                <div key={step.id} className="relative flex gap-4 pb-8 last:pb-0">
                  {/* Connector Line */}
                  {index !== journeySteps.length - 1 && (
                    <div
                      className={`absolute left-[9px] top-6 h-full w-0.5 ${step.status === "completed" ? "bg-green-600" : "bg-border"
                        }`}
                    />
                  )}

                  {/* Icon */}
                  <div className="relative z-10 flex-shrink-0">
                    {getStepIcon(step.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h4 className={`text-sm font-medium ${step.status === "pending" ? "text-muted-foreground" : "text-foreground"
                          }`}>
                          {step.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {step.date && (
                          <span className="text-xs text-muted-foreground">{step.date}</span>
                        )}
                        {step.action && (
                          <Button variant="outline" size="sm" asChild className="bg-transparent">
                            <Link href={step.action.href}>
                              {step.action.label}
                              <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Activities */}
        <Card>
          <CardHeader>
            <CardTitle>À venir</CardTitle>
            <CardDescription>Tâches et activités nécessitant votre attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 ${activity.type === "document" && activity.priority === "high"
                  ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
                  }`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium">{activity.title}</h4>
                  {activity.type === "visit" && (
                    <>
                      <p className="text-xs text-muted-foreground truncate">{activity.property}</p>
                      <p className="text-xs text-accent">{activity.date} at {activity.time}</p>
                    </>
                  )}
                  {activity.type === "document" && (
                    <>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-destructive">Due: {activity.dueDate}</p>
                    </>
                  )}
                  {activity.type === "message" && (
                    <>
                      <p className="text-xs text-muted-foreground">From: {activity.from}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.preview}</p>
                    </>
                  )}
                </div>
              </div>
            ))}

            <Separator />

            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/portal/notifications">
                Voir toutes les activités
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Action Required Banner */}
      <Card className="border-accent/50 bg-accent/5">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20 flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-foreground">Action requise</h3>
              <p className="text-sm text-muted-foreground">
                Téléversez votre preuve de revenus pour poursuivre votre dossier de location pour Modern Loft in Downtown.
              </p>
            </div>
            <Button asChild>
              <Link href="/portal/documents">
                <Upload className="mr-2 h-4 w-4" />
                Téléverser maintenant
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Favorite Properties */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Vos propriétés préférées</h2>
          <Button variant="ghost" asChild className="text-accent">
            <Link href="/portal/favorites">
              Voir tout
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2">
          {favoriteProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-40 h-40 sm:h-auto flex-shrink-0">
                  <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground">
                    {property.status}
                  </Badge>
                </div>
                <CardContent className="p-4 flex-1">
                  <h3 className="font-medium text-foreground mb-1">{property.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3" />
                    {property.location}
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-3">
                    ${property.price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/mois</span>
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Bed className="h-3 w-3" />
                      {property.beds} chambre(s)
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      {property.baths} salle(s) de bain
                    </span>
                    <span className="flex items-center gap-1">
                      <Square className="h-3 w-3" />
                      {property.sqft} pi²
                    </span>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>

  )
}
