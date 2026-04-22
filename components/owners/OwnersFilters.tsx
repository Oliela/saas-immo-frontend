import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

interface Props {
    statusFilter: string
    setStatusFilter: (value: string) => void
    search: string
    setSearch: (value: string) => void
}

export default function OwnersFilters({
    statusFilter,
    setStatusFilter,
    search,
    setSearch
}: Props) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par nom..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tous les statuts</SelectItem>
                            <SelectItem value="actif">Actif</SelectItem>
                            <SelectItem value="inactif">Inactif</SelectItem>
                            <SelectItem value="en attente">En attente</SelectItem>
                            <SelectItem value="suspendu">Suspendu</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    )
}