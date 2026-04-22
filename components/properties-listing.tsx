"use client"

import { useState, useMemo } from "react"
import { PropertyCard, type Property } from "@/components/property-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Grid3X3, List, Search, SlidersHorizontal, X } from "lucide-react"
import { CITIES, NEIGHBORHOODS } from "@/data/senegal-locations"
import { cn } from "@/lib/utils"
import type { ApiFeature } from "@/hooks/useFeatures"

interface PropertiesListingProps {
  properties: Property[]
  features: ApiFeature[]
  title: string
  description: string
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: "Appartement",
  house: "Maison",
  villa: "Villa",
  studio: "Studio",
  commercial: "Commercial",
}

function FilterPanel({
  filters,
  setFilters,
  activeCount,
  onClear,
  features,
}: {
  filters: any
  setFilters: (f: any) => void
  activeCount: number
  onClear: () => void
  features: ApiFeature[]
}) {
  return (
    <div className="space-y-6">
      {/* City */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">Ville</Label>
        <Select value={filters.city} onValueChange={(v) => setFilters({ ...filters, city: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Toutes les villes" />
          </SelectTrigger>
          <SelectContent>
            {CITIES.map((c) => (
              <SelectItem key={c} value={c === "Toutes les villes" ? "all" : c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Neighborhood */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">Quartier</Label>
        <Select value={filters.neighborhood} onValueChange={(v) => setFilters({ ...filters, neighborhood: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les quartiers" />
          </SelectTrigger>
          <SelectContent>
            {NEIGHBORHOODS.map((n) => (
              <SelectItem key={n} value={n === "Tous les quartiers" ? "all" : n}>{n}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Property Type */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-foreground">Type de bien</Label>
        <Select value={filters.propertyType} onValueChange={(v) => setFilters({ ...filters, propertyType: v })}>
          <SelectTrigger>
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="apartment">Appartement</SelectItem>
            <SelectItem value="house">Maison</SelectItem>
            <SelectItem value="villa">Villa</SelectItem>
            <SelectItem value="studio">Studio</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">Fourchette de prix (FCFA)</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Min</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Max</Label>
            <Input
              type="number"
              placeholder="Sans limite"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Surface */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">Surface (m²)</Label>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Min</Label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minArea}
              onChange={(e) => setFilters({ ...filters, minArea: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Max</Label>
            <Input
              type="number"
              placeholder="Sans limite"
              value={filters.maxArea}
              onChange={(e) => setFilters({ ...filters, maxArea: e.target.value })}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Rooms */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">Chambres</Label>
        <div className="flex flex-wrap gap-2">
          {["any", "1", "2", "3", "4", "5+"].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setFilters({ ...filters, bedrooms: val })}
              className={cn(
                "h-9 min-w-[40px] rounded-lg border px-3 text-sm font-medium transition-all",
                filters.bedrooms === val
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/50"
              )}
            >
              {val === "any" ? "Peu importe" : val}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">Salles de bain</Label>
        <div className="flex flex-wrap gap-2">
          {["any", "1", "2", "3", "4+"].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => setFilters({ ...filters, bathrooms: val })}
              className={cn(
                "h-9 min-w-[40px] rounded-lg border px-3 text-sm font-medium transition-all",
                filters.bathrooms === val
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-foreground hover:border-primary/50"
              )}
            >
              {val === "any" ? "Peu importe" : val}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Features — dynamiques depuis l'API */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">Caractéristiques</Label>
        <div className="space-y-2">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center gap-2">
              <Checkbox
                id={`feature-${feature.id}`}
                checked={filters.features.includes(feature.name)}
                onCheckedChange={(checked) => {
                  const next = checked
                    ? [...filters.features, feature.name]
                    : filters.features.filter((f: string) => f !== feature.name)
                  setFilters({ ...filters, features: next })
                }}
              />
              <label htmlFor={`feature-${feature.id}`} className="text-sm text-foreground cursor-pointer">
                {feature.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {activeCount > 0 && (
        <Button variant="outline" className="w-full bg-transparent" onClick={onClear}>
          <X className="mr-2 h-4 w-4" />
          Effacer tous les filtres ({activeCount})
        </Button>
      )}
    </div>
  )
}

const defaultFilters = {
  search: "",
  city: "all",
  neighborhood: "all",
  propertyType: "all",
  minPrice: "",
  maxPrice: "",
  minArea: "",
  maxArea: "",
  bedrooms: "any",
  bathrooms: "any",
  features: [] as string[],
}

export function PropertiesListing({ properties, features, title, description }: PropertiesListingProps) {
  const [filters, setFilters] = useState(defaultFilters)
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.city !== "all") count++
    if (filters.neighborhood !== "all") count++
    if (filters.propertyType !== "all") count++
    if (filters.minPrice) count++
    if (filters.maxPrice) count++
    if (filters.minArea) count++
    if (filters.maxArea) count++
    if (filters.bedrooms !== "any") count++
    if (filters.bathrooms !== "any") count++
    count += filters.features.length
    return count
  }, [filters])

  const filteredProperties = useMemo(() => {
    let result = [...properties]

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (p) => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)
      )
    }
    if (filters.city !== "all") {
      result = result.filter((p) => p.location.toLowerCase().includes(filters.city.toLowerCase()))
    }
    if (filters.neighborhood !== "all") {
      result = result.filter((p) =>
        p.neighborhood.toLowerCase() === filters.neighborhood.toLowerCase()
      )
    }
    if (filters.propertyType !== "all") {
      result = result.filter((p) => p.type === filters.propertyType)
    }
    if (filters.minPrice) {
      result = result.filter((p) => p.price >= parseInt(filters.minPrice))
    }
    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= parseInt(filters.maxPrice))
    }
    if (filters.minArea) {
      result = result.filter((p) => p.area >= parseInt(filters.minArea))
    }
    if (filters.maxArea) {
      result = result.filter((p) => p.area <= parseInt(filters.maxArea))
    }
    if (filters.bedrooms !== "any") {
      const n = parseInt(filters.bedrooms)
      result = result.filter((p) =>
        filters.bedrooms === "5+" ? p.bedrooms >= 5 : p.bedrooms === n
      )
    }
    if (filters.bathrooms !== "any") {
      const n = parseInt(filters.bathrooms)
      result = result.filter((p) =>
        filters.bathrooms === "4+" ? p.bathrooms >= 4 : p.bathrooms === n
      )
    }
    if (filters.features.length > 0) {
      result = result.filter((p) =>
        filters.features.every((f: string) => p.features.includes(f))
      )
    }

    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break
      case "price-high": result.sort((a, b) => b.price - a.price); break
      case "area": result.sort((a, b) => b.area - a.area); break
    }

    return result
  }, [properties, filters, sortBy])

  const clearFilters = () => setFilters(defaultFilters)

  return (
    <div className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground lg:text-4xl text-balance">{title}</h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>

        {/* Search bar + mobile filter trigger */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par titre ou localisation..."
              className="pl-9"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden bg-transparent relative">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtres
                {activeFilterCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader className="mb-6">
                <SheetTitle>Filtres</SheetTitle>
              </SheetHeader>
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                activeCount={activeFilterCount}
                onClear={clearFilters}
                features={features}
              />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-foreground flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtres
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="text-xs">{activeFilterCount}</Badge>
                  )}
                </h2>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
                  >
                    Tout effacer
                  </button>
                )}
              </div>
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                activeCount={activeFilterCount}
                onClear={clearFilters}
                features={features}
              />
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">{filteredProperties.length}</span>{" "}
                {filteredProperties.length === 1 ? "bien" : "biens"} trouvés
              </p>
              <div className="flex items-center gap-3">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Trier par" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Plus récents d'abord</SelectItem>
                    <SelectItem value="price-low">Prix : croissant</SelectItem>
                    <SelectItem value="price-high">Prix : décroissant</SelectItem>
                    <SelectItem value="area">Plus grande surface</SelectItem>
                  </SelectContent>
                </Select>
                <div className="hidden sm:flex items-center border border-border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                    <span className="sr-only">Vue grille</span>
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">Vue liste</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Active filter chips */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {filters.search && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Recherche : {filters.search}
                    <button onClick={() => setFilters({ ...filters, search: "" })} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.city !== "all" && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Ville : {filters.city}
                    <button onClick={() => setFilters({ ...filters, city: "all" })} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.propertyType !== "all" && (
                  <Badge variant="secondary" className="gap-1 pr-1 capitalize">
                    {PROPERTY_TYPE_LABELS[filters.propertyType] || filters.propertyType}
                    <button onClick={() => setFilters({ ...filters, propertyType: "all" })} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(filters.minPrice || filters.maxPrice) && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Prix : {filters.minPrice || "0"} – {filters.maxPrice || "∞"} FCFA
                    <button onClick={() => setFilters({ ...filters, minPrice: "", maxPrice: "" })} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(filters.minArea || filters.maxArea) && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    Surface : {filters.minArea || "0"} – {filters.maxArea || "∞"} m²
                    <button onClick={() => setFilters({ ...filters, minArea: "", maxArea: "" })} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.bedrooms !== "any" && (
                  <Badge variant="secondary" className="gap-1 pr-1">
                    {filters.bedrooms} chambre{filters.bedrooms !== "1" ? "s" : ""}
                    <button onClick={() => setFilters({ ...filters, bedrooms: "any" })} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {filters.features.map((f: string) => (
                  <Badge key={f} variant="secondary" className="gap-1 pr-1">
                    {f}
                    <button
                      onClick={() => setFilters({ ...filters, features: filters.features.filter((x: string) => x !== f) })}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {filteredProperties.length > 0 ? (
              <div className={viewMode === "grid"
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                : "flex flex-col gap-4"
              }>
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 rounded-xl border border-dashed border-border">
                <p className="text-lg font-medium text-foreground mb-2">Aucun bien trouvé</p>
                <p className="text-sm text-muted-foreground mb-4">Essayez de modifier ou d'effacer vos filtres.</p>
                <Button variant="outline" className="bg-transparent" onClick={clearFilters}>
                  Effacer tous les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}