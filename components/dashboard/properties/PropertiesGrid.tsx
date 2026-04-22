"use client"

import Image from "next/image"
import Link from "next/link"
import { Eye, Pencil, Trash2, MoreHorizontal, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { ref } from "process"

interface Props {
    properties: any[]
    view: "grid" | "list"
    formatPrice: (price: number, listingType: "sale" | "rent") => string
}

export default function PropertiesGrid({ properties, view, formatPrice }: Props) {
    const STORAGE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null)

    const getImageUrl = (images: { url: string }[] | undefined): string => {
        if (!images || images.length === 0) return "/placeholder.svg"
        if (!images[0]?.url) return "/placeholder.svg"
        return `${STORAGE_URL}${images[0].url}`
    }

    const handleDeleteConfirm = async () => {
        if (propertyToDelete === null) return

        try {
            const response = await axiosInstance.delete(
                `/api/biens/${propertyToDelete}`
            )

            if (response.status !== 200) {
                throw new Error("Erreur lors de la suppression")
            }
            toast.success("Bien supprimé avec succès.")
            window.location.reload()  // ← rafraîchir la liste après suppression
        } catch (error) {
            console.error("Erreur suppression :", error)
            toast.error("Une erreur est survenue lors de la suppression du bien.")
            // Optionnel : afficher un toast d'erreur
        } finally {
            setPropertyToDelete(null)
        }
    }

    const DeleteConfirmDialog = () => (
        <AlertDialog open={propertyToDelete !== null} onOpenChange={(open) => !open && setPropertyToDelete(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Supprimer ce bien ?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="space-y-2">
                        <span>Cette action est irréversible.</span>
                        <span className="block font-medium text-foreground">
                            La suppression de ce bien entraînera également la suppression de :
                        </span>
                        <ul className="list-disc list-inside text-sm space-y-1">
                            <li>Tous les <strong>contrats</strong> liés à ce bien</li>
                            <li>Toutes les <strong>factures</strong> liées à ce bien</li>
                        </ul>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDeleteConfirm}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Supprimer définitivement
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

    if (view === "grid") {
        return (
            <>
                <DeleteConfirmDialog />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {properties.map((property) => (
                        <Card key={property.id} className="overflow-hidden">
                            <div className="relative aspect-[4/3]">
                                <Image
                                    src={getImageUrl(property.images)}
                                    alt={property.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute top-3 left-3">
                                    <Badge variant={property.listingType === "rent" ? "secondary" : "default"}>
                                        {property.listingType === "rent" ? "À louer" : "À vendre"}
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
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/properties/${property.id}`}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    Voir
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link href={`/dashboard/properties/${property.id}/edit`}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Modifier
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                className="text-destructive"
                                                onClick={() => setPropertyToDelete(property.id)}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Supprimer
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

                                    {property.propertyType !== "terrain" && (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>
                                                {property.rooms} {property.propertyType === "bureau" || property.propertyType === "entrepot" ? "pièce(s)" : "ch"}
                                            </span>
                                            <span>|</span>
                                            <span>{property.bathrooms} sdb</span>
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3 flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">{property.surface} m²</span>
                                    <Badge variant="outline" className="capitalize">{property.propertyType}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </>
        )
    }

    return (
        <>
            <DeleteConfirmDialog />
            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Propriété</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Emplacement</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">Prix</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Type</th>
                                    <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Détails</th>
                                    <th className="text-right py-4 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map((property) => (
                                    <tr key={property.id} className="border-b border-border last:border-0">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-md">
                                                    <Image
                                                        src={getImageUrl(property.images)}
                                                        alt={property.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-foreground truncate max-w-[200px]">{property.title}</p>
                                                    <Badge variant={property.listingType === "rent" ? "secondary" : "default"} className="mt-1">
                                                        {property.listingType === "rent" ? "À louer" : "À vendre"}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 hidden md:table-cell">
                                            <p className="text-sm text-muted-foreground">{property.neighborhood}, {property.city}</p>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="font-medium text-foreground">
                                                {formatPrice(property.price, property.listingType)}
                                            </p>
                                        </td>
                                        <td className="py-4 px-4 hidden sm:table-cell">
                                            <Badge variant="outline" className="capitalize">{property.propertyType}</Badge>
                                        </td>
                                        <td className="py-4 px-4 hidden lg:table-cell">
                                            <p className="text-sm text-muted-foreground">
                                                {property.propertyType !== "terrain" && (
                                                    <>
                                                        {property.rooms} {property.propertyType === "bureau" ||
                                                        property.propertyType === "entrepot" ? "pièce(s)" : "ch"}
                                                        {` | ${property.bathrooms} sdb | `}
                                                    </>
                                                )}
                                                {property.surface} m²
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
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/properties/${property.id}`}>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            Voir
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/dashboard/properties/${property.id}/edit`}>
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Modifier
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => setPropertyToDelete(property.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Supprimer
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
        </>
    )
}