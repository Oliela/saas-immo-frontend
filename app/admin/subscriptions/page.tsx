"use client"

import { FormEvent, useMemo, useState } from "react"
import Link from "next/link"
import { Crown, Eye, Plus, Search } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { StatsCard } from "@/components/admin/stats-card"
import { useAdminAgencies } from "@/hooks/admin/useAdminAgencies"
import { useAdminSubscriptions } from "@/hooks/admin/useAdminSubscriptions"
import UpgradeRequestsTable from "@/components/admin/UpgradeRequestsTable"
import { saveSubscription } from "@/services/adminSubscriptionService"
import type { SubscriptionInput, SubscriptionPlan } from "@/types/subscription"

const labels = { starter: "Starter", business: "Business", pro: "Pro" }
const limits = { starter: 3, business: 6, pro: 10 }
const statusLabels =
{
  scheduled: "Planifié",
  active: "Actif",
  expired: "Expiré",
  grace: "En prolongation",
  replaced: "Remplacé"
}
const money = (value: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(value)

export default function AdminSubscriptionsPage() {
  const { subscriptions, stats, loading, error, refresh } = useAdminSubscriptions()
  const { agencies } = useAdminAgencies()
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState<SubscriptionInput>({ agency_id: 0, plan: "starter", starts_at: "", expires_at: "", amount_paid: 0 })
  const filtered = useMemo(() => subscriptions.filter((item) => item.agencyName.toLowerCase().includes(search.toLowerCase())), [subscriptions, search])

  async function submit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      await saveSubscription(form)
      toast.success("Abonnement enregistré")
      setOpen(false)
      await refresh()
    } catch {
      toast.error("Impossible d’enregistrer l’abonnement")
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Abonnements</h1>
          <p className="text-muted-foreground">Gestion manuelle des abonnements des agences</p></div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />Nouvel abonnement</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enregistrer ou renouveler un abonnement</DialogTitle>
            </DialogHeader>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2"><Label>Agence</Label><Select required onValueChange={(v) => setForm({ ...form, agency_id: Number(v) })}><SelectTrigger><SelectValue placeholder="Choisir une agence" /></SelectTrigger><SelectContent>{agencies.filter(a => a.approvalStatus === "approved").map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Plan</Label><Select value={form.plan} onValueChange={(v: SubscriptionPlan) => setForm({ ...form, plan: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(labels).map(([value, label]) => <SelectItem key={value} value={value}>{label} — {limits[value as SubscriptionPlan]} utilisateurs</SelectItem>)}</SelectContent></Select></div>
              <div className="grid grid-cols-2 gap-4"><div className="space-y-2"><Label>Date de début</Label><Input required type="date" value={form.starts_at} onChange={e => setForm({ ...form, starts_at: e.target.value })} /></div><div className="space-y-2"><Label>Date d’expiration</Label><Input required type="date" value={form.expires_at} onChange={e => setForm({ ...form, expires_at: e.target.value })} /></div></div>
              <div className="space-y-2"><Label>Montant payé (FCFA)</Label><Input required min={0} type="number" value={form.amount_paid || ""} onChange={e => setForm({ ...form, amount_paid: Number(e.target.value) })} /></div>
              <Button className="w-full" disabled={saving || !form.agency_id}>{saving ? "Enregistrement…" : "Enregistrer"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Actifs" value={stats.active} icon={<Crown className="h-4 w-4" />} />
        <StatsCard title="Expirés" value={stats.expired} icon={<Crown className="h-4 w-4" />} />
        <StatsCard title="Montant total" value={money(stats.revenue)} icon={<Crown className="h-4 w-4" />} /></div>
      <Card>
        <CardHeader>
          <CardTitle>Liste des abonnements</CardTitle>
          <div className="relative max-w-sm"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Rechercher une agence" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {error && <p className="text-destructive">{error}</p>}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agence</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Date de début</TableHead>
                <TableHead>Date d’expiration</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Utilisateurs</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!loading && filtered.length === 0 &&
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">Aucun abonnement</TableCell>
                </TableRow>}
              {filtered.map(item =>
                <TableRow key={item.id}>
                  <TableCell>
                    <Link className="font-medium hover:underline" href={`/admin/subscriptions/${item.id}`}>{item.agencyName}</Link>
                  </TableCell>
                  <TableCell>{labels[item.plan]}</TableCell>
                  <TableCell>{item.startsAt}</TableCell>
                  <TableCell>{item.expiresAt}</TableCell>
                  <TableCell>{money(item.amountPaid)}</TableCell>
                  <TableCell>
                    <div className="w-28">
                      <span className="text-xs">{item.agentsUsed}/{item.agentLimit}</span>
                      <Progress value={(item.agentsUsed / item.agentLimit) * 100} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        item.status === "active"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : item.status === "grace"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : item.status === "expired"
                              ? "border-red-200 bg-red-50 text-red-700"
                              : item.status === "scheduled"
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : "border-slate-200 bg-slate-50 text-slate-600"
                      }
                    >
                      {statusLabels[item.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/subscriptions/${item.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir les détails
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <UpgradeRequestsTable />

    </div>
  )
}
