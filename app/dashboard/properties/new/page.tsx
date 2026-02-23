"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  X,
  MapPin,
  Plus,
  Building2,
  Home,
  Landmark,
  Store,
  ImageIcon,
  Video,
  User,
  Search,
  AlertCircle,
  Save,
  Send,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const steps = [
  { id: 1, name: "Basic Info", description: "Property details" },
  { id: 2, name: "Location", description: "Address & map" },
  { id: 3, name: "Details", description: "Specifications" },
  { id: 4, name: "Media", description: "Photos & videos" },
  { id: 5, name: "Owner", description: "Property owner" },
]

const propertyTypes = [
  { value: "apartment", label: "Apartment", icon: Building2 },
  { value: "house", label: "House", icon: Home },
  { value: "land", label: "Land", icon: Landmark },
  { value: "commercial", label: "Commercial", icon: Store },
]

const mockOwners = [
  { id: "1", name: "John Smith", email: "john@example.com", phone: "+1 555-0123", properties: 3 },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com", phone: "+1 555-0456", properties: 5 },
  { id: "3", name: "Michael Brown", email: "michael@example.com", phone: "+1 555-0789", properties: 2 },
]

export default function NewPropertyPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Basic Info
    title: "",
    propertyType: "",
    listingType: "sale",
    price: "",
    status: "available",
    // Location
    city: "",
    neighborhood: "",
    address: "",
    // Details
    surface: "",
    rooms: "",
    bathrooms: "",
    floor: "",
    furnished: false,
    description: "",
    // Media
    images: [] as string[],
    video: "",
    // Owner
    ownerId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    "/images/property-1.jpg",
    "/images/property-2.jpg",
  ])
  const [isDragging, setIsDragging] = useState(false)
  const [selectedOwner, setSelectedOwner] = useState<typeof mockOwners[0] | null>(null)
  const [ownerSearch, setOwnerSearch] = useState("")
  const [showNewOwnerDialog, setShowNewOwnerDialog] = useState(false)

  const progress = (currentStep / steps.length) * 100

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.title) newErrors.title = "Title is required"
      if (!formData.propertyType) newErrors.propertyType = "Property type is required"
      if (!formData.price) newErrors.price = "Price is required"
    } else if (step === 2) {
      if (!formData.city) newErrors.city = "City is required"
      if (!formData.address) newErrors.address = "Address is required"
    } else if (step === 3) {
      if (!formData.surface) newErrors.surface = "Surface area is required"
      if (!formData.rooms) newErrors.rooms = "Number of rooms is required"
    } else if (step === 4) {
      if (uploadedImages.length === 0) newErrors.images = "At least one image is required"
    } else if (step === 5) {
      if (!selectedOwner) newErrors.owner = "Property owner is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length))
    }
  }

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // In a real app, you would handle file upload here
    setUploadedImages((prev) => [...prev, "/images/property-3.jpg"])
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const filteredOwners = mockOwners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(ownerSearch.toLowerCase()) ||
      owner.email.toLowerCase().includes(ownerSearch.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/properties">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Add New Property</h1>
          <p className="text-muted-foreground">Create a new property listing</p>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Step {currentStep} of {steps.length}
              </span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                  className={cn(
                    "flex flex-col items-center",
                    currentStep > step.id && "cursor-pointer"
                  )}
                  disabled={currentStep <= step.id}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      currentStep === step.id && "border-primary bg-primary text-primary-foreground",
                      currentStep > step.id && "border-primary bg-primary text-primary-foreground",
                      currentStep < step.id && "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-xs font-medium hidden sm:block",
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.name}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-0.5 w-8 sm:w-16 lg:w-24 mx-2",
                      currentStep > step.id ? "bg-primary" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Property Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Modern Apartment with City View"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  A descriptive title helps attract potential clients
                </p>
              </div>

              <div className="space-y-2">
                <Label>
                  Property Type <span className="text-destructive">*</span>
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, propertyType: type.value })}
                      className={cn(
                        "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                        formData.propertyType === type.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <type.icon
                        className={cn(
                          "h-6 w-6",
                          formData.propertyType === type.value
                            ? "text-primary"
                            : "text-muted-foreground"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm font-medium",
                          formData.propertyType === type.value
                            ? "text-primary"
                            : "text-foreground"
                        )}
                      >
                        {type.label}
                      </span>
                    </button>
                  ))}
                </div>
                {errors.propertyType && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.propertyType}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Listing Type</Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, listingType: "sale" })}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium",
                      formData.listingType === "sale"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    For Sale
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, listingType: "rent" })}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium",
                      formData.listingType === "rent"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    For Rent
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      id="price"
                      type="number"
                      placeholder="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={cn("pl-7", errors.price ? "border-destructive" : "")}
                    />
                    {formData.listingType === "rent" && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        /month
                      </span>
                    )}
                  </div>
                  {errors.price && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Availability Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => setFormData({ ...formData, city: value })}
                  >
                    <SelectTrigger className={errors.city ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new-york">New York</SelectItem>
                      <SelectItem value="los-angeles">Los Angeles</SelectItem>
                      <SelectItem value="chicago">Chicago</SelectItem>
                      <SelectItem value="miami">Miami</SelectItem>
                      <SelectItem value="san-francisco">San Francisco</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.city && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Neighborhood</Label>
                  <Input
                    id="neighborhood"
                    placeholder="e.g., Downtown, Upper East Side"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  Full Address <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    placeholder="Enter the complete property address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={cn("pl-9 min-h-[80px]", errors.address ? "border-destructive" : "")}
                  />
                </div>
                {errors.address && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.address}
                  </p>
                )}
              </div>

              {/* Map Placeholder */}
              <div className="space-y-2">
                <Label>Location on Map</Label>
                <div className="relative aspect-video rounded-lg border border-border bg-muted overflow-hidden">
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mb-2" />
                    <p className="text-sm font-medium">Map Preview</p>
                    <p className="text-xs">Enter an address to show location</p>
                  </div>
                  {formData.address && (
                    <div className="absolute inset-0 bg-muted/80 flex items-center justify-center">
                      <div className="bg-card p-4 rounded-lg shadow-lg text-center">
                        <MapPin className="h-8 w-8 mx-auto text-primary mb-2" />
                        <p className="text-sm font-medium text-foreground">Location Set</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formData.city || "City"}, {formData.neighborhood || "Area"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  The map will be displayed on the property listing page
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="surface">
                    Surface Area (sqft) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="surface"
                    type="number"
                    placeholder="0"
                    value={formData.surface}
                    onChange={(e) => setFormData({ ...formData, surface: e.target.value })}
                    className={errors.surface ? "border-destructive" : ""}
                  />
                  {errors.surface && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.surface}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rooms">
                    Rooms <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={formData.rooms}
                    onValueChange={(value) => setFormData({ ...formData, rooms: value })}
                  >
                    <SelectTrigger className={errors.rooms ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "room" : "rooms"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.rooms && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.rooms}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Select
                    value={formData.bathrooms}
                    onValueChange={(value) => setFormData({ ...formData, bathrooms: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "bathroom" : "bathrooms"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Select
                    value={formData.floor}
                    onValueChange={(value) => setFormData({ ...formData, floor: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ground">Ground Floor</SelectItem>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          Floor {num}
                        </SelectItem>
                      ))}
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div className="space-y-0.5">
                  <Label htmlFor="furnished" className="cursor-pointer">
                    Furnished
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Is this property furnished?
                  </p>
                </div>
                <Switch
                  id="furnished"
                  checked={formData.furnished}
                  onCheckedChange={(checked) => setFormData({ ...formData, furnished: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the property features, amenities, and any special characteristics..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground">
                  A detailed description helps clients understand the property better
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Media */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>
                  Property Images <span className="text-destructive">*</span>
                </Label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50",
                    errors.images && "border-destructive"
                  )}
                >
                  <div className="flex flex-col items-center">
                    <div className="p-3 rounded-full bg-muted mb-4">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Drag and drop your images here
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      PNG, JPG up to 10MB each
                    </p>
                    <Button variant="outline" type="button">
                      <Upload className="mr-2 h-4 w-4" />
                      Browse Files
                    </Button>
                  </div>
                </div>
                {errors.images && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.images}
                  </p>
                )}
              </div>

              {uploadedImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Images ({uploadedImages.length})</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-border">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Property image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2" variant="secondary">
                            Cover
                          </Badge>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus className="h-6 w-6 mb-1" />
                      <span className="text-xs">Add More</span>
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Drag images to reorder. The first image will be used as the cover.
                  </p>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <Label>Video Tour (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center border-border hover:border-primary/50 transition-colors">
                  <div className="flex flex-col items-center">
                    <div className="p-3 rounded-full bg-muted mb-3">
                      <Video className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Upload a video tour
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      MP4, MOV up to 100MB
                    </p>
                    <Button variant="outline" size="sm" type="button">
                      <Upload className="mr-2 h-3 w-3" />
                      Upload Video
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Owner */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>
                  Select Property Owner <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search owners by name or email..."
                    value={ownerSearch}
                    onChange={(e) => setOwnerSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-3">
                {filteredOwners.map((owner) => (
                  <button
                    key={owner.id}
                    type="button"
                    onClick={() => setSelectedOwner(owner)}
                    className={cn(
                      "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
                      selectedOwner?.id === owner.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                      <User className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground">{owner.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{owner.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{owner.phone}</p>
                      <p className="text-xs text-muted-foreground">
                        {owner.properties} properties
                      </p>
                    </div>
                    {selectedOwner?.id === owner.id && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {errors.owner && (
                <p className="text-sm text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.owner}
                </p>
              )}

              <Separator />

              <Dialog open={showNewOwnerDialog} onOpenChange={setShowNewOwnerDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Owner
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Owner</DialogTitle>
                    <DialogDescription>
                      Add a new property owner to your database
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="ownerFirstName">First Name</Label>
                        <Input id="ownerFirstName" placeholder="John" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ownerLastName">Last Name</Label>
                        <Input id="ownerLastName" placeholder="Smith" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerEmail">Email</Label>
                      <Input id="ownerEmail" type="email" placeholder="john@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ownerPhone">Phone Number</Label>
                      <Input id="ownerPhone" placeholder="+1 555-0123" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowNewOwnerDialog(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowNewOwnerDialog(false)}>Create Owner</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {selectedOwner && (
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-7 w-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{selectedOwner.name}</p>
                        <p className="text-sm text-muted-foreground">{selectedOwner.email}</p>
                        <p className="text-sm text-muted-foreground">{selectedOwner.phone}</p>
                        <Badge variant="secondary" className="mt-2">
                          {selectedOwner.properties} existing properties
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-3">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => validateStep(currentStep)}>
              <Send className="mr-2 h-4 w-4" />
              Publish Property
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
