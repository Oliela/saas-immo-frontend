"use client"

import { useState } from "react"
import { Search, MapPin, Banknote, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  variant?: "hero" | "compact"
  onSearch?: (filters: SearchFilters) => void
}

export interface SearchFilters {
  location: string
  propertyType: string
  minPrice: string
  maxPrice: string
}

export function SearchBar({ variant = "hero", onSearch }: SearchBarProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
  })

  const handleSearch = () => {
    onSearch?.(filters)
    // window.location.href = `/search?location=${filters.location}&propertyType=${filters.propertyType}&minPrice=${filters.minPrice}&maxPrice=${filters.maxPrice}`
     window.location.href ="/buy"
  }

  if (variant === "compact") {
    return (
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-card rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Localisation"
            className="pl-9"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </div>
        <Select
          value={filters.propertyType}
          onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Type de bien" />
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
        <Select
          value={filters.maxPrice}
          onValueChange={(value) => setFilters({ ...filters, maxPrice: value })}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Prix max" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1000000">1 000 000 FCFA</SelectItem>
            <SelectItem value="5000000">5 000 000 FCFA</SelectItem>
            <SelectItem value="10000000">10 000 000 FCFA</SelectItem>
            <SelectItem value="25000000">25 000 000 FCFA</SelectItem>
            <SelectItem value="50000000">50 000 000 FCFA</SelectItem>
            <SelectItem value="100000000">100 000 000+ FCFA</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className="shrink-0">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-2xl border border-border shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Localisation
            </label>
            <Input
              placeholder="Ville, quartier..."
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              Type de bien
            </label>
            <Select
              value={filters.propertyType}
              onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir un type" />
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
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              Budget min
            </label>
            <Select
              value={filters.minPrice}
              onValueChange={(value) => setFilters({ ...filters, minPrice: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pas de minimum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Pas de minimum</SelectItem>
                <SelectItem value="500000">500 000 FCFA</SelectItem>
                <SelectItem value="1000000">1 000 000 FCFA</SelectItem>
                <SelectItem value="5000000">5 000 000 FCFA</SelectItem>
                <SelectItem value="10000000">10 000 000 FCFA</SelectItem>
                <SelectItem value="50000000">50 000 000 FCFA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Banknote className="h-4 w-4 text-muted-foreground" />
              Budget max
            </label>
            <Select
              value={filters.maxPrice}
              onValueChange={(value) => setFilters({ ...filters, maxPrice: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Pas de maximum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1000000">1 000 000 FCFA</SelectItem>
                <SelectItem value="5000000">5 000 000 FCFA</SelectItem>
                <SelectItem value="10000000">10 000 000 FCFA</SelectItem>
                <SelectItem value="25000000">25 000 000 FCFA</SelectItem>
                <SelectItem value="50000000">50 000 000 FCFA</SelectItem>
                <SelectItem value="100000000">100 000 000+ FCFA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={handleSearch} size="lg" className="w-full mt-6">
          <Search className="h-5 w-5 mr-2" />
          Rechercher des biens
        </Button>
      </div>
    </div>
  )
}
