"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Square,
  Trash2,
  Grid3X3,
  List,
  ArrowUpDown,
  Filter,
  ExternalLink,
  Layers,
  Sofa,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth"
import axiosInstance from "@/lib/axios"

// ─── Type ────────────────────────────────────────────────────────────────────

interface FavoriteBienImage {
  id: number
  url: string
  alt: string | null
  bien_id: number
}

interface FavoriteBien {
  id: number
  title: string
  propertyType: string
  listingType: "sale" | "rent"
  price: string
  status: string
  city: string
  neighborhood: string | null
  address: string | null
  country: string | null
  surface: string
  rooms: number
  bathrooms: number
  floor: number | null
  furnished: 0 | 1
  agency_id: number
  images: FavoriteBienImage[]
  pivot: { client_id: number; bien_id: number }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

function imageUrl(url: string) {
  if (url.startsWith("http")) return url
  return `${BASE_URL}${url}`
}

function formatPrice(price: string, listingType: "sale" | "rent") {
  const num = parseFloat(price)
  const formatted = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(num)
  return listingType === "rent" ? `${formatted} / mois` : formatted
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function FavoritesSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-9 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function FavoritesPage() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteBien[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("date")
  const [filterType, setFilterType] = useState("all")
  const [removingId, setRemovingId] = useState<number | null>(null)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axiosInstance.get<FavoriteBien[]>("/api/favorites")
        setFavorites(res.data)
      } catch (error) {
        console.error("Erreur chargement favoris :", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFavorites()
  }, [])

  const handleRemove = async (bienId: number) => {
    setRemovingId(bienId)
    try {
      await axiosInstance.post(`/api/favorites/${bienId}`)
      setFavorites((prev) => prev.filter((f) => f.id !== bienId))
    } catch (error) {
      console.error("Erreur suppression favori :", error)
    } finally {
      setRemovingId(null)
    }
  }

  const filteredFavorites = favorites
    .filter((p) => {
      if (filterType === "all") return true
      if (filterType === "rent") return p.listingType === "rent"
      if (filterType === "sale") return p.listingType === "sale"
      return true
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return parseFloat(a.price) - parseFloat(b.price)
      if (sortBy === "price-high") return parseFloat(b.price) - parseFloat(a.price)
      return 0
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Mes favoris</h1>
          <p className="text-muted-foreground">
            {loading ? "Chargement..." : `${favorites.length} bien${favorites.length > 1 ? "s" : ""} sauvegardé${favorites.length > 1 ? "s" : ""}`}
          </p>
        </div>
        <Button asChild>
          <Link href="/buy">Parcourir les biens</Link>
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="rent">À louer</SelectItem>
              <SelectItem value="sale">À vendre</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date d'ajout</SelectItem>
              <SelectItem value="price-low">Prix croissant</SelectItem>
              <SelectItem value="price-high">Prix décroissant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1 border border-border rounded-lg p-1">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Contenu */}
      {loading ? (
        <FavoritesSkeleton />
      ) : viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFavorites.map((bien) => {
            const thumb = bien.images[0] ? imageUrl(bien.images[0].url) : "/placeholder.svg"
            return (
              <Card key={bien.id} className="overflow-hidden group">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={thumb}
                    alt={bien.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <Badge className="absolute bottom-3 left-3 bg-card/90 text-card-foreground">
                    {bien.listingType === "rent" ? "À louer" : "À vendre"}
                  </Badge>

                  {/* Bouton supprimer */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={removingId === bien.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Retirer des favoris ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Voulez-vous retirer <span className="font-medium">{bien.title}</span> de vos favoris ?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-transparent">Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleRemove(bien.id)}
                        >
                          Retirer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-medium text-foreground mb-1 line-clamp-1">{bien.title}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 shrink-0" />
                    <span className="line-clamp-1">
                      {[bien.neighborhood, bien.city].filter(Boolean).join(", ")}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-foreground mb-3">
                    {formatPrice(bien.price, bien.listingType)}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />{bien.rooms} pièces
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />{bien.bathrooms} SDB
                    </span>
                    <span className="flex items-center gap-1">
                      <Square className="h-4 w-4" />{parseFloat(bien.surface).toFixed(0)} m²
                    </span>
                    {bien.floor !== null && (
                      <span className="flex items-center gap-1">
                        <Layers className="h-4 w-4" />Étage {bien.floor}
                      </span>
                    )}
                    {bien.furnished === 1 && (
                      <span className="flex items-center gap-1">
                        <Sofa className="h-4 w-4" />Meublé
                      </span>
                    )}
                  </div>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/property/${bien.id}`}>
                      Voir le bien
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFavorites.map((bien) => {
            const thumb = bien.images[0] ? imageUrl(bien.images[0].url) : "/placeholder.svg"
            return (
              <Card key={bien.id} className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                    <Image src={thumb} alt={bien.title} fill className="object-cover" />
                    <Badge className="absolute top-3 left-3 bg-card/90 text-card-foreground">
                      {bien.listingType === "rent" ? "À louer" : "À vendre"}
                    </Badge>
                  </div>
                  <CardContent className="p-4 flex-1">
                    <div className="flex flex-col h-full">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-medium text-foreground mb-1">{bien.title}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" />
                            {[bien.neighborhood, bien.city].filter(Boolean).join(", ")}
                          </div>
                        </div>
                        <p className="text-lg font-semibold text-foreground whitespace-nowrap">
                          {formatPrice(bien.price, bien.listingType)}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                        <span className="flex items-center gap-1"><Bed className="h-4 w-4" />{bien.rooms} pièces</span>
                        <span className="flex items-center gap-1"><Bath className="h-4 w-4" />{bien.bathrooms} SDB</span>
                        <span className="flex items-center gap-1"><Square className="h-4 w-4" />{parseFloat(bien.surface).toFixed(0)} m²</span>
                        {bien.floor !== null && (
                          <span className="flex items-center gap-1"><Layers className="h-4 w-4" />Étage {bien.floor}</span>
                        )}
                        {bien.furnished === 1 && (
                          <span className="flex items-center gap-1"><Sofa className="h-4 w-4" />Meublé</span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-auto">
                        <Button variant="outline" size="sm" asChild className="bg-transparent">
                          <Link href={`/property/${bien.id}`}>
                            Voir le bien
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </Link>
                        </Button>

                        {/* Bouton supprimer */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive ml-auto"
                              disabled={removingId === bien.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Retirer des favoris ?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Voulez-vous retirer <span className="font-medium">{bien.title}</span> de vos favoris ?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-transparent">Annuler</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => handleRemove(bien.id)}
                              >
                                Retirer
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {/* Vide */}
      {!loading && filteredFavorites.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Aucun favori</h3>
            <p className="text-muted-foreground mb-4">
              Parcourez les biens et sauvegardez vos favoris pour les retrouver ici.
            </p>
            <Button asChild>
              <Link href="/buy">Parcourir les biens</Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}