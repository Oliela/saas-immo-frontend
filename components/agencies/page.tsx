"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AgencyCard } from "@/components/agency-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, MapPin, Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Type aligné sur la structure du serveur
export interface AgencyServer {
  id: number
  name: string
  logo: string | null
  email: string
  phone: string
  address: string
  city: string
  description: string
  web_site: string
  licence_number: string
  is_active: number
  information_certified: number
  terms_accepted: number
  specializations: { id: number; name: string }[]
  users: { id: number; nom: string; prenom: string; phone: string; email: string }[]
  biens: { id: number; title: string; propertyType: string; listingType: string; price: string }[]
  created_at: string
  updated_at: string
}

interface ListingAgenciesPageProps {
  agencies: AgencyServer[]
  loading: boolean
  error: any
}

export default function ListingAgenciesPage({ agencies, loading, error }: ListingAgenciesPageProps) {
  const [search, setSearch] = useState("")
  const [cityFilter, setCityFilter] = useState("all")

  const CITIES = useMemo(
    () => [...new Set(agencies.map((a) => a.city).filter(Boolean))],
    [agencies]
  )

  const filtered = useMemo(() => {
    return agencies.filter((agency) => {
      const matchSearch =
        !search ||
        agency.name.toLowerCase().includes(search.toLowerCase()) ||
        agency.city.toLowerCase().includes(search.toLowerCase()) ||
        agency.specializations.some((s) =>
          s.name.toLowerCase().includes(search.toLowerCase())
        )

      const matchCity =
        cityFilter === "all" ||
        agency.city.toLowerCase() === cityFilter.toLowerCase()

      return matchSearch && matchCity
    })
  }, [search, cityFilter, agencies])

  const hasFilters = search !== "" || cityFilter !== "all"

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        {/* Page Header */}
        <section className="bg-muted py-12 lg:py-16 border-b border-border" style={{ backgroundColor:'#374250'}}>
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold text-foreground lg:text-4xl text-balance" style={{ color:'white' }}>
                Agences partenaires
              </h1>
              <p className="mt-3 text-muted-foreground leading-relaxed" style={{ color:'white' }}>
                Connectez-vous avec des professionnels immobiliers de confiance. Nos agences
                partenaires sont vérifiées et engagées à vous aider à trouver le bien idéal.
              </p>
            </div>

            {/* Search + city filter */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center max-w-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher par nom, ville, spécialité..."
                  className="pl-10 bg-background"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearch("")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Select value={cityFilter} onValueChange={setCityFilter}>
                <SelectTrigger className="w-full sm:w-48 bg-background">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="Toutes les villes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les villes</SelectItem>
                  {CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 text-muted-foreground hover:text-foreground"
                  onClick={() => { setSearch(""); setCityFilter("all") }}
                >
                  <X className="mr-1.5 h-4 w-4" />
                  Effacer
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Agencies Grid */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">

            {/* États : loading / error / vide / résultats */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm">Chargement des agences...</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 rounded-xl border border-dashed border-destructive/40">
                <p className="text-lg font-medium text-destructive mb-2">Erreur de chargement</p>
                <p className="text-sm text-muted-foreground">
                  Impossible de récupérer les agences. Veuillez réessayer.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-8">
                  <p className="text-muted-foreground">
                    <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                    {filtered.length === 1 ? "agence trouvée" : "agences trouvées"}
                    {hasFilters && (
                      <span className="ml-2 text-sm">
                        {search && (
                          <Badge variant="secondary" className="mr-1 gap-1 pr-1">
                            &ldquo;{search}&rdquo;
                            <button onClick={() => setSearch("")} className="ml-1 hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                        {cityFilter !== "all" && (
                          <Badge variant="secondary" className="gap-1 pr-1">
                            <MapPin className="h-3 w-3" />
                            {cityFilter}
                            <button onClick={() => setCityFilter("all")} className="ml-1 hover:text-destructive">
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        )}
                      </span>
                    )}
                  </p>
                </div>

                {filtered.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((agency) => (
                      <AgencyCard key={agency.id} agency={agency} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 rounded-xl border border-dashed border-border">
                    <p className="text-lg font-medium text-foreground mb-2">Aucune agence trouvée</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Aucun résultat pour &ldquo;{search}&rdquo;
                      {cityFilter !== "all" ? ` à ${cityFilter}` : ""}. Essayez une autre recherche.
                    </p>
                    <Button variant="outline" className="bg-transparent" onClick={() => { setSearch(""); setCityFilter("all") }}>
                      Effacer les filtres
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 lg:py-16 bg-muted border-t border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-foreground">Vous êtes une agence immobilière ?</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Rejoignez notre réseau de professionnels de confiance et atteignez des milliers de
              clients potentiels à la recherche du bien idéal.
            </p>
            <a
              href="/register"
              className="inline-flex items-center justify-center mt-6 px-6 py-3 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              Devenir partenaire
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}