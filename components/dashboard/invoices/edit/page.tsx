"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft, Save, Trash2, Plus, X,
  User, Building2, Home, Calendar,
  FileText, Calculator, AlertTriangle, Search, Users,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Command, CommandEmpty, CommandGroup,
  CommandInput, CommandItem, CommandList,
} from "@/components/ui/command"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import axiosInstance from "@/lib/axios"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Article {
  id?: number
  libelle: string
  description: string
  prix_unitaire: number
  quantite: number
}

interface Facture {
  id: number
  numero_facture: string
  agency_id: number
  destinataire_type: "client" | "proprietaire" | null
  destinataire_id: number | null
  destinataire: any | null
  bien_id: number | null
  bien: any | null
  contract_id: number | null
  contract: any | null
  date_emission: string
  date_echeance: string | null
  type_facture: string
  categorie: string | null
  sous_categorie: string | null
  montant_ht: string
  taux_tva: string
  montant_tva: string
  montant_ttc: string
  remise: string
  montant_remise: string
  devise: string
  statut: string
  notes: string | null
  articles: any[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number | string, devise = "XOF") {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: devise,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(isNaN(num) ? 0 : num)
}

function getClientName(c: any): string {
  if (!c) return "—"
  // Nouvelle structure : { client: { nom, prenom, ... }, client_id, ... }
  const client = c.client || c
  if (client.nom && client.prenom) return `${client.prenom} ${client.nom}`
  if (client.firstName && client.lastName) return `${client.firstName} ${client.lastName}`
  return client.user?.email || client.email || `#${c.id}`
}

function getClientId(c: any): number {
  // Retourne l'id du client (pas l'id du wrapper)
  return c.client?.id || c.id
}

function getClientEmail(c: any): string {
  const client = c.client || c
  return client.user?.email || client.email || ""
}

function getOwnerName(o: any): string {
  if (!o) return "—"
  if (o.firstName && o.lastName) return `${o.firstName} ${o.lastName}`
  if (o.nom && o.prenom) return `${o.prenom} ${o.nom}`
  return o.email || `#${o.id}`
}

// ─── Catégories ───────────────────────────────────────────────────────────────

const categoriesByType: Record<string, { value: string; label: string }[]> = {
  Vente: [
    { value: "honoraires_vente", label: "Honoraires de vente" },
    { value: "commission_vente", label: "Commission de vente" },
    { value: "frais_dossier", label: "Frais de dossier" },
    { value: "autres", label: "Autres" },
  ],
  Location: [
    { value: "loyer", label: "Loyer" },
    { value: "mensualite", label: "Mensualité" },
    { value: "caution", label: "Caution" },
    { value: "honoraires_location", label: "Honoraires de location" },
    { value: "frais_dossier", label: "Frais de dossier" },
    { value: "charges", label: "Charges locatives" },
    { value: "autres", label: "Autres" },
  ],
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  clients: any[]
  owners: any[]
  contracts: any[]
  biens: any[]
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function InvoiceEditPage({ clients = [], owners = [], contracts = [], biens = [] }: Props) {
  const params = useParams<{ id: string }>()
  const router = useRouter()

  const [facture, setFacture] = useState<Facture | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    date_emission: "",
    date_echeance: "",
    type_facture: "",
    categorie: "",
    sous_categorie: "",
    destinataire_type: "" as "client" | "proprietaire" | "",
    destinataire_id: "" as number | "",
    bien_id: "" as number | "",
    contract_id: "" as number | "",
    remise: "0",
    taux_tva: "0",
    devise: "XOF",
    notes: "",
  })

  const [articles, setArticles] = useState<Article[]>([])

  const [destinataireOpen, setDestinataireOpen] = useState(false)
  const [propertyOpen, setPropertyOpen] = useState(false)
  const [contractOpen, setContractOpen] = useState(false)

  // ─── Fetch ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!params.id) return
    const fetchFacture = async () => {
      try {

        const res = await axiosInstance.get(`/api/factures/${params.id}`)
        const data: Facture = await res.data
        setFacture(data)
        setForm({
          date_emission: data.date_emission?.split("T")[0] || "",
          date_echeance: data.date_echeance?.split("T")[0] || "",
          type_facture: data.type_facture || "",
          categorie: data.categorie || "",
          sous_categorie: data.sous_categorie || "",
          destinataire_type: (data.destinataire_type as any) || "",
          destinataire_id: data.destinataire_id || "",
          bien_id: data.bien_id || "",
          contract_id: data.contract_id || "",
          remise: data.remise || "0",
          taux_tva: data.taux_tva || "0",
          devise: data.devise || "XOF",
          notes: data.notes || "",
        })
        setArticles(
          (data.articles || []).map((a: any) => ({
            id: a.id,
            libelle: a.libelle,
            description: a.description || "",
            prix_unitaire: parseFloat(a.prix_unitaire) || 0,
            quantite: parseFloat(a.quantite) || 1,
          }))
        )
      } catch {
        setError("Erreur lors du chargement de la facture.")
      } finally {
        setLoading(false)
      }
    }
    fetchFacture()
  }, [params.id])

  // ─── Destinataire options ─────────────────────────────────────────────────────

  const recipientOptions = useMemo(() => {
    if (form.destinataire_type === "client") {
      // Normaliser la structure — extraire le client imbriqué
      return clients.map((c: any) => ({
        ...c.client,
        _wrapper_id: c.id, // garder l'id du wrapper si besoin
      }))
    }
    if (form.destinataire_type === "proprietaire") return owners
    return []
  }, [form.destinataire_type, clients, owners])

  const selectedRecipient = recipientOptions.find((r: any) => r.id === form.destinataire_id)
  const selectedProperty = biens.find((p: any) => p.id === form.bien_id)
  const selectedContract = contracts.find((c: any) => c.id === form.contract_id)

  // ─── Calculs ──────────────────────────────────────────────────────────────────

  const montant_ht = articles.reduce((s, a) => s + (parseFloat(String(a.prix_unitaire)) || 0) * (parseFloat(String(a.quantite)) || 0), 0)
  const remise = parseFloat(form.remise) || 0
  const taux_tva = parseFloat(form.taux_tva) || 0
  const montant_remise = Math.round(montant_ht * remise / 100 * 100) / 100
  const ht_apres_remise = Math.round((montant_ht - montant_remise) * 100) / 100
  const montant_tva = Math.round(ht_apres_remise * taux_tva / 100 * 100) / 100
  const montant_ttc = Math.round((ht_apres_remise + montant_tva) * 100) / 100

  // ─── Articles ─────────────────────────────────────────────────────────────────

  const addArticle = () => {
    setArticles([...articles, { libelle: "", description: "", prix_unitaire: 0, quantite: 1 }])
  }

  const removeArticle = (index: number) => {
    if (articles.length > 1) setArticles(articles.filter((_, i) => i !== index))
  }

  const updateArticle = (index: number, updates: Partial<Article>) => {
    setArticles(articles.map((a, i) => (i === index ? { ...a, ...updates } : a)))
  }

  // ─── Submit ───────────────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!facture) return
    setIsSaving(true)
    setError(null)

    const payload = {
      date_emission: form.date_emission,
      date_echeance: form.date_echeance || null,
      type_facture: form.type_facture,
      categorie: form.categorie || null,
      sous_categorie: form.sous_categorie || null,
      destinataire_type: form.destinataire_type || null,
      destinataire_id: form.destinataire_id || null,
      bien_id: form.bien_id || null,
      contract_id: form.contract_id || null,
      remise,
      taux_tva,
      montant_ht,
      montant_remise,
      montant_tva,
      montant_ttc,
      devise: form.devise,
      notes: form.notes || null,
      articles: articles.map((a) => ({
        libelle: a.libelle,
        description: a.description || null,
        prix_unitaire: parseFloat(String(a.prix_unitaire)) || 0,
        quantite: parseFloat(String(a.quantite)) || 1,
        total: Math.round((parseFloat(String(a.prix_unitaire)) || 0) * (parseFloat(String(a.quantite)) || 1) * 100) / 100,
      })),
    }

    // ── Debug ─────────────────────────────────────────────────────────────────
    console.log("=== PAYLOAD UPDATE FACTURE ===")
    // console.log(JSON.stringify(payload, null, 2))
    // alert("Payload prêt — voir la console pour le contenu envoyé au serveur.")
    setIsSaving(false)

    // ── Décommenter pour activer l'appel API réel ─────────────────────────────
    try {
      const res = await axiosInstance.put(`/api/factures/${facture.id}`, payload)
      router.push(`/dashboard/invoices/${facture.id}`)
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la sauvegarde.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!facture || !confirm("Supprimer cette facture ? Cette action est irréversible.")) return
    setIsDeleting(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/factures/${facture.id}`,
        { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.ok) router.push("/dashboard/invoices")
      else setError("Impossible de supprimer cette facture.")
    } catch {
      setError("Erreur réseau.")
    } finally {
      setIsDeleting(false)
    }
  }

  // ─── Loading ──────────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-5 w-40" /></CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="space-y-2">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-10 w-full rounded-md" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader><Skeleton className="h-5 w-20" /></CardHeader>
            <CardContent className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-5 w-16" /></CardHeader>
            <CardContent><Skeleton className="h-24 w-full rounded-md" /></CardContent>
          </Card>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  )

  if (!facture) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Facture introuvable.</p>
      </div>
    )
  }

  const categories = categoriesByType[form.type_facture] || []

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/invoices/${facture.id}`}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Modifier — {facture.numero_facture}
            </h1>
            <p className="text-muted-foreground text-sm">Modifiez tous les champs de la facture</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="mr-2 h-4 w-4" />
            {isDeleting ? "Suppression..." : "Supprimer"}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Sauvegarde..." : "Enregistrer"}
          </Button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Formulaire ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Dates + Type + Catégorie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="emission">
                    Date d'émission <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="emission"
                    type="date"
                    value={form.date_emission}
                    onChange={(e) => setForm({ ...form, date_emission: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="echeance">Date d'échéance</Label>
                  <Input
                    id="echeance"
                    type="date"
                    value={form.date_echeance}
                    onChange={(e) => setForm({ ...form, date_echeance: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Type <span className="text-destructive">*</span></Label>
                  <Select
                    value={form.type_facture}
                    onValueChange={(v) => setForm({ ...form, type_facture: v, categorie: "" })}
                  >
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vente">Vente</SelectItem>
                      <SelectItem value="Location">Location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Catégorie</Label>
                  <Select
                    value={form.categorie}
                    onValueChange={(v) => setForm({ ...form, categorie: v })}
                    disabled={!form.type_facture}
                  >
                    <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Destinataire */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Destinataire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Type de destinataire</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={form.destinataire_type === "client" ? "default" : "outline"}
                    className={form.destinataire_type !== "client" ? "bg-transparent" : ""}
                    onClick={() => setForm({ ...form, destinataire_type: "client", destinataire_id: "" })}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Client
                  </Button>
                  <Button
                    type="button"
                    variant={form.destinataire_type === "proprietaire" ? "default" : "outline"}
                    className={form.destinataire_type !== "proprietaire" ? "bg-transparent" : ""}
                    onClick={() => setForm({ ...form, destinataire_type: "proprietaire", destinataire_id: "" })}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Propriétaire
                  </Button>
                </div>
              </div>

              {form.destinataire_type && (
                <div className="space-y-2">
                  <Label>{form.destinataire_type === "client" ? "Client" : "Propriétaire"}</Label>
                  <Popover open={destinataireOpen} onOpenChange={setDestinataireOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between bg-transparent font-normal"
                      >
                        {selectedRecipient ? (
                          <span>
                            {form.destinataire_type === "client"
                              ? getClientName(selectedRecipient)
                              : getOwnerName(selectedRecipient)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">
                            Rechercher {form.destinataire_type === "client" ? "un client" : "un propriétaire"}...
                          </span>
                        )}
                        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Rechercher par nom ou e-mail..." />
                        <CommandList>
                          <CommandEmpty>Aucun résultat.</CommandEmpty>
                          <CommandGroup>
                            {recipientOptions.map((r: any) => {
                              const name = form.destinataire_type === "client" ? getClientName(r) : getOwnerName(r)
                              const email = r.user?.email || r.email || ""
                              return (
                                <CommandItem
                                  key={r.id}
                                  value={`${name} ${email}`}
                                  onSelect={() => {
                                    setForm({ ...form, destinataire_id: r.id })
                                    setDestinataireOpen(false)
                                  }}
                                >
                                  <div className="flex flex-col">
                                    <p className="font-medium">{name}</p>
                                    {email && <p className="text-xs text-muted-foreground">{email}</p>}
                                  </div>
                                </CommandItem>
                              )
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bien & Contrat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Bien et contrat
              </CardTitle>
              <CardDescription>Optionnel</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              {/* Bien */}
              <div className="space-y-2">
                <Label>Bien</Label>
                <Popover open={propertyOpen} onOpenChange={setPropertyOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between bg-transparent font-normal"
                    >
                      {selectedProperty ? (
                        <span className="truncate">{selectedProperty.title}</span>
                      ) : (
                        <span className="text-muted-foreground">Sélectionner un bien...</span>
                      )}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Rechercher un bien..." />
                      <CommandList>
                        <CommandEmpty>Aucun bien trouvé.</CommandEmpty>
                        <CommandGroup>
                          {biens.map((p: any) => (
                            <CommandItem
                              key={p.id}
                              value={`${p.title} ${p.city || ""}`}
                              onSelect={() => {
                                setForm({ ...form, bien_id: p.id })
                                setPropertyOpen(false)
                              }}
                            >
                              <div className="flex flex-col">
                                <p className="font-medium">{p.title}</p>
                                <p className="text-xs text-muted-foreground">{p.city}</p>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Contrat */}
              <div className="space-y-2">
                <Label>Contrat</Label>
                <Popover open={contractOpen} onOpenChange={setContractOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between bg-transparent font-normal"
                    >
                      {selectedContract ? (
                        <span>{selectedContract.contract_number}</span>
                      ) : (
                        <span className="text-muted-foreground">Sélectionner un contrat...</span>
                      )}
                      <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Rechercher un contrat..." />
                      <CommandList>
                        <CommandEmpty>Aucun contrat trouvé.</CommandEmpty>
                        <CommandGroup>
                          {contracts.map((c: any) => {
                            const clientName = c.client ? getClientName(c.client) : ""
                            return (
                              <CommandItem
                                key={c.id}
                                value={`${c.contract_number} ${clientName}`}
                                onSelect={() => {
                                  setForm({ ...form, contract_id: c.id })
                                  setContractOpen(false)
                                }}
                              >
                                <div className="flex flex-col">
                                  <p className="font-medium">{c.contract_number}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {c.type}{clientName ? ` — ${clientName}` : ""}
                                  </p>
                                </div>
                              </CommandItem>
                            )
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </CardContent>
          </Card>

          {/* Articles */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Lignes de facture
                </CardTitle>
                <CardDescription>
                  {articles.length} article{articles.length > 1 ? "s" : ""}
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" className="bg-transparent" onClick={addArticle}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground">
                        Libellé <span className="text-destructive">*</span>
                      </th>
                      <th className="text-left py-3 px-3 font-medium text-muted-foreground hidden md:table-cell">
                        Détails
                      </th>
                      <th className="text-right py-3 px-3 font-medium text-muted-foreground">Prix unitaire</th>
                      <th className="text-right py-3 px-3 font-medium text-muted-foreground">Qté</th>
                      <th className="text-right py-3 px-3 font-medium text-muted-foreground">Total</th>
                      <th className="py-3 px-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article, index) => (
                      <tr
                        key={index}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-2 px-3">
                          <Input
                            placeholder="ex: Loyer mensuel"
                            value={article.libelle}
                            onChange={(e) => updateArticle(index, { libelle: e.target.value })}
                            className="text-sm min-w-[130px]"
                          />
                        </td>
                        <td className="py-2 px-3 hidden md:table-cell">
                          <Input
                            placeholder="Détails optionnels"
                            value={article.description}
                            onChange={(e) => updateArticle(index, { description: e.target.value })}
                            className="text-sm min-w-[130px]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            value={article.prix_unitaire === 0 ? "" : article.prix_unitaire}
                            onChange={(e) => updateArticle(index, { prix_unitaire: parseFloat(e.target.value) || 0 })}
                            className="text-sm text-right min-w-[100px]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            min="0.01"
                            step="1"
                            value={article.quantite}
                            onChange={(e) => updateArticle(index, { quantite: parseFloat(e.target.value) || 1 })}
                            className="text-sm text-right w-16"
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-semibold whitespace-nowrap">
                          {formatCurrency(article.prix_unitaire * article.quantite, form.devise)}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeArticle(index)}
                            disabled={articles.length === 1}
                          >
                            <X className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Totaux */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Calculator className="h-4 w-4" />
                Totaux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total HT</span>
                <span className="font-medium">{formatCurrency(montant_ht, form.devise)}</span>
              </div>

              <div className="flex justify-between items-center gap-3">
                <span className="text-sm text-muted-foreground">Remise (%)</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number" min="0" max="100" step="0.1"
                    value={form.remise}
                    onChange={(e) => setForm({ ...form, remise: e.target.value })}
                    className="w-20 text-right text-sm"
                  />
                  {montant_remise > 0 && (
                    <span className="text-xs text-destructive whitespace-nowrap">
                      − {formatCurrency(montant_remise, form.devise)}
                    </span>
                  )}
                </div>
              </div>

              {remise > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">HT après remise</span>
                  <span className="font-medium">{formatCurrency(ht_apres_remise, form.devise)}</span>
                </div>
              )}

              <div className="flex justify-between items-center gap-3">
                <span className="text-sm text-muted-foreground">TVA (%)</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number" min="0" max="100" step="0.1"
                    value={form.taux_tva}
                    onChange={(e) => setForm({ ...form, taux_tva: e.target.value })}
                    className="w-20 text-right text-sm"
                  />
                  {montant_tva > 0 && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatCurrency(montant_tva, form.devise)}
                    </span>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/20">
                <span className="font-bold">Total TTC</span>
                <span className="font-bold text-primary text-lg">
                  {formatCurrency(montant_ttc, form.devise)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Informations complémentaires..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="resize-none"
                rows={4}
              />
            </CardContent>
          </Card>

          <Button className="w-full" onClick={handleSave} disabled={isSaving}>
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Sauvegarde..." : "Enregistrer les modifications"}
          </Button>
        </div>
      </div>
    </div>
  )
}