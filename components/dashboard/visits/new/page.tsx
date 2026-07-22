"use client"

import { useState } from "react"
import Link from "next/link"
import {
    ArrowLeft, User, Building2, Calendar, Clock, UserCircle,
    FileText, Check, Save, Mail, Bell, MapPin, AlertCircle,
    CheckCircle, XCircle, Search, ChevronsUpDown,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Command, CommandEmpty, CommandGroup,
    CommandInput, CommandItem, CommandList,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { redirect, useRouter } from "next/navigation"

// ─── Types ─────────────────────────────────────────────────────────────────

interface Client {
    id: string
    name: string
    email: string
    phone: string
    avatar: string
}

interface Property {
    id: string
    title: string
    address: string
    image: string
}

interface Agent {
    id: string
    name: string
    role: string
    avatar: string
}

interface Creneau {
    id: number
    bien_id: number
    agent_id: number
    visit_date: string    // "YYYY-MM-DD"
    start_time: string   // "HH:MM:SS" ou "HH:MM"
    end_time: string
    status: string
}

interface Props {
    clients: Client[]
    properties: Property[]
    agents: Agent[]
    timeSlots: string[]
    agencyId?: number
    creneaux: Creneau[]   // ← nouveau
}

// ─── SearchSelect générique ─────────────────────────────────────────────────

interface SearchSelectProps<T> {
    items: T[]
    selected: T | null
    onSelect: (item: T) => void
    placeholder: string
    searchPlaceholder: string
    emptyMessage: string
    renderItem: (item: T) => React.ReactNode
    renderSelected: (item: T) => React.ReactNode
    getKey: (item: T) => string
    getSearchValue: (item: T) => string
    error?: string
}

function SearchSelect<T>({
    items, selected, onSelect, placeholder, searchPlaceholder,
    emptyMessage, renderItem, renderSelected, getKey, getSearchValue, error,
}: SearchSelectProps<T>) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("")

    const filtered = items.filter((item) =>
        getSearchValue(item).toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="space-y-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                            "w-full justify-between bg-transparent font-normal",
                            !selected && "text-muted-foreground",
                            error && "border-destructive"
                        )}
                    >
                        {selected ? renderSelected(selected) : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command shouldFilter={false}>
                        <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                                placeholder={searchPlaceholder}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                        <CommandList className="max-h-[280px]">
                            {filtered.length === 0 ? (
                                <div className="py-6 text-center text-sm text-muted-foreground">{emptyMessage}</div>
                            ) : (
                                <CommandGroup>
                                    {filtered.map((item) => (
                                        <CommandItem
                                            key={getKey(item)}
                                            onSelect={() => { onSelect(item); setOpen(false); setSearch("") }}
                                            className="cursor-pointer"
                                        >
                                            <div className="flex items-center gap-2 w-full">
                                                <Check className={cn(
                                                    "h-4 w-4 shrink-0",
                                                    selected && getKey(selected) === getKey(item) ? "opacity-100" : "opacity-0"
                                                )} />
                                                {renderItem(item)}
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {error && (
                <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{error}
                </p>
            )}
        </div>
    )
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function NewVisitForm({ clients, properties, agents, timeSlots, agencyId, creneaux }: Props) {
    const STORAGE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
    const router = useRouter()


    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
    const [visitDate, setVisitDate] = useState("")
    const [visitStartTime, setVisitStartTime] = useState("")
    const [visitEndTime, setVisitEndTime] = useState("")
    const [status, setStatus] = useState<"pending" | "confirmed" | "canceled">("pending")
    const [notes, setNotes] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    const getOccupiedSlots = (date: string): Set<string> => {
        const occupied = new Set<string>()
        if (!date) return occupied

        creneaux.forEach((c) => {
            if (c.visit_date !== date) return

            // Filtre par bien ET agent si sélectionnés
            const bienMatch = !selectedProperty || String(c.bien_id) === selectedProperty.id
            const agentMatch = !selectedAgent || String(c.agent_id) === selectedAgent.id
            if (!bienMatch && !agentMatch) return

            const start = c.start_time.slice(0, 5)
            const end = c.end_time.slice(0, 5)

            timeSlots.forEach((slot) => {
                if (slot >= start && slot < end) occupied.add(slot)
            })
        })

        return occupied
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!selectedClient) newErrors.client = "Veuillez sélectionner un client"
        if (!selectedProperty) newErrors.property = "Veuillez sélectionner une propriété"
        if (!visitDate) newErrors.date = "Veuillez sélectionner une date"
        if (!visitStartTime) newErrors.startTime = "Veuillez sélectionner une heure de début"
        if (!visitEndTime) newErrors.endTime = "Veuillez sélectionner une heure de fin"
        if (visitStartTime && visitEndTime && visitStartTime >= visitEndTime)
            newErrors.endTime = "L'heure de fin doit être après l'heure de début"
        if (!selectedAgent) newErrors.agent = "Veuillez assigner un agent"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validateForm()) return
        // console.log({
        //     client_id: Number(selectedClient?.id),
        //     bien_id: Number(selectedProperty?.id),
        //     agent_id: Number(selectedAgent?.id),
        //     visit_date: visitDate,
        //     start_time: visitStartTime,
        //     end_time: visitEndTime,
        //     status,
        //     notes,
        //     agency_id: Number(agencyId),
        // })
        const playload = {
            client_id: Number(selectedClient?.id),
            bien_id: Number(selectedProperty?.id),
            agent_id: Number(selectedAgent?.id),
            visit_date: visitDate,
            start_time: visitStartTime,
            end_time: visitEndTime,
            status,
            agency_id: Number(agencyId),
        }
        try {
            const res = await axiosInstance.post("/api/visit-reservations/planification", playload)
            toast.success("Visite planifiée avec succès !")
            router.push("/dashboard/visits") // ← redirection côté client, ne lève pas d'exception
        } catch (error: any) {
            const backendMessage = error?.response?.data?.message
            toast.error(backendMessage || "Une erreur est survenue lors de la planification de la visite.")
        }

    }

    const getStatusBadge = (s: "pending" | "confirmed" | "canceled") => {
        if (s === "confirmed") return (
            <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20">
                <CheckCircle className="mr-1 h-3 w-3" />Confirmée
            </Badge>
        )
        if (s === "canceled") return (
            <Badge variant="destructive">
                <XCircle className="mr-1 h-3 w-3" />Annulée
            </Badge>
        )
        return (
            <Badge variant="secondary">
                <Clock className="mr-1 h-3 w-3" />En attente
            </Badge>
        )
    }

    const availableDates = Array.from({ length: 14 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() + i + 1)
        return {
            value: date.toISOString().split("T")[0],
            dayOfWeek: date.toLocaleDateString("fr-FR", { weekday: "short" }),
            dayNumber: date.getDate(),
            month: date.toLocaleDateString("fr-FR", { month: "short" }),
        }
    })


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/visits"><ArrowLeft className="h-4 w-4" /></Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Planifier une visite</h1>
                    <p className="text-muted-foreground">Créer un nouveau rendez-vous de visite de propriété</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">

                    {/* ── Client ── */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />Sélectionner un client
                            </CardTitle>
                            <CardDescription>Recherchez par nom, email ou téléphone</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SearchSelect
                                items={clients}
                                selected={selectedClient}
                                onSelect={(c) => { setSelectedClient(c); setErrors({ ...errors, client: "" }) }}
                                placeholder="Rechercher un client..."
                                searchPlaceholder="Nom, email, téléphone..."
                                emptyMessage="Aucun client trouvé"
                                getKey={(c) => c.id}
                                getSearchValue={(c) => `${c.name} ${c.email} ${c.phone}`}
                                error={errors.client}
                                renderSelected={(c) => (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={c.avatar || "/images/property-1.jpg"} />
                                            <AvatarFallback className="text-xs">{c.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{c.name}</span>
                                        <span className="text-muted-foreground text-xs">{c.email}</span>
                                    </div>
                                )}
                                renderItem={(c) => (
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarImage src={c.avatar || "/images/property-1.jpg"} />
                                            <AvatarFallback className="text-xs">{c.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="font-medium truncate">{c.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{c.email} · {c.phone}</p>
                                        </div>
                                    </div>
                                )}
                            />

                            {/* Carte du client sélectionné */}
                            {selectedClient && (
                                <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={selectedClient.avatar} />
                                        <AvatarFallback>{selectedClient.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium">{selectedClient.name}</p>
                                        <p className="text-xs text-muted-foreground">{selectedClient.email} · {selectedClient.phone}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={() => setSelectedClient(null)}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ── Propriété ── */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />Sélectionner une propriété
                            </CardTitle>
                            <CardDescription>Recherchez par titre ou adresse</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SearchSelect
                                items={properties}
                                selected={selectedProperty}
                                onSelect={(p) => { setSelectedProperty(p); setErrors({ ...errors, property: "" }) }}
                                placeholder="Rechercher une propriété..."
                                searchPlaceholder="Titre, adresse, ville..."
                                emptyMessage="Aucune propriété trouvée"
                                getKey={(p) => p.id}
                                getSearchValue={(p) => `${p.title} ${p.address}`}
                                error={errors.property}
                                renderSelected={(p) => (
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                                        <span className="font-medium truncate">{p.title}</span>
                                    </div>
                                )}
                                renderItem={(p) => (
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="h-10 w-12 rounded bg-muted shrink-0 overflow-hidden flex items-center justify-center">
                                            {p.image
                                                ? <img src={`${STORAGE_URL}${p.image}`} alt={p.title} className="h-full w-full object-cover" />
                                                : <Building2 className="h-4 w-4 text-muted-foreground" />
                                            }
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-medium truncate">{p.title}</p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                                                <MapPin className="h-3 w-3 shrink-0" />{p.address}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            />

                            {/* Carte de la propriété sélectionnée */}
                            {selectedProperty && (
                                <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                                    <div className="h-12 w-16 rounded bg-muted shrink-0 overflow-hidden flex items-center justify-center">
                                        {selectedProperty.image
                                            ? <img src={`${STORAGE_URL}${selectedProperty.image}`} alt={selectedProperty.title} className="h-full w-full object-cover" />
                                            : <Building2 className="h-4 w-4 text-muted-foreground" />
                                        }
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium">{selectedProperty.title}</p>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <MapPin className="h-3 w-3" />{selectedProperty.address}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={() => setSelectedProperty(null)}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ── Date & Heure ── */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />Date et heure
                            </CardTitle>
                            <CardDescription>Sélectionnez quand la visite doit avoir lieu</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* ── Date ── */}
                            <div className="space-y-3">
                                <Label>Date de visite</Label>
                                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                    {availableDates.slice(0, 7).map((date) => {
                                        // Vérifie si TOUS les slots sont occupés pour cette date
                                        const occupiedOnDate = getOccupiedSlots(date.value)
                                        const allOccupied = timeSlots.every((t) => occupiedOnDate.has(t))

                                        return (
                                            <button
                                                key={date.value}
                                                type="button"
                                                disabled={allOccupied}
                                                onClick={() => {
                                                    setVisitDate(date.value)
                                                    setVisitStartTime("")
                                                    setVisitEndTime("")
                                                    setErrors({ ...errors, date: "" })
                                                }}
                                                title={allOccupied ? "Aucun créneau disponible ce jour" : undefined}
                                                className={cn(
                                                    "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all relative",
                                                    visitDate === date.value
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : allOccupied
                                                            ? "border-border bg-muted text-muted-foreground opacity-40 cursor-not-allowed"
                                                            : "border-border hover:border-primary/50"
                                                )}
                                            >
                                                <span className="text-xs font-medium">{date.dayOfWeek}</span>
                                                <span className="text-lg font-bold">{date.dayNumber}</span>
                                                <span className="text-xs">{date.month}</span>
                                                {allOccupied && (
                                                    <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-destructive/80 flex items-center justify-center">
                                                        <XCircle className="h-3 w-3 text-white" />
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Ou sélectionnez une date spécifique :</span>
                                    <Input
                                        type="date"
                                        value={visitDate}
                                        onChange={(e) => {
                                            setVisitDate(e.target.value)
                                            setVisitStartTime("")
                                            setVisitEndTime("")
                                            setErrors({ ...errors, date: "" })
                                        }}
                                        className="w-auto"
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                </div>

                                {errors.date && (
                                    <p className="text-sm text-destructive flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />{errors.date}
                                    </p>
                                )}
                            </div>

                            <Separator />

                            {/* ── Horaire ── */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Horaire de visite</Label>
                                    {/* Légende */}
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 rounded border-2 border-primary bg-primary" />
                                            <span>Sélectionné</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 rounded border-2 border-border bg-muted opacity-50" />
                                            <span>Occupé</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 rounded border-2 border-border" />
                                            <span>Libre</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Message si pas de date sélectionnée */}
                                {!visitDate ? (
                                    <div className="flex items-center justify-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Sélectionnez d'abord une date
                                    </div>
                                ) : (
                                    <>
                                        {(() => {
                                            const occupied = getOccupiedSlots(visitDate)

                                            return (
                                                <div className="grid grid-cols-2 gap-6">

                                                    {/* Heure de début */}
                                                    <div className="space-y-2">
                                                        <Label className="text-sm text-muted-foreground">Heure de début</Label>
                                                        <div className="grid grid-cols-3 gap-1.5">
                                                            {timeSlots.map((time) => {
                                                                const isOccupied = occupied.has(time)
                                                                const isSelected = visitStartTime === time
                                                                return (
                                                                    <button
                                                                        key={time}
                                                                        type="button"
                                                                        disabled={isOccupied}
                                                                        onClick={() => {
                                                                            setVisitStartTime(time)
                                                                            if (visitEndTime && time >= visitEndTime) setVisitEndTime("")
                                                                            setErrors({ ...errors, startTime: "" })
                                                                        }}
                                                                        title={isOccupied ? "Créneau déjà réservé" : undefined}
                                                                        className={cn(
                                                                            "py-2 px-1 rounded-lg border-2 text-xs font-medium transition-all",
                                                                            isSelected
                                                                                ? "border-primary bg-primary text-primary-foreground"
                                                                                : isOccupied
                                                                                    ? "border-border bg-muted text-muted-foreground opacity-40 cursor-not-allowed line-through"
                                                                                    : "border-border hover:border-primary/50"
                                                                        )}
                                                                    >
                                                                        {time}
                                                                    </button>
                                                                )
                                                            })}
                                                        </div>
                                                        {errors.startTime && (
                                                            <p className="text-xs text-destructive flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />{errors.startTime}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Heure de fin */}
                                                    <div className="space-y-2">
                                                        <Label className="text-sm text-muted-foreground">Heure de fin</Label>
                                                        {!visitStartTime ? (
                                                            <div className="flex items-center justify-center h-full min-h-[80px] text-xs text-muted-foreground border-2 border-dashed rounded-lg">
                                                                <Clock className="mr-1.5 h-3 w-3" />
                                                                Choisissez d'abord une heure de début
                                                            </div>
                                                        ) : (
                                                            <div className="grid grid-cols-3 gap-1.5">
                                                                {timeSlots.map((time) => {
                                                                    const isOccupied = occupied.has(time)
                                                                    const isTooEarly = time <= visitStartTime
                                                                    const isDisabled = isOccupied || isTooEarly
                                                                    const isSelected = visitEndTime === time
                                                                    return (
                                                                        <button
                                                                            key={time}
                                                                            type="button"
                                                                            disabled={isDisabled}
                                                                            onClick={() => { setVisitEndTime(time); setErrors({ ...errors, endTime: "" }) }}
                                                                            title={isOccupied ? "Créneau déjà réservé" : undefined}
                                                                            className={cn(
                                                                                "py-2 px-1 rounded-lg border-2 text-xs font-medium transition-all",
                                                                                isSelected
                                                                                    ? "border-primary bg-primary text-primary-foreground"
                                                                                    : isOccupied
                                                                                        ? "border-border bg-muted text-muted-foreground opacity-40 cursor-not-allowed line-through"
                                                                                        : isTooEarly
                                                                                            ? "border-border opacity-25 cursor-not-allowed"
                                                                                            : "border-border hover:border-primary/50"
                                                                            )}
                                                                        >
                                                                            {time}
                                                                        </button>
                                                                    )
                                                                })}
                                                            </div>
                                                        )}
                                                        {errors.endTime && (
                                                            <p className="text-xs text-destructive flex items-center gap-1">
                                                                <AlertCircle className="h-3 w-3" />{errors.endTime}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })()}

                                        {/* Résumé horaire */}
                                        {visitStartTime && visitEndTime && (
                                            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                                                <Clock className="h-4 w-4 text-primary shrink-0" />
                                                <span>Visite de <strong>{visitStartTime}</strong> à <strong>{visitEndTime}</strong></span>
                                                <Badge variant="secondary" className="ml-auto text-xs">
                                                    {(() => {
                                                        const [sh, sm] = visitStartTime.split(":").map(Number)
                                                        const [eh, em] = visitEndTime.split(":").map(Number)
                                                        const diff = (eh * 60 + em) - (sh * 60 + sm)
                                                        return diff >= 60
                                                            ? `${Math.floor(diff / 60)}h${diff % 60 > 0 ? diff % 60 + "min" : ""}`
                                                            : `${diff}min`
                                                    })()}
                                                </Badge>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                        </CardContent>
                    </Card>

                    {/* ── Agent ── */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <UserCircle className="h-5 w-5" />Assigner un agent
                            </CardTitle>
                            <CardDescription>Recherchez l'agent qui mènera la visite</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SearchSelect
                                items={agents}
                                selected={selectedAgent}
                                onSelect={(a) => { setSelectedAgent(a); setErrors({ ...errors, agent: "" }) }}
                                placeholder="Rechercher un agent..."
                                searchPlaceholder="Nom, rôle..."
                                emptyMessage="Aucun agent trouvé"
                                getKey={(a) => a.id}
                                getSearchValue={(a) => `${a.name} ${a.role}`}
                                error={errors.agent}
                                renderSelected={(a) => (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={a.avatar} />
                                            <AvatarFallback className="text-xs">{a.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{a.name}</span>
                                        <span className="text-muted-foreground text-xs">{a.role}</span>
                                    </div>
                                )}
                                renderItem={(a) => (
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <Avatar className="h-8 w-8 shrink-0">
                                            <AvatarImage src={a.avatar} />
                                            <AvatarFallback className="text-xs">{a.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0">
                                            <p className="font-medium truncate">{a.name}</p>
                                            <p className="text-xs text-muted-foreground">{a.role}</p>
                                        </div>
                                    </div>
                                )}
                            />

                            {/* Carte de l'agent sélectionné */}
                            {selectedAgent && (
                                <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={selectedAgent.avatar} />
                                        <AvatarFallback>{selectedAgent.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-medium">{selectedAgent.name}</p>
                                        <p className="text-xs text-muted-foreground">{selectedAgent.role}</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={() => setSelectedAgent(null)}
                                    >
                                        <XCircle className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* ── Statut & Notes ── */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />Statut et notes
                            </CardTitle>
                            <CardDescription>Définissez le statut et ajoutez des notes internes</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Statut de la visite</Label>
                                <div className="flex gap-3">
                                    {(["pending", "confirmed", "canceled"] as const).map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setStatus(s)}
                                            className={cn(
                                                "flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium",
                                                status === s
                                                    ? s === "confirmed"
                                                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                                                        : s === "canceled"
                                                            ? "border-destructive bg-destructive/10 text-destructive"
                                                            : "border-primary bg-primary/10 text-primary"
                                                    : "border-border hover:border-primary/50"
                                            )}
                                        >
                                            {s === "pending" ? "En attente" : s === "confirmed" ? "Confirmée" : "Annulée"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Notes internes</Label>
                                <Textarea
                                    placeholder="Ajoutez des notes pour l'agent ou à titre de référence interne..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="min-h-[120px]"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Ces notes sont à usage interne uniquement et ne seront pas partagées avec le client
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* ── Sidebar ── */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Résumé de la visite</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm text-muted-foreground">Client</span>
                                    {selectedClient ? (
                                        <div className="mt-1 flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={selectedClient.avatar} />
                                                <AvatarFallback>{selectedClient.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{selectedClient.name}</p>
                                                <p className="text-xs text-muted-foreground">{selectedClient.email}</p>
                                            </div>
                                        </div>
                                    ) : <p className="text-sm text-muted-foreground mt-1">Non sélectionné</p>}
                                </div>
                                <Separator />
                                <div>
                                    <span className="text-sm text-muted-foreground">Propriété</span>
                                    {selectedProperty ? (
                                        <div className="mt-1">
                                            <p className="text-sm font-medium">{selectedProperty.title}</p>
                                            <p className="text-xs text-muted-foreground">{selectedProperty.address}</p>
                                        </div>
                                    ) : <p className="text-sm text-muted-foreground mt-1">Non sélectionnée</p>}
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Date</span>
                                    <span className="text-sm font-medium">
                                        {visitDate
                                            ? new Date(visitDate).toLocaleDateString("fr-FR", { weekday: "short", month: "short", day: "numeric" })
                                            : "Non sélectionnée"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Horaire</span>
                                    <span className="text-sm font-medium">
                                        {visitStartTime && visitEndTime
                                            ? `${visitStartTime} – ${visitEndTime}`
                                            : "Non sélectionné"}
                                    </span>
                                </div>
                                <Separator />
                                <div>
                                    <span className="text-sm text-muted-foreground">Agent assigné</span>
                                    {selectedAgent ? (
                                        <div className="mt-1 flex items-center gap-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={selectedAgent.avatar} />
                                                <AvatarFallback>{selectedAgent.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-medium">{selectedAgent.name}</p>
                                                <p className="text-xs text-muted-foreground">{selectedAgent.role}</p>
                                            </div>
                                        </div>
                                    ) : <p className="text-sm text-muted-foreground mt-1">Non assigné</p>}
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Statut</span>
                                    {getStatusBadge(status)}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notification preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <Bell className="h-4 w-4" />Aperçu de la notification
                            </CardTitle>
                            <CardDescription>Aperçu envoyé au client</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {selectedClient && selectedProperty && visitDate && visitEndTime ? (
                                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Notification par email</span>
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium mb-2">Visite programmée — {selectedProperty.title}</p>
                                        <p className="text-muted-foreground text-xs leading-relaxed">
                                            Cher {selectedClient.name},<br /><br />
                                            Votre visite a été programmée :<br />
                                            <strong>Propriété :</strong> {selectedProperty.title}<br />
                                            <strong>Adresse :</strong> {selectedProperty.address}<br />
                                            <strong>Date :</strong> {new Date(visitDate).toLocaleDateString("fr-FR", {
                                                weekday: "long", month: "long", day: "numeric", year: "numeric",
                                            })}<br />
                                            <strong>Heure :</strong> {visitStartTime} – {visitEndTime}<br />
                                            {selectedAgent && <><strong>Agent :</strong> {selectedAgent.name}</>}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Complétez le formulaire pour prévisualiser la notification</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        <Button className="w-full" onClick={handleSubmit}>
                            <Check className="mr-2 h-4 w-4" />Confirmer et envoyer la notification
                        </Button>
                        <Button variant="outline" className="w-full bg-transparent">
                            <Save className="mr-2 h-4 w-4" />Enregistrer en tant que brouillon
                        </Button>
                        <Button variant="ghost" className="w-full" asChild>
                            <Link href="/dashboard/visits">Annuler</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}