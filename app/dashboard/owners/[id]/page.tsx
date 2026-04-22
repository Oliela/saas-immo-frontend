"use client"

import Link from "next/link"
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  MapPin,
  Building2,
  DollarSign,
  Calendar,
  FileText,
  Home,
  TrendingUp,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axios"
import { useParams } from "next/navigation"

// ─── Types ────────────────────────────────────────────────────────────────────

type OwnerStatus = "actif" | "inactif" | "en attente" | "suspendu"

type PropertyStatus = "rented" | "available" | "maintenance"

type ListingType = "sale" | "rent"

interface Property {
  id: string | number
  title: string
  address: string
  price: string | number | null
  monthlyRent: string | number | null
  status: PropertyStatus | string
  listingType: ListingType | string
}

interface Contract {
  id: string | number
  property: string
  type: "rental" | string
}

interface Transaction {
  description: string
  date: string
  amount: string
}

/** Shape returned by the API */
interface OwnerApiResponse {
  id: string | number
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  state: string
  address: string
  zipCode: string
  country: string
  status: OwnerStatus
  created_at: string
  biens_count?: number
  total_portfolio_value?: string
  monthly_income?: string
  occupancy_rate?: string
  bio?: string
  bankName?: string
  accountHolder?: string
  accountNumber?: string
  accountType?: string
  taxIdType?: string
  taxId?: string
  agency?: string
  biens?: Property[]
}

/** Normalised shape used in the view */
interface OwnerViewModel {
  id: string | number
  name: string
  email: string
  phone: string
  location: string
  address: string
  status: OwnerStatus
  joinedDate: string
  lastActivity: string | null
  totalProperties: number
  totalValue: string
  monthlyIncome: string
  occupancyRate: string
  bio: string
  bankName?: string
  accountHolder?: string
  accountNumber?: string
  accountType?: string
  taxIdType?: string
  taxId?: string
  agency?: string
  properties: Property[]
  contracts: Contract[]
  transactions: Transaction[]
}

// ─── Config maps ──────────────────────────────────────────────────────────────

type BadgeVariant = "default" | "secondary" | "outline" | "destructive"

const PROPERTY_STATUS_CONFIG: Record<
  PropertyStatus,
  { variant: BadgeVariant; label: string }
> = {
  rented:      { variant: "default",   label: "Loué" },
  available:   { variant: "secondary", label: "Disponible" },
  maintenance: { variant: "outline",   label: "Maintenance" },
}

const OWNER_STATUS_CONFIG: Record<
  OwnerStatus,
  { label: string; variant: BadgeVariant }
> = {
  actif:        { label: "Actif",       variant: "default" },
  inactif:      { label: "Inactif",     variant: "secondary" },
  "en attente": { label: "En attente",  variant: "outline" },
  suspendu:     { label: "Suspendu",    variant: "destructive" },
}

const FALLBACK_STATUS = { label: "Inconnu", variant: "outline" as BadgeVariant }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapApiToViewModel(data: OwnerApiResponse): OwnerViewModel {
  return {
    id:               data.id,
    name:             `${data.firstName} ${data.lastName}`,
    email:            data.email,
    phone:            data.phone,
    location:         `${data.city}, ${data.state}`,
    address:          `${data.address}, ${data.city}, ${data.state} ${data.zipCode}, ${data.country}`,
    status:           data.status,
    joinedDate:       data.created_at.split("T")[0],
    lastActivity:     null,
    totalProperties:  data.biens_count ?? 0,
    totalValue:       data.total_portfolio_value ?? "0 CFA",
    monthlyIncome:    data.monthly_income ?? "0 CFA",
    occupancyRate:    data.occupancy_rate ?? "0%",
    bio:              data.bio ?? "",
    bankName:         data.bankName,
    accountHolder:    data.accountHolder,
    accountNumber:    data.accountNumber,
    accountType:      data.accountType,
    taxIdType:        data.taxIdType,
    taxId:            data.taxId,
    agency:           data.agency,
    properties:       data.biens ?? [],
    contracts:        [],
    transactions:     [],
  }
}

function getPropertyStatusBadge(status: string) {
  const config =
    PROPERTY_STATUS_CONFIG[status as PropertyStatus] ?? {
      variant: "outline" as BadgeVariant,
      label: status,
    }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OwnerViewPage() {
  const { id } = useParams()
  const [ownerData, setOwnerData] = useState<OwnerApiResponse | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchOwner = async () => {
      try {
        const res = await axiosInstance.get<OwnerApiResponse>(`/api/owners/${id}`)
        setOwnerData(res.data)
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : (err as { response?: { data?: { message?: string } } })
                ?.response?.data?.message ?? "Erreur chargement"
        setError(message)
      } finally {
        setLoading(false)
      }
    }
    fetchOwner()
  }, [id])

  if (loading) return <p>Chargement...</p>
  if (error)   return <p>{error}</p>
  if (!ownerData) return <p>Propriétaire introuvable</p>

  const owner       = mapApiToViewModel(ownerData)
  const ownerStatus = OWNER_STATUS_CONFIG[owner.status] ?? FALLBACK_STATUS

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/owners">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>

          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14">
              <AvatarFallback className="text-lg">AT</AvatarFallback>
            </Avatar>

            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">{owner.name}</h1>
                <Badge variant={ownerStatus.variant}>{ownerStatus.label}</Badge>
              </div>
              <p className="text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {owner.location}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-transparent">
            <Mail className="mr-2 h-4 w-4" />Envoyer un email
          </Button>
          <Button variant="outline" size="sm" className="bg-transparent">
            <Phone className="mr-2 h-4 w-4" />Appeler
          </Button>
          <Button size="sm" asChild>
            <Link href={`/dashboard/owners/${owner.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />Modifier le profil
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Propriétés",          value: owner.totalProperties, Icon: Home },
          { label: "Valeur du portefeuille", value: owner.totalValue,   Icon: DollarSign },
          { label: "Revenu mensuel",       value: owner.monthlyIncome,   Icon: TrendingUp },
          { label: "Taux d'occupation",    value: owner.occupancyRate,   Icon: Building2 },
        ].map(({ label, value, Icon }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Main content ───────────────────────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="properties">
            <TabsList>
              <TabsTrigger value="properties">
                <Home className="mr-2 h-4 w-4" />Propriétés
              </TabsTrigger>
              <TabsTrigger value="contracts">
                <FileText className="mr-2 h-4 w-4" />Contrats
              </TabsTrigger>
              <TabsTrigger value="transactions">
                <DollarSign className="mr-2 h-4 w-4" />Transactions
              </TabsTrigger>
            </TabsList>

            {/* ── Properties tab ── */}
            <TabsContent value="properties" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Propriétés ({owner.properties.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {owner.properties.length > 0 ? (
                    owner.properties.map((prop) => (
                      <div
                        key={prop.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <Home className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{prop.title}</p>
                            <p className="text-sm text-muted-foreground">{prop.address}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right hidden sm:block">
                            <p className="font-medium text-foreground">
                            {prop.price} CFA
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {prop.listingType === "sale" ? "À vendre" : "À louer / mois"}
                            </p>
                          </div>
                          {getPropertyStatusBadge(prop.status ?? "unknown")}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune propriété trouvée</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Contracts tab ── */}
            <TabsContent value="contracts" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contrats actifs ({owner.contracts.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {owner.contracts.length > 0 ? (
                    owner.contracts.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between p-4 rounded-lg border border-border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{c.id}</p>
                            <p className="text-sm text-muted-foreground">{c.property}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="capitalize">
                            {c.type === "rental" ? "Location" : c.type}
                          </Badge>
                          <Badge variant="default">Signé</Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucun contrat trouvé</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Transactions tab ── */}
            <TabsContent value="transactions" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transactions récentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-0">
                  {owner.transactions.length > 0 ? (
                    owner.transactions.map((t, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-3 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{t.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(t.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`font-bold ${
                            t.amount.startsWith("+") ? "text-green-600" : "text-destructive"
                          }`}
                        >
                          {t.amount}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Aucune transaction trouvée</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Sidebar ──────────────────────────────────────────────────── */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />{owner.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />{owner.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />{owner.address}
              </div>
              <Separator />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Membre depuis</span>
                <span className="text-foreground">
                  {new Date(owner.joinedDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Dernière activité</span>
                <span className="text-foreground">{owner.lastActivity ?? "—"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">À propos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {owner.bio || "N'a pas de bio enregistrée"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" size="sm" asChild>
                <Link href={`/dashboard/owners/${owner.id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />Modifier le profil
                </Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent" size="sm">
                <Mail className="mr-2 h-4 w-4" />Envoyer un email
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}