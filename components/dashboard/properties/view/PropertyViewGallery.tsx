import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

const STORAGE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

interface PropertyImage {
  id: number
  url: string
}

interface Property {
  title: string
  images: PropertyImage[]
}

const getImageUrl = (url: string | undefined): string => {
  if (!url) return "/placeholder.svg"
  if (url.startsWith("http")) return url
  return `${STORAGE_URL}${url}`
}

export default function PropertyViewGallery({ property }: { property: Property }) {
  const images = property.images ?? []

  return (
    <Card>
      <CardContent className="p-0 overflow-hidden rounded-lg">
        <div className="flex gap-1 h-[400px]">

          {/* Image principale — prend toute la hauteur à gauche */}
          <div className="relative w-1/2 shrink-0">
            <Image
              src={getImageUrl(images[0]?.url)}
              alt={property.title}
              fill
              className="object-cover"
              loading="eager"
              priority
            />
          </div>

          {/* 4 images secondaires à droite en grille 2x2 */}
          <div className="grid grid-cols-2 grid-rows-2 gap-1 w-1/2">
            {Array.from({ length: 4 }).map((_, i) => {
              const img = images[i + 1]
              return (
                <div key={img?.id ?? i} className="relative w-full h-full">
                  <Image
                    src={getImageUrl(img?.url)}
                    alt={img ? `${property.title} - photo ${i + 2}` : ""}
                    fill
                    className="object-cover"
                  />
                </div>
              )
            })}
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
