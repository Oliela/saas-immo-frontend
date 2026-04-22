"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft, User, Mail, Phone, FileText, Check, X,
  Download, Eye, Clock, CheckCircle, XCircle, Upload,
  Pencil, MessageSquare, Calendar, Building2, MapPin,
  Heart, DollarSign, Home, CloudUpload, Loader2,
  Banknote, Briefcase, FileCheck, AlertCircle, Star,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import axiosInstance from "@/lib/axios"
import { useAgencyClientDetails } from "@/hooks/agence/useAgencyClientDetails"

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const fmt = (n: string | number | null) =>
  n ? Number(n).toLocaleString("fr-FR") + " XOF" : "—"

const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("fr-FR") : "—"

const initials = (prenom: string, nom: string) =>
  `${prenom?.[0] ?? ""}${nom?.[0] ?? ""}`.toUpperCase()

const STORAGE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"


const DOC_LABELS: Record<string, string> = {
  id_document: "Pièce d'identité",
  income_proof: "Justificatif de revenus",
  bank_statement: "Relevé bancaire",
  recommendation_letter: "Lettre de recommandation",
  work_contract: "Contrat de travail",
  rental_history: "Historique locatif",
  other: "Autre",
}

// ─── BADGES ──────────────────────────────────────────────────────────────────

const StatutBadge = ({ statut }: { statut: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    prospect: { label: "Prospect", cls: "bg-gray-100 text-gray-600" },
    lead: { label: "Lead", cls: "bg-amber-100 text-amber-700" },
    qualifié: { label: "Qualifié", cls: "bg-purple-100 text-purple-700" },
    en_negociation: { label: "Négociation", cls: "bg-orange-100 text-orange-700" },
    conclu: { label: "Conclu", cls: "bg-green-100 text-green-700" },
  }
  const v = map[statut] || { label: statut, cls: "bg-gray-100 text-gray-600" }
  return <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${v.cls}`}>{v.label}</span>
}

const ContratBadge = ({ statut }: { statut: string }) => {
  const map: Record<string, { label: string; cls: string }> = {
    draft: { label: "Brouillon", cls: "bg-gray-100 text-gray-600" },
    sent: { label: "Envoyé", cls: "bg-blue-100 text-blue-700" },
    approved: { label: "Approuvé", cls: "bg-purple-100 text-purple-700" },
    signed: { label: "Signé", cls: "bg-green-100 text-green-700" },
    cancelled: { label: "Annulé", cls: "bg-red-100 text-red-700" },
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

const DocBadge = ({ status }: { status: 'pending' | 'approved' | 'rejected' }) => {
  if (status === 'approved')
    return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700"><CheckCircle className="h-3 w-3" /> Approuvé</span>
  if (status === 'pending')
    return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700"><Clock className="h-3 w-3" /> En attente</span>
  return <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 text-red-700"><XCircle className="h-3 w-3" /> Rejeté</span>
}

// ─── INFO ROW ─────────────────────────────────────────────────────────────────

const InfoRow = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | null }) => (
  <div className="flex items-start gap-3">
    <Icon className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  </div>
)

// ─── UPLOAD DIALOG ────────────────────────────────────────────────────────────

const UploadDialog = ({ open, onClose, clientName, clientId }: { open: boolean; onClose: () => void; clientName: string; clientId?: string | number }) => {
  const [file, setFile] = useState<File | null>(null)
  const [type, setType] = useState("")
  const [drag, setDrag] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!file || !type) return
    if (!clientId) {
      toast.error("Client introuvable pour l'upload")
      return
    }

    setIsSubmitting(true)
    console.log("Uploading document for clientId:", clientId, "type:", type, "file:", file)

    try {
      const formData = new FormData()
      formData.append("client_id", String(clientId))
      formData.append("type", type)
      formData.append("file", file)

      const token = localStorage.getItem("token")

      const res = await axiosInstance.post("/api/profile/documents/upload", formData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "multipart/form-data",
        },
      })

      if (res.status === 201) {
        toast.success("Document telecharge avec succes")
        onClose()
        setFile(null)
        setType("")
        window.location.reload()
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Erreur lors du telechargement du document"
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) { onClose(); setFile(null); setType("") } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Téléverser un document</DialogTitle>
          <DialogDescription>Document pour {clientName}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Type de document</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger><SelectValue placeholder="Sélectionner..." /></SelectTrigger>
              <SelectContent>
                {Object.entries(DOC_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Fichier</Label>
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                drag ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50"
              )}
              onClick={() => document.getElementById("file-upload")?.click()}
              onDragOver={e => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f) setFile(f) }}
            >
              <input id="file-upload" type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                onChange={e => setFile(e.target.files?.[0] ?? null)} />
              {file ? (
                <div className="space-y-1">
                  <FileText className="h-8 w-8 text-primary mx-auto" />
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                  <Button variant="ghost" size="sm" className="text-xs" onClick={e => { e.stopPropagation(); setFile(null) }}>Supprimer</Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <CloudUpload className="h-8 w-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-foreground">Glisser ou cliquer pour parcourir</p>
                  <p className="text-xs text-muted-foreground">PDF, JPG, PNG — max 20 Mo</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="bg-transparent" onClick={() => { onClose(); setFile(null); setType("") }} disabled={isSubmitting}>Annuler</Button>
          <Button onClick={handleSubmit} disabled={!file || !type || isSubmitting}>
            <Upload className="mr-2 h-4 w-4" /> {isSubmitting ? "Telechargement..." : "Televerser"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ClientDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { data, loading, error, approveDocument, rejectDocument } = useAgencyClientDetails(id)
  const [uploadOpen, setUploadOpen] = useState(false)

  const handleView = (doc?: { file_path?: string }) => {
    if (!doc?.file_path) return
    const url = `${API_BASE_URL}/storage/${doc.file_path}`
    window.open(url, "_blank")
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64 gap-2 text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="text-sm">Chargement...</span>
    </div>
  )

  if (error || !data) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <AlertCircle className="h-8 w-8 text-destructive" />
      <p className="text-destructive text-sm">{error || "Client introuvable"}</p>
      <Button variant="outline" asChild><Link href="/dashboard/clients"><ArrowLeft className="mr-2 h-4 w-4" />Retour</Link></Button>
    </div>
  )

  const isLead = data.lead_id !== null && data.client_id === null
  const client = data.client
  const lead = data.lead

  // Nom affiché
  const displayName = isLead
    ? `${lead?.prenom ?? ""} ${lead?.nom ?? ""}`.trim()
    : `${client?.prenom ?? ""} ${client?.nom ?? ""}`.trim()

  const displayEmail = isLead ? lead?.email ?? "—" : client?.user?.email ?? "—"
  const displayPhone = isLead ? lead?.phone ?? "—" : client?.phone ?? "—"

  // Complétion profil (uniquement pour clients avec compte)
  const docFields = ["id_document", "income_proof", "bank_statement", "recommendation_letter", "work_contract", "rental_history"] as const
  const profileFields = [
    { key: "prenom", label: "Prénom", complete: !!client?.prenom },
    { key: "nom", label: "Nom", complete: !!client?.nom },
    { key: "email", label: "Email", complete: !!client?.user?.email },
    { key: "phone", label: "Téléphone", complete: !!client?.phone },
    { key: "address", label: "Adresse", complete: !!client?.address },
    { key: "occupation", label: "Profession", complete: !!client?.occupation },
    ...docFields.map(k => ({ key: k, label: DOC_LABELS[k], complete: !!client?.[k as keyof typeof client] })),
  ]
  const completionPct = client
    ? Math.round((profileFields.filter(f => f.complete).length / profileFields.length) * 100)
    : 0

  // ── Handle Send Email ───────────────────────────────────────────────────────
  const handleSendEmail = async () => {
    if (!displayEmail || displayEmail === "—") {
      toast.error("Aucune adresse email disponible pour ce client")
      return
    }

    try {
      // Ouvrir le client de messagerie par défaut avec l'adresse email pré-remplie
      const subject = encodeURIComponent(`Message concernant votre demande - ${displayName}`)
      const body = encodeURIComponent(`Bonjour ${displayName},\n\nNous espérons que vous allez bien.\n\nCordialement,\nVotre équipe immobilière`)
      window.open(`mailto:${displayEmail}?subject=${subject}&body=${body}`, '_blank')

      toast.success("Client de messagerie ouvert")
    } catch (error) {
      toast.error("Erreur lors de l'ouverture du client de messagerie")
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/clients"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
              {initials(
                isLead ? lead?.prenom ?? "" : client?.prenom ?? "",
                isLead ? lead?.nom ?? "" : client?.nom ?? ""
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
              <StatutBadge statut={data.statut} />
              {isLead && (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">Prospect sans compte</span>
              )}
            </div>
            <p className="text-muted-foreground text-sm mt-0.5">
              {displayEmail} · Premier contact le {fmtDate(data.first_contact_at)}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-transparent" onClick={handleSendEmail}>
            <Mail className="mr-2 h-4 w-4" /> Envoyer un mail
          </Button>
          {!isLead && (
            <Button asChild>
              <Link href={`/dashboard/clients/${id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" /> Modifier
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* ── Alerte pour prospects sans compte ── */}
      {isLead && (
        <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700">
            Ce prospect ne possède pas encore de compte utilisateur. Afin de pouvoir réserver des visites, la création d’un compte est nécessaire.
            Il peut s’inscrire avec son adresse email existante ({displayEmail}), ou vous avez la possibilité de créer un compte en son nom et de lui communiquer ses identifiants de connexion.
          </AlertDescription>
        </Alert>
      )}

      {/* ── Layout ── */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* ── Colonne principale ── */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="w-full sm:w-auto flex-wrap h-auto gap-1">
              <TabsTrigger value="overview">Aperçu</TabsTrigger>
              {!isLead && <TabsTrigger value="documents">Documents ({client?.documents?.length ?? 0})</TabsTrigger>}
              {!isLead && <TabsTrigger value="visits">Visites ({client?.visit_reservations?.length ?? 0})</TabsTrigger>}
              {!isLead && <TabsTrigger value="interests">Intérêts ({client?.favorites?.length ?? 0})</TabsTrigger>}
              {!isLead && <TabsTrigger value="contracts">Contrats ({client?.contracts?.length ?? 0})</TabsTrigger>}
            </TabsList>

            {/* ── Aperçu ── */}
            <TabsContent value="overview" className="mt-6 space-y-6">

              {/* Informations personnelles */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Informations personnelles</CardTitle>
                    {!isLead && (
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/clients/${id}/edit`}><Pencil className="mr-2 h-3 w-3" />Modifier</Link>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  <InfoRow icon={User} label="Nom complet" value={displayName} />
                  <InfoRow icon={Mail} label="Email" value={displayEmail} />
                  <InfoRow icon={Phone} label="Téléphone" value={displayPhone} />
                  {!isLead && <InfoRow icon={MapPin} label="Adresse" value={[client?.address, client?.city, client?.country].filter(Boolean).join(", ") || null} />}
                  {!isLead && client?.birth_date && <InfoRow icon={Calendar} label="Date de naissance" value={fmtDate(client.birth_date)} />}
                </CardContent>
              </Card>

              {/* Situation professionnelle — clients avec compte seulement */}
              {!isLead && (client?.occupation || client?.employer || client?.professional_situation) && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Situation professionnelle</CardTitle></CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <InfoRow icon={Briefcase} label="Situation professionnelle" value={client?.professional_situation ?? null} />
                    <InfoRow icon={Briefcase} label="Profession" value={client?.occupation ?? null} />
                    {client?.professional_situation === "Salarié" && (
                      <>
                        <InfoRow icon={Building2} label="Employeur" value={client?.employer ?? null} />
                        <InfoRow icon={FileCheck} label="Type d'emploi" value={client?.type_employment ?? null} />
                      </>
                    )}
                    <InfoRow icon={Banknote} label="Revenu mensuel" value={fmt(client?.monthly_income ?? null)} />
                  </CardContent>
                </Card>
              )}

              {/* Préférences immobilières — clients avec compte */}
              {!isLead && (client?.property_type || client?.monthly_budget || client?.acquisition_type || client?.surface_area) && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Préférences immobilières</CardTitle></CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <InfoRow icon={Home} label="Type de bien" value={client?.property_type ?? null} />
                    <InfoRow icon={Banknote} label="Budget mensuel" value={fmt(client?.monthly_budget ?? null)} />
                    <InfoRow icon={Building2} label="Nombre de pièces" value={client?.nb_pieces ? String(client.nb_pieces) : null} />
                    <InfoRow icon={Calendar} label="Date d'emménagement" value={fmtDate(client?.move_in_date ?? null)} />
                    <InfoRow icon={Home} label="Type d'acquisition" value={client?.acquisition_type === "sale" ? "Achat" : client?.acquisition_type === "rent" ? "Location" : null} />
                    <InfoRow icon={Building2} label="Superficie souhaitée" value={client?.surface_area ? `${client.surface_area} m²` : null} />
                  </CardContent>
                </Card>
              )}

              {/* Formulaires de souhait */}
              {(isLead ? lead?.wish_forms : client?.wish_forms)?.length ? (
                <Card>
                  <CardHeader><CardTitle className="text-base">Formulaires de souhait</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {(isLead ? lead?.wish_forms : client?.wish_forms)?.map(w => (
                      <div key={w.id} className="p-4 rounded-lg border border-border space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {w.property_type && <Badge variant="outline">{w.property_type}</Badge>}
                          {w.listing_type && <Badge variant="outline">{w.listing_type === "rent" ? "Location" : w.listing_type === "buy" ? "Achat" : "Investissement"}</Badge>}
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${w.statut === "nouveau" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"}`}>{w.statut}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {w.budget_min && <div><span className="text-muted-foreground">Budget min : </span>{fmt(w.budget_min)}</div>}
                          {w.budget_max && <div><span className="text-muted-foreground">Budget max : </span>{fmt(w.budget_max)}</div>}
                          {w.nb_pieces && <div><span className="text-muted-foreground">Pièces : </span>{w.nb_pieces}</div>}
                          {w.ville && <div className="flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{w.ville}</div>}
                          {w.area_min && <div><span className="text-muted-foreground">Surface min : </span>{w.area_min} m²</div>}
                          {w.area_max && <div><span className="text-muted-foreground">Surface max : </span>{w.area_max} m²</div>}
                          {w.timeline && <div><span className="text-muted-foreground">Délai : </span>{w.timeline}</div>}
                        </div>
                        {w.features?.length ? (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {w.features.map(f => (
                              <span key={f} className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">{f}</span>
                            ))}
                          </div>
                        ) : null}
                        {w.description && <p className="text-xs text-muted-foreground italic">{w.description}</p>}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : null}

              {/* Note agent */}
              {!isLead && client?.note && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Note agent</CardTitle></CardHeader>
                  <CardContent><p className="text-sm text-foreground leading-relaxed">{client.note}</p></CardContent>
                </Card>
              )}
            </TabsContent>

            {/* ── Documents ── */}
            {!isLead && (
              <TabsContent value="documents" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Documents client</CardTitle>
                      <CardDescription>Approuvez ou rejetez les documents soumis</CardDescription>
                    </div>
                    <Button variant="outline" className="bg-transparent" onClick={() => setUploadOpen(true)}>
                      <Upload className="mr-2 h-4 w-4" /> Ajouter
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {client?.documents?.length ? client.documents.map(doc => (
                      <div key={doc.id} className="flex items-center gap-4 p-4 rounded-lg border border-border">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{doc.original_name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span>{DOC_LABELS[doc.type] ?? doc.type}</span>
                            <span>·</span>
                            <span>{fmtDate(doc.uploaded_at)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <DocBadge status={doc.status} />
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleView(doc)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {doc.status === 'pending' && (
                            <>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => approveDocument(doc.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                onClick={() => rejectDocument(doc.id)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    )) : (
                      <p className="text-center text-muted-foreground text-sm py-8">Aucun document soumis</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* ── Visites ── */}
            {!isLead && (
              <TabsContent value="visits" className="mt-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-base">Historique des visites</CardTitle>
                      <CardDescription>Visites planifiées et effectuées</CardDescription>
                    </div>
                    <Button asChild>
                      <Link href={`/dashboard/visits/new?client=${client?.id}`}>
                        <Calendar className="mr-2 h-4 w-4" /> Planifier
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {client?.visit_reservations?.length ? client.visit_reservations.map(v => (
                      <div key={v.id} className="p-4 rounded-lg border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Building2 className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium text-sm text-foreground">{v.visit_schedule?.bien?.title ?? "—"}</p>
                              <p className="text-xs text-muted-foreground">
                                {fmtDate(v.visit_schedule?.visit_date ?? null)}
                                {v.visit_schedule?.start_time ? ` à ${v.visit_schedule.start_time}` : ""}
                                {v.visit_schedule?.agent ? ` · ${v.visit_schedule.agent.prenom} ${v.visit_schedule.agent.nom}` : ""}
                              </p>
                            </div>
                          </div>
                          <VisiteBadge statut={v.status} />
                        </div>
                        {v.feedback && (
                          <div className="ml-8 p-3 rounded-md bg-muted/50">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Retour client</p>
                            <p className="text-sm text-foreground">{v.feedback}</p>
                          </div>
                        )}
                      </div>
                    )) : (
                      <p className="text-center text-muted-foreground text-sm py-8">Aucune visite</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* ── Intérêts / Favoris ── */}
            {!isLead && (
              <TabsContent value="interests" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Biens favoris</CardTitle>
                    <CardDescription>Biens mis en favori par le client</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {client?.favorites?.length ? client.favorites.map(bien => (
                      <div key={bien.id} className="flex items-center gap-4 p-4 rounded-lg border border-border">
                        <div className="h-16 w-20 rounded-lg bg-muted overflow-hidden shrink-0">
                          {bien.images?.[0] ? (
                            <img src={`${STORAGE_URL}${bien.images[0].url}`} alt={bien.title} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Home className="h-6 w-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-foreground truncate">{bien.title}</p>
                          <p className="text-xs text-muted-foreground">{bien.address}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{bien.propertyType}</Badge>
                            <span className="text-sm font-semibold text-primary">{fmt(bien.price)}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent shrink-0" asChild>
                          <Link href={`/dashboard/properties/${bien.id}`}>Voir</Link>
                        </Button>
                      </div>
                    )) : (
                      <p className="text-center text-muted-foreground text-sm py-8">Aucun favori</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            )}

            {/* ── Contrats & Factures ── */}
            {!isLead && (
              <TabsContent value="contracts" className="mt-6 space-y-4">
                {client?.contracts?.length ? client.contracts.map(contrat => (
                  <Card key={contrat.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-mono text-sm font-semibold text-foreground">{contrat.contract_number}</p>
                            <ContratBadge statut={contrat.status} />
                            <Badge variant="outline" className="text-xs">
                              {contrat.type === "rental" ? "Location" : "Vente"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {contrat.bien?.title ?? "—"} · {contrat.city} · {fmtDate(contrat.start_date)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-transparent" asChild>
                          <Link href={`/dashboard/contracts/${contrat.id}`}>
                            <Eye className="mr-2 h-3 w-3" /> Voir
                          </Link>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Montant</p>
                          <p className="text-sm font-semibold text-foreground">{fmt(contrat.amount)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Caution</p>
                          <p className="text-sm font-medium text-foreground">{fmt(contrat.deposit)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Durée</p>
                          <p className="text-sm font-medium text-foreground">{contrat.duration} mois</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Fréquence</p>
                          <p className="text-sm font-medium text-foreground">{contrat.payment_frequency ?? "—"}</p>
                        </div>
                      </div>

                      {/* Factures du contrat */}
                      {contrat.factures?.length ? (
                        <div>
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Factures</p>
                          <div className="space-y-2">
                            {contrat.factures.map(f => (
                              <div key={f.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-xs font-mono font-medium text-foreground">{f.numero_facture}</p>
                                    <p className="text-xs text-muted-foreground">{fmtDate(f.date_emission)}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-semibold text-foreground">{fmt(f.montant_ttc)}</span>
                                  <FactureBadge statut={f.statut} />
                                  <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                    <Link href={`/dashboard/factures/${f.id}`}><Eye className="h-4 w-4" /></Link>
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground">Aucune facture pour ce contrat</p>
                      )}
                    </CardContent>
                  </Card>
                )) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">Aucun contrat</p>
                      <Button className="mt-4" asChild>
                        <Link href={`/dashboard/contracts/new?client=${client?.id}`}>
                          <FileText className="mr-2 h-4 w-4" /> Créer un contrat
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">

          {/* Statut pipeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Statut pipeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {["prospect", "lead", "qualifié", "en_negociation", "conclu"].map((s, i, arr) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={cn(
                    "h-5 w-5 rounded-full flex items-center justify-center text-xs",
                    data.statut === s
                      ? "bg-primary text-primary-foreground font-bold"
                      : arr.indexOf(data.statut) > i
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                  )}>
                    {arr.indexOf(data.statut) > i ? <Check className="h-3 w-3" /> : i + 1}
                  </div>
                  <span className={cn("text-sm capitalize", data.statut === s ? "font-semibold text-foreground" : "text-muted-foreground")}>
                    {s.replace("_", " ")}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Complétion profil — clients avec compte seulement */}
          {!isLead && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Complétion du profil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-foreground">{completionPct}%</span>
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full",
                    completionPct === 100 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  )}>{completionPct === 100 ? "Complet" : "Incomplet"}</span>
                </div>
                <Progress value={completionPct} className="h-2" />
                <Separator />
                <div className="space-y-2">
                  {profileFields.map((field, i) => (
                    <div key={field.key} className="flex items-center gap-2">
                      <div className={cn("h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0",
                        field.complete ? "bg-green-500" : "bg-muted"
                      )}>
                        {field.complete
                          ? <Check className="h-3 w-3 text-white" />
                          : <span className="text-xs text-muted-foreground">{i + 1}</span>
                        }
                      </div>
                      <span className={cn("text-xs", field.complete ? "text-foreground" : "text-muted-foreground")}>
                        {field.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Résumé documents */}
          {!isLead && client?.documents?.length ? (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Total", icon: FileText, val: client.documents.length, cls: "" },
                  { label: "Approuvés", icon: CheckCircle, val: client.documents.filter(d => d.status === 'approved').length, cls: "text-green-600" },
                  { label: "En attente", icon: Clock, val: client.documents.filter(d => d.status === 'pending').length, cls: "text-amber-600" },
                  { label: "Rejetés", icon: XCircle, val: client.documents.filter(d => d.status === 'rejected').length, cls: "text-destructive" },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className={cn("text-sm text-muted-foreground flex items-center gap-1.5", r.cls)}>
                      <r.icon className="h-3.5 w-3.5" /> {r.label}
                    </span>
                    <span className="font-medium text-foreground text-sm">{r.val}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {/* Actions rapides */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actions rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent" onClick={handleSendEmail}>
                <Mail className="mr-2 h-4 w-4" /> Envoyer un mail
              </Button>
              {!isLead && (
                <>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href={`/dashboard/visits/new?client=${client?.id}`}>
                      <Calendar className="mr-2 h-4 w-4" /> Planifier une visite
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                    <Link href={`/dashboard/contracts/new?client=${client?.id}`}>
                      <FileText className="mr-2 h-4 w-4" /> Créer un contrat
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" onClick={() => setUploadOpen(true)}>
                    <Upload className="mr-2 h-4 w-4" /> Ajouter un document
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Dialog */}
      {!isLead && (
        <UploadDialog
          open={uploadOpen}
          onClose={() => setUploadOpen(false)}
          clientName={displayName}
          clientId={client?.id}
        />
      )}
    </div>
  )
}