"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft, Pencil, Download, Printer, Send,
  CheckCircle, AlertTriangle, User,
  Building2, DollarSign, CreditCard,
  Plus, Trash2, X, FileText, Banknote, Smartphone,
  Wallet, Receipt, Home, Hash,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Article {
  id: number
  facture_id: number
  libelle: string
  description: string | null
  prix_unitaire: string
  quantite: string
  total: string
}

interface Reglement {
  id: number
  facture_id: number
  montant_regle: number
  mode_paiement: string
  date_reglement: string
  date_confirmation: string | null
  reference_paiement: string | null
  statut: "en_attente" | "confirme" | "annule"
  notes: string | null
}

interface Facture {
  id: number
  numero_facture: string
  agency_id: number
  agency: any
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
  statut: "non_payee" | "partiellement_payee" | "soldee" | "annulee"
  fichier_joint: string | null
  notes: string | null
  montant_regle: number
  montant_restant: number
  articles: Article[]
  reglements: Reglement[]
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

function getDestinataireName(facture: Facture): string {
  const d = facture.destinataire
  if (!d) return "—"
  if (d.firstName && d.lastName) return `${d.firstName} ${d.lastName}`
  if (d.nom && d.prenom) return `${d.prenom} ${d.nom}`
  return d.email || "—"
}

function getDestinataireInitials(facture: Facture): string {
  const name = getDestinataireName(facture)
  return name !== "—" ? name.charAt(0).toUpperCase() : "?"
}

function getStatusConfig(statut: string) {
  const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
    non_payee: { variant: "secondary", label: "Non Payée" },
    partiellement_payee: { variant: "outline", label: "Partiellement Payée" },
    soldee: { variant: "default", label: "Soldée" },
    annulee: { variant: "destructive", label: "Annulée" },
  }
  return config[statut] || { variant: "outline", label: statut }
}

function getReglementStatusConfig(statut: string) {
  const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
    en_attente: { variant: "secondary", label: "En attente" },
    confirme: { variant: "default", label: "Confirmé" },
    annule: { variant: "destructive", label: "Annulé" },
  }
  return config[statut] || { variant: "outline", label: statut }
}

function getPaymentMethodLabel(mode: string) {
  const methods: Record<string, string> = {
    especes: "Espèces",
    virement: "Virement",
    cheque: "Chèque",
    wave: "Wave",
    orange_money: "Orange Money",
    carte_bancaire: "Carte bancaire",
  }
  return methods[mode] || mode
}

function getPaymentMethodIcon(mode: string) {
  const icons: Record<string, React.ReactNode> = {
    especes: <Banknote className="h-4 w-4" />,
    virement: <Building2 className="h-4 w-4" />,
    cheque: <FileText className="h-4 w-4" />,
    wave: <Smartphone className="h-4 w-4" />,
    orange_money: <Smartphone className="h-4 w-4" />,
    carte_bancaire: <CreditCard className="h-4 w-4" />,
  }
  return icons[mode] || <Wallet className="h-4 w-4" />
}

const paymentMethods = [
  { value: "virement", label: "Virement", Icon: Building2 },
  { value: "cheque", label: "Chèque", Icon: FileText },
  { value: "especes", label: "Espèces", Icon: Banknote },
  { value: "carte_bancaire", label: "Carte", Icon: CreditCard },
  { value: "wave", label: "Wave", Icon: Smartphone },
  { value: "orange_money", label: "Orange Money", Icon: Smartphone },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function InvoiceDetailPage() {
  const params = useParams<{ id: string }>()

  const [facture, setFacture] = useState<Facture | null>(null)
  const [loading, setLoading] = useState(true)
  const [reglements, setReglements] = useState<Reglement[]>([])

  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    montant_regle: "",
    mode_paiement: "",
    date_reglement: new Date().toISOString().split("T")[0],
    notes: "",
  })
  const [amountError, setAmountError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ─── Fetch facture ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!params.id) return

    const fetchFacture = async () => {
      try {
        // ✅ axiosInstance au lieu de fetch + localStorage
        const { data } = await axiosInstance.get<Facture>(`/api/factures/${params.id}`)
        setFacture(data)
        setReglements(data.reglements || [])
      } catch (err) {
        console.error("Erreur chargement facture:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFacture()
  }, [params.id])

  // ─── Calculs depuis les règlements locaux ────────────────────────────────
  // On calcule depuis la liste locale pour que l'UI se mette à jour
  // immédiatement après ajout d'un règlement sans refetch

  const montantTtc = facture ? parseFloat(facture.montant_ttc) : 0
  const montantHt = facture ? parseFloat(facture.montant_ht) : 0
  const montantTva = facture ? parseFloat(facture.montant_tva) : 0
  const tauxTva = facture ? parseFloat(facture.taux_tva) : 0
  const remise = facture ? parseFloat(facture.remise) : 0
  const montantRemise = facture ? parseFloat(facture.montant_remise) : 0

  // ✅ Calculé depuis la liste locale (pas depuis l'accesseur serveur)
  // ✅ parseFloat car montant_regle peut être une string selon l'API
  const totalPaid = reglements
    .filter((r) => r.statut === "confirme")
    .reduce((s, r) => s + (parseFloat(String(r.montant_regle)) || 0), 0)
  const remaining = Math.max(montantTtc - totalPaid, 0)
  const progressPct = montantTtc > 0 ? Math.min((totalPaid / montantTtc) * 100, 100) : 0

  const computedStatut =
    remaining <= 0 ? "soldee" :
      totalPaid > 0 ? "partiellement_payee" :
        (facture?.statut || "non_payee")

  const statusConfig = getStatusConfig(computedStatut)

  // ─── Payment handlers ─────────────────────────────────────────────────────

  const handleOpenPayment = () => {
    setPaymentForm({
      montant_regle: remaining.toString(),
      mode_paiement: "",
      date_reglement: new Date().toISOString().split("T")[0],
      notes: "",
    })
    setAmountError("")
    setPaymentDialogOpen(true)
  }

  const handleAddPayment = async () => {
    const amount = parseFloat(paymentForm.montant_regle)
    if (!amount || amount <= 0) { setAmountError("Veuillez entrer un montant valide."); return }
    if (amount > remaining) { setAmountError(`Le montant ne peut pas dépasser ${formatCurrency(remaining, facture?.devise)}.`); return }
    if (!paymentForm.mode_paiement) { setAmountError("Veuillez sélectionner un mode de paiement."); return }

    const payload = {
      montant_regle: amount,
      mode_paiement: paymentForm.mode_paiement,
      date_reglement: paymentForm.date_reglement,
      notes: paymentForm.notes || null,
    }

    console.log("=== PAYLOAD RÈGLEMENT ===")
    console.log(`POST /api/factures/reglements/${facture?.id}`)
    console.log(JSON.stringify(payload, null, 2))

    setIsSubmitting(true)
    try {
      // ✅ Route correcte : /api/factures/{id}/reglements
      const { data } = await axiosInstance.post(
        `/api/factures/reglements/${facture?.id}`,
        payload
      )

      console.log("=== RÉPONSE SERVEUR ===")
      console.log(data)

      // ✅ Ajouter le règlement retourné dans la liste locale
      if (data.reglement) {
        setReglements((prev) => [...prev, data.reglement])
      } else {
        // Si le serveur retourne directement le règlement
        setReglements((prev) => [...prev, data])
      }

      toast.success("Règlement enregistré avec succès !")
      setPaymentDialogOpen(false)
    } catch (err: any) {
      console.error("Erreur:", err.response || err)
      const message = err?.response?.data?.message || "Erreur lors de l'enregistrement."
      setAmountError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReglement = async (reglementId: number) => {
    if (!facture) return
    try {
      const { data } = await axiosInstance.delete(
        `/api/factures/reglements/${reglementId}`,
        { data: { factureId: facture.id } }
      )

      // ✅ Retirer le règlement de la liste
      setReglements((prev) => prev.filter((r) => r.id !== reglementId))

      // ✅ Mettre à jour la facture avec les valeurs retournées
      setFacture((prev) => prev ? {
        ...prev,
        montant_regle: data.montant_regle,
        montant_restant: data.montant_restant,
        statut: data.statut,
      } : prev)

      toast.success("Règlement supprimé.")
    } catch (err: any) {
      console.error("Erreur suppression règlement:", err)
      const message = err?.response?.data?.message || "Impossible de supprimer ce règlement."
      toast.error(message)
    }
  }

  // ─── Loading ──────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">

          {/* Tabs bar */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-muted">
            <Skeleton className="h-9 rounded-md" />
            <Skeleton className="h-9 rounded-md" />
          </div>

          {/* Facture */}
          <Card>
            <CardContent className="p-8 space-y-8">

              {/* En-tête facture */}
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <Skeleton className="h-7 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-2 text-right">
                  <Skeleton className="h-4 w-36 ml-auto" />
                  <Skeleton className="h-3 w-28 ml-auto" />
                  <Skeleton className="h-3 w-24 ml-auto" />
                </div>
              </div>

              {/* Destinataire + dates */}
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex justify-end gap-6">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Articles */}
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-5 gap-2 p-3 bg-muted/50 border-b border-border">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-3 w-full" />
                  ))}
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 p-3 border-b border-border last:border-0">
                    <Skeleton className="h-4 col-span-2" />
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                    <Skeleton className="h-4" />
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div className="flex justify-end">
                <div className="w-[300px] space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">

          {/* Destinataire */}
          <Card>
            <CardHeader><Skeleton className="h-5 w-28" /></CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-3 w-44 mt-1" />
            </CardContent>
          </Card>

          {/* Bien */}
          <Card>
            <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent className="space-y-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-48" />
            </CardContent>
          </Card>

          {/* Informations */}
          <Card>
            <CardHeader><Skeleton className="h-5 w-28" /></CardHeader>
            <CardContent className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
              <Separator />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
              <Skeleton className="h-1.5 w-full rounded-full mt-2" />
            </CardContent>
          </Card>
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

  const destinataireName = getDestinataireName(facture)

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/invoices">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{facture.numero_facture}</h1>
              <Badge variant={statusConfig.variant as any}>{statusConfig.label}</Badge>
              <Badge variant="outline">{facture.type_facture}</Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              Émise le {new Date(facture.date_emission).toLocaleDateString("fr-FR")}
              {facture.date_echeance && (
                <> · Échéance le {new Date(facture.date_echeance).toLocaleDateString("fr-FR")}</>
              )}
            </p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {/* <Button variant="outline" size="sm" className="bg-transparent">
            <Printer className="mr-2 h-4 w-4" />
            Imprimer
          </Button> */}
          {/* <Button variant="outline" size="sm" className="bg-transparent">
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button> */}
          {/* <Button variant="outline" size="sm" className="bg-transparent">
            <Send className="mr-2 h-4 w-4" />
            Envoyer
          </Button> */}
          <Button size="sm" asChild>
            <Link href={`/dashboard/invoices/${facture.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Modifier
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ── Main Content ── */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="payments">
                Règlements
                {reglements.length > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">
                    {reglements.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* ── Tab Détails ── */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground tracking-tight">FACTURE</h2>
                      <p className="text-muted-foreground mt-1 font-mono text-sm">{facture.numero_facture}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{facture.agency?.name || "Agence"}</p>
                      {facture.agency?.email && <p className="text-sm text-muted-foreground">{facture.agency.email}</p>}
                      {facture.agency?.phone && <p className="text-sm text-muted-foreground">{facture.agency.phone}</p>}
                      {facture.agency?.city && <p className="text-sm text-muted-foreground">{facture.agency.city}</p>}
                    </div>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2 mb-8">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Destinataire</p>
                      <p className="font-semibold text-foreground">{destinataireName}</p>
                      {facture.destinataire?.email && <p className="text-sm text-muted-foreground">{facture.destinataire.email}</p>}
                      {facture.destinataire?.phone && <p className="text-sm text-muted-foreground">{facture.destinataire.phone}</p>}
                      {facture.bien && <p className="text-sm text-muted-foreground mt-1">{facture.bien.title} — {facture.bien.city}</p>}
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex justify-end gap-6">
                        <span className="text-sm text-muted-foreground">Date d'émission</span>
                        <span className="text-sm font-medium">{new Date(facture.date_emission).toLocaleDateString("fr-FR")}</span>
                      </div>
                      {facture.date_echeance && (
                        <div className="flex justify-end gap-6">
                          <span className="text-sm text-muted-foreground">Échéance</span>
                          <span className="text-sm font-medium">{new Date(facture.date_echeance).toLocaleDateString("fr-FR")}</span>
                        </div>
                      )}
                      {facture.categorie && (
                        <div className="flex justify-end gap-6">
                          <span className="text-sm text-muted-foreground">Catégorie</span>
                          <span className="text-sm font-medium capitalize">{facture.categorie.replace(/_/g, " ")}</span>
                        </div>
                      )}
                      {facture.contract && (
                        <div className="flex justify-end gap-6">
                          <span className="text-sm text-muted-foreground">Contrat</span>
                          <span className="text-sm font-mono">{facture.contract.contract_number}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Articles */}
                  <div className="border border-border rounded-lg overflow-hidden mb-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Libellé</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Détails</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Prix unitaire</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Qté</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {facture.articles.map((article) => (
                          <tr key={article.id} className="border-b border-border last:border-0 hover:bg-muted/20">
                            <td className="py-3 px-4 font-medium">{article.libelle}</td>
                            <td className="py-3 px-4 text-muted-foreground hidden md:table-cell">{article.description || "—"}</td>
                            <td className="py-3 px-4 text-right">{formatCurrency(article.prix_unitaire, facture.devise)}</td>
                            <td className="py-3 px-4 text-right text-muted-foreground">{parseFloat(article.quantite)}</td>
                            <td className="py-3 px-4 text-right font-semibold">{formatCurrency(article.total, facture.devise)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totaux */}
                  <div className="flex justify-end">
                    <div className="w-[300px] space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sous-total HT</span>
                        <span>{formatCurrency(montantHt, facture.devise)}</span>
                      </div>
                      {remise > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Remise ({facture.remise}%)</span>
                          <span className="text-destructive">− {formatCurrency(montantRemise, facture.devise)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">TVA ({tauxTva}%)</span>
                        <span>{formatCurrency(montantTva, facture.devise)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total TTC</span>
                        <span className="text-lg">{formatCurrency(montantTtc, facture.devise)}</span>
                      </div>
                    </div>
                  </div>

                  {facture.notes && (
                    <div className="mt-8 pt-6 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Notes</p>
                      <p className="text-sm text-muted-foreground">{facture.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab Règlements ── */}
            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Résumé des paiements</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 rounded-lg bg-muted/50 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Total TTC</p>
                      <p className="text-xl font-bold">{formatCurrency(montantTtc, facture.devise)}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-500/10 text-center">
                      <p className="text-xs text-muted-foreground mb-1">Payé</p>
                      <p className="text-xl font-bold text-emerald-600">{formatCurrency(totalPaid, facture.devise)}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${remaining <= 0 ? "bg-emerald-500/10" : "bg-amber-500/10 border border-amber-500/20"}`}>
                      <p className={`text-xs mb-1 ${remaining <= 0 ? "text-muted-foreground" : "text-amber-600"}`}>Restant</p>
                      <p className={`text-xl font-bold ${remaining <= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                        {formatCurrency(remaining, facture.devise)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avancement</span>
                      <span className="font-medium">{Math.round(progressPct)}%</span>
                    </div>
                    <Progress value={progressPct} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle>Historique des règlements</CardTitle>
                  {!["soldee", "annulee"].includes(computedStatut) && (
                    <Button size="sm" onClick={handleOpenPayment}>
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {reglements.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucun règlement enregistré</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Mode</th>
                            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Montant</th>
                            <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Référence</th>
                            <th className="text-center py-3 px-4 font-medium text-muted-foreground">Statut</th>
                            <th className="py-3 px-4" />
                          </tr>
                        </thead>
                        <tbody>
                          {reglements.map((reglement) => {
                            const rConfig = getReglementStatusConfig(reglement.statut)
                            return (
                              <tr key={reglement.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                                <td className="py-3 px-4">{new Date(reglement.date_reglement).toLocaleDateString("fr-FR")}</td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    {getPaymentMethodIcon(reglement.mode_paiement)}
                                    <span>{getPaymentMethodLabel(reglement.mode_paiement)}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right font-semibold text-emerald-600">
                                  {formatCurrency(reglement.montant_regle, facture.devise)}
                                </td>
                                <td className="py-3 px-4 hidden md:table-cell">
                                  {reglement.reference_paiement
                                    ? <span className="font-mono text-xs text-muted-foreground">{reglement.reference_paiement}</span>
                                    : <span className="text-muted-foreground text-xs">—</span>}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <Badge variant={rConfig.variant as any}>{rConfig.label}</Badge>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 hover:bg-destructive/10"
                                    onClick={() => handleDeleteReglement(reglement.id)}
                                    title="Supprimer ce règlement"
                                  >
                                    <X className="h-4 w-4 text-destructive" />
                                  </Button>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {facture.destinataire && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><User className="h-4 w-4" />Destinataire</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getDestinataireInitials(facture)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{destinataireName}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {facture.destinataire_type === "client" ? "Client" : "Propriétaire"}
                    </p>
                  </div>
                </div>
                {facture.destinataire.phone && <p className="text-xs text-muted-foreground">{facture.destinataire.phone}</p>}
                {facture.destinataire.email && <p className="text-xs text-muted-foreground">{facture.destinataire.email}</p>}
              </CardContent>
            </Card>
          )}

          {facture.bien && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Home className="h-4 w-4" />Bien immobilier</CardTitle></CardHeader>
              <CardContent className="space-y-1">
                <p className="font-semibold text-sm">{facture.bien.title}</p>
                <p className="text-xs text-muted-foreground capitalize">{facture.bien.propertyType}</p>
                <p className="text-xs text-muted-foreground">{facture.bien.address} — {facture.bien.city}</p>
              </CardContent>
            </Card>
          )}

          {facture.contract && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Hash className="h-4 w-4" />Contrat lié</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Numéro</span>
                  <span className="font-mono text-xs font-medium">{facture.contract.contract_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{facture.contract.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Statut</span>
                  <Badge variant="outline" className="text-xs capitalize">{facture.contract.status}</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle className="text-base">Informations</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{facture.type_facture}</span>
              </div>
              {facture.categorie && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Catégorie</span>
                  <span className="font-medium capitalize">{facture.categorie.replace(/_/g, " ")}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Émission</span>
                <span className="font-medium">{new Date(facture.date_emission).toLocaleDateString("fr-FR")}</span>
              </div>
              {facture.date_echeance && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Échéance</span>
                  <span className="font-medium">{new Date(facture.date_echeance).toLocaleDateString("fr-FR")}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">HT</span>
                <span className="font-medium">{formatCurrency(montantHt, facture.devise)}</span>
              </div>
              {tauxTva > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">TVA ({tauxTva}%)</span>
                  <span className="font-medium">{formatCurrency(montantTva, facture.devise)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span>Total TTC</span>
                <span className="text-primary">{formatCurrency(montantTtc, facture.devise)}</span>
              </div>
              <Separator />
              {/* ✅ Résumé paiement dans la sidebar aussi */}
              <div className="flex justify-between text-emerald-600">
                <span>Payé</span>
                <span className="font-medium">{formatCurrency(totalPaid, facture.devise)}</span>
              </div>
              <div className="flex justify-between text-amber-600">
                <span>Restant</span>
                <span className="font-bold">{formatCurrency(remaining, facture.devise)}</span>
              </div>
              <Progress value={progressPct} className="h-1.5 mt-1" />
              <p className="text-xs text-center text-muted-foreground">{Math.round(progressPct)}% réglé</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Modal règlement ── */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Enregistrer un règlement</DialogTitle>
            <DialogDescription>Facture {facture.numero_facture} — {destinataireName}</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total TTC</p>
                <p className="font-bold text-sm">{formatCurrency(montantTtc, facture.devise)}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 text-center">
                <p className="text-xs text-muted-foreground mb-1">Déjà payé</p>
                <p className="font-bold text-emerald-600 text-sm">{formatCurrency(totalPaid, facture.devise)}</p>
              </div>
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                <p className="text-xs text-amber-600 mb-1">Restant</p>
                <p className="font-bold text-amber-600 text-sm">{formatCurrency(remaining, facture.devise)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pay-amount">Montant <span className="text-destructive">*</span></Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pay-amount"
                  type="number"
                  min="0.01"
                  max={remaining}
                  step="1"
                  placeholder="0"
                  className="pl-9"
                  value={paymentForm.montant_regle}
                  onChange={(e) => {
                    setAmountError("")
                    const val = parseFloat(e.target.value) || 0
                    setPaymentForm({
                      ...paymentForm,
                      montant_regle: val > remaining ? remaining.toString() : e.target.value
                    })
                  }}
                />
              </div>
              {paymentForm.montant_regle && parseFloat(paymentForm.montant_regle) > 0 && (
                <p className="text-xs text-muted-foreground">
                  Restant après règlement : {formatCurrency(remaining - parseFloat(paymentForm.montant_regle), facture.devise)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Mode de paiement <span className="text-destructive">*</span></Label>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map((m) => (
                  <button
                    key={m.value}
                    type="button"
                    onClick={() => { setAmountError(""); setPaymentForm({ ...paymentForm, mode_paiement: m.value }) }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-xs font-medium transition-all cursor-pointer ${paymentForm.mode_paiement === m.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                  >
                    <m.Icon className="h-4 w-4" />
                    <span className="leading-tight text-center">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pay-date">Date du règlement</Label>
              <Input
                id="pay-date"
                type="date"
                value={paymentForm.date_reglement}
                onChange={(e) => setPaymentForm({ ...paymentForm, date_reglement: e.target.value })}
              />
            </div>

            {amountError && (
              <p className="text-sm text-destructive flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {amountError}
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" className="bg-transparent" onClick={() => setPaymentDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleAddPayment}
              disabled={isSubmitting || !paymentForm.montant_regle || !paymentForm.mode_paiement}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}