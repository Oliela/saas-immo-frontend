"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Plus, Search, Download, MoreHorizontal, Eye,
  Trash2, CreditCard, TrendingUp, AlertTriangle,
  CheckCircle, Clock, Building2, Banknote,
  FileText, Smartphone,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { useFactures, Facture } from "@/hooks/agence/useFactures"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { usePdfDownload } from "@/hooks/usePdfDownload" // ← AJOUT

// ─── Helpers ──────────────────────────────────────────────────────

function getDestinataireName(facture: Facture): string {
  if (facture.destinataire_type === "fournisseur") return facture.fournisseur_nom || "Fournisseur"
  if (facture.destinataire) {
    const d = facture.destinataire
    if (d.firstName && d.lastName) return `${d.firstName} ${d.lastName}`
    if (d.nom && d.prenom) return `${d.prenom} ${d.nom}`
    return d.email || "—"
  }
  return "—"
}

function getStatusConfig(statut: string) {
  const config: Record<string, { variant: "default" | "secondary" | "outline" | "destructive"; label: string }> = {
    non_payee:           { variant: "secondary",   label: "Non Payée" },
    partiellement_payee: { variant: "outline",     label: "Partiellement Payée" },
    soldee:              { variant: "default",     label: "Soldée" },
    annulee:             { variant: "destructive", label: "Annulée" },
  }
  return config[statut] || { variant: "outline", label: statut }
}

function formatCurrency(amount: number, devise = "XOF") {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency", currency: devise,
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(amount)
}

const paymentMethods = [
  { value: "virement",      label: "Virement",      Icon: Building2 },
  { value: "cheque",        label: "Chèque",         Icon: FileText },
  { value: "especes",       label: "Espèces",        Icon: Banknote },
  { value: "carte_bancaire",label: "Carte",          Icon: CreditCard },
  { value: "wave",          label: "Wave",           Icon: Smartphone },
  { value: "orange_money",  label: "Orange Money",   Icon: Smartphone },
]

interface Props { agencyId: number }

export default function ListingInvoicesPage({ agencyId }: Props) {
  const { factures, stats, loading, error } = useFactures(agencyId)
  const { open: openPdf, isLoading: isPdfLoading } = usePdfDownload() // ← AJOUT

  const [searchTerm, setSearchTerm]               = useState("")
  const [typeFilter, setTypeFilter]               = useState("all")
  const [statusFilter, setStatusFilter]           = useState("all")
  const [paymentOpen, setPaymentOpen]             = useState(false)
  const [isSubmitting, setIsSubmitting]           = useState(false)
  const [selectedInvoice, setSelectedInvoice]     = useState<Facture | null>(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [paymentAmount, setPaymentAmount]         = useState("")
  const [paymentDate, setPaymentDate]             = useState(new Date().toISOString().split("T")[0])
  const [paymentRef, setPaymentRef]               = useState("")
  const [paymentError, setPaymentError]           = useState("")
  const [invoiceToDelete, setInvoiceToDelete]     = useState<Facture | null>(null)

  const filtered = factures.filter((f) => {
    if (searchTerm && !f.numero_facture.toLowerCase().includes(searchTerm.toLowerCase())) return false
    if (typeFilter !== "all" && f.type_facture !== typeFilter) return false
    if (statusFilter !== "all" && f.statut !== statusFilter) return false
    return true
  })

  const statCards = [
    { label: "Total Revenus CFA",         value: stats?.total_revenue ?? "—",        change: stats ? `${stats.factures_non_payee + stats.factures_partiellement_payee} en attente` : "", icon: TrendingUp },
    { label: "Non Payées CFA",            value: stats?.non_payee ?? "—",            change: stats ? `${stats.factures_non_payee} factures` : "",                                         icon: Clock },
    { label: "Partiellement Payées CFA",  value: stats?.partiellement_payee ?? "—",  change: stats ? `${stats.factures_partiellement_payee} factures` : "",                               icon: AlertTriangle },
    { label: "Soldées CFA",               value: stats?.soldee ?? "—",               change: stats ? `${stats.pourcentage_avancement}% recouvrement` : "",                                icon: CheckCircle },
  ]

  const handleOpenPayment = (facture: Facture) => {
    setSelectedInvoice(facture)
    setPaymentAmount(facture.montant_restant.toString())
    setSelectedPaymentMethod("")
    setPaymentDate(new Date().toISOString().split("T")[0])
    setPaymentRef("")
    setPaymentError("")
    setPaymentOpen(true)
  }

  const handleAddPayment = async () => {
    const amount = parseFloat(paymentAmount)
    if (!amount || amount <= 0) { setPaymentError("Veuillez entrer un montant valide."); return }
    if (selectedInvoice && amount > selectedInvoice.montant_restant) {
      setPaymentError(`Le montant ne peut pas dépasser ${formatCurrency(selectedInvoice.montant_restant)}.`); return
    }
    if (!selectedPaymentMethod) { setPaymentError("Veuillez sélectionner un mode de paiement."); return }

    const payload = { montant_regle: amount, mode_paiement: selectedPaymentMethod, date_reglement: paymentDate, notes: paymentRef || null }
    setIsSubmitting(true)
    try {
      const response = await axiosInstance.post(`/api/factures/reglements/${selectedInvoice?.id}`, payload)
      toast.success("Règlement enregistré avec succès !")
      if (response.data?.message) { setPaymentError(response.data.message); toast.error(response.data.message); return }
      setPaymentOpen(false)
    } catch (err: any) {
      setPaymentError("Erreur réseau, veuillez réessayer.")
      toast.error(err?.message || "Erreur réseau, veuillez réessayer.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteInvoice = async () => {
    if (!invoiceToDelete) return
    try {
      await axiosInstance.delete(`/api/factures/${invoiceToDelete.id}`)
      toast.success("Facture supprimée avec succès.")
      window.location.reload()
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de la suppression.")
    } finally {
      setInvoiceToDelete(null)
    }
  }

  // ─── Loading skeleton ──────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2"><Skeleton className="h-7 w-52" /><Skeleton className="h-4 w-64" /></div>
          <div className="flex gap-2"><Skeleton className="h-9 w-28 rounded-md" /><Skeleton className="h-9 w-40 rounded-md" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}><CardContent className="p-4"><div className="flex items-center justify-between"><div className="space-y-2"><Skeleton className="h-3 w-32" /><Skeleton className="h-7 w-24" /><Skeleton className="h-3 w-20" /></div><Skeleton className="h-10 w-10 rounded-lg shrink-0" /></div></CardContent></Card>
          ))}
        </div>
        <Card><CardContent className="p-6 text-center text-muted-foreground">Chargement...</CardContent></Card>
      </div>
    )
  }

  if (error) return <div className="flex items-center justify-center h-64"><p className="text-destructive">{error}</p></div>

  // ─── Render ────────────────────────────────────────────────────

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Factures & Paiements</h1>
          <p className="text-muted-foreground">Gérez la facturation et suivez les paiements</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/invoices/create">
            <Plus className="mr-2 h-4 w-4" />Créer une facture
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4">
            <div>
              <CardTitle>Toutes les factures</CardTitle>
              <CardDescription>Liste complète des factures de l'agence</CardDescription>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Rechercher par numéro..." className="pl-9" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[140px]"><SelectValue placeholder="Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="Vente">Vente</SelectItem>
                  <SelectItem value="Location">Location</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[170px]"><SelectValue placeholder="Statut" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="non_payee">Non Payée</SelectItem>
                  <SelectItem value="partiellement_payee">Partiellement Payée</SelectItem>
                  <SelectItem value="soldee">Soldée</SelectItem>
                  <SelectItem value="annulee">Annulée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Facture</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Destinataire</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Catégorie</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Montant TTC</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Payé</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Restant</th>
                  <th className="text-center py-3 px-4 font-medium text-muted-foreground">Statut</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="rounded-full bg-muted p-4"><FileText className="h-8 w-8 text-muted-foreground" /></div>
                        <div>
                          <p className="font-semibold text-foreground">Aucune facture trouvée</p>
                          <p className="text-sm text-muted-foreground">Créez votre première facture pour commencer.</p>
                        </div>
                        <Button asChild><Link href="/dashboard/invoices/create">Créer une facture</Link></Button>
                      </div>
                    </td>
                  </tr>
                )}
                {filtered.map((facture) => {
                  const statusConfig    = getStatusConfig(facture.statut)
                  const destinataireName = getDestinataireName(facture)
                  const montantTtc      = parseFloat(facture.montant_ttc)

                  return (
                    <tr key={facture.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-medium text-foreground">{facture.numero_facture}</p>
                        <p className="text-xs text-muted-foreground">{new Date(facture.date_emission).toLocaleDateString("fr-FR")}</p>
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        <p className="text-sm text-foreground">{destinataireName}</p>
                        <p className="text-xs text-muted-foreground">{facture.bien?.title || "—"}</p>
                      </td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        <p className="text-sm text-foreground capitalize">{facture.categorie?.replace(/_/g, " ") || "—"}</p>
                        {facture.sous_categorie && <p className="text-xs text-muted-foreground">{facture.sous_categorie}</p>}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <p className="font-semibold text-foreground">{formatCurrency(montantTtc, facture.devise)}</p>
                      </td>
                      <td className="py-3 px-4 text-right hidden sm:table-cell">
                        <p className="text-sm text-emerald-600 font-medium">{formatCurrency(facture.montant_regle, facture.devise)}</p>
                      </td>
                      <td className="py-3 px-4 text-right hidden sm:table-cell">
                        <p className="text-sm text-foreground">{formatCurrency(facture.montant_restant, facture.devise)}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant={statusConfig.variant as any}>{statusConfig.label}</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/invoices/${facture.id}`}>
                                <Eye className="mr-2 h-4 w-4" />Voir
                              </Link>
                            </DropdownMenuItem>

                            {/* ── MODIFIÉ ── */}
                            <DropdownMenuItem
                              onSelect={() => openPdf(`/api/factures/${facture.id}/pdf`, facture.id)}
                              disabled={isPdfLoading(facture.id)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              {isPdfLoading(facture.id) ? "Ouverture..." : "Télécharger PDF"}
                            </DropdownMenuItem>
                            {/* ── FIN MODIFIÉ ── */}

                            {!["soldee", "annulee"].includes(facture.statut) && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleOpenPayment(facture)}>
                                  <CreditCard className="mr-2 h-4 w-4" />Ajouter un règlement
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => setInvoiceToDelete(facture)}>
                              <Trash2 className="mr-2 h-4 w-4" />Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal règlement */}
      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Enregistrer un règlement</DialogTitle>
            <DialogDescription>
              {selectedInvoice && `Facture ${selectedInvoice.numero_facture} — ${getDestinataireName(selectedInvoice)}`}
            </DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-5 py-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Total TTC</p>
                  <p className="font-bold text-foreground text-sm">{formatCurrency(parseFloat(selectedInvoice.montant_ttc), selectedInvoice.devise)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Déjà payé</p>
                  <p className="font-bold text-emerald-600 text-sm">{formatCurrency(selectedInvoice.montant_regle, selectedInvoice.devise)}</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center">
                  <p className="text-xs text-amber-600 mb-1">Restant</p>
                  <p className="font-bold text-amber-600 text-sm">{formatCurrency(selectedInvoice.montant_restant, selectedInvoice.devise)}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pay-amount">Montant à régler <span className="text-destructive">*</span></Label>
                <Input id="pay-amount" type="number" min="0.01" step="1" max={selectedInvoice.montant_restant}
                  placeholder="0" value={paymentAmount}
                  onChange={(e) => {
                    setPaymentError("")
                    const val = parseFloat(e.target.value) || 0
                    setPaymentAmount(val > selectedInvoice.montant_restant ? selectedInvoice.montant_restant.toString() : e.target.value)
                  }} />
                {paymentAmount && parseFloat(paymentAmount) > 0 && (
                  parseFloat(paymentAmount) > selectedInvoice.montant_restant ? (
                    <p className="text-xs text-destructive flex items-center gap-1"><AlertTriangle className="h-3 w-3 shrink-0" />Maximum : {formatCurrency(selectedInvoice.montant_restant, selectedInvoice.devise)}</p>
                  ) : (
                    <p className="text-xs text-muted-foreground">Restant après : {formatCurrency(selectedInvoice.montant_restant - parseFloat(paymentAmount), selectedInvoice.devise)}</p>
                  )
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="pay-date">Date du règlement</Label>
                <Input id="pay-date" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Mode de paiement <span className="text-destructive">*</span></Label>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map((m) => (
                    <button key={m.value} type="button"
                      onClick={() => { setPaymentError(""); setSelectedPaymentMethod(m.value) }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 text-xs font-medium transition-all cursor-pointer ${selectedPaymentMethod === m.value ? "border-primary bg-primary/5 text-primary" : "border-border bg-transparent text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}>
                      <m.Icon className="h-4 w-4" />
                      <span className="leading-tight text-center">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pay-ref">Notes <span className="text-xs text-muted-foreground">(optionnel)</span></Label>
                <Input id="pay-ref" placeholder="ex: numéro de virement..." value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} />
              </div>
              {paymentError && <p className="text-sm text-destructive flex items-center gap-1.5"><AlertTriangle className="h-4 w-4 shrink-0" />{paymentError}</p>}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="bg-transparent" onClick={() => setPaymentOpen(false)} disabled={isSubmitting}>Annuler</Button>
            <Button onClick={handleAddPayment} disabled={!selectedInvoice || isSubmitting}>
              <CreditCard className="mr-2 h-4 w-4" />{isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal suppression */}
      <AlertDialog open={invoiceToDelete !== null} onOpenChange={(open) => !open && setInvoiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />Supprimer cette facture ?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <span>Cette action est irréversible.</span>
              <span className="block font-medium text-foreground">La suppression de <strong>{invoiceToDelete?.numero_facture}</strong> supprimera aussi tous les règlements associés.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteInvoice} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer définitivement
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}