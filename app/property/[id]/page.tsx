import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Share2,
  Heart,
  ArrowLeft,
  Phone,
  Mail,
  CheckCircle,
  CalendarDays,
} from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PropertyCard } from "@/components/property-card"
import { PropertyGallery } from "@/components/property-gallery"
import { ScheduleVisitDialog } from "@/components/schedule-visit-dialog"
import { ShowInterestDialog } from "@/components/show-interest-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { properties, agencies } from "@/lib/mock-data"

interface PropertyPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PropertyPageProps) {
  const { id } = await params
  const property = properties.find((p) => p.id === id)

  if (!property) {
    return {
      title: "Property Not Found | SAS IMO",
    }
  }

  return {
    title: `${property.title} | SAS IMO`,
    description: `${property.title} - ${property.bedrooms} beds, ${property.bathrooms} baths, ${property.area} sqft in ${property.location}`,
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { id } = await params
  const property = properties.find((p) => p.id === id)

  if (!property) {
    notFound()
  }

  const formatPrice = (price: number, listingType: "buy" | "rent") => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
    return listingType === "rent" ? `${formatted}/mo` : formatted
  }

  // Get similar properties
  const similarProperties = properties
    .filter(
      (p) => p.id !== property.id && p.type === property.type && p.listingType === property.listingType
    )
    .slice(0, 3)

  // Get a random agency
  const agency = agencies[Math.floor(Math.random() * agencies.length)]

  // Generate gallery images
  const galleryImages = [
    property.image,
    "/images/property-1.jpg",
    "/images/property-2.jpg",
    "/images/property-3.jpg",
    "/images/property-4.jpg",
    "/images/property-5.jpg",
    "/images/property-6.jpg",
  ]

  const features = [
    "Air Conditioning",
    "Heating System",
    "Hardwood Floors",
    "Modern Kitchen",
    "Parking Space",
    "Laundry In-Unit",
    "Pet Friendly",
    "24/7 Security",
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        {/* Back Navigation */}
        <div className="bg-muted border-b border-border">
          <div className="mx-auto max-w-7xl px-4 py-4 lg:px-8">
            <Link
              href={property.listingType === "rent" ? "/rent" : "/buy"}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to listings
            </Link>
          </div>
        </div>

        {/* Property Header */}
        <section className="bg-muted pb-8">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            {/* Image Gallery Carousel */}
            <div className="pt-6">
              <PropertyGallery images={galleryImages} title={property.title} />
            </div>

            {/* Property Title & Actions */}
            <div className="mt-6 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={property.listingType === "rent" ? "secondary" : "default"}>
                    {property.listingType === "rent" ? "For Rent" : "For Sale"}
                  </Badge>
                  <Badge variant="outline" className="capitalize">
                    {property.type}
                  </Badge>
                </div>
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                  {property.title}
                </h1>
                <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                  <span className="sr-only">Save property</span>
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share property</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Property Content */}
        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Price & Key Details */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <p className="text-3xl font-bold text-foreground">
                          {formatPrice(property.price, property.listingType)}
                        </p>
                        {property.listingType === "buy" && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Est. $2,400/mo with 20% down
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <Bed className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold text-foreground">{property.bedrooms}</p>
                            <p className="text-xs text-muted-foreground">Beds</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bath className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold text-foreground">{property.bathrooms}</p>
                            <p className="text-xs text-muted-foreground">Baths</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Square className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="font-semibold text-foreground">{property.area}</p>
                            <p className="text-xs text-muted-foreground">Sqft</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle>About This Property</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      Welcome to this stunning {property.type} in the heart of {property.location}. 
                      This beautifully maintained property features {property.bedrooms} spacious bedrooms 
                      and {property.bathrooms} modern bathrooms, offering {property.area} square feet of 
                      comfortable living space.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      The open floor plan creates a seamless flow between the living, dining, and kitchen 
                      areas, perfect for both everyday living and entertaining. Large windows flood the 
                      space with natural light, while high-quality finishes throughout add a touch of 
                      elegance to every room.
                    </p>
                  </CardContent>
                </Card>

                {/* Features */}
                <Card>
                  <CardHeader>
                    <CardTitle>Features & Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-accent" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Property Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Property Type</span>
                        <span className="font-medium text-foreground capitalize">{property.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Listing Type</span>
                        <span className="font-medium text-foreground capitalize">
                          {property.listingType === "rent" ? "Rental" : "For Sale"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bedrooms</span>
                        <span className="font-medium text-foreground">{property.bedrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bathrooms</span>
                        <span className="font-medium text-foreground">{property.bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Square Feet</span>
                        <span className="font-medium text-foreground">{property.area}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Year Built</span>
                        <span className="font-medium text-foreground">2020</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Card */}
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Interested in this property?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 overflow-hidden rounded-full">
                        <Image
                          src={agency.image || "/placeholder.svg"}
                          alt={agency.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{agency.name}</p>
                        <p className="text-sm text-muted-foreground">{agency.location}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <ShowInterestDialog propertyTitle={property.title}>
                        <Button className="w-full" size="lg">
                          <Heart className="mr-2 h-4 w-4" />
                          Show Interest
                        </Button>
                      </ShowInterestDialog>
                      <ScheduleVisitDialog propertyTitle={property.title}>
                        <Button variant="outline" className="w-full bg-transparent" size="lg">
                          <CalendarDays className="mr-2 h-4 w-4" />
                          Schedule a Visit
                        </Button>
                      </ScheduleVisitDialog>
                      <Button variant="outline" className="w-full bg-transparent" size="lg">
                        <Phone className="mr-2 h-4 w-4" />
                        Request Call
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Listed 5 days ago</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <section className="py-12 lg:py-16 bg-muted border-t border-border">
            <div className="mx-auto max-w-7xl px-4 lg:px-8">
              <h2 className="text-2xl font-bold text-foreground mb-8">Similar Properties</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {similarProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}
