"use client"

import { useState, useMemo } from "react"
import { PropertyCard, type Property } from "@/components/property-card"
import { SearchBar, type SearchFilters } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Grid3X3, List } from "lucide-react"

interface PropertiesListingProps {
  properties: Property[]
  title: string
  description: string
}

export function PropertiesListing({ properties, title, description }: PropertiesListingProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
  })
  const [sortBy, setSortBy] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredProperties = useMemo(() => {
    let result = [...properties]

    // Filter by location
    if (filters.location) {
      result = result.filter((p) =>
        p.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Filter by property type
    if (filters.propertyType && filters.propertyType !== "all") {
      result = result.filter((p) => p.type === filters.propertyType)
    }

    // Filter by min price
    if (filters.minPrice) {
      const min = Number.parseInt(filters.minPrice)
      result = result.filter((p) => p.price >= min)
    }

    // Filter by max price
    if (filters.maxPrice) {
      const max = Number.parseInt(filters.maxPrice)
      result = result.filter((p) => p.price <= max)
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        result.sort((a, b) => b.price - a.price)
        break
      case "area":
        result.sort((a, b) => b.area - a.area)
        break
      default:
        // newest - keep original order
        break
    }

    return result
  }, [properties, filters, sortBy])

  return (
    <div className="py-8 lg:py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground lg:text-4xl">{title}</h1>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar variant="compact" onSearch={setFilters} />
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">{filteredProperties.length}</span>{" "}
            properties found
          </p>

          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="area">Largest Area</SelectItem>
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
                <span className="sr-only">Grid view</span>
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
                <span className="sr-only">List view</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
                : "flex flex-col gap-4"
            }
          >
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">No properties match your criteria.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
