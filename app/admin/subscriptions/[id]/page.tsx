import Link from "next/link"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import {
  ArrowLeft,
  Crown,
  Building2,
  Calendar,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/admin/status-badge"
import { StatsCard } from "@/components/admin/stats-card"
import { mockSubscriptions, mockAgencies } from "@/lib/admin-mock-data"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const planColors: Record<string, string> = {
  starter: "bg-slate-100 text-slate-700 border-slate-200",
  professional: "bg-blue-50 text-blue-700 border-blue-200",
  enterprise: "bg-amber-50 text-amber-700 border-amber-200",
}

export default async function AdminSubscriptionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const subscription = mockSubscriptions.find((s) => s.id === id)

  if (!subscription) {
    notFound()
  }

  const agency = mockAgencies.find((a) => a.id === subscription.agencyId)
  const totalPaid = subscription.paymentHistory
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0)

  const propertiesUsage =
    subscription.limits.properties > 0
      ? (subscription.usage.properties / subscription.limits.properties) * 100
      : 0
  const agentsUsage =
    subscription.limits.agents > 0
      ? (subscription.usage.agents / subscription.limits.agents) * 100
      : 0
  const storageUsage = (subscription.usage.storage / subscription.limits.storage) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/subscriptions">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex items-center gap-3 flex-1">
          <Avatar className="h-10 w-10">
            <AvatarImage src={agency?.logo} alt={subscription.agencyName} />
            <AvatarFallback>
              {subscription.agencyName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">{subscription.agencyName}</h1>
              <Badge variant="outline" className={planColors[subscription.plan] || ""}>
                {subscription.planName}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Depuis le {format(new Date(subscription.startDate), "PPP")}
            </p>
          </div>
        </div>
        <StatusBadge status={subscription.status} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Prix"
          value={formatCurrency(subscription.price)}
          description={subscription.billingCycle === "monthly" ? "par mois" : "par an"}
          icon={<Crown className="h-4 w-4" />}
        />
        <StatsCard
          title="Total payé"
          value={formatCurrency(totalPaid)}
          icon={<Crown className="h-4 w-4" />}
        />
        <StatsCard
          title="Paiements"
          value={subscription.paymentHistory.length}
          icon={<Crown className="h-4 w-4" />}
        />
        <StatsCard
          title="Jours restants"
          value={Math.max(
            0,
            Math.ceil(
              (new Date(subscription.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            )
          )}
          icon={<Calendar className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Subscription Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">{subscription.agencyName}</p>
                <p className="text-xs text-muted-foreground">Agence</p>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/agencies/${subscription.agencyId}`}>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {format(new Date(subscription.startDate), "dd/MM/yyyy")} →{" "}
                  {format(new Date(subscription.expiryDate), "dd/MM/yyyy")}
                </p>
                <p className="text-xs text-muted-foreground">Période</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">
                  {subscription.billingCycle === "monthly" ? "Mensuel" : "Annuel"}
                </p>
                <p className="text-xs text-muted-foreground">Cycle de facturation</p>
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Renouvellement auto</span>
              <Badge variant={subscription.autoRenew ? "default" : "secondary"}>
                {subscription.autoRenew ? "Activé" : "Désactivé"}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Prix</span>
              <span>
                {formatCurrency(subscription.price)}/
                {subscription.billingCycle === "monthly" ? "mois" : "an"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Consommation</CardTitle>
            <CardDescription>Utilisation des limites du plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Biens immobiliers</span>
                <span className="text-muted-foreground">
                  {subscription.usage.properties}
                  {subscription.limits.properties > 0
                    ? ` / ${subscription.limits.properties}`
                    : " / Illimité"}
                </span>
              </div>
              {subscription.limits.properties > 0 ? (
                <Progress value={propertiesUsage} className="h-2" />
              ) : (
                <div className="h-2 rounded-full bg-muted" />
              )}
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Agents</span>
                <span className="text-muted-foreground">
                  {subscription.usage.agents}
                  {subscription.limits.agents > 0
                    ? ` / ${subscription.limits.agents}`
                    : " / Illimité"}
                </span>
              </div>
              {subscription.limits.agents > 0 ? (
                <Progress value={agentsUsage} className="h-2" />
              ) : (
                <div className="h-2 rounded-full bg-muted" />
              )}
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Stockage (Go)</span>
                <span className="text-muted-foreground">
                  {subscription.usage.storage} / {subscription.limits.storage}
                </span>
              </div>
              <Progress value={storageUsage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Fonctionnalités incluses</CardTitle>
            <CardDescription>Plan {subscription.planName}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {subscription.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
          <CardDescription>
            {subscription.paymentHistory.length} paiement
            {subscription.paymentHistory.length !== 1 ? "s" : ""} — Total :{" "}
            {formatCurrency(totalPaid)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Statut</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscription.paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {format(new Date(payment.paidAt), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell className="capitalize">
                    {payment.method.replace("_", " ")}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell>
                    {payment.status === "completed" ? (
                      <div className="flex items-center gap-1.5 text-green-600 text-sm">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Complété
                      </div>
                    ) : payment.status === "failed" ? (
                      <div className="flex items-center gap-1.5 text-destructive text-sm">
                        <XCircle className="h-3.5 w-3.5" />
                        Échoué
                      </div>
                    ) : (
                      <StatusBadge status={payment.status} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
