"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Calendar, DollarSign,
  Building2, User, Briefcase, Plus, Trash2,
  Search, Send, Home, Users, Calculator,
  ShoppingBag, MapPin, Info, CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { cn } from "@/lib/utils"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

// ─── Types de facture ─────────────────────────────────────────────────────────

const invoiceTypes = [
  { value: "Vente",    label: "Vente",    Icon: ShoppingBag },
  { value: "Location", label: "Location", Icon: MapPin },
]

const categoriesByType: Record<string, { value: string; label: string }[]> = {
  Vente: [
    { value: "commission_vente",    label: "Commission de vente" },
    { value: "frais_dossier",       label: "Frais de dossier" },
    { value: "autres",              label: "Autres" },
  ],
  Location: [
    { value: "loyer",               label: "Loyer" },
    { value: "mensualite",          label: "Mensualité" },
    { value: "caution",             label: "Caution" },
    { value: "frais_dossier",       label: "Frais de dossier" },
    { value: "charges",             label: "Charges locatives" },
    { value: "autres",              label: "Autres" },
  ],
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(amount: number, devise = "XOF") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: devise,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// Résout le nom d'un client selon la structure de l'API
function getClientName(c: any): string {
  if (c.nom && c.prenom) return `${c.prenom} ${c.nom}`
  if (c.firstName && c.lastName) return `${c.firstName} ${c.lastName}`
  return c.email || `Client #${c.id}`
}

// Résout le nom d'un propriétaire selon la structure de l'API
function getOwnerName(o: any): string {
  if (o.firstName && o.lastName) return `${o.firstName} ${o.lastName}`
  if (o.nom && o.prenom) return `${o.prenom} ${o.nom}`
  return o.email || `Propriétaire #${o.id}`
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface InvoiceLine {
  id: string
  libelle: string
  description: string
  prix_unitaire: number
  quantite: number
}

interface Props {
  agencyId: number
  clients: any[]
  owners: any[]
  contracts: any[]
  biens: any[]
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CreateInvoice({
  agencyId,
  clients,
  owners,
  contracts,
  biens,
}: Props) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ─── Form state ───────────────────────────────────────────────────────────

  const [form, setForm] = useState({
    date_emission:     new Date().toISOString().split("T")[0],
    date_echeance:     new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    type_facture:      "",
    categorie:         "",
    sous_categorie:    "",
    destinataire_type: "" as "client" | "proprietaire" | "",
    destinataire_id:   "" as number | "",
    bien_id:           "" as number | "",
    contract_id:       "" as number | "",
    remise:            "0",
    taux_tva:          "0",
    devise:            "XOF",
    notes:             "",
  })

  const [lines, setLines] = useState<InvoiceLine[]>([
    { id: "1", libelle: "", description: "", prix_unitaire: 0, quantite: 1 },
  ])

  const [destinataireOpen, setDestinataireOpen] = useState(false)
  const [propertyOpen,     setPropertyOpen]     = useState(false)
  const [contractOpen,     setContractOpen]     = useState(false)

  // ─── Options selon type destinataire ─────────────────────────────────────

  const recipientOptions = useMemo(() => {
    if (form.destinataire_type === "client")       return clients
    if (form.destinataire_type === "proprietaire") return owners
    return []
  }, [form.destinataire_type, clients, owners])

  const selectedRecipient = recipientOptions.find((r: any) => r.id === form.destinataire_id)
  const selectedProperty  = biens.find((p: any) => p.id === form.bien_id)
  const selectedContract  = contracts.find((c: any) => c.id === form.contract_id)

  // ─── Calculs ──────────────────────────────────────────────────────────────

  const montant_ht      = lines.reduce((sum, l) => sum + l.prix_unitaire * l.quantite, 0)
  const remise          = parseFloat(form.remise) || 0
  const montant_remise  = Math.round(montant_ht * remise / 100 * 100) / 100
  const ht_apres_remise = Math.round((montant_ht - montant_remise) * 100) / 100
  const taux_tva        = parseFloat(form.taux_tva) || 0
  const montant_tva     = Math.round(ht_apres_remise * taux_tva / 100 * 100) / 100
  const montant_ttc     = Math.round((ht_apres_remise + montant_tva) * 100) / 100

  // ─── Gestion des lignes ───────────────────────────────────────────────────

  const addLine = () => {
    setLines([...lines, {
      id: Date.now().toString(),
      libelle: "", description: "", prix_unitaire: 0, quantite: 1,
    }])
  }

  const removeLine = (id: string) => {
    if (lines.length > 1) setLines(lines.filter((l) => l.id !== id))
  }

  const updateLine = (id: string, updates: Partial<InvoiceLine>) => {
    setLines(lines.map((l) => (l.id === id ? { ...l, ...updates } : l)))
  }

  const handleTypeChange = (value: string) => {
    setForm({ ...form, type_facture: value, categorie: "", sous_categorie: "" })
    setLines([{ id: "1", libelle: "", description: "", prix_unitaire: 0, quantite: 1 }])
  }

  // ─── Préremplissage des lignes selon contrat ──────────────────────────────

  const prefillLinesFromContract = (contractId: number, type: string) => {
    const contract = contracts.find((c: any) => c.id === contractId)
    if (!contract) return

    const amount     = parseFloat(contract.amount)     || 0
    const deposit    = parseFloat(contract.deposit)    || 0
    const commission = parseFloat(contract.commission) || 0

    // Contrat rental + facture Location
    if (contract.type === "rental" && type === "Location") {
      const newLines: InvoiceLine[] = [
        {
          id:            Date.now().toString(),
          libelle:       "Loyer",
          description:   "Avance sur loyer",
          prix_unitaire: amount,
          quantite:      contract.cautionMonths || 1,
        },
      ]

      if (deposit > 0) {
        newLines.push({
          id:            (Date.now() + 1).toString(),
          libelle:       "Caution",
          description:   "",
          prix_unitaire: deposit,
          quantite:      contract.cautionMonths || 1,
        })
      }

      if (commission > 0) {
        newLines.push({
          id:            (Date.now() + 2).toString(),
          libelle:       "Commission",
          description:   "",
          prix_unitaire: Math.round(amount * commission / 100 * 100) / 100,
          quantite:      1,
        })
      }

      setLines(newLines)
      return
    }

    // Contrat sale + facture Vente
    if (contract.type === "sale" && type === "Vente") {
      const newLines: InvoiceLine[] = [
        {
          id:            Date.now().toString(),
          libelle:       "Prix de vente",
          description:   contract.bien?.title || "",
          prix_unitaire: amount,
          quantite:      1,
        },
      ]

      if (commission > 0) {
        newLines.push({
          id:            (Date.now() + 1).toString(),
          libelle:       "Commission agence",
          description:   `${commission}% du prix de vente`,
          prix_unitaire: Math.round(amount * commission / 100 * 100) / 100,
          quantite:      1,
        })
      }

      setLines(newLines)
    }
  }

  const handleContractSelect = (contractId: number) => {
    const contract = contracts.find((c: any) => c.id === contractId)
    if (!contract) return

    // Préremplir bien, client et contrat depuis le contrat sélectionné
    const updates: Partial<typeof form> = { contract_id: contractId }

    // Préremplir le bien lié au contrat
    if (contract.bien_id) {
      updates.bien_id = contract.bien_id
    }

    // Préremplir le destinataire
    // Contrat rental → client
    if (contract.type === "rental" && contract.client_id) {
      updates.destinataire_type = "client"
      updates.destinataire_id   = contract.client_id
    }
    // Contrat sale → client aussi
    if (contract.type === "sale" && contract.client_id) {
      updates.destinataire_type = "client"
      updates.destinataire_id   = contract.client_id
    }

    setForm((prev) => ({ ...prev, ...updates }))
    setContractOpen(false)

    // Préremplir les lignes si le type de facture est déjà choisi
    if (form.type_facture) {
      prefillLinesFromContract(contractId, form.type_facture)
    }
  }

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const payload = {
      agency_id:         agencyId,
      date_emission:     form.date_emission,
      date_echeance:     form.date_echeance || null,
      type_facture:      form.type_facture,
      categorie:         form.categorie || null,
      sous_categorie:    form.sous_categorie || null,
      destinataire_type: form.destinataire_type || null,
      destinataire_id:   form.destinataire_id   || null,
      bien_id:           form.bien_id            || null,
      contract_id:       form.contract_id        || null,
      montant_ht,
      remise,
      montant_remise,
      taux_tva,
      montant_tva,
      montant_ttc,
      devise:            form.devise,
      notes:             form.notes || null,
      articles: lines.map((l) => ({
        libelle:       l.libelle,
        description:   l.description || null,
        prix_unitaire: l.prix_unitaire,
        quantite:      l.quantite,
        total:         Math.round(l.prix_unitaire * l.quantite * 100) / 100,
      })),
    }

    console.log("=== PAYLOAD ENVOYÉ AU SERVEUR ===")
    console.log(JSON.stringify(payload, null, 2))

    // TODO: décommenter pour l'appel réel
    try {
      const token = localStorage.getItem("token")
      const response = await axiosInstance.post(`/api/factures`, payload)
      const data = await response.data
      toast.success("Facture créée avec succès !")
      router.push("/dashboard/invoices")
    } catch (err) {
      console.error(err)
      toast.error("Une erreur est survenue lors de la création de la facture.")
    }

    await new Promise((r) => setTimeout(r, 800))
    setIsSubmitting(false)
    toast.success("Payload prêt — voir la console pour le contenu envoyé au serveur.")
  }

  const isFormValid =
    form.type_facture &&
    form.categorie &&
    form.date_emission &&
    lines.length > 0 &&
    lines.every((l) => l.libelle && l.prix_unitaire > 0 && l.quantite > 0)

  // ─── Render ───────────────────────────────────────────────────────────────
console.log ("clients dans CreateInvoice:", clients);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/invoices">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Créer une facture</h1>
            <p className="text-sm text-muted-foreground">Générez une nouvelle facture pour votre agence</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent" asChild>
            <Link href="/dashboard/invoices">Annuler</Link>
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !isFormValid}>
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Création..." : "Créer la facture"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Main Form ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
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
            </CardContent>
          </Card>

          {/* Type + Catégorie */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Type de facture
              </CardTitle>
              <CardDescription>Sélectionnez le type puis la catégorie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Type <span className="text-destructive">*</span></Label>
                <div className="flex gap-3">
                  {invoiceTypes.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => handleTypeChange(t.value)}
                      className={cn(
                        "flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all cursor-pointer text-sm font-medium flex-1 justify-center",
                        form.type_facture === t.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      <t.Icon className="h-5 w-5" />
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {form.type_facture && (
                <div className="space-y-2">
                  <Label>Catégorie <span className="text-destructive">*</span></Label>
                  <Select
                    value={form.categorie}
                    onValueChange={(v) => setForm({ ...form, categorie: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesByType[form.type_facture]?.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Destinataire */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Destinataire
              </CardTitle>
              <CardDescription>À qui est destinée cette facture ?</CardDescription>
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
                  <Label>
                    {form.destinataire_type === "client" ? "Client" : "Propriétaire"}
                  </Label>
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
                              const name = form.destinataire_type === "client"
                                ? getClientName(r)
                                : getOwnerName(r)
                              const email = r.email || r.user?.email || ""
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
                                    {email && (
                                      <p className="text-xs text-muted-foreground">{email}</p>
                                    )}
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
              <CardDescription>
                Lier un bien ou un contrat (optionnel)
                {form.type_facture && (
                  <span className="flex items-center gap-1 mt-1 text-primary text-xs font-medium">
                    <Info className="h-3 w-3 shrink-0" />
                    {form.type_facture === "Location"
                      ? "Sélectionner un contrat de location préremplira les lignes automatiquement"
                      : form.type_facture === "Vente"
                      ? "Sélectionner un contrat de vente préremplira les lignes automatiquement"
                      : ""}
                  </span>
                )}
              </CardDescription>
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
                              value={`${p.title} ${p.address || ""} ${p.city || ""}`}
                              onSelect={() => {
                                setForm({ ...form, bien_id: p.id })
                                setPropertyOpen(false)
                              }}
                            >
                              <div className="flex flex-col">
                                <p className="font-medium">{p.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {p.city}{p.address ? ` — ${p.address}` : ""}
                                </p>
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
                            const clientName = c.client
                              ? getClientName(c.client)
                              : ""
                            return (
                              <CommandItem
                                key={c.id}
                                value={`${c.contract_number} ${clientName}`}
                                onSelect={() => handleContractSelect(c.id)}
                              >
                                <div className="flex flex-col">
                                  <p className="font-medium">{c.contract_number}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {c.type} {clientName ? `— ${clientName}` : ""}
                                    {c.bien?.title ? ` — ${c.bien.title}` : ""}
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

          {/* Lignes de facture */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Lignes de facture
              </CardTitle>
              <CardDescription>
                Ajoutez les articles de cette facture
                {selectedContract && form.contract_id && (
                  <span className="block mt-1 text-emerald-600 text-xs font-medium">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3 shrink-0" />
                      Lignes préremplies depuis le contrat {selectedContract.contract_number}
                    </span>
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                      <th className="text-right py-3 px-3 font-medium text-muted-foreground">
                        Prix unitaire <span className="text-destructive">*</span>
                      </th>
                      <th className="text-right py-3 px-3 font-medium text-muted-foreground">
                        Qté <span className="text-destructive">*</span>
                      </th>
                      <th className="text-right py-3 px-3 font-medium text-muted-foreground">Total</th>
                      <th className="py-3 px-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((line) => (
                      <tr
                        key={line.id}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="py-2 px-3">
                          <Input
                            placeholder="ex: Loyer mensuel"
                            value={line.libelle}
                            onChange={(e) => updateLine(line.id, { libelle: e.target.value })}
                            className="text-sm min-w-[140px]"
                          />
                        </td>
                        <td className="py-2 px-3 hidden md:table-cell">
                          <Input
                            placeholder="Détails optionnels"
                            value={line.description}
                            onChange={(e) => updateLine(line.id, { description: e.target.value })}
                            className="text-sm min-w-[140px]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="0"
                            value={line.prix_unitaire === 0 ? "" : line.prix_unitaire}
                            onChange={(e) =>
                              updateLine(line.id, { prix_unitaire: parseFloat(e.target.value) || 0 })
                            }
                            className="text-sm text-right min-w-[100px]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <Input
                            type="number"
                            min="0.01"
                            step="1"
                            value={line.quantite}
                            onChange={(e) =>
                              updateLine(line.id, { quantite: parseFloat(e.target.value) || 1 })
                            }
                            className="text-sm text-right w-16"
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-semibold text-foreground whitespace-nowrap">
                          {formatCurrency(line.prix_unitaire * line.quantite, form.devise)}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeLine(line.id)}
                            disabled={lines.length === 1}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full bg-transparent"
                onClick={addLine}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter une ligne
              </Button>
            </CardContent>
          </Card>

          {/* Totaux */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Totaux
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-w-sm ml-auto">
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-muted-foreground">Sous-total HT</span>
                  <span className="font-semibold">{formatCurrency(montant_ht, form.devise)}</span>
                </div>

                <div className="flex justify-between items-center gap-4 py-2">
                  <span className="text-sm text-muted-foreground">Remise (%)</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={form.remise}
                      onChange={(e) => setForm({ ...form, remise: e.target.value })}
                      className="w-20 text-right text-sm"
                    />
                    {montant_remise > 0 && (
                      <span className="text-sm text-destructive whitespace-nowrap">
                        − {formatCurrency(montant_remise, form.devise)}
                      </span>
                    )}
                  </div>
                </div>

                {remise > 0 && (
                  <div className="flex justify-between items-center py-2 text-sm">
                    <span className="text-muted-foreground">HT après remise</span>
                    <span className="font-medium">{formatCurrency(ht_apres_remise, form.devise)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center gap-4 py-2">
                  <span className="text-sm text-muted-foreground">TVA (%)</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={form.taux_tva}
                      onChange={(e) => setForm({ ...form, taux_tva: e.target.value })}
                      className="w-20 text-right text-sm"
                    />
                    {montant_tva > 0 && (
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {formatCurrency(montant_tva, form.devise)}
                      </span>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between items-center p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <span className="text-base font-bold">Total TTC</span>
                  <span className="text-lg font-bold text-primary">
                    {formatCurrency(montant_ttc, form.devise)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>Informations complémentaires (optionnel)</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Conditions de paiement, instructions particulières..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="resize-none"
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4 h-fit sticky top-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Résumé</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">

              {/* Type */}
              {form.type_facture && (
                <div>
                  <p className="text-muted-foreground">Type</p>
                  <p className="font-medium">{form.type_facture}</p>
                </div>
              )}

              {/* Catégorie */}
              {form.categorie && (
                <div>
                  <p className="text-muted-foreground">Catégorie</p>
                  <p className="font-medium">
                    {categoriesByType[form.type_facture]?.find((c) => c.value === form.categorie)?.label}
                  </p>
                </div>
              )}

              {/* Destinataire */}
              {selectedRecipient && (
                <div>
                  <p className="text-muted-foreground">Destinataire</p>
                  <p className="font-medium">
                    {form.destinataire_type === "client"
                      ? getClientName(selectedRecipient)
                      : getOwnerName(selectedRecipient)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedRecipient.email || selectedRecipient.user?.email || ""}
                  </p>
                </div>
              )}

              {/* Bien */}
              {selectedProperty && (
                <div>
                  <p className="text-muted-foreground">Bien</p>
                  <p className="font-medium">{selectedProperty.title}</p>
                  <p className="text-xs text-muted-foreground">{selectedProperty.city}</p>
                </div>
              )}

              {/* Contrat */}
              {selectedContract && (
                <div>
                  <p className="text-muted-foreground">Contrat</p>
                  <p className="font-medium">{selectedContract.contract_number}</p>
                  <p className="text-xs text-muted-foreground">{selectedContract.type}</p>
                </div>
              )}

              <Separator />

              {/* Articles */}
              {lines.some((l) => l.libelle) && (
                <>
                  <div>
                    <p className="text-muted-foreground mb-2">
                      Articles ({lines.filter((l) => l.libelle).length} ligne{lines.filter((l) => l.libelle).length > 1 ? "s" : ""})
                    </p>
                    <div className="space-y-1">
                      {lines.map((line) =>
                        line.libelle ? (
                          <div
                            key={line.id}
                            className="flex justify-between items-start gap-2 py-1.5 border-b border-border/50 last:border-0"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-xs">{line.libelle}</p>
                              {line.description && (
                                <p className="text-xs text-muted-foreground truncate">{line.description}</p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {line.quantite} × {formatCurrency(line.prix_unitaire, form.devise)}
                              </p>
                            </div>
                            <span className="text-xs font-semibold whitespace-nowrap">
                              {formatCurrency(line.prix_unitaire * line.quantite, form.devise)}
                            </span>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                  <Separator />
                </>
              )}

              {/* Totaux */}
              <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total HT</span>
                  <span>{formatCurrency(montant_ht, form.devise)}</span>
                </div>
                {remise > 0 && (
                  <div className="flex justify-between text-destructive">
                    <span>Remise ({form.remise}%)</span>
                    <span>− {formatCurrency(montant_remise, form.devise)}</span>
                  </div>
                )}
                {taux_tva > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>TVA ({form.taux_tva}%)</span>
                    <span>{formatCurrency(montant_tva, form.devise)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold border-t border-border pt-2">
                  <span>Total TTC</span>
                  <span className="text-primary">{formatCurrency(montant_ttc, form.devise)}</span>
                </div>
              </div>

              {/* Submit */}
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting || !isFormValid}
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting ? "Création..." : "Créer la facture"}
              </Button>

              {!isFormValid && (
                <p className="text-xs text-muted-foreground text-center">
                  Complétez le type, la catégorie et au moins une ligne
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}