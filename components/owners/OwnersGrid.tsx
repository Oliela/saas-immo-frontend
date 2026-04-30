import React from "react"
import Link from "next/link"
import {
    MoreHorizontal,
    Eye,
    Pencil,
    Trash2,
    Mail,
    Phone,
    MapPin,
    Building2,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"


/* ========================= */
/*         TYPES             */
/* ========================= */

interface Owner {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    city?: string          // location
    address?: string
    biens?: []   // nombre de propriétés
    total_portfolio_value?: number    // valeur du portefeuille
    status?: string | null | undefined
    lastActivity?: string
}



interface Props {
    owners: Owner[]
    getStatusBadge: (status: string) => React.JSX.Element
}


/* ========================= */
/*       MAIN GRID           */
/* ========================= */

export default function OwnersGrid({ owners, getStatusBadge }: Props) {

    function getStatusBadgeWrapper(status: string): React.ReactNode {
        return getStatusBadge(status)
    }

    const handleDelete = async (id: string | number) => {
        if (!confirm("Voulez-vous vraiment supprimer ce propriétaire ?")) return


        try {
            await axiosInstance.delete(`/api/owners/${id}`)
            
            toast.success("")
            window.location.href = `/dashboard/owners/`

        } catch (error) {
            console.error("Erreur suppression", error)
            toast.error("")
        }
    }

    console.log("donnee",owners)

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {owners.map((owner) => (
                <Card key={owner.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback className="text-lg">
                                        {owner.firstName?.charAt(0) || "U"}{owner.lastName?.charAt(0) || "U"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-foreground">{owner.firstName} {owner.lastName}</p>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        {owner.city}
                                    </div>
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/owners/${owner.id}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            Voir le profil
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/owners/${owner.id}/edit`}>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Modifier
                                        </Link>
                                    </DropdownMenuItem>
                                    {/* <DropdownMenuItem>
                                        <Building2 className="mr-2 h-4 w-4" />
                                        Voir les propriétés
                                    </DropdownMenuItem> */}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => handleDelete(owner.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Supprimer
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                {owner.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                {owner.phone}
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-border">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-foreground">{owner?.biens?.length || 0}</p>
                                    <p className="text-xs text-muted-foreground">Propriétés</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold text-foreground">{owner.total_portfolio_value || "0"} CFA</p>
                                    <p className="text-xs text-muted-foreground">Valeur du portefeuille</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            {getStatusBadge(owner.status ?? "")}
                            <p className="text-xs text-muted-foreground">Dernière activité : {owner.lastActivity || "Inconnue"}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
