"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Share2,
  Heart,
  ArrowLeft,
  Phone,
  CalendarDays,
  CheckCircle,
  Layers,
  Building2,
  LogIn,
  Ban,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertyGallery } from "@/components/property-gallery"
import { ScheduleVisitDialog } from "@/components/schedule-visit-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import axiosInstance from "@/lib/axios"
import type { BienDetail } from "@/types/bienDetailsType"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ""

function formatPrice(price: string, listingType: "sale" | "rent") {
  const num = parseFloat(price)
  const formatted = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(num)
  return listingType === "rent" ? `${formatted} / mois` : formatted
}

function imageUrl(url: string) {
  if (url.startsWith("http")) return url
  return `${BASE_URL}${url}`
}

function relativeDate(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86_400_000)
  if (days === 0) return "Aujourd'hui"
  if (days === 1) return "Hier"
  return `Il y a ${days} jours`
}

// ─── Helpers statut ──────────────────────────────────────────────────────────

function getStatusLabel(status: string, listingType: "sale" | "rent") {
  if (status === "available") return null // affiché via le listing type badge
  if (status === "pending") return "En négociation"
  if (status === "sold") return listingType === "rent" ? "Loué" : "Vendu"
  return null
}

function getStatusBadgeClass(status: string) {
  if (status === "pending") return "bg-amber-500/15 text-amber-700 border-amber-300"
  if (status === "sold") return "bg-red-500/15 text-red-700 border-red-300"
  return ""
}

function PropertyDetailSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-6">
          <Skeleton className="h-[400px] w-full rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-40 w-full" />
            </div>
            <Skeleton className="h-80 w-full" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default function PropertyPage() {
  const params = useParams<{ id: string }>()
  const [bien, setBien] = useState<BienDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const { user, loading: authLoading } = useAuth()

  const isAgencyUser = user?.account_type === "agency_user"

  useEffect(() => {
    if (!params.id) return
    const fetchBien = async () => {
      try {
        const res = await axiosInstance.get<BienDetail>(`/api/biens/${params.id}`)
        setBien(res.data)
      } catch (error: any) {
        if (error?.response?.status === 404) setNotFound(true)
        console.error("Erreur chargement bien :", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBien()
  }, [params.id])

  const handleToggleFavorite = async () => {
    if (!bien || favoriteLoading) return
    if (!user) {
      setShowLoginPrompt(true)
      return
    }
    setFavoriteLoading(true)
    try {
      const res = await axiosInstance.post(`/api/favorites/${bien.id}`)
      setIsFavorite(res.data.status === "added")
      toast.success(res.data.message)
    } catch (error: any) {
      console.error("Erreur toggle favori :", error.response?.message || error.message)
    } finally {
      setFavoriteLoading(false)
    }
  }

  if (loading) return <PropertyDetailSkeleton />

  if (notFound || !bien) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-2xl font-bold text-foreground">Bien introuvable</p>
            <Link href="/" className="text-sm text-primary underline">
              Retour à l'accueil
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const galleryImages = bien.images.map((img) => imageUrl(img.url))
  const backHref = bien.listingType === "rent" ? "/rent" : "/buy"
  const fullLocation = [bien.neighborhood, bien.city, bien.country].filter(Boolean).join(", ")

  const isAvailable = bien.status === "available" || !bien.status
  const statusLabel = getStatusLabel(bien.status, bien.listingType)
  const statusBadgeClass = getStatusBadgeClass(bien.status)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        {/* Back Navigation */}
        <div className="bg-muted border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
            <Link
              href={backHref}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux annonces
            </Link>
          </div>
        </div>

        {/* Gallery + Header */}
        <section className="bg-muted pb-8">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            {galleryImages.length > 0 && (
              <div className="pt-6">
                <PropertyGallery images={galleryImages} title={bien.title} />
              </div>
            )}

            <div className="mt-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {/* Badge listing type — affiché seulement si disponible */}
                  {isAvailable ? (
                    <Badge variant={bien.listingType === "rent" ? "secondary" : "default"}>
                      {bien.listingType === "rent" ? "À louer" : "À vendre"}
                    </Badge>
                  ) : (
                    <Badge className={`border ${statusBadgeClass}`}>
                      {statusLabel}
                    </Badge>
                  )}

                  <Badge variant="outline" className="capitalize">{bien.propertyType}</Badge>

                  {/* Badge disponible — uniquement si available */}
                  {isAvailable && (
                    <Badge variant="outline" className="text-emerald-600 border-emerald-600">
                      Disponible
                    </Badge>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">{bien.title}</h1>
                {fullLocation && (
                  <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{fullLocation}</span>
                  </div>
                )}
                {bien.address && (
                  <p className="text-sm text-muted-foreground mt-1 ml-5">{bien.address}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleFavorite}
                  disabled={favoriteLoading}
                  title={isFavorite ? "Retirer des favoris" : "Sauvegarder le bien"}
                  className={isFavorite ? "border-red-400 text-red-500 hover:bg-red-50" : ""}
                >
                  <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
                  <span className="sr-only">
                    {isFavorite ? "Retirer des favoris" : "Sauvegarder le bien"}
                  </span>
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Partager le bien</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className={isAgencyUser ? "block" : "grid grid-cols-1 lg:grid-cols-3 gap-8"}>

              {/* Main */}
              <div className={isAgencyUser ? "space-y-8" : "lg:col-span-2 space-y-8"}>

                {/* Prix + chiffres clés */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <p className="text-3xl font-bold text-foreground">
                        {formatPrice(bien.price, bien.listingType)}
                      </p>
                      <div className="flex items-center gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Bed className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold text-foreground">{bien.rooms}</p>
                            <p className="text-xs text-muted-foreground">Pièces</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold text-foreground">{bien.bathrooms}</p>
                            <p className="text-xs text-muted-foreground">SDB</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Square className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold text-foreground">{parseFloat(bien.surface).toFixed(0)}</p>
                            <p className="text-xs text-muted-foreground">m²</p>
                          </div>
                        </div>
                        {bien.floor !== null && (
                          <div className="flex items-center gap-2">
                            <Layers className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-semibold text-foreground">{bien.floor}</p>
                              <p className="text-xs text-muted-foreground">Étage</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                {bien.description && (
                  <Card>
                    <CardHeader>
                      <CardTitle>À propos de ce bien</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {bien.description}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Équipements */}
                {bien.features.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Équipements et prestations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {bien.features.map((feature) => (
                          <div key={feature.id} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                            <span className="text-sm text-foreground">{feature.name}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Détails */}
                <Card>
                  <CardHeader>
                    <CardTitle>Détails du bien</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                      {[
                        { label: "Type de bien", value: bien.propertyType },
                        { label: "Type d'annonce", value: bien.listingType === "rent" ? "Location" : "Vente" },
                        { label: "Pièces", value: bien.rooms },
                        { label: "Salles de bain", value: bien.bathrooms },
                        { label: "Surface", value: `${parseFloat(bien.surface).toFixed(0)} m²` },
                        { label: "Étage", value: bien.floor ?? "—" },
                        { label: "Meublé", value: bien.furnished ? "Oui" : "Non" },
                        {
                          label: "Statut",
                          value: bien.status === "available"
                            ? "Disponible"
                            : bien.status === "pending"
                              ? "En négociation"
                              : bien.status === "sold"
                                ? (bien.listingType === "rent" ? "Loué" : "Vendu")
                                : bien.status,
                        },
                        { label: "Ville", value: bien.city },
                        { label: "Quartier", value: bien.neighborhood ?? "—" },
                        { label: "Pays", value: bien.country ?? "—" },
                        {
                          label: "Publié le",
                          value: new Date(bien.created_at).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }),
                        },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between border-b border-border pb-2">
                          <span className="text-muted-foreground text-sm">{label}</span>
                          <span className="font-medium text-foreground text-sm capitalize">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar — masquée pour les agency_user */}
              {!isAgencyUser && (
                <div className="space-y-6">
                  <Card className="sticky top-24">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        {isAvailable
                          ? "Manifestez votre intérêt pour ce bien"
                          : statusLabel}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {isAvailable ? (
                        <>
                          <ScheduleVisitDialog
                            propertyTitle={bien.title}
                            bien={bien}
                            user={user}
                          >
                            <Button variant="outline" className="w-full bg-transparent" size="sm">
                              <CalendarDays className="mr-2 h-4 w-4" />
                              Planifier une visite
                            </Button>
                          </ScheduleVisitDialog>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-3">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            <span>{relativeDate(bien.created_at)} &bull; {bien.agence.name}</span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-3 py-2 text-center">
                          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                            bien.status === "sold" ? "bg-red-500/10" : "bg-amber-500/10"
                          }`}>
                            <Ban className={`h-6 w-6 ${
                              bien.status === "sold" ? "text-red-600" : "text-amber-600"
                            }`} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Ce bien est actuellement{" "}
                            <span className="font-semibold text-foreground">
                              {statusLabel?.toLowerCase()}
                            </span>{" "}
                            et n'est plus disponible à la réservation.
                          </p>
                          <Button variant="outline" className="w-full bg-transparent" size="sm" asChild>
                            <Link href={backHref}>Voir d'autres biens</Link>
                          </Button>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-3 w-full justify-center">
                            <Calendar className="h-3.5 w-3.5 shrink-0" />
                            <span>{relativeDate(bien.created_at)} &bull; {bien.agence.name}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Agence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="font-semibold text-foreground">{bien.agence.name}</p>
                      {bien.agence.address && (
                        <p className="text-sm text-muted-foreground">
                          {bien.agence.address}, {bien.agence.city}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Dialog — connexion requise pour les favoris */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="max-w-sm" aria-describedby={undefined}>
          <DialogHeader>
            <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Heart className="h-7 w-7 text-primary" />
            </div>
            <DialogTitle className="text-center">Connexion requise</DialogTitle>
            <DialogDescription className="text-center">
              Vous devez être connecté pour sauvegarder un bien dans vos favoris.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-2">
            <Button asChild className="w-full">
              <Link href="/login" onClick={() => setShowLoginPrompt(false)}>
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </Link>
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => setShowLoginPrompt(false)}
            >
              Annuler
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}