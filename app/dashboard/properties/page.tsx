"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Grid3X3,
  List,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { properties } from "@/lib/mock-data"

export default function PropertiesPage() {
  const [view, setView] = useState<"grid" | "list">("grid")
  const [filter, setFilter] = useState("all")

  const formatPrice = (price: number, listingType: "buy" | "rent") => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
    return listingType === "rent" ? `${formatted}/mo` : formatted
  }

  const filteredProperties = properties.filter((property) => {
    if (filter === "all") return true
    if (filter === "sale") return property.listingType === "buy"
    if (filter === "rent") return property.listingType === "rent"
    return true
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Properties</h1>
          <p className="text-muted-foreground">Manage your property listings</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/properties/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search properties..." className="pl-9" />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "list")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="grid">
                    <Grid3X3 className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="list">
                    <List className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total Listings</p>
              <p className="text-2xl font-bold text-foreground">{properties.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">For Sale</p>
              <p className="text-2xl font-bold text-foreground">
                {properties.filter((p) => p.listingType === "buy").length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">For Rent</p>
              <p className="text-2xl font-bold text-foreground">
                {properties.filter((p) => p.listingType === "rent").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Grid/List */}
      {view === "grid" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant={property.listingType === "rent" ? "secondary" : "default"}>
                    {property.listingType === "rent" ? "Rent" : "Sale"}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="secondary" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-foreground truncate">{property.title}</h3>
                <p className="text-sm text-muted-foreground truncate">{property.location}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="font-bold text-foreground">
                    {formatPrice(property.price, property.listingType)}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{property.bedrooms} bd</span>
                    <span>|</span>
                    <span>{property.bathrooms} ba</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{property.area} sqft</span>
                  <Badge variant="outline" className="capitalize">{property.type}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Property</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Location</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Price</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Details</th>
                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProperties.map((property) => (
                    <tr key={property.id} className="border-b border-border last:border-0">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={property.image || "/placeholder.svg"}
                              alt={property.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground truncate max-w-[200px]">{property.title}</p>
                            <Badge variant={property.listingType === "rent" ? "secondary" : "default"} className="mt-1">
                              {property.listingType === "rent" ? "Rent" : "Sale"}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell">
                        <p className="text-sm text-muted-foreground">{property.location}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-foreground">
                          {formatPrice(property.price, property.listingType)}
                        </p>
                      </td>
                      <td className="py-4 px-4 hidden sm:table-cell">
                        <Badge variant="outline" className="capitalize">{property.type}</Badge>
                      </td>
                      <td className="py-4 px-4 hidden lg:table-cell">
                        <p className="text-sm text-muted-foreground">
                          {property.bedrooms} bd | {property.bathrooms} ba | {property.area} sqft
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
