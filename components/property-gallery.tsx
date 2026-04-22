"use client"

import { useState, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, Expand, Grid3X3, ImageOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface PropertyGalleryProps {
  images: string[]
  title: string
}

function PlaceholderSlot() {
  return (
    <div className="hidden lg:flex relative aspect-[4/3] overflow-hidden rounded-xl bg-muted items-center justify-center">
      <ImageOff className="h-8 w-8 text-muted-foreground/40" />
    </div>
  )
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

  // Cas : 1 seule image → affichage pleine largeur
  if (images.length === 1) {
    return (
      <>
        <div
          className="relative w-full h-[400px] lg:h-[500px] overflow-hidden rounded-xl cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={images[0]}
            alt={`${title} - Image principale`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm">
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <LightboxDialog
          images={images}
          title={title}
          isOpen={isLightboxOpen}
          index={lightboxIndex}
          onClose={() => setIsLightboxOpen(false)}
          onPrevious={lightboxPrevious}
          onNext={lightboxNext}
          onSelect={setLightboxIndex}
        />
      </>
    )
  }

  // Slots pour la grille : toujours 4 miniatures (remplies ou grises)
  const thumbnailSlots = Array.from({ length: 4 }, (_, i) => images[i + 1] ?? null)

  return (
    <>
      {/* Grille principale */}
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:grid-rows-2 gap-2 lg:gap-3 lg:h-[480px]">

        {/* Grande image principale — occupe 2 colonnes et 2 lignes */}
        <div
          className="lg:col-span-2 lg:row-span-2 relative aspect-[4/3] lg:aspect-auto lg:h-full overflow-hidden rounded-xl group cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={images[currentIndex]}
            alt={`${title} - Image principale`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />

          {/* Flèches mobile */}
          {images.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-2 lg:hidden">
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => { e.stopPropagation(); goToPrevious() }}
                className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={(e) => { e.stopPropagation(); goToNext() }}
                className="h-10 w-10 rounded-full bg-card/80 backdrop-blur-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Compteur mobile */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 lg:hidden">
            <div className="bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-foreground">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Bouton expand */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="secondary" size="icon" className="h-9 w-9 rounded-full bg-card/80 backdrop-blur-sm">
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* 4 miniatures desktop */}
        {thumbnailSlots.map((image, index) =>
          image ? (
            <div
              key={index}
              className="hidden lg:block relative aspect-[4/3] lg:aspect-auto overflow-hidden rounded-xl cursor-pointer group"
              onClick={() => openLightbox(index + 1)}
            >
              <Image
                src={image}
                alt={`${title} - Image ${index + 2}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay "+X" sur la dernière miniature si plus de 5 images */}
              {index === 3 && images.length > 5 && (
                <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                  <div className="text-center text-card">
                    <Grid3X3 className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-sm font-semibold">+{images.length - 5} photos</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <PlaceholderSlot key={`placeholder-${index}`} />
          )
        )}
      </div>

      {/* Miniatures scrollables — mobile */}
      {images.length > 1 && (
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
                src={image}
                alt={`${title} - Miniature ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Bouton voir toutes les photos */}
      <div className="mt-4 flex justify-center lg:justify-end">
        <Button variant="outline" onClick={() => openLightbox(0)} className="gap-2 bg-transparent">
          <Grid3X3 className="h-4 w-4" />
          Voir les {images.length} photo{images.length > 1 ? "s" : ""}
        </Button>
      </div>

      {/* Lightbox */}
      <LightboxDialog
        images={images}
        title={title}
        isOpen={isLightboxOpen}
        index={lightboxIndex}
        onClose={() => setIsLightboxOpen(false)}
        onPrevious={lightboxPrevious}
        onNext={lightboxNext}
        onSelect={setLightboxIndex}
      />
    </>
  )
}

// ─── Lightbox ────────────────────────────────────────────────────────────────

interface LightboxProps {
  images: string[]
  title: string
  isOpen: boolean
  index: number
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
  onSelect: (i: number) => void
}

function LightboxDialog({ images, title, isOpen, index, onClose, onPrevious, onNext, onSelect }: LightboxProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-7xl w-full h-[90vh] p-0 bg-foreground/95 border-none"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Galerie photos — {title}</DialogTitle>
        <div className="relative h-full flex flex-col">

          {/* Fermer */}
          <div className="absolute top-4 right-4 z-10">
            <Button variant="ghost" size="icon" onClick={onClose} className="text-card hover:bg-card/20">
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Compteur */}
          <div className="absolute top-4 left-4 z-10">
            <span className="text-card text-sm font-medium">{index + 1} / {images.length}</span>
          </div>

          {/* Image principale */}
          <div className="flex-1 flex items-center justify-center p-4 pt-14 min-h-0">
            <div className="relative w-full h-full">
              <Image
                src={images[index]}
                alt={`${title} - Image ${index + 1}`}
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Flèche gauche */}
          {images.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-0 flex items-center">
                <Button variant="ghost" size="icon" onClick={onPrevious} className="h-12 w-12 ml-4 text-card hover:bg-card/20">
                  <ChevronLeft className="h-8 w-8" />
                </Button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                <Button variant="ghost" size="icon" onClick={onNext} className="h-12 w-12 mr-4 text-card hover:bg-card/20">
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </div>
            </>
          )}

          {/* Bande de miniatures */}
          {images.length > 1 && (
            <div className="flex justify-center gap-2 p-4 bg-foreground overflow-x-auto">
              {images.map((image, i) => (
                <button
                  key={i}
                  onClick={() => onSelect(i)}
                  className={cn(
                    "relative h-14 w-20 flex-shrink-0 overflow-hidden rounded-md transition-all",
                    index === i ? "ring-2 ring-primary" : "opacity-50 hover:opacity-75"
                  )}
                >
                  <Image
                    src={image}
                    alt={`${title} - Miniature ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}