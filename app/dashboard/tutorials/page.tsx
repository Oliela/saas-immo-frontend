"use client"

import { useState } from "react"
import { PlayCircle, Search, Clock, Eye, Filter, BookOpen, Building2, Users, FileText, Calendar, Receipt } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const tutorialCategories = [
  { id: "all", label: "Tous", icon: BookOpen },
  { id: "properties", label: "Biens", icon: Building2 },
  { id: "clients", label: "Clients", icon: Users },
  { id: "contracts", label: "Contrats", icon: FileText },
  { id: "calendar", label: "Calendrier", icon: Calendar },
  { id: "invoices", label: "Factures", icon: Receipt },
]

const tutorials = [
  {
    id: "1",
    title: "Prise en main du tableau de bord",
    description: "Apprenez les bases de la navigation sur le tableau de bord et la compréhension des indicateurs clés.",
    category: "all",
    duration: "5:32",
    views: 1245,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: true,
  },
  {
    id: "2",
    title: "Comment ajouter un nouveau bien",
    description: "Guide étape par étape pour ajouter des biens avec photos, descriptions et tarification.",
    category: "properties",
    duration: "8:15",
    views: 892,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: true,
  },
  {
    id: "3",
    title: "Gérer les annonces de biens",
    description: "Apprenez à modifier, archiver et gérer efficacement vos annonces immobilières.",
    category: "properties",
    duration: "6:45",
    views: 567,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: false,
  },
  {
    id: "4",
    title: "Ajouter et gérer des clients",
    description: "Comment ajouter de nouveaux clients, suivre leurs préférences et gérer leurs documents.",
    category: "clients",
    duration: "7:20",
    views: 734,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: true,
  },
  {
    id: "5",
    title: "Comprendre les intérêts des clients",
    description: "Apprenez à consulter et répondre aux demandes d'intérêt des clients pour un bien.",
    category: "clients",
    duration: "4:50",
    views: 456,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: false,
  },
  {
    id: "6",
    title: "Créer des contrats",
    description: "Guide complet pour créer des contrats de vente et de location pour vos clients.",
    category: "contracts",
    duration: "10:30",
    views: 623,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: true,
  },
  {
    id: "7",
    title: "Processus de signature de contrat",
    description: "Comment gérer le flux de signature de contrat du brouillon jusqu'à la finalisation.",
    category: "contracts",
    duration: "6:15",
    views: 412,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: false,
  },
  {
    id: "8",
    title: "Planifier des visites de biens",
    description: "Apprenez à planifier, gérer et suivre les visites de biens avec les clients.",
    category: "calendar",
    duration: "5:45",
    views: 589,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: false,
  },
  {
    id: "9",
    title: "Utiliser le calendrier",
    description: "Maîtrisez la vue calendrier pour gérer tous vos rendez-vous et visites.",
    category: "calendar",
    duration: "4:20",
    views: 378,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: false,
  },
  {
    id: "10",
    title: "Créer et envoyer des factures",
    description: "Comment créer des factures, ajouter des lignes et les envoyer aux clients.",
    category: "invoices",
    duration: "8:00",
    views: 521,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: true,
  },
  {
    id: "11",
    title: "Enregistrer les paiements",
    description: "Apprenez à enregistrer les paiements des clients et suivre le statut des factures.",
    category: "invoices",
    duration: "5:10",
    views: 345,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: false,
  },
]

export default function DashboardTutorialsPage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedVideo, setSelectedVideo] = useState<typeof tutorials[0] | null>(null)

  const filteredTutorials = tutorials.filter((t) => {
    const matchSearch = !search || 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === "all" || t.category === activeCategory
    return matchSearch && matchCategory
  })

  const featuredTutorials = tutorials.filter((t) => t.featured)

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tutoriels</h1>
        <p className="text-muted-foreground mt-1">Apprenez à utiliser la plateforme grâce à des guides vidéo</p>
      </div>

      {/* Recherche */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher des tutoriels..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Section À la une */}
      {activeCategory === "all" && !search && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-primary" />
            Tutoriels à la une
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredTutorials.slice(0, 3).map((tutorial) => (
              <Card
                key={tutorial.id}
                className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                onClick={() => setSelectedVideo(tutorial)}
              >
                <div className="relative aspect-video bg-muted">
                  <div 
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${tutorial.thumbnail})` }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center">
                      <PlayCircle className="h-8 w-8 text-primary-foreground" />
                    </div>
                  </div>
                  <Badge className="absolute top-2 right-2 bg-black/70 text-white border-0">
                    {tutorial.duration}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground line-clamp-1">{tutorial.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tutorial.description}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {tutorial.views.toLocaleString("fr-FR")} vues
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {tutorial.duration}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Onglets de catégories */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="flex-wrap h-auto gap-2 bg-transparent p-0">
          {tutorialCategories.map((cat) => (
            <TabsTrigger
              key={cat.id}
              value={cat.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2 border border-border data-[state=active]:border-primary"
            >
              <cat.icon className="h-4 w-4 mr-2" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          {filteredTutorials.length === 0 ? (
            <Card className="p-12 text-center">
              <PlayCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-1">Aucun tutoriel trouvé</h3>
              <p className="text-sm text-muted-foreground">Essayez de modifier votre recherche ou le filtre de catégorie.</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredTutorials.map((tutorial) => (
                <Card
                  key={tutorial.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                  onClick={() => setSelectedVideo(tutorial)}
                >
                  <div className="relative aspect-video bg-muted">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${tutorial.thumbnail})` }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="h-14 w-14 rounded-full bg-primary/90 flex items-center justify-center">
                        <PlayCircle className="h-7 w-7 text-primary-foreground" />
                      </div>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white border-0">
                      {tutorial.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground line-clamp-1">{tutorial.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tutorial.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {tutorial.views.toLocaleString("fr-FR")} vues
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Boîte de dialogue du lecteur vidéo */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full">
            {selectedVideo && (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="border-0"
              />
            )}
          </div>
          <div className="p-4 pt-0">
            <p className="text-sm text-muted-foreground">{selectedVideo?.description}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}