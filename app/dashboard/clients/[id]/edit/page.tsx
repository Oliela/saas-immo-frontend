"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft, Mail, Phone, Save, Trash2, MapPin,
  User, Briefcase, Building2, Banknote, Home,
  Calendar, Loader2, Ruler,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

// ─── TYPE ─────────────────────────────────────────────────────────────────────

type FormData = {
  nom: string
  prenom: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  birth_date: string
  occupation: string
  employer: string
  type_employment: string
  professional_situation: string
  monthly_income: string
  property_type: string
  acquisition_type: string
  monthly_budget: string
  nb_pieces: string
  surface_area: string
  move_in_date: string
  note: string
}

const defaultForm: FormData = {
  nom: "", prenom: "", email: "", phone: "",
  address: "", city: "", country: "", birth_date: "",
  occupation: "", employer: "", type_employment: "",
  professional_situation: "", monthly_income: "",
  property_type: "", acquisition_type: "", monthly_budget: "",
  nb_pieces: "", surface_area: "", move_in_date: "",
  note: "",
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function formatNumber(value: string): string {
  const digits = value.replace(/\D/g, "")
  if (!digits) return ""
  return parseInt(digits, 10).toLocaleString("fr-FR")
}

function unformatNumber(value: string): string {
  return value.replace(/\s/g, "").replace(/\u00a0/g, "")
}

const Field = ({
  id, label, icon: Icon, type = "text", value, onChange, required = false, placeholder = "",
}: {
  id: string; label: string; icon?: any; type?: string
  value: string; onChange: (v: string) => void
  required?: boolean; placeholder?: string
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>
      {label}{required && <span className="text-destructive ml-1">*</span>}
    </Label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
      <Input
        id={id} type={type} value={value ?? ""}
        onChange={e => onChange(e.target.value)}
        className={Icon ? "pl-9" : ""}
        placeholder={placeholder}
      />
    </div>
  </div>
)

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ClientEditPage() {
  const params = useParams()
  const id = params.id as string

  const [formData, setFormData] = useState<FormData>(defaultForm)
  const [clientName, setClientName] = useState("")
  const [clientId, setClientId] = useState<number | null>(null)
  const [isLeadOnly, setIsLeadOnly] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // États formatés pour les champs numériques affichés
  const [budgetDisplay, setBudgetDisplay] = useState("")
  const [surfaceDisplay, setSurfaceDisplay] = useState("")
  const [incomeDisplay, setIncomeDisplay] = useState("")

  const set = (key: keyof FormData) => (value: string) =>
    setFormData(prev => ({ ...prev, [key]: value }))

  // ─── Chargement ───────────────────────────────────────
  useEffect(() => {
    if (!id) return
    setLoading(true)

    axiosInstance.get(`/api/agency-clients/client/${id}`)
      .then(res => {
        const data = res.data?.data
        const isLead = data?.lead_id !== null && data?.client_id === null

        if (isLead) {
          const lead = data?.lead
          setClientName(`${lead?.prenom ?? ""} ${lead?.nom ?? ""}`.trim())
          setIsLeadOnly(true)
          return
        }

        const client = data?.client
        if (!client) return

        setClientId(client.id)
        setClientName(`${client.prenom ?? ""} ${client.nom ?? ""}`.trim())

        const loaded: FormData = {
          nom: client.nom ?? "",
          prenom: client.prenom ?? "",
          email: client.user?.email ?? "",
          phone: client.phone ?? "",
          address: client.address ?? "",
          city: client.city ?? "",
          country: client.country ?? "",
          birth_date: client.birth_date ?? "",
          occupation: client.occupation ?? "",
          employer: client.employer ?? "",
          type_employment: client.type_employment ?? "",
          professional_situation: client.professional_situation ?? "",
          monthly_income: client.monthly_income ?? "",
          property_type: client.property_type ?? "",
          acquisition_type: client.acquisition_type ?? "",
          monthly_budget: client.monthly_budget ?? "",
          nb_pieces: client.nb_pieces ? String(client.nb_pieces) : "",
          surface_area: client.surface_area ? String(client.surface_area) : "",
          move_in_date: client.move_in_date ?? "",
          note: client.note ?? "",
        }
        setFormData(loaded)

        // Init affichage formaté
        if (client.monthly_budget) {
          setBudgetDisplay(parseInt(client.monthly_budget).toLocaleString("fr-FR"))
        }
        if (client.surface_area) {
          setSurfaceDisplay(parseInt(client.surface_area).toLocaleString("fr-FR"))
        }
        if (client.monthly_income) {
          setIncomeDisplay(parseInt(client.monthly_income).toLocaleString("fr-FR"))
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  // ─── Sauvegarde ───────────────────────────────────────
  const handleSave = async () => {
    if (!clientId) return
    setSaving(true)
    setError(null)
    try {
      await axiosInstance.put(`/api/clients/${clientId}`, {
        nom: formData.nom,
        prenom: formData.prenom,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        birth_date: formData.birth_date || null,
        occupation: formData.occupation,
        employer: formData.employer,
        type_employment: formData.type_employment,
        professional_situation: formData.professional_situation,
        monthly_income: formData.monthly_income ? unformatNumber(formData.monthly_income) : null,
        property_type: formData.property_type,
        acquisition_type: formData.acquisition_type,
        monthly_budget: formData.monthly_budget ? unformatNumber(formData.monthly_budget) : null,
        nb_pieces: formData.nb_pieces ? Number(formData.nb_pieces) : null,
        surface_area: formData.surface_area ? Number(unformatNumber(formData.surface_area)) : null,
        move_in_date: formData.move_in_date || null,
        note: formData.note,
      })
      toast.success("Client mis à jour avec succès")
    } catch (e: any) {
      setError(e.response?.data?.message ?? e.response?.data?.error ?? e.message)
      toast.error("Erreur lors de la mise à jour du client")
    } finally {
      setSaving(false)
    }
  }

  // ─── Suppression ─────────────────────────────────────
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/agency-clients/${id}`)
      window.location.href = "/dashboard/clients"
    } catch (e: any) {
      setError(e.response?.data?.message ?? e.message)
    }
  }

  const isSalarie = formData.professional_situation === "Salarié"
  const isSale = formData.acquisition_type === "sale"

  // ─── États ────────────────────────────────────────────

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">Chargement...</span>
    </div>
  )

  if (isLeadOnly) return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/clients/${id}`}><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Modifier le profil</h1>
          <p className="text-muted-foreground text-sm">{clientName}</p>
        </div>
      </div>
      <Card>
        <CardContent className="py-12 text-center space-y-3">
          <User className="h-10 w-10 text-muted-foreground mx-auto" />
          <p className="font-medium text-foreground">Ce prospect n'a pas encore de compte</p>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Les modifications de profil ne sont disponibles que pour les clients ayant créé un compte.
          </p>
          <Button variant="outline" className="mt-2" asChild>
            <Link href={`/dashboard/clients/${id}`}><ArrowLeft className="mr-2 h-4 w-4" /> Retour au profil</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )

  // ─── Formulaire ───────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/clients/${id}`}><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Modifier le profil</h1>
            <p className="text-muted-foreground text-sm">{clientName}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="bg-transparent" asChild>
            <Link href={`/dashboard/clients/${id}`}>Annuler</Link>
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving
              ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              : <Save className="mr-2 h-4 w-4" />}
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">

          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Coordonnées et identité du client</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="prenom" label="Prénom" icon={User} value={formData.prenom} onChange={set("prenom")} required />
                <Field id="nom" label="Nom" icon={User} value={formData.nom} onChange={set("nom")} required />
                <Field id="email" label="Email" icon={Mail} value={formData.email} onChange={set("email")} type="email" required />
                <Field id="phone" label="Téléphone" icon={Phone} value={formData.phone} onChange={set("phone")} required />
                <Field id="address" label="Adresse" icon={MapPin} value={formData.address} onChange={set("address")} />
                <Field id="city" label="Ville" icon={MapPin} value={formData.city} onChange={set("city")} />
                <Field id="country" label="Pays" icon={MapPin} value={formData.country} onChange={set("country")} />
                <Field id="birth_date" label="Date de naissance" icon={Calendar} value={formData.birth_date} onChange={set("birth_date")} type="date" />
              </div>
            </CardContent>
          </Card>

          {/* Situation professionnelle */}
          <Card>
            <CardHeader>
              <CardTitle>Situation professionnelle</CardTitle>
              <CardDescription>Emploi et revenus du client</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">

                {/* Situation professionnelle */}
                <div className="space-y-2">
                  <Label>Situation professionnelle</Label>
                  <Select
                    value={formData.professional_situation || ""}
                    onValueChange={val => {
                      set("professional_situation")(val)
                      // Réinitialise les champs liés si on change de situation
                      if (val !== "Salarié") {
                        set("employer")("")
                        set("type_employment")("")
                      }
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Sélectionnez votre situation" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sans emploi">Sans emploi</SelectItem>
                      <SelectItem value="Salarié">Salarié</SelectItem>
                      <SelectItem value="Entrepreneur/Chef d'entreprise">Entrepreneur / Chef d'entreprise</SelectItem>
                      <SelectItem value="Profession Libérale">Profession libérale</SelectItem>
                      <SelectItem value="Consultant">Consultant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Field id="occupation" label="Profession" icon={Briefcase} value={formData.occupation} onChange={set("occupation")} />

                {/* Champs conditionnels — visible seulement si Salarié */}
                {isSalarie && (
                  <>
                    <Field id="employer" label="Employeur" icon={Building2} value={formData.employer} onChange={set("employer")} />
                    <div className="space-y-2">
                      <Label>Type de contrat</Label>
                      <Select value={formData.type_employment || ""} onValueChange={set("type_employment")}>
                        <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="temps-plein">Temps plein</SelectItem>
                          <SelectItem value="temps-partiel">Temps partiel</SelectItem>
                          <SelectItem value="independant">Indépendant</SelectItem>
                          <SelectItem value="chomage">Sans emploi</SelectItem>
                          <SelectItem value="retraite">Retraité</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="monthly_income">Revenu mensuel (FCFA)</Label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="monthly_income"
                      type="text"
                      inputMode="numeric"
                      placeholder="Ex : 500 000"
                      value={incomeDisplay}
                      onChange={e => {
                        const formatted = formatNumber(e.target.value)
                        setIncomeDisplay(formatted)
                        set("monthly_income")(unformatNumber(formatted))
                      }}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Préférences immobilières */}
          <Card>
            <CardHeader>
              <CardTitle>Préférences immobilières</CardTitle>
              <CardDescription>Ce que le client recherche</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">

                {/* Type d'acquisition */}
                <div className="space-y-2">
                  <Label>Type d'acquisition</Label>
                  <Select
                    value={formData.acquisition_type || ""}
                    onValueChange={val => {
                      set("acquisition_type")(val)
                      // Réinitialise le budget au changement de type
                      set("monthly_budget")("")
                      setBudgetDisplay("")
                    }}
                  >
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rent">Location</SelectItem>
                      <SelectItem value="sale">Vente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Type de bien */}
                <div className="space-y-2">
                  <Label>Type de bien</Label>
                  <Select value={formData.property_type || ""} onValueChange={set("property_type")}>
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="duplex">Duplex</SelectItem>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="bureaux">Bureaux</SelectItem>
                      <SelectItem value="commerce">Commerce</SelectItem>
                      <SelectItem value="entrepot">Entrepôt</SelectItem>
                      <SelectItem value="immeuble">Immeuble</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget — conditionnel */}
                <div className="space-y-2">
                  {isSale ? (
                    <>
                      <Label htmlFor="monthly_budget">Budget d'achat (FCFA)</Label>
                      <div className="relative">
                        <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="monthly_budget"
                          type="text"
                          inputMode="numeric"
                          placeholder="Ex : 25 000 000"
                          value={budgetDisplay}
                          onChange={e => {
                            const formatted = formatNumber(e.target.value)
                            setBudgetDisplay(formatted)
                            set("monthly_budget")(unformatNumber(formatted))
                          }}
                          className="pl-9"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <Label>Budget mensuel (FCFA)</Label>
                      <Select
                        value={formData.monthly_budget || ""}
                        onValueChange={set("monthly_budget")}
                        disabled={!formData.acquisition_type}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={!formData.acquisition_type ? "Choisir d'abord le type d'acquisition" : "Sélectionner un budget"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500000.00">Moins de 500 000 FCFA</SelectItem>
                          <SelectItem value="1000000.00">500 000 – 1 000 000 FCFA</SelectItem>
                          <SelectItem value="2000000.00">1 000 000 – 2 000 000 FCFA</SelectItem>
                          <SelectItem value="5000000.00">2 000 000 – 5 000 000 FCFA</SelectItem>
                          <SelectItem value="15000000.00">5 000 000 – 15 000 000 FCFA</SelectItem>
                          <SelectItem value="15000001.00">Plus de 15 000 000 FCFA</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>

                {/* Nombre de pièces */}
                <Field
                  id="nb_pieces"
                  label="Nombre de pièces"
                  icon={Home}
                  value={formData.nb_pieces}
                  onChange={set("nb_pieces")}
                  type="number"
                  placeholder="1"
                />

                {/* Superficie */}
                <div className="space-y-2">
                  <Label htmlFor="surface_area">Superficie (m²)</Label>
                  <div className="relative">
                    <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="surface_area"
                      type="text"
                      inputMode="numeric"
                      placeholder="Ex : 120"
                      value={surfaceDisplay}
                      onChange={e => {
                        const formatted = formatNumber(e.target.value)
                        setSurfaceDisplay(formatted)
                        set("surface_area")(unformatNumber(formatted))
                      }}
                      className="pl-9"
                    />
                  </div>
                </div>

                {/* Date d'emménagement */}
                <Field id="move_in_date" label="Date d'emménagement" icon={Calendar} value={formData.move_in_date} onChange={set("move_in_date")} type="date" />
              </div>
            </CardContent>
          </Card>

          {/* Note agent */}
          <Card>
            <CardHeader>
              <CardTitle>Note interne</CardTitle>
              <CardDescription>Visible uniquement par les agents de l'agence</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ajouter des notes sur les préférences, exigences ou historique du client..."
                value={formData.note}
                onChange={e => set("note")(e.target.value)}
                className="min-h-[140px]"
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Récapitulatif */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { label: "Nom", value: [formData.prenom, formData.nom].filter(Boolean).join(" ") },
                { label: "Email", value: formData.email },
                { label: "Téléphone", value: formData.phone },
                { label: "Acquisition", value: formData.acquisition_type === "sale" ? "Vente" : formData.acquisition_type === "rent" ? "Location" : "" },
                { label: "Type bien", value: formData.property_type },
                { label: "Budget", value: formData.monthly_budget ? `${Number(unformatNumber(formData.monthly_budget)).toLocaleString("fr-FR")} FCFA` : "" },
                { label: "Superficie", value: formData.surface_area ? `${Number(unformatNumber(formData.surface_area)).toLocaleString("fr-FR")} m²` : "" },
              ].map(r => (
                <div key={r.label} className="flex justify-between gap-2">
                  <span className="text-muted-foreground flex-shrink-0">{r.label}</span>
                  <span className="font-medium text-foreground text-right truncate">{r.value || "—"}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Zone de danger */}
          <Card className="border-destructive/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-destructive">Zone de danger</CardTitle>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive bg-transparent border-destructive/30">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer le client
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer le client</AlertDialogTitle>
                    <AlertDialogDescription>
                      Cette action supprimera définitivement {clientName} et toutes ses données associées. Elle est irréversible.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={handleDelete}
                    >
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}