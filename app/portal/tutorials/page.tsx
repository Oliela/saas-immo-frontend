"use client"

import { useState } from "react"
import { PlayCircle, Search, Clock, Eye, Heart, FileText, Calendar, Receipt, MessageSquare, Home } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const tutorialCategories = [
  { id: "all", label: "Tous", icon: Home },
  { id: "search", label: "Recherche de biens", icon: Heart },
  { id: "visits", label: "Visites", icon: Calendar },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "contracts", label: "Contrats", icon: FileText },
  { id: "invoices", label: "Factures", icon: Receipt },
  { id: "messages", label: "Messages", icon: MessageSquare },
]

const tutorials = [
  {
    id: "1",
    title: "Bienvenue sur le portail client",
    description: "Une introduction à votre portail client et comment naviguer entre les différentes sections.",
    category: "all",
    duration: "4:15",
    views: 2340,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: true,
  },
  {
    id: "2",
    title: "Comment rechercher des biens",
    description: "Apprenez à utiliser les filtres pour trouver le bien idéal selon la localisation, le prix et les caractéristiques.",
    category: "search",
    duration: "6:30",
    views: 1876,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: true,
  },
  {
    id: "3",
    title: "Enregistrer des biens favoris",
    description: "Comment ajouter des biens à vos favoris et gérer votre liste de souhaits.",
    category: "search",
    duration: "3:45",
    views: 1234,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: false,
  },
  {
    id: "4",
    title: "Manifester son intérêt pour un bien",
    description: "Apprenez à exprimer votre intérêt pour un bien et ce qui se passe ensuite.",
    category: "search",
    duration: "4:20",
    views: 987,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: true,
  },
  {
    id: "5",
    title: "Planifier des visites de biens",
    description: "Comment demander et planifier des visites pour les biens qui vous intéressent.",
    category: "visits",
    duration: "5:10",
    views: 1456,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: true,
  },
  {
    id: "6",
    title: "Gérer vos visites",
    description: "Consultez les visites à venir, reportez ou annulez des rendez-vous.",
    category: "visits",
    duration: "4:00",
    views: 876,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: false,
  },
  {
    id: "7",
    title: "Téléverser les documents requis",
    description: "Comment téléverser vos pièces d'identité, justificatifs de revenus et autres documents nécessaires.",
    category: "documents",
    duration: "5:45",
    views: 1123,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: true,
  },
  {
    id: "8",
    title: "Statut et vérification des documents",
    description: "Comprendre les statuts des documents et que faire si un document est rejeté.",
    category: "documents",
    duration: "3:30",
    views: 654,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: false,
  },
  {
    id: "9",
    title: "Comprendre votre contrat",
    description: "Un guide pour lire et comprendre votre contrat immobilier.",
    category: "contracts",
    duration: "8:20",
    views: 1567,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: true,
  },
  {
    id: "10",
    title: "Signer votre contrat",
    description: "Guide étape par étape pour consulter et signer votre contrat électroniquement.",
    category: "contracts",
    duration: "6:15",
    views: 1234,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: false,
  },
  {
    id: "11",
    title: "Demander des modifications au contrat",
    description: "Comment demander des changements à votre contrat avant de le signer.",
    category: "contracts",
    duration: "4:45",
    views: 789,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: false,
  },
  {
    id: "12",
    title: "Consulter et payer les factures",
    description: "Comment consulter vos factures et effectuer des paiements.",
    category: "invoices",
    duration: "5:30",
    views: 1098,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: false,
  },
  {
    id: "13",
    title: "Comprendre l'historique des paiements",
    description: "Suivez vos paiements et téléchargez vos reçus.",
    category: "invoices",
    duration: "3:15",
    views: 567,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: false,
  },
  {
    id: "14",
    title: "Échanger avec votre agent",
    description: "Comment communiquer avec votre agent attitré via le portail.",
    category: "messages",
    duration: "4:00",
    views: 890,
    videoId: "dQw4w9WgXcQ",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    featured: false,
  },
]

export default function PortalTutorialsPage() {
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
        <p className="text-muted-foreground mt-1">Guides vidéo pour vous aider à utiliser la plateforme</p>
      </div>

      {/* Recherche */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher des tutoriels..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Section À la une */}
      {activeCategory === "all" && !search && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <PlayCircle className="h-5 w-5 text-primary" />
            Pour bien démarrer
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                      <div className="h-12 w-12 rounded-full bg-primary/90 flex items-center justify-center">
                        <PlayCircle className="h-6 w-6 text-primary-foreground" />
                      </div>
                    </div>
                    <Badge className="absolute top-2 right-2 bg-black/70 text-white border-0">
                      {tutorial.duration}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-foreground line-clamp-1">{tutorial.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{tutorial.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {tutorial.views.toLocaleString("fr-FR")}
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
          )}
        </TabsContent>
      </Tabs>

      {/* Boîte de dialogue du lecteur vidéo */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
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