"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building, Users, Shield, TrendingUp, Loader2, HomeIcon } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchBar } from "@/components/search-bar"
import { PropertyCard, Property } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { useBiens } from "@/hooks/useBiens"
import { Bien } from "@/types/biensTypes"

const stats = [
  { label: "Propriétés Listées", value: "12,000+" },
  { label: "Clients Satisfaits", value: "8,500+" },
  { label: "Agences Partenaires", value: "450+" },
  { label: "Villes Couvertes", value: "120+" },
]

const features = [
  {
    icon: Building,
    title: "Annonces Immobilières Étendues",
    description: "Parcourez des milliers de propriétés vérifiées provenant d'agences de confiance à travers le pays.",
  },
  {
    icon: Shield,
    title: "Fiable et Vérifiée",
    description: "Toutes les propriétés et les agences sont soigneusement vérifiées pour votre tranquillité.",
  },
  {
    icon: Users,
    title: "Agents Experts",
    description: "Connectez-vous avec des professionnels immobiliers expérimentés qui comprennent vos besoins.",
  },
  {
    icon: TrendingUp,
    title: "Aperçus du Marché",
    description: "Accédez aux données de marché en temps réel et aux estimations de propriétés.",
  },
]

const propertyTypeMap: Record<string, Property["type"]> = {
  appartement: "apartment",
  villa: "villa",
  bureau: "commercial",
  terrain: "commercial",
  maison: "house",
}

type BienWithFavori = Bien & {
  favori_count?: number
}

function bienToProperty(bien: Bien): Property {
  return {
    id: String(bien.id),
    title: bien.title,
    price: parseFloat(bien.price),
    location: `${bien.neighborhood}, ${bien.city}`,
    neighborhood: bien.neighborhood,
    features: bien.features.map((f) => f.name),
    type: propertyTypeMap[bien.propertyType] ?? "apartment",
    listingType: bien.listingType as "sale" | "rent",
    bedrooms: bien.rooms,
    bathrooms: bien.bathrooms,
    area: parseFloat(bien.surface),
    image: bien.images[0]?.url ?? "",
    status: bien.status as Property["status"],
  }
}

export default function HomePage() {
  const { data: biens, loading } = useBiens()

  const featuredProperties = [...biens]
    .sort((a, b) => ((b as BienWithFavori).favori_count ?? 0) - ((a as BienWithFavori).favori_count ?? 0))
    .slice(0, 3)
    .map((bien) => ({ ...bienToProperty(bien), featured: true }))

  const recentProperties = [...biens]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 4)
    .map(bienToProperty)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero-bg.jpg"
              alt="Modern home exterior"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-primary/70" />
          </div>
          
          <div className="relative z-10 w-full px-4 py-16 lg:py-24">z
            <div className="mx-auto max-w-7xl">
              <div className="max-w-2xl mb-10" style={{ margin:'auto', marginBottom:'40px',textAlign: 'center' }}>
                <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl text-balance">
                  Trouvez Votre Maison Parfaite
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-primary-foreground/90">
                  Découvrez des propriétés exceptionnelles à vendre et à louer. Connectez-vous avec des agences de confiance et trouvez la maison qui correspond à votre style de vie.
                </p>
              </div>
              
              <SearchBar variant="hero" />
              
              <div className="mt-8 flex flex-wrap gap-4" style={{ justifyContent:'center' }}>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/buy">
                    Parcourir les Propriétés à Vendre
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                  <Link href="/rent">
                    Trouver des Locations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-card border-y border-border">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Properties */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Propriétés en Vedette</h2>
                <p className="mt-2 text-muted-foreground">Annonces premium sélectionnées pour vous</p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex bg-transparent">
                <Link href="/buy">
                  Voir Tous
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : featuredProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                <HomeIcon className="h-12 w-12 opacity-30" />
                <p className="text-lg font-medium">Aucun bien trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
            
            <div className="mt-8 text-center sm:hidden">
              <Button variant="outline" asChild>
                <Link href="/buy">
                  Voir Toutes les Propriétés
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 lg:py-24 bg-muted">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground">Pourquoi Choisir GalleConnectPro</h2>
              <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
                Nous rendons la recherche de votre propriété parfaite simple, transparente et sans stress
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="bg-card rounded-xl p-6 border border-border">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Listings */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-foreground">Annonces Récentes</h2>
                <p className="mt-2 text-muted-foreground">Propriétés fraîchement ajoutées à notre plateforme</p>
              </div>
              <Button variant="outline" asChild className="hidden sm:flex bg-transparent">
                <Link href="/buy">
                  Explorer Plus
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recentProperties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
                <HomeIcon className="h-12 w-12 opacity-30" />
                <p className="text-lg font-medium">Aucun bien trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {recentProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary">
          <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl text-balance">
              Prêt à Trouver la Maison de Vos Rêves?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
              Rejoignez des milliers de propriétaires heureux qui ont trouvé leur propriété parfaite grâce à GalleConnectPro.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">
                  Commencer Gratuitement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10" asChild>
                <Link href="/agencies">
                  Parcourir les Agences
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
