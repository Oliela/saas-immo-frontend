"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useParams } from "next/navigation"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"


interface OwnerFormData {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  state: string
  zipCode: string
  status: string
  taxIdType: string
  bio: string
  bankName: string
  accountNumber: string
  routingNumber: string
  taxId: string
}

export default function OwnerEditPage() {
  const { id } = useParams()

  const [formData, setFormData] = useState<OwnerFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchOwner = async () => {
      try {
        const res = await axiosInstance.get(`/api/owners/${id}`)
        const owner = res.data

        const mappedData: OwnerFormData = {
          id: String(owner.id),
          firstName: owner.firstName ?? "",
          lastName: owner.lastName ?? "",
          email: owner.email ?? "",
          phone: owner.phone ?? "",
          address: owner.address ?? "",
          city: owner.city ?? "",
          country: owner.country ?? "",
          state: owner.state ?? "",
          zipCode: owner.zipCode ?? "",
          status: owner.status ?? "actif",
          bio: owner.bio ?? "",
          bankName: owner.bankName ?? "",
          accountNumber: owner.accountNumber ?? "",
          routingNumber: owner.routingNumber ?? "",
          taxId: owner.taxId ?? "",
          taxIdType: owner.taxIdType ?? "",
        }

        setFormData(mappedData)
      } catch (err: any) {
        setError(err.response?.data?.message || "Erreur chargement")
      } finally {
        setLoading(false)
      }
    }

    fetchOwner()
  }, [id])

  if (loading) return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-72" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-48 rounded-md" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Adresse */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full rounded-md" />
          </CardContent>
        </Card>

        {/* Informations bancaires */}
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  )
  if (error) return <p>{error}</p>
  if (!formData) return <p>Propriétaire introuvable</p>

  console.log("formData", formData)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("formData", formData)
    try {
      const res = await axiosInstance.put(`/api/owners/${formData.id}`, formData)
      console.log("res", res)
      toast.success("Propriétaire modifié avec succès")
      window.location.href = `/dashboard/owners/${formData.id}`

    } catch (err: any) {
      console.log("err", err)
      toast.error("Erreur lors de la modification du propriétaire")
    }
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


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/owners/${formData.id}`}><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Modifier le profil du propriétaire</h1>
            <p className="text-muted-foreground">{formData.firstName} {formData.lastName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm" onClick={() => handleDelete(formData.id)}><Trash2 className="mr-2 h-4 w-4" />Supprimer</Button>
          <Button size="sm"><Save className="mr-2 h-4 w-4" />Enregistrer les modifications</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
            <CardDescription>Identité et coordonnées du propriétaire</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Nom de famille</Label>
                <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Numéro de téléphone</Label>
              <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Statut</Label>
              <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                  <SelectItem value="en attente">En attente</SelectItem>
                  <SelectItem value="suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Adresse</CardTitle>
            <CardDescription>Adresse postale du propriétaire</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Adresse</Label>
              <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>Ville</Label>
                <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>État</Label>
                <Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Code postal</Label>
                <Input value={formData.zipCode} onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Pays</Label>
                <Input value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle>Biographie</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={5} />
          </CardContent>
        </Card>

        {/* Banking */}
        <Card>
          <CardHeader>
            <CardTitle>Informations bancaires</CardTitle>
            <CardDescription>Pour les dépôts de revenus locatifs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nom de la banque</Label>
              <Input value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Numéro de compte</Label>
                <Input value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Numéro de routage</Label>
                <Input value={formData.routingNumber} onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Numéro fiscal</Label>
              <Input value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Type d'identifiant fiscal</Label>
              <Input value={formData.taxIdType} onChange={(e) => setFormData({ ...formData, taxIdType: e.target.value })} />
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  )
}
