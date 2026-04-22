"use client"

import { Search, Filter, Grid3X3, List } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Props {
    view: "grid" | "list"
    setView: (value: "grid" | "list") => void
    filter: string
    setFilter: (value: string) => void
    search: string
    setSearch: (value: string) => void
}

export default function PropertiesFilter({
    view,
    setView,
    filter,
    setFilter,
    search,
    setSearch
}: Props) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-1 gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher des propriétés..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <Select value={filter} onValueChange={setFilter}>
                            <SelectTrigger className="w-[140px]">
                                <Filter className="mr-2 h-4 w-4" />
                                <SelectValue placeholder="Filtrer" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les types</SelectItem>
                                <SelectItem value="sale">À vendre</SelectItem>
                                <SelectItem value="rent">À louer</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

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
            </CardContent>
        </Card>
    )
}