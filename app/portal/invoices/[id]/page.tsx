"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  ArrowLeft, Download, Printer, DollarSign,
  Calendar, Building2, FileText, Banknote,
  Smartphone, CreditCard, Wallet, Hash,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import axiosInstance from "@/lib/axios"
import { usePdfDownload } from "@/hooks/usePdfDownload" // ← AJOUT

// ─── Types ────────────────────────────────────────────────────────

interface Article {
  id: number
  libelle: string
  description: string | null
  prix_unitaire: string
  quantite: string
  total: string
}

interface Reglement {
  id: number
  montant_regle: string
  mode_paiement: string
  date_reglement: string
  reference_paiement: string | null
  statut: "en_attente" | "confirme" | "annule"
  notes: string | null
}

interface Facture {
  id: number
  numero_facture: string
  agency: any
  destinataire: any | null
  bien: any | null
  contract: any | null
  date_emission: string
  date_echeance: string | null
  type_facture: string
  categorie: string | null
  montant_ht: string
  taux_tva: string
  montant_tva: string
  montant_ttc: string
  remise: string
  montant_remise: string
  devise: string
  statut: "non_payee" | "partiellement_payee" | "soldee" | "annulee"
  notes: string | null
  montant_regle: number
  montant_restant: number
  articles: Article[]
  reglements: Reglement[]
}

// ─── Helpers ──────────────────────────────────────────────────────

function formatCurrency(amount: number | string, devise = "XOF") {
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  return new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: devise,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(isNaN(num) ? 0 : num)
}

function getStatusConfig(statut: string) {
  const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
    non_payee:           { variant: "secondary",  label: "En attente" },
    partiellement_payee: { variant: "outline",    label: "Partiellement payée" },
    soldee:              { variant: "default",     label: "Payée" },
    annulee:             { variant: "destructive", label: "Annulée" },
  }
  return config[statut] || { variant: "outline", label: statut }
}

function getReglementStatusConfig(statut: string) {
  const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
    en_attente: { variant: "secondary",   label: "En attente" },
    confirme:   { variant: "default",     label: "Confirmé" },
    annule:     { variant: "destructive", label: "Annulé" },
  }
  return config[statut] || { variant: "outline", label: statut }
}

function getPaymentMethodLabel(mode: string) {
  const methods: Record<string, string> = {
    especes: "Espèces", virement: "Virement", cheque: "Chèque",
    wave: "Wave", orange_money: "Orange Money", carte_bancaire: "Carte bancaire",
  }
  return methods[mode] || mode
}

function getPaymentMethodIcon(mode: string) {
  const icons: Record<string, React.ReactNode> = {
    especes: <Banknote className="h-4 w-4" />, virement: <Building2 className="h-4 w-4" />,
    cheque: <FileText className="h-4 w-4" />, wave: <Smartphone className="h-4 w-4" />,
    orange_money: <Smartphone className="h-4 w-4" />, carte_bancaire: <CreditCard className="h-4 w-4" />,
  }
  return icons[mode] || <Wallet className="h-4 w-4" />
}

function getDestinataireName(facture: Facture): string {
  const d = facture.destinataire
  if (!d) return "—"
  if (d.nom && d.prenom) return `${d.prenom} ${d.nom}`
  if (d.firstName && d.lastName) return `${d.firstName} ${d.lastName}`
  return d.email || "—"
}

// ─── Component ────────────────────────────────────────────────────

export default function PortalInvoiceDetailPage() {
  const params = useParams<{ id: string }>()
  const { open: openPdf, isLoading: isPdfLoading } = usePdfDownload() // ← AJOUT

  const [facture,    setFacture]    = useState<Facture | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [reglements, setReglements] = useState<Reglement[]>([])

  useEffect(() => {
    if (!params.id) return
    const fetchFacture = async () => {
      try {
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

  const montantTtc    = facture ? parseFloat(facture.montant_ttc)    : 0
  const montantHt     = facture ? parseFloat(facture.montant_ht)     : 0
  const montantTva    = facture ? parseFloat(facture.montant_tva)    : 0
  const tauxTva       = facture ? parseFloat(facture.taux_tva)       : 0
  const remise        = facture ? parseFloat(facture.remise)         : 0
  const montantRemise = facture ? parseFloat(facture.montant_remise) : 0

  const totalPaid   = reglements.filter((r) => r.statut === "confirme").reduce((s, r) => s + (parseFloat(String(r.montant_regle)) || 0), 0)
  const remaining   = Math.max(montantTtc - totalPaid, 0)
  const progressPct = montantTtc > 0 ? Math.min((totalPaid / montantTtc) * 100, 100) : 0
  const statusConfig = getStatusConfig(facture?.statut || "non_payee")

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Chargement...</p></div>
  if (!facture) return <div className="flex items-center justify-center h-64"><p className="text-destructive">Facture introuvable.</p></div>

  const destinataireName = getDestinataireName(facture)
  const pdfPath = `/api/factures/${facture.id}/pdf` // ← AJOUT

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/portal/invoices"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-foreground">{facture.numero_facture}</h1>
              <Badge variant={statusConfig.variant as any}>{statusConfig.label}</Badge>
              <Badge variant="outline">{facture.type_facture}</Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              Émise le {new Date(facture.date_emission).toLocaleDateString("fr-FR")}
              {facture.date_echeance && <> · Échéance le {new Date(facture.date_echeance).toLocaleDateString("fr-FR")}</>}
            </p>
          </div>
        </div>
        {/* ── Boutons PDF header ── */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline" size="sm" className="bg-transparent"
            onClick={() => openPdf(pdfPath, `${facture.id}-print`)}
            disabled={isPdfLoading(`${facture.id}-print`)}
          >
            <Printer className="mr-2 h-4 w-4" />
            {isPdfLoading(`${facture.id}-print`) ? "Ouverture..." : "Imprimer"}
          </Button>
          <Button
            variant="outline" size="sm" className="bg-transparent"
            onClick={() => openPdf(pdfPath, facture.id)}
            disabled={isPdfLoading(facture.id)}
          >
            <Download className="mr-2 h-4 w-4" />
            {isPdfLoading(facture.id) ? "Ouverture..." : "Télécharger PDF"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Détails</TabsTrigger>
              <TabsTrigger value="payments">
                Règlements
                {reglements.length > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">{reglements.length}</span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Détails */}
            <TabsContent value="details" className="space-y-6">
              <Card>
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h2 className="text-2xl font-bold tracking-tight">FACTURE</h2>
                      <p className="text-muted-foreground mt-1 font-mono text-sm">{facture.numero_facture}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{facture.agency?.name || "Agence"}</p>
                      {facture.agency?.email && <p className="text-sm text-muted-foreground">{facture.agency.email}</p>}
                      {facture.agency?.phone && <p className="text-sm text-muted-foreground">{facture.agency.phone}</p>}
                      {facture.agency?.city  && <p className="text-sm text-muted-foreground">{facture.agency.city}</p>}
                    </div>
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2 mb-8">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Facturé à</p>
                      <p className="font-semibold">{destinataireName}</p>
                      {facture.destinataire?.phone && <p className="text-sm text-muted-foreground">{facture.destinataire.phone}</p>}
                      {facture.bien && <p className="text-sm text-muted-foreground mt-1">{facture.bien.title} — {facture.bien.city}</p>}
                    </div>
                    <div className="text-right space-y-1">
                      <div className="flex justify-end gap-6">
                        <span className="text-sm text-muted-foreground">Émission</span>
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

                  <div className="border border-border rounded-lg overflow-hidden mb-6">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Libellé</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Détails</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">P.U.</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Qté</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {facture.articles.map((article) => (
                          <tr key={article.id} className="border-b border-border last:border-0">
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

                  <div className="flex justify-end">
                    <div className="w-[280px] space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sous-total HT</span>
                        <span>{formatCurrency(montantHt, facture.devise)}</span>
                      </div>
                      {remise > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Remise</span>
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

            {/* Règlements */}
            <TabsContent value="payments" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Statut des paiements</CardTitle></CardHeader>
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
                      <p className={`text-xl font-bold ${remaining <= 0 ? "text-emerald-600" : "text-amber-600"}`}>{formatCurrency(remaining, facture.devise)}</p>
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
                <CardHeader><CardTitle>Historique des règlements</CardTitle></CardHeader>
                <CardContent>
                  {reglements.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">Aucun règlement enregistré</p>
                  ) : (
                    <div className="space-y-3">
                      {reglements.map((reglement) => {
                        const rConfig = getReglementStatusConfig(reglement.statut)
                        return (
                          <div key={reglement.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-3">
                              {getPaymentMethodIcon(reglement.mode_paiement)}
                              <div>
                                <p className="text-sm font-medium">{new Date(reglement.date_reglement).toLocaleDateString("fr-FR")}</p>
                                <p className="text-xs text-muted-foreground">
                                  {getPaymentMethodLabel(reglement.mode_paiement)}
                                  {reglement.reference_paiement && <span className="font-mono ml-1">{reglement.reference_paiement}</span>}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-emerald-600">{formatCurrency(reglement.montant_regle, facture.devise)}</p>
                              <Badge variant={rConfig.variant as any} className="text-xs mt-1">{rConfig.label}</Badge>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {facture.bien && (
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Building2 className="h-4 w-4" />Bien immobilier</CardTitle></CardHeader>
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
                <div className="flex justify-between"><span className="text-muted-foreground">Numéro</span><span className="font-mono text-xs font-medium">{facture.contract.contract_number}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type</span><span className="font-medium capitalize">{facture.contract.type}</span></div>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Calendar className="h-4 w-4" />Informations</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Émission</span><span className="font-medium">{new Date(facture.date_emission).toLocaleDateString("fr-FR")}</span></div>
              {facture.date_echeance && (<><Separator /><div className="flex justify-between"><span className="text-muted-foreground">Échéance</span><span className="font-medium">{new Date(facture.date_echeance).toLocaleDateString("fr-FR")}</span></div></>)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><DollarSign className="h-4 w-4" />Montant</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Total TTC</span><span className="font-bold text-lg text-primary">{formatCurrency(montantTtc, facture.devise)}</span></div>
              <Separator />
              <div className="flex justify-between text-emerald-600"><span>Payé</span><span className="font-medium">{formatCurrency(totalPaid, facture.devise)}</span></div>
              <div className="flex justify-between text-amber-600"><span>Restant</span><span className="font-bold">{formatCurrency(remaining, facture.devise)}</span></div>
              <Progress value={progressPct} className="h-1.5 mt-1" />
              <p className="text-xs text-center text-muted-foreground">{Math.round(progressPct)}% réglé</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}