"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetAgentDetails } from "@/hooks/agence/useGetAgentDetails"
import { useUpdateAgent } from "@/hooks/agence/useUpdateAgent"

// ─── Component ────────────────────────────────────────────────────────────────

export default function AgentEditPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { data, loading: loadingDetails } = useGetAgentDetails(id)
  const { updateAgent, loading: loadingUpdate } = useUpdateAgent()

  const [formData, setFormData] = useState({
    nom:             "",
    prenom:          "",
    email:           "",
    phone:           "",
    is_active:       1,
    role:            "agent",
    first_name:      "",
    last_name:       "",
    bio:             "",
    specialization:  "",
    license_number:  "",
    commission_rate: "",
    address:         "",
  })

  // Préremplir quand les données arrivent
  useEffect(() => {
    const agent = data.agent
    if (!agent) return
    setFormData({
      nom:             agent.nom ?? "",
      prenom:          agent.prenom ?? "",
      email:           agent.email ?? "",
      phone:           agent.phone ?? "",
      is_active:       agent.is_active ?? 1,
      role:            agent.roles?.[0]?.name ?? "agent",
      first_name:      agent.profile?.first_name ?? "",
      last_name:       agent.profile?.last_name ?? "",
      bio:             agent.profile?.bio ?? "",
      specialization:  agent.profile?.specialization ?? "",
      license_number:  agent.profile?.license_number ?? "",
      commission_rate: agent.profile?.commission_rate?.toString() ?? "",
      address:         agent.profile?.address ?? "",
    })
  }, [data.agent])

  const set = (field: string, value: string | number) =>
    setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    await updateAgent(id, {
      ...formData,
      commission_rate: formData.commission_rate === "" ? undefined : parseFloat(formData.commission_rate),
    }, () => {
      router.push(`/dashboard/agents/${id}`)
    })
  }

  if (loadingDetails) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-4">
                {[...Array(4)].map((_, j) => <Skeleton key={j} className="h-10 w-full" />)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const fullName = `${formData.first_name || formData.nom} ${formData.last_name || formData.prenom}`

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/agents/${id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Modifier l'agent</h1>
            <p className="text-muted-foreground">{fullName}</p>
          </div>
        </div>
        <Button size="sm" onClick={handleSubmit} disabled={loadingUpdate}>
          <Save className="mr-2 h-4 w-4" />
          {loadingUpdate ? "Enregistrement..." : "Enregistrer"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Informations personnelles */}
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={formData.nom}
                  onChange={e => set("nom", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={formData.prenom}
                  onChange={e => set("prenom", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => set("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={e => set("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={e => set("address", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Biographie</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={e => set("bio", e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Rôle & Credentials */}
        <Card>
          <CardHeader>
            <CardTitle>Rôle et Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select value={formData.role} onValueChange={v => set("role", v)}>
                <SelectTrigger id="role"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin_agence">Admin Agence</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                  <SelectItem value="agent_junior">Agent Junior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="is_active">Statut</Label>
              <Select
                value={formData.is_active.toString()}
                onValueChange={v => set("is_active", parseInt(v))}
              >
                <SelectTrigger id="is_active"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Actif</SelectItem>
                  <SelectItem value="0">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="specialization">Spécialisation</Label>
              <Input
                id="specialization"
                value={formData.specialization}
                onChange={e => set("specialization", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license_number">Numéro de licence</Label>
              <Input
                id="license_number"
                value={formData.license_number}
                onChange={e => set("license_number", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission_rate">Taux de commission (%)</Label>
              <Input
                id="commission_rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.commission_rate}
                onChange={e => set("commission_rate", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}