"use client"

import { useState } from "react"
import { Search, MapPin, DollarSign, Home } from "lucide-react"
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
  }

  if (variant === "compact") {
    return (
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-card rounded-xl border border-border shadow-sm">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Location"
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
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="house">House</SelectItem>
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
            <SelectValue placeholder="Max Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100000">$100,000</SelectItem>
            <SelectItem value="250000">$250,000</SelectItem>
            <SelectItem value="500000">$500,000</SelectItem>
            <SelectItem value="750000">$750,000</SelectItem>
            <SelectItem value="1000000">$1,000,000</SelectItem>
            <SelectItem value="2000000">$2,000,000+</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className="shrink-0">
          <Search className="h-4 w-4 mr-2" />
          Search
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
              Location
            </label>
            <Input
              placeholder="City, neighborhood..."
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              Property Type
            </label>
            <Select
              value={filters.propertyType}
              onValueChange={(value) => setFilters({ ...filters, propertyType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Min Budget
            </label>
            <Select
              value={filters.minPrice}
              onValueChange={(value) => setFilters({ ...filters, minPrice: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="No minimum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">No minimum</SelectItem>
                <SelectItem value="50000">$50,000</SelectItem>
                <SelectItem value="100000">$100,000</SelectItem>
                <SelectItem value="200000">$200,000</SelectItem>
                <SelectItem value="500000">$500,000</SelectItem>
                <SelectItem value="1000000">$1,000,000</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              Max Budget
            </label>
            <Select
              value={filters.maxPrice}
              onValueChange={(value) => setFilters({ ...filters, maxPrice: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="No maximum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100000">$100,000</SelectItem>
                <SelectItem value="250000">$250,000</SelectItem>
                <SelectItem value="500000">$500,000</SelectItem>
                <SelectItem value="750000">$750,000</SelectItem>
                <SelectItem value="1000000">$1,000,000</SelectItem>
                <SelectItem value="2000000">$2,000,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={handleSearch} size="lg" className="w-full mt-6">
          <Search className="h-5 w-5 mr-2" />
          Search Properties
        </Button>
      </div>
    </div>
  )
}
