"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Heart,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Trash2,
  Grid3X3,
  List,
  ArrowUpDown,
  Filter,
  ExternalLink,
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

const favoriteProperties = [
  {
    id: 1,
    title: "Modern Loft in Downtown",
    price: 2500,
    type: "rent",
    location: "Downtown, Los Angeles",
    beds: 2,
    baths: 2,
    sqft: 1200,
    image: "/images/property-1.jpg",
    addedDate: "Jan 25, 2026",
    status: "visiting",
    visitDate: "Feb 5, 2026",
  },
  {
    id: 2,
    title: "Cozy Studio Apartment",
    price: 1800,
    type: "rent",
    location: "Arts District, LA",
    beds: 1,
    baths: 1,
    sqft: 650,
    image: "/images/property-3.jpg",
    addedDate: "Jan 22, 2026",
    status: "saved",
  },
  {
    id: 3,
    title: "Luxury Penthouse Suite",
    price: 4500,
    type: "rent",
    location: "Beverly Hills, CA",
    beds: 3,
    baths: 3,
    sqft: 2500,
    image: "/images/property-5.jpg",
    addedDate: "Jan 20, 2026",
    status: "saved",
  },
  {
    id: 4,
    title: "Charming Victorian House",
    price: 850000,
    type: "sale",
    location: "San Francisco, CA",
    beds: 4,
    baths: 2,
    sqft: 2200,
    image: "/images/property-6.jpg",
    addedDate: "Jan 18, 2026",
    status: "saved",
  },
  {
    id: 5,
    title: "Industrial Loft Conversion",
    price: 2200,
    type: "rent",
    location: "Arts District, LA",
    beds: 1,
    baths: 1,
    sqft: 900,
    image: "/images/property-7.jpg",
    addedDate: "Jan 15, 2026",
    status: "visited",
    feedback: "Loved the space but location is too far from work",
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "visiting":
      return <Badge className="bg-accent text-accent-foreground">Visit Scheduled</Badge>
    case "visited":
      return <Badge variant="secondary">Visited</Badge>
    case "saved":
      return <Badge variant="outline" className="bg-transparent">Saved</Badge>
    default:
      return null
  }
}

export default function FavoritesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("date")
  const [filterType, setFilterType] = useState("all")

  const filteredProperties = favoriteProperties.filter((p) => {
    if (filterType === "all") return true
    if (filterType === "rent") return p.type === "rent"
    if (filterType === "sale") return p.type === "sale"
    return true
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">My Favorites</h1>
          <p className="text-muted-foreground">
            {favoriteProperties.length} properties saved
          </p>
        </div>
        <Button asChild>
          <Link href="/buy">
            Browse More Properties
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="rent">For Rent</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Date Added</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
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

      {/* Properties Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden group">
              <div className="relative aspect-[4/3]">
                <Image
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {getStatusBadge(property.status)}
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove from favorites?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove {property.title} from your saved properties.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-transparent">Cancel</AlertDialogCancel>
                      <AlertDialogAction>Remove</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Badge className="absolute bottom-3 left-3 bg-card/90 text-card-foreground">
                  {property.type === "rent" ? "For Rent" : "For Sale"}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-foreground mb-1 line-clamp-1">{property.title}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  {property.location}
                </div>
                <p className="text-lg font-semibold text-foreground mb-3">
                  ${property.price.toLocaleString()}
                  {property.type === "rent" && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    {property.beds}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    {property.baths}
                  </span>
                  <span className="flex items-center gap-1">
                    <Square className="h-4 w-4" />
                    {property.sqft}
                  </span>
                </div>
                {property.status === "visiting" && (
                  <div className="flex items-center gap-2 text-sm text-accent mb-3">
                    <Calendar className="h-4 w-4" />
                    Visit on {property.visitDate}
                  </div>
                )}
                {property.feedback && (
                  <p className="text-xs text-muted-foreground italic mb-3">"{property.feedback}"</p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent" asChild>
                    <Link href={`/property/${property.id}`}>
                      View Details
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                  {property.status === "saved" && (
                    <Button className="flex-1" asChild>
                      <Link href="/portal/visits">
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule Visit
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                  <Image
                    src={property.image || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-3 left-3 bg-card/90 text-card-foreground">
                    {property.type === "rent" ? "For Rent" : "For Sale"}
                  </Badge>
                </div>
                <CardContent className="p-4 flex-1">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{property.title}</h3>
                          {getStatusBadge(property.status)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {property.location}
                        </div>
                      </div>
                      <p className="text-lg font-semibold text-foreground whitespace-nowrap">
                        ${property.price.toLocaleString()}
                        {property.type === "rent" && <span className="text-sm font-normal text-muted-foreground">/mo</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        {property.beds} beds
                      </span>
                      <span className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        {property.baths} baths
                      </span>
                      <span className="flex items-center gap-1">
                        <Square className="h-4 w-4" />
                        {property.sqft} sqft
                      </span>
                    </div>
                    {property.status === "visiting" && (
                      <div className="flex items-center gap-2 text-sm text-accent mb-3">
                        <Calendar className="h-4 w-4" />
                        Visit scheduled for {property.visitDate}
                      </div>
                    )}
                    {property.feedback && (
                      <p className="text-sm text-muted-foreground italic mb-3">"{property.feedback}"</p>
                    )}
                    <div className="flex gap-2 mt-auto">
                      <Button variant="outline" size="sm" asChild className="bg-transparent">
                        <Link href={`/property/${property.id}`}>
                          View Details
                        </Link>
                      </Button>
                      {property.status === "saved" && (
                        <Button size="sm">
                          <Calendar className="mr-2 h-4 w-4" />
                          Schedule Visit
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive ml-auto">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remove from favorites?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will remove {property.title} from your saved properties.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-transparent">Cancel</AlertDialogCancel>
                            <AlertDialogAction>Remove</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredProperties.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">
              Start browsing properties and save your favorites to track them here.
            </p>
            <Button asChild>
              <Link href="/buy">Browse Properties</Link>
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
