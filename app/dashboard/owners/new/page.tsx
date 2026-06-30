"use client"

import React, { useEffect } from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  CreditCard,
  FileText,
  Plus,
  Building2,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  MapPin,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useAgency } from "@/hooks/agence/useAgency"
import axiosInstance from "@/lib/axios"
import { Skeleton } from "@/components/ui/skeleton"

// Sample linked properties for existing owner view
const linkedProperties = [
  {
    id: "1",
    name: "Modern Downtown Apartment",
    address: "123 Main St, New York",
    type: "Apartment",
    status: "Loué",
    monthlyRent: 2500,
    image: "/images/property-1.jpg"
  },
  {
    id: "2",
    name: "Luxury Beach Villa",
    address: "456 Ocean Ave, Miami",
    type: "Villa",
    status: "Disponible",
    monthlyRent: 5500,
    image: "/images/property-2.jpg"
  },
  {
    id: "3",
    name: "Cozy Studio Loft",
    address: "789 Arts District, Los Angeles",
    type: "Studio",
    status: "Loué",
    monthlyRent: 1800,
    image: "/images/property-3.jpg"
  },
]

// Sample financial data
const financialSummary = {
  totalRevenue: 42300,
  totalExpenses: 8450,
  netIncome: 33850,
  pendingPayments: 4300,
}

const recentTransactions = [
  { id: 1, type: "income", description: "Rent - Modern Downtown Apartment", amount: 2500, date: "2026-02-01" },
  { id: 2, type: "expense", description: "Maintenance - Luxury Beach Villa", amount: 450, date: "2026-01-28" },
  { id: 3, type: "income", description: "Rent - Cozy Studio Loft", amount: 1800, date: "2026-01-15" },
  { id: 4, type: "expense", description: "Insurance - All Properties", amount: 1200, date: "2026-01-10" },
]

export default function OwnerFormPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { data: agencyData, loading } = useAgency() // Set to true for existing owner
  // console.log("agencyData", agencyData)
  const agencyId = agencyData?.agency?.id
  const [formData, setFormData] = useState({
    agency_id: agencyId,
    // Personal Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Address
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Sénégal",
    // Bank Info
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    routingNumber: "",
    accountType: "",
    // Tax Info
    taxIdType: "",
    taxId: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)


  // ✅ Met à jour agency_id une fois que agencyData est chargé
  useEffect(() => {
    if (agencyId) {
      setFormData(prev => ({ ...prev, agency_id: agencyId }))
    }
  }, [agencyId])

  // ✅ Bloque le rendu tant que les données ne sont pas là
  if (loading || !agencyId) return (
    <div className="min-h-screen bg-background">

      {/* Header */}
      <div className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-9 rounded-md" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-4 w-72" />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 space-y-6">

        {/* Tabs bar */}
        <div className="flex gap-1">
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">

            {/* Informations personnelles */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-52" />
                <Skeleton className="h-4 w-40" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-md" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations bancaires */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-56" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  ))}
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Informations fiscales */}
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-4 w-52" />
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-3 w-36" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Skeleton className="h-9 w-24 rounded-md" />
              <Skeleton className="h-9 w-40 rounded-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )


  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis"
    if (!formData.lastName.trim()) newErrors.lastName = "Le nom de famille est requis"
    if (!formData.email.trim()) newErrors.email = "L'email est requis"
    if (!formData.city.trim()) newErrors.city = "La ville est requise"
    if (!formData.address.trim()) newErrors.address = "L'adresse est requise"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide"
    }
    if (!formData.phone.trim()) newErrors.phone = "Le numéro de téléphone est requis"
    setErrors(newErrors)
    // toast.error(JSON.stringify(newErrors))
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)
    // console.log(formData)

    // await newawPromise((resolve) => setTimeout(resolve, 1500))
    try {
      const res = await axiosInstance.post("/api/owners", formData)
      // console.log(res)
      toast.success("Propriétaire créé avec succès")
      window.location.href = "/dashboard/owners"
    } catch (err: any) {
      console.error(err)
      toast.error(err.response.data.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/owners">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground">
                  {isEditMode ? "Profil du propriétaire" : "Ajouter un nouveau propriétaire"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isEditMode ? "Gérer les informations du propriétaire et ses propriétés" : "Enregistrer un nouveau propriétaire de bien"}
                </p>
              </div>
            </div>
            {isEditMode && (
              <div className="flex items-center gap-2">
                <Button variant="outline" className="bg-transparent" asChild>
                  <Link href="/dashboard/properties/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter une propriété
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            {isEditMode && (
              <>
                <TabsTrigger value="properties">Propriétés</TabsTrigger>
                <TabsTrigger value="finances">Finances</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="profile">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Personal Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Informations personnelles
                      </CardTitle>
                      <CardDescription>Coordonnées du propriétaire</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">Prénom</Label>
                          <Input
                            id="firstName"
                            placeholder="Jamil"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className={errors.firstName ? "border-destructive" : ""}
                          />
                          {errors.firstName && (
                            <p className="text-sm text-destructive">{errors.firstName}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Nom de famille</Label>
                          <Input
                            id="lastName"
                            placeholder="Seye"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className={errors.lastName ? "border-destructive" : ""}
                          />
                          {errors.lastName && (
                            <p className="text-sm text-destructive">{errors.lastName}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="jamil.seye@example.com"
                              className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                          </div>
                          {errors.email && (
                            <p className="text-sm text-destructive">{errors.email}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Numéro de téléphone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+221 77 123 45 67"
                              className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-sm text-destructive">{errors.phone}</p>
                          )}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <Label>Adresse</Label>
                        <Input
                          placeholder="Adresse"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                        {errors.lastName && (
                          <p className="text-sm text-destructive">{errors.address}</p>
                        )}
                        <div className="grid gap-4 sm:grid-cols-3">
                          <Input
                            placeholder="Ville"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          />

                          <Input
                            placeholder="État"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                          />

                          <Input
                            placeholder="Code postal"
                            value={formData.zipCode}
                            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                          />
                        </div>
                        {errors.city && (
                          <p className="text-sm text-destructive">{errors.city}</p>
                        )}
                        {errors.city && (
                          <p className="text-sm text-destructive">{errors.state}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Bank Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-primary" />
                        Informations bancaires
                      </CardTitle>
                      <CardDescription>Pour les paiements et versements de loyer</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Nom de la banque</Label>
                          <Input
                            id="bankName"
                            placeholder="Banque de Sénégal"
                            value={formData.bankName}
                            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountHolder">Nom du titulaire</Label>
                          <Input
                            id="accountHolder"
                            placeholder="Jamil Seye"
                            value={formData.accountHolder}
                            onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Numéro de compte</Label>
                          <Input
                            id="accountNumber"
                            type="password"
                            placeholder="••••••••1234"
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="routingNumber">Numéro de routage</Label>
                          <Input
                            id="routingNumber"
                            placeholder="123456789"
                            value={formData.routingNumber}
                            onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountType">Type de compte</Label>
                          <Select
                            value={formData.accountType}
                            onValueChange={(value) => setFormData({ ...formData, accountType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checking">Compte courant</SelectItem>
                              <SelectItem value="savings">Épargne</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tax Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Informations fiscales
                      </CardTitle>
                      <CardDescription>Optionnel - pour les déclarations fiscales</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="taxIdType">Type d'identifiant</Label>
                          <Select
                            value={formData.taxIdType}
                            onValueChange={(value) => setFormData({ ...formData, taxIdType: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner le type d'identifiant" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ssn">Numéro de sécurité sociale (SSS)</SelectItem>
                              <SelectItem value="ein">Numéro d'identification de l'employeur (EIN)</SelectItem>
                              <SelectItem value="itin">Numéro d'identification fiscale individuel (ITIN)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="taxId">Numéro d'identification fiscale</Label>
                          <Input
                            id="taxId"
                            type="password"
                            placeholder="••• •• ••••"
                            value={formData.taxId}
                            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Actions */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <Button type="button" variant="outline" className="bg-transparent" asChild>
                      <Link href="/dashboard/owners">Cancel</Link>
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Enregistrement..." : isEditMode ? "Enregistrer les modifications" : "Ajouter un propriétaire"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </TabsContent>

          {isEditMode && (
            <>
              <TabsContent value="properties">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Propriétés liées</CardTitle>
                        <CardDescription>Propriétés appartenant à ce propriétaire</CardDescription>
                      </div>
                      <Button asChild>
                        <Link href="/dashboard/properties/new">
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter une propriété
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {linkedProperties.map((property) => (
                        <Card key={property.id} className="overflow-hidden">
                          <div className="relative aspect-video">
                            <Image
                              src={property.image || "/placeholder.svg"}
                              alt={property.name}
                              fill
                              className="object-cover"
                            />
                            <Badge
                              className={`absolute top-2 right-2 ${property.status === "Loué"
                                ? "bg-green-100 text-green-700"
                                : "bg-blue-100 text-blue-700"
                                }`}
                            >
                              {property.status}
                            </Badge>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold truncate">{property.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="h-3 w-3" />
                              {property.address}
                            </p>
                            <div className="flex items-center justify-between mt-3">
                              <div>
                                <p className="text-xs text-muted-foreground">Loyer mensuel</p>
                                <p className="font-semibold">${property.monthlyRent.toLocaleString()}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="finances">
                <div className="space-y-6">
                  {/* Financial Summary */}
                  <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Revenu total</p>
                            <p className="text-xl font-semibold">${financialSummary.totalRevenue.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                            <TrendingDown className="h-5 w-5 text-red-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Dépenses totales</p>
                            <p className="text-xl font-semibold">${financialSummary.totalExpenses.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <DollarSign className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Revenu net</p>
                            <p className="text-xl font-semibold">${financialSummary.netIncome.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                            <Calendar className="h-5 w-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">En attente</p>
                            <p className="text-xl font-semibold">${financialSummary.pendingPayments.toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Transactions */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Transactions récentes</CardTitle>
                      <CardDescription>Derniers revenus et dépenses pour ce propriétaire</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead className="text-right">Montant</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {recentTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell className="text-muted-foreground">
                                {transaction.date}
                              </TableCell>
                              <TableCell>{transaction.description}</TableCell>
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={
                                    transaction.type === "income"
                                      ? "bg-green-50 text-green-700 border-green-200"
                                      : "bg-red-50 text-red-700 border-red-200"
                                  }
                                >
                                  {transaction.type === "income" ? "Revenu" : "Dépense"}
                                </Badge>
                              </TableCell>
                              <TableCell
                                className={`text-right font-medium ${transaction.type === "income" ? "text-green-600" : "text-red-600"
                                  }`}
                              >
                                {transaction.type === "income" ? "+" : "-"}$
                                {transaction.amount.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  )
}
