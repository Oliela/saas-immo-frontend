"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Expand, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface PropertyGalleryProps {
  images: string[]
  title: string
}

export function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }, [images.length])

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }, [images.length])

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  const lightboxPrevious = () => {
    setLightboxIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <>
      {/* Main Gallery Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-4">
        {/* Main Image */}
        <div className="lg:col-span-2 lg:row-span-2 relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden rounded-xl group cursor-pointer" onClick={() => openLightbox(0)}>
          <Image
            src={images[currentIndex] || "/placeholder.svg"}
            alt={`${title} - Main Image`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
          
          {/* Navigation Arrows - Mobile */}
          <div className="absolute inset-0 flex items-center justify-between p-2 lg:hidden">
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Image Counter - Mobile */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 lg:hidden">
            <div className="bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Expand Button */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm"
            >
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Thumbnail Grid - Desktop Only */}
        {images.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className="hidden lg:block relative aspect-[4/3] overflow-hidden rounded-xl cursor-pointer group"
            onClick={() => openLightbox(index + 1)}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${title} - Image ${index + 2}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-foreground/50 flex items-center justify-center">
                <div className="text-center text-card">
                  <Grid3X3 className="h-6 w-6 mx-auto mb-1" />
                  <span className="text-sm font-medium">+{images.length - 5} more</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Thumbnail Strip - Mobile */}
      <div className="flex gap-2 mt-2 overflow-x-auto pb-2 lg:hidden">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg transition-all",
              currentIndex === index ? "ring-2 ring-primary" : "opacity-70"
            )}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${title} - Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      {/* View All Photos Button */}
      <div className="mt-4 flex justify-center lg:justify-end">
        <Button variant="outline" onClick={() => openLightbox(0)} className="gap-2 bg-transparent">
          <Grid3X3 className="h-4 w-4" />
          View All {images.length} Photos
        </Button>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-foreground/95 border-none">
          <DialogTitle className="sr-only">Property image gallery</DialogTitle>
          <div className="relative h-full flex flex-col">
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLightboxOpen(false)}
                className="text-card hover:bg-card/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 z-10">
              <span className="text-card text-sm font-medium">
                {lightboxIndex + 1} / {images.length}
              </span>
            </div>

            {/* Main Image Area */}
            <div className="flex-1 flex items-center justify-center p-4 pt-14">
              <div className="relative w-full h-full">
                <Image
                  src={images[lightboxIndex] || "/placeholder.svg"}
                  alt={`${title} - Image ${lightboxIndex + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            {/* Navigation */}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={lightboxPrevious}
                className="h-12 w-12 ml-4 text-card hover:bg-card/20"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={lightboxNext}
                className="h-12 w-12 mr-4 text-card hover:bg-card/20"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </div>

            {/* Thumbnail Strip */}
            <div className="flex justify-center gap-2 p-4 bg-foreground">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className={cn(
                    "relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-md transition-all",
                    lightboxIndex === index ? "ring-2 ring-primary" : "opacity-50 hover:opacity-75"
                  )}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${title} - Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
