"use client"

import Link from "next/link"
import { useParams, notFound } from "next/navigation"
import {
  MapPin, Phone, Mail, Globe, Building2, Clock,
  CheckCircle, ChevronRight, MessageSquare, Award, Loader2, BadgeCheck,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertyCard } from "@/components/property-card"
import { ContactAgencyDialog } from "@/components/contact-agency-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import axiosInstance from "@/lib/axios"
import { useEffect, useState } from "react"

// ── Types ──────────────────────────────────────────────────────────────────
interface BienImage {
  id: number
  url: string
  alt: string | null
  bien_id: number
}

interface Bien {
  id: number
  title: string
  propertyType: string
  listingType: "sale" | "rent"
  price: string
  status: string
  city: string
  neighborhood: string
  address: string
  surface: string
  rooms: number
  bathrooms: number | null
  floor: number | null
  furnished: number
  description: string | null
  images: BienImage[]
}

interface AgencyUser {
  id: number
  nom: string
  prenom: string
  phone: string
  email: string
  account_type: string
  profile: {
    first_name: string
    last_name: string
    bio: string | null
    specialization: string | null
    license_number: string | null
  } | null
}

interface Specialization {
  id: number
  name: string
}

interface AgencyDetail {
  id: number
  name: string
  logo: string | null
  email: string
  phone: string
  city: string
  address: string
  description: string
  web_site: string
  licence_number: string
  information_certified: number
  is_active: number
  specializations: Specialization[]
  users: AgencyUser[]
  biens: Bien[]
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function formatPrice(price: string, listingType: string) {
  const num = parseFloat(price)
  const formatted = new Intl.NumberFormat("fr-FR").format(num)
  return listingType === "rent" ? `${formatted} FCFA/mois` : `${formatted} FCFA`
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  appartement: "Appartement",
  maison: "Maison",
  villa: "Villa",
  studio: "Studio",
  loft: "Loft",
  duplex: "Duplex",
  penthouse: "Penthouse",
  terrain: "Terrain",
  terrain_agricole: "Terrain agricole",
  local_commercial: "Local commercial",
  boutique: "Boutique",
  bureau: "Bureau",
  entrepot: "Entrepôt",
  immeuble: "Immeuble",
  usine: "Usine",
  hotel: "Hôtel",
  maison_hotes: "Maison d'hôtes",
  ecole: "École",
  campement: "Campement",
}

// ── Component ────────────────────────────────────────────────────────────────
export default function AgencyDetailsPage() {
  const params = useParams<{ id: string }>()
  const [agency, setAgency] = useState<AgencyDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNotFound, setIsNotFound] = useState(false)

  useEffect(() => {
    if (!params.id) return
    const fetchAgency = async () => {
      try {
        const res = await axiosInstance.get(`/api/agency/${params.id}`)
        // Le serveur enveloppe dans { agency: {...} }
        setAgency(res.data.agency ?? res.data)
      } catch (error: any) {
        if (error?.response?.status === 404) setIsNotFound(true)
        console.error("Erreur chargement agence :", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAgency()
  }, [params.id])

  // ── États ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Chargement de l'agence...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isNotFound || !agency) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold">Agence introuvable</p>
            <p className="text-sm text-muted-foreground mt-1">Cette agence n'existe pas ou a été supprimée.</p>
            <Button asChild className="mt-4"><Link href="/agencies">Retour aux agences</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const biens = agency.biens ?? []
  const users = agency.users ?? []

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* ── Hero ── */}
        <div className="relative h-[280px] md:h-[360px] bg-muted flex items-end" style={{ backgroundColor: "#374250" }}>
          {agency.logo && (
            <img src={agency.logo} alt={agency.name} className="absolute inset-0 w-full h-full object-cover opacity-30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <div className="relative w-full px-4 pb-8 md:px-10">
            <div className="mx-auto max-w-7xl flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="flex items-center gap-4">
                {/* Logo ou icône */}
                <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-card shadow-lg border shrink-0">
                  {agency.logo
                    ? <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover rounded-xl" />
                    : <Building2 className="h-10 w-10 text-primary" />
                  }
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">{agency.name}</h1>
                    {agency.information_certified === 1 && (
                      <Badge className="gap-1 bg-green-600 text-white text-xs">
                        <BadgeCheck className="h-3 w-3" /> Certifiée
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-white/80 text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{agency.address}, {agency.city}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ContactAgencyDialog agencyName={agency.name} agencyId={agency.id} currencySymbol="FCFA">
                  <Button size="lg" className="gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Contacter l'agence
                  </Button>
                </ContactAgencyDialog>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="#biens">
                    Voir les biens <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <div className="grid gap-8 lg:grid-cols-3">

            {/* ── Colonne principale ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* À propos */}
              <Card>
                <CardHeader>
                  <CardTitle>À propos de {agency.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {agency.description}
                  </p>

                  {/* Spécialisations */}
                  {agency.specializations.length > 0 && (
                    <div className="pt-4">
                      <h4 className="text-sm font-medium mb-3">Spécialités</h4>
                      <div className="flex flex-wrap gap-2">
                        {agency.specializations.map((s) => (
                          <Badge key={s.id} variant="secondary" className="rounded-full">{s.name}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{biens.length}</div>
                      <div className="text-sm text-muted-foreground">Biens</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">0</div>
                      <div className="text-sm text-muted-foreground">Note</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{users.length}</div>
                      <div className="text-sm text-muted-foreground">Agents</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Équipe */}
              {users.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" /> Notre équipe
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {users.map((user) => {
                        const initials = `${user.nom?.[0] ?? ""}${user.prenom?.[0] ?? ""}`.toUpperCase()
                        return (
                          <div key={user.id} className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary shrink-0">
                              {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-foreground">{user.prenom} {user.nom}</h4>
                              <p className="text-sm text-muted-foreground capitalize">{user.account_type.replace("_", " ")}</p>
                              {user.profile?.bio && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{user.profile.bio}</p>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" asChild className="bg-transparent shrink-0">
                              <a href={`mailto:${user.email}`}><MessageSquare className="h-4 w-4" /></a>
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Biens */}
              <section id="biens">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">
                    Annonces actives
                    <span className="ml-2 text-base font-normal text-muted-foreground">({biens.length})</span>
                  </h2>
                </div>

                {biens.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
                    Aucun bien disponible pour cette agence.
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {biens.map((bien) => (
                      <Card key={bien.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                        {/* Image */}
                        <div className="relative aspect-[16/9] bg-muted flex items-center justify-center overflow-hidden">
                          {bien.images?.[0] ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_API_URL}${bien.images[0].url}`}
                              alt={bien.images[0].alt ?? bien.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <Building2 className="h-12 w-12 text-muted-foreground/30" />
                          )}
                          <div className="absolute top-3 left-3 flex gap-2">
                            <Badge className={bien.listingType === "rent" ? "bg-blue-600 text-white" : "bg-emerald-600 text-white"}>
                              {bien.listingType === "rent" ? "Location" : "Vente"}
                            </Badge>
                            <Badge variant="secondary" className="capitalize">
                              {PROPERTY_TYPE_LABELS[bien.propertyType] ?? bien.propertyType}
                            </Badge>
                          </div>
                        </div>

                        <CardContent className="p-4 space-y-2">
                          <h3 className="font-semibold text-foreground line-clamp-1">{bien.title}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                            <span className="line-clamp-1">{bien.neighborhood}, {bien.city}</span>
                          </div>
                          <div className="flex items-center justify-between pt-1">
                            <span className="font-bold text-primary">{formatPrice(bien.price, bien.listingType)}</span>
                            <div className="flex gap-3 text-xs text-muted-foreground">
                              {bien.surface && <span>{bien.surface} m²</span>}
                              {bien.rooms && <span>{bien.rooms} pièces</span>}
                            </div>
                          </div>
                        </CardContent>

                        <div className="px-4 pb-4">
                          <Button asChild className="w-full" size="sm">
                            <Link href={`/property/${bien.id}`}>Voir le bien</Link>
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* ── Sidebar ── */}
            <div className="space-y-6">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-lg">Informations de contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Adresse</p>
                      <p className="text-sm text-muted-foreground">{agency.address}, {agency.city}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Téléphone</p>
                      <p className="text-sm text-muted-foreground">{agency.phone}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">E-mail</p>
                      <p className="text-sm text-muted-foreground break-all">{agency.email}</p>
                    </div>
                  </div>
                  {agency.web_site && (
                    <>
                      <Separator />
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <Globe className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Site web</p>
                          <a href={agency.web_site} target="_blank" rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline break-all">
                            {agency.web_site.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                  <Separator />
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Horaires d'ouverture</p>
                      <p className="text-sm text-muted-foreground">
                        Lun – Ven : 09:00 – 18:00<br />
                        Sam : 10:00 – 16:00<br />
                        Dim : Fermé
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <ContactAgencyDialog agencyId={agency.id} agencyName={agency.name} currencySymbol="FCFA">
                      <Button className="w-full" size="lg">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Envoyer un message
                      </Button>
                    </ContactAgencyDialog>
                    <Button variant="outline" className="w-full bg-transparent" size="lg" asChild>
                      <a href={`tel:${agency.phone}`}>
                        <Phone className="mr-2 h-4 w-4" /> Appeler
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Trust indicators */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  {[
                    "Agence vérifiée",
                    "Agréée et assurée",
                    agency.information_certified === 1 ? "Informations certifiées" : null,
                    "Transactions sécurisées",
                  ].filter(Boolean).map((label) => (
                    <div key={label} className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
                      <span className="text-sm">{label}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}