"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search, MoreHorizontal, Eye, Trash2,
  Mail, Phone, MapPin, UserPlus, Download, Heart,
  FileText, Home, Calendar, TrendingUp, CheckCircle,
  Building2, Banknote, ClipboardList, Loader2, Users
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

// ─── TYPES ───────────────────────────────────────────────────────────────────

type WishForm = {
  id: number
  property_type: string | null
  listing_type: string | null
  budget_min: string | null
  budget_max: string | null
  nb_pieces: number | null
  ville: string | null
  description: string | null
  features: string[] | null
  timeline: string | null
  statut: string
}

type Visite = {
  id: number
  status: string
  visit_schedule: {
    visit_date: string
    bien: { title: string; city: string } | null
    agent: { nom: string; prenom: string } | null
  } | null
}

type Contrat = {
  id: number
  contract_number: string
  type: string
  status: string
  amount: number
  start_date: string
  bien: { title: string; city: string } | null
  factures: Facture[]
}

type Facture = {
  id: number
  numero_facture: string
  montant_ttc: number
  statut: string
  date_emission: string
}

type Favori = {
  id: number
  title: string
  price: number
  city: string
}

type ClientItem = {
  id: number
  statut: string
  source: string
  first_contact_at: string
  client: {
    id: number
    nom: string
    prenom: string
    phone: string
    city: string | null
    user: { email: string } | null
    wish_forms: WishForm[]
    visit_reservations: Visite[]
    contracts: Contrat[]
    favorites: Favori[]
    monthly_budget: string | null
  }
}

type LeadItem = {
  id: number
  statut: string
  source: string
  first_contact_at: string
  lead: {
    id: number
    nom: string
    prenom: string
    email: string | null
    phone: string | null
    source: string
    wish_forms: WishForm[]
  }
}

type ApiData = {
  clients: ClientItem[]
  leads: LeadItem[]
  stats: {
    total: number
    prospects: number
    leads: number
    qualifies: number
    en_negociation: number
    conclus: number
  }
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────

function useAgencyClients() {
  const [data, setData] = useState<ApiData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get<ApiData>("/api/agency-clients")
        setData(response.data)
        console.log("Fetched agency clients data:", response.data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}

// ─── HELPERS / BADGES ────────────────────────────────────────────────────────

const initials = (nom: string) => nom.split(" ").map(n => n[0]).join("").toUpperCase()

const fmt = (n: number | string | null) =>
  n ? Number(n).toLocaleString("fr-FR") + " XOF" : "—"

const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("fr-FR") : "—"

const typeLabel = (type: string) =>
  type === "rental" ? "Locataire" : "Acheteur"

const StatutBadge = ({ statut }: { statut: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    prospect: { label: "Prospect", cls: "bg-sky-100 text-sky-700" },
    qualifié: { label: "Qualifié", cls: "bg-purple-100 text-purple-700" },
    en_negociation: { label: "Négociation", cls: "bg-orange-100 text-orange-700" },
    conclu: { label: "Conclu", cls: "bg-green-100 text-green-700" },
  }
  const v = map[statut] || { label: statut, cls: "bg-gray-100 text-gray-600" }
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v.cls}`}>{v.label}</span>
}

const ContratBadge = ({ statut }: { statut: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    draft: { label: "Brouillon", cls: "bg-gray-100 text-gray-600" },
    sent: { label: "Envoyé", cls: "bg-blue-100 text-blue-700" },
    approved: { label: "Approuvé", cls: "bg-purple-100 text-purple-700" },
    signed: { label: "Signé", cls: "bg-green-100 text-green-700" },
  }
  const v = map[statut] || { label: statut, cls: "bg-gray-100 text-gray-600" }
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v.cls}`}>{v.label}</span>
}

const FactureBadge = ({ statut }: { statut: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    soldee: { label: "Soldée", cls: "bg-green-100 text-green-700" },
    non_payee: { label: "Non payée", cls: "bg-red-100 text-red-700" },
    partiellement_payee: { label: "Partielle", cls: "bg-amber-100 text-amber-700" },
  }
  const v = map[statut] || { label: statut, cls: "bg-gray-100 text-gray-600" }
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v.cls}`}>{v.label}</span>
}

const VisiteBadge = ({ statut }: { statut: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    completed: { label: "Effectuée", cls: "bg-green-100 text-green-700" },
    confirmed: { label: "Confirmée", cls: "bg-blue-100 text-blue-700" },
    pending: { label: "En attente", cls: "bg-gray-100 text-gray-600" },
    cancelled: { label: "Annulée", cls: "bg-red-100 text-red-700" },
  }
  const v = map[statut] || { label: statut, cls: "bg-gray-100 text-gray-600" }
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${v.cls}`}>{v.label}</span>
}

const SourceBadge = ({ source }: { source: string }) => source === "favori" ? (
  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
    <Heart className="h-3 w-3" /> Favori
  </span>
) : (
  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
    <ClipboardList className="h-3 w-3" /> Formulaire
  </span>
)

// ─── COMPOSANTS RÉUTILISABLES ─────────────────────────────────────────────────

const Th = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th className={`text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide ${className}`}>
    {children}
  </th>
)

const ClientCell = ({ person }: { person: { id: string | number; nom: string; ville: string } }) => (
  <div className="flex items-center gap-3">
    <Avatar className="h-9 w-9">
      <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
        {initials(person.nom)}
      </AvatarFallback>
    </Avatar>
    <div>
      <Link
        href={`/dashboard/clients/${person.id}`}
        className="font-medium text-sm text-foreground hover:text-primary hover:underline underline-offset-2 transition-colors"
      >
        {person.nom}
      </Link>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
        <MapPin className="h-3 w-3" />{person.ville || "—"}
      </div>
    </div>
  </div>
)

const ContactCell = ({ person }: { person: { email: string; phone: string } }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Mail className="h-3 w-3" />{person.email || "—"}
    </div>
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Phone className="h-3 w-3" />{person.phone || "—"}
    </div>
  </div>
)

const ActionMenu = ({ id, email, nom }: { id: string | number; email?: string; nom?: string }) => {
  const handleSendEmail = () => {
    if (!email) {
      toast.error("Aucune adresse email disponible pour ce client")
      return
    }

    try {
      // Ouvrir le client de messagerie par défaut avec l'adresse email pré-remplie
      const subject = encodeURIComponent(`Message concernant votre demande - ${nom || 'Client'}`)
      const body = encodeURIComponent(`Bonjour ${nom || 'Client'},\n\nNous espérons que vous allez bien.\n\nCordialement,\nVotre équipe immobilière`)
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank')
    } catch (error) {
      toast.error("Erreur lors de l'ouverture du client de messagerie")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/dashboard/clients/${id}`}>
            <Eye className="mr-2 h-4 w-4" /> Voir le profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSendEmail}>
          <Mail className="mr-2 h-4 w-4" /> Envoyer un e-mail
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" /> Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─── TABS ─────────────────────────────────────────────────────────────────────

const TousTab = ({ tous, search }: { tous: any[]; search: string }) => {
  const filtered = tous.filter(p => p.nom.toLowerCase().includes(search.toLowerCase()))
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <Th>Client / Prospect</Th>
                <Th className="hidden md:table-cell">Contact</Th>
                <Th>Statut</Th>
                <Th className="hidden lg:table-cell">Aperçu</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={`${p._type}-${p.id}`} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4"><ClientCell person={p} /></td>
                  <td className="py-4 px-4 hidden md:table-cell"><ContactCell person={p} /></td>
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <StatutBadge statut={p.statut} />
                      {p.type_client && <p className="text-xs text-muted-foreground">{p.type_client}</p>}
                    </div>
                  </td>
                  <td className="py-4 px-4 hidden lg:table-cell">
                    {p.souhait && (
                      <p className="text-xs text-foreground">{p.souhait.type_bien} · {p.souhait.nb_pieces} pièces · {p.souhait.ville}</p>
                    )}
                    {p.contrat && (
                      <p className="text-xs text-foreground">{p.contrat.bien} · {p.contrat.montant}</p>
                    )}
                    {p.interet_confirme && (
                      <p className="text-xs text-foreground">{p.interet_confirme} · {p.budget}</p>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right"><ActionMenu id={p.id} email={p.email} nom={p.nom} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="rounded-full bg-muted p-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Aucun client trouvé</p>
                <p className="text-sm text-muted-foreground">Commencez par ajouter votre premier client.</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/clients/new">Ajouter un nouveau client</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Onglet unique Prospects = leads (data.leads) + clients avec statut "prospect"
const ProspectsTab = ({ prospects, search }: { prospects: any[]; search: string }) => {
  const filtered = prospects.filter(p => p.nom.toLowerCase().includes(search.toLowerCase()))
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <Th>Prospect</Th>
                <Th className="hidden md:table-cell">Contact</Th>
                <Th>Source</Th>
                <Th className="hidden lg:table-cell">Détails</Th>
                <Th className="hidden sm:table-cell">Date</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={`${p._origin}-${p.id}`} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4"><ClientCell person={p} /></td>
                  <td className="py-4 px-4 hidden md:table-cell"><ContactCell person={p} /></td>
                  <td className="py-4 px-4"><SourceBadge source={p.source} /></td>
                  <td className="py-4 px-4 hidden lg:table-cell">
                    {p.souhait ? (
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-foreground">
                          {p.souhait.type_bien} · {p.souhait.nb_pieces} pièces
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {p.souhait.budget_min} – {p.souhait.budget_max} · {p.souhait.ville}
                        </p>
                      </div>
                    ) : p.favoris?.length > 0 ? (
                      <div className="space-y-1">
                        {p.favoris.slice(0, 2).map((f: any, i: number) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <Home className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-foreground">{f.titre}</span>
                            {f.prix && <span className="text-xs text-muted-foreground">— {f.prix}</span>}
                          </div>
                        ))}
                        {p.favoris.length > 2 && (
                          <p className="text-xs text-muted-foreground pl-4">+{p.favoris.length - 2} autre(s)</p>
                        )}
                      </div>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell">
                    <p className="text-xs text-muted-foreground">{p.date_interaction}</p>
                  </td>
                  <td className="py-4 px-4 text-right"><ActionMenu id={p.id} email={p.email} nom={p.nom} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="rounded-full bg-muted p-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Aucun prospect trouvé</p>
                <p className="text-sm text-muted-foreground">Ajoutez un nouveau prospect pour commencer.</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/clients/new">Ajouter un nouveau client</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const QualifiesTab = ({ qualifies, search }: { qualifies: any[]; search: string }) => {
  const filtered = qualifies.filter(q => q.nom.toLowerCase().includes(search.toLowerCase()))
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <Th>Client</Th>
                <Th className="hidden md:table-cell">Contact</Th>
                <Th className="hidden lg:table-cell">Visites</Th>
                <Th>Intérêt confirmé</Th>
                <Th className="hidden sm:table-cell">Budget</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4"><ClientCell person={q} /></td>
                  <td className="py-4 px-4 hidden md:table-cell"><ContactCell person={q} /></td>
                  <td className="py-4 px-4 hidden lg:table-cell">
                    {q.visites?.length > 0 ? (
                      <div className="space-y-1.5">
                        {q.visites.slice(0, 2).map((v: any, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-foreground">{v.bien}</span>
                            <VisiteBadge statut={v.statut} />
                          </div>
                        ))}
                        {q.visites.length > 2 && (
                          <p className="text-xs text-muted-foreground pl-4">+{q.visites.length - 2} autre(s)</p>
                        )}
                      </div>
                    ) : <span className="text-xs text-muted-foreground">Aucune visite</span>}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      <span className="text-xs font-medium text-foreground">{q.interet_confirme==="-" ? "Non" : "Oui"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 ml-5">{q.type_client}</p>
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <Banknote className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium text-foreground">{q.budget}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5"> Date de la dernière visite </p>
                    <p className="text-xs text-muted-foreground mt-0.5">{q.date_derniere_visite}</p>
                  </td>
                  <td className="py-4 px-4 text-right"><ActionMenu id={q.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="rounded-full bg-muted p-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Aucun client qualifié trouvé</p>
                <p className="text-sm text-muted-foreground">Qualifiez vos premiers clients.</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/clients/new">Ajouter un nouveau client</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const NegociationTab = ({ negociations, search }: { negociations: any[]; search: string }) => {
  const filtered = negociations.filter(n => n.nom.toLowerCase().includes(search.toLowerCase()))
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <Th>Client</Th>
                <Th className="hidden md:table-cell">Contact</Th>
                <Th>Contrat</Th>
                <Th className="hidden lg:table-cell">Bien</Th>
                <Th className="hidden sm:table-cell">Type</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(n => (
                <tr key={n.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4"><ClientCell person={n} /></td>
                  <td className="py-4 px-4 hidden md:table-cell"><ContactCell person={n} /></td>
                  <td className="py-4 px-4">
                    {n.contrat ? (
                      <>
                        <p className="text-xs font-mono text-foreground font-medium">{n.contrat.numero}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <ContratBadge statut={n.contrat.statut} />
                          <span className="text-xs text-muted-foreground">{n.contrat.type}</span>
                        </div>
                        <p className="text-xs font-medium text-foreground mt-1">{n.contrat.montant}</p>
                      </>
                    ) : <span className="text-xs text-muted-foreground">Aucun contrat</span>}
                  </td>
                  <td className="py-4 px-4 hidden lg:table-cell">
                    {n.contrat?.bien ? (
                      <>
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-foreground">{n.contrat.bien}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Créé le {n.contrat.date_creation}</p>
                      </>
                    ) : <span className="text-xs text-muted-foreground">—</span>}
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell">
                    <p className="text-xs text-muted-foreground">{n.type_client}</p>
                  </td>
                  <td className="py-4 px-4 text-right"><ActionMenu id={n.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <div className="rounded-full bg-muted p-4">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-semibold text-foreground">Aucun client en négociation</p>
                <p className="text-sm text-muted-foreground">Aucun client n'est actuellement en négociation.</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/clients/new">Ajouter un nouveau client</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const ConclusTab = ({ conclus, search }: { conclus: any[]; search: string }) => {
  const filtered = conclus.filter(c => c.nom.toLowerCase().includes(search.toLowerCase()))
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <Th>Client</Th>
                <Th className="hidden md:table-cell">Contact</Th>
                <Th>Contrat signé</Th>
                <Th className="hidden lg:table-cell">Factures</Th>
                <Th className="hidden sm:table-cell">Type</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4"><ClientCell person={c} /></td>
                  <td className="py-4 px-4 hidden md:table-cell"><ContactCell person={c} /></td>
                  <td className="py-4 px-4">
                    {c.contrat ? (
                      <>
                        <div className="flex items-center gap-1.5 mb-1">
                          <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                          <span className="text-xs font-mono font-medium text-foreground">{c.contrat.numero}</span>
                        </div>
                        <p className="text-xs text-foreground">{c.contrat.bien}</p>
                        <p className="text-xs font-semibold text-foreground mt-0.5">{c.contrat.montant}</p>
                        <p className="text-xs text-muted-foreground">Signé le {c.contrat.date_signature}</p>
                      </>
                    ) : <span className="text-xs text-muted-foreground">Aucun contrat</span>}
                  </td>
                  <td className="py-4 px-4 hidden lg:table-cell">
                    {c.factures?.length > 0 ? (
                      <div className="space-y-1.5">
                        {c.factures.slice(0, 2).map((f: any, i: number) => (
                          <div key={i} className="flex items-center gap-2">
                            <FileText className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs font-mono text-muted-foreground">{f.numero}</span>
                            <span className="text-xs text-foreground font-medium">{f.montant}</span>
                            <FactureBadge statut={f.statut} />
                          </div>
                        ))}
                        {c.factures.length > 2 && (
                          <p className="text-xs text-muted-foreground pl-4">+{c.factures.length - 2} autre(s)</p>
                        )}
                      </div>
                    ) : <span className="text-xs text-muted-foreground">Aucune facture</span>}
                  </td>
                  <td className="py-4 px-4 hidden sm:table-cell">
                    <p className="text-xs text-muted-foreground">{c.type_client}</p>
                  </td>
                  <td className="py-4 px-4 text-right"><ActionMenu id={c.id} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="text-center text-muted-foreground text-sm py-10">Aucun dossier conclu</p>}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── PAGE PRINCIPALE ─────────────────────────────────────────────────────────

export default function ClientsPage() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState("tous")
  const { data, loading, error } = useAgencyClients()

  // ─── Transformation API → format composant ────────────────

  // ── Prospects = leads (data.leads) + clients avec statut "prospect" ──────────
  const prospects = [
    // Leads venant de data.leads
    ...(data?.leads ?? []).map(item => ({
      _origin: "lead" as const,
      id: item.id,
      nom: `${item.lead.prenom} ${item.lead.nom}`.trim(),
      email: item.lead.email ?? "",
      phone: item.lead.phone ?? "",
      ville: item.lead.wish_forms[0]?.ville ?? "—",
      statut: "prospect",
      source: item.lead.source,
      type_client: "Prospect",
      souhait: item.lead.wish_forms[0] ? {
        type_bien: item.lead.wish_forms[0].property_type ?? "—",
        budget_min: item.lead.wish_forms[0].budget_min
          ? Number(item.lead.wish_forms[0].budget_min).toLocaleString("fr-FR")
          : "—",
        budget_max: item.lead.wish_forms[0].budget_max
          ? Number(item.lead.wish_forms[0].budget_max).toLocaleString("fr-FR")
          : "—",
        nb_pieces: item.lead.wish_forms[0].nb_pieces ?? 0,
        ville: item.lead.wish_forms[0].ville ?? "—",
      } : null,
      favoris: [],
      date_interaction: fmtDate(item.first_contact_at),
    })),
    // Clients enregistrés avec statut "prospect"
    ...(data?.clients ?? [])
      .filter(item => item.statut === "prospect")
      .map(item => ({
        _origin: "client" as const,
        id: item.id,
        nom: `${item.client.prenom} ${item.client.nom}`.trim(),
        email: item.client.user?.email ?? "",
        phone: item.client.phone ?? "",
        ville: item.client.city ?? "—",
        statut: "prospect",
        source: item.source,
        type_client: "Prospect",
        souhait: item.client.wish_forms[0] ? {
          type_bien: item.client.wish_forms[0].property_type ?? "—",
          budget_min: item.client.wish_forms[0].budget_min
            ? Number(item.client.wish_forms[0].budget_min).toLocaleString("fr-FR")
            : "—",
          budget_max: item.client.wish_forms[0].budget_max
            ? Number(item.client.wish_forms[0].budget_max).toLocaleString("fr-FR")
            : "—",
          nb_pieces: item.client.wish_forms[0].nb_pieces ?? 0,
          ville: item.client.wish_forms[0].ville ?? "—",
        } : null,
        favoris: item.client.favorites.map(f => ({
          titre: f.title,
          prix: fmt(f.price),
        })),
        date_interaction: fmtDate(item.first_contact_at),
      })),
  ]

  const qualifies = (data?.clients ?? [])
    .filter(item => item.statut === "qualifié")
    .map(item => {
      const client = item.client
      const derniereVisite = item.client.visit_reservations[0]
      const premierContrat = item.client.contracts[0]
      return {
        id: item.id,
        nom: `${item.client.prenom} ${item.client.nom}`.trim(),
        email: item.client.user?.email ?? "",
        phone: item.client.phone ?? "",
        ville: item.client.city ?? "—",
        statut: item.statut,
        type_client: premierContrat ? typeLabel(premierContrat.type) : "Client",
        visites: item.client.visit_reservations.map(v => ({
          bien: v.visit_schedule?.bien?.title ?? "—",
          date: fmtDate(v.visit_schedule?.visit_date ?? null),
          statut: v.status,
        })),
        interet_confirme: item.client.visit_reservations
          .find(v => v.status === "completed")
          ?.visit_schedule?.bien?.title ?? "-",
        // budget: premierContrat
        //   ? fmt(premierContrat.amount)
        //   : item.client.wish_forms[0]?.budget_max
        //     ? fmt(item.client.wish_forms[0].budget_max)
        //     : "—",
        budget: client.monthly_budget,
        date_derniere_visite: derniereVisite?.visit_schedule?.visit_date
          ? fmtDate(derniereVisite.visit_schedule.visit_date)
          : "—",
      }
    })

  const negociations = (data?.clients ?? [])
    .filter(item => item.statut === "en_negociation")
    .map(item => {
      const contrat = item.client.contracts[0]
      return {
        id: item.id,
        nom: `${item.client.prenom} ${item.client.nom}`.trim(),
        email: item.client.user?.email ?? "",
        phone: item.client.phone ?? "",
        ville: item.client.city ?? "—",
        statut: item.statut,
        type_client: contrat ? typeLabel(contrat.type) : "Client",
        contrat: contrat ? {
          numero: contrat.contract_number,
          type: contrat.type === "rental" ? "Location" : "Vente",
          bien: contrat.bien?.title ?? "—",
          montant: fmt(contrat.amount),
          statut: contrat.status,
          date_creation: fmtDate(contrat.start_date),
        } : null,
      }
    })

  const conclus = (data?.clients ?? [])
    .filter(item => item.statut === "conclu")
    .map(item => {
      const contrat = item.client.contracts.find(c => c.status === "signed")
        ?? item.client.contracts[0]
      return {
        id: item.id,
        nom: `${item.client.prenom} ${item.client.nom}`.trim(),
        email: item.client.user?.email ?? "",
        phone: item.client.phone ?? "",
        ville: item.client.city ?? "—",
        statut: item.statut,
        type_client: contrat ? typeLabel(contrat.type) : "Client",
        contrat: contrat ? {
          numero: contrat.contract_number,
          type: contrat.type === "rental" ? "Location" : "Vente",
          bien: contrat.bien?.title ?? "—",
          montant: fmt(contrat.amount),
          date_signature: fmtDate(contrat.start_date),
        } : null,
        factures: (contrat?.factures ?? []).map(f => ({
          numero: f.numero_facture,
          montant: fmt(f.montant_ttc),
          statut: f.statut,
          date: fmtDate(f.date_emission),
        })),
      }
    })

  const tous = [
    ...prospects.map(p => ({ ...p, _type: "prospect" as const })),
    ...qualifies.map(q => ({ ...q, _type: "client" as const })),
    ...negociations.map(n => ({ ...n, _type: "client" as const })),
    ...conclus.map(c => ({ ...c, _type: "client" as const })),
  ]

  const stats = [
    { label: "Total", value: data?.stats.total ?? 0, icon: TrendingUp, color: "text-blue-500", tab: "tous" },
    { label: "Prospects", value: prospects.length, icon: UserPlus, color: "text-sky-500", tab: "prospects" },
    { label: "Qualifiés", value: data?.stats.qualifies ?? 0, icon: Calendar, color: "text-purple-500", tab: "qualifies" },
    { label: "Négociation", value: data?.stats.en_negociation ?? 0, icon: FileText, color: "text-orange-500", tab: "negociation" },
    { label: "Conclus", value: data?.stats.conclus ?? 0, icon: CheckCircle, color: "text-green-500", tab: "conclus" },
  ]

  // ─── États de chargement ──────────────────────────────────

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">Chargement...</span>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-destructive text-sm">Erreur : {error}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Clients & Prospects</h1>
          <p className="text-muted-foreground text-sm">Gérez et suivez votre portefeuille client</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" /> Ajouter un client
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Card
            key={s.label}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setActiveTab(s.tab)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="w-fit">
            <TabsTrigger value="tous">
              Tous
              <span className="ml-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-1.5 py-0.5 rounded-full">{tous.length}</span>
            </TabsTrigger>
            <TabsTrigger value="prospects" className="gap-1">
              <UserPlus className="h-3.5 w-3.5" /> Prospects
              <span className="ml-1 bg-sky-100 text-sky-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">{prospects.length}</span>
            </TabsTrigger>
            <TabsTrigger value="qualifies" className="gap-1">
              <Calendar className="h-3.5 w-3.5" /> Qualifiés
              <span className="ml-1 bg-purple-100 text-purple-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">{qualifies.length}</span>
            </TabsTrigger>
            <TabsTrigger value="negociation" className="gap-1">
              <FileText className="h-3.5 w-3.5" /> Négociation
              <span className="ml-1 bg-orange-100 text-orange-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">{negociations.length}</span>
            </TabsTrigger>
            <TabsTrigger value="conclus" className="gap-1">
              <CheckCircle className="h-3.5 w-3.5" /> Conclus
              <span className="ml-1 bg-green-100 text-green-700 text-xs font-semibold px-1.5 py-0.5 rounded-full">{conclus.length}</span>
            </TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-9 w-full sm:w-[220px]"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <TabsContent value="tous"><TousTab tous={tous} search={search} /></TabsContent>
        <TabsContent value="prospects"><ProspectsTab prospects={prospects} search={search} /></TabsContent>
        <TabsContent value="qualifies"><QualifiesTab qualifies={qualifies} search={search} /></TabsContent>
        <TabsContent value="negociation"><NegociationTab negociations={negociations} search={search} /></TabsContent>
        <TabsContent value="conclus"><ConclusTab conclus={conclus} search={search} /></TabsContent>
      </Tabs>
    </div>
  )
}