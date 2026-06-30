"use client"

import Link from "next/link"
import {
  Users,
  Building2,
  UserCircle,
  Home,
  FileText,
  Receipt,
  CreditCard,
  Crown,
  BadgeCheck,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/admin/stats-card"
import { ActivityTimeline } from "@/components/admin/activity-timeline"
import { StatusBadge } from "@/components/admin/status-badge"
import { useAdminDashboard } from "@/hooks/useAdminDashboard"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const INVOICE_STATUS_COLORS: Record<string, string> = {
  Paid:      "var(--chart-2)",
  Partial:   "var(--chart-4)",
  Unpaid:    "var(--chart-3)",
  Cancelled: "var(--chart-5)",
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat("fr-FR").format(num)
}

export default function AdminDashboardPage() {
  const { data, loading, error } = useAdminDashboard()

  const stats = data?.stats
  const recentAgencies = data?.recentAgencies ?? []
  const recentContracts = data?.recentContracts ?? []
  const recentActivities = data?.recentActivities ?? []
  const monthlyRevenueData = data?.monthlyRevenue ?? []
  const invoiceStatusData = (data?.invoiceStatusDistribution ?? []).map((item) => ({
    ...item,
    fill: INVOICE_STATUS_COLORS[item.name] ?? "var(--chart-1)",
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement du dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground">Aperçu de la performance de votre plateforme SaaS</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Clients"
          value={formatNumber(stats?.totalClients ?? 0)}
          trend="up"
          trendValue="+12%"
          description="depuis le mois dernier"
          icon={<Users className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Agences"
          value={formatNumber(stats?.totalAgencies ?? 0)}
          trend="up"
          trendValue="+2"
          description="nouveau ce mois-ci"
          icon={<Building2 className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Propriétaires"
          value={formatNumber(stats?.totalOwners ?? 0)}
          trend="neutral"
          trendValue="0%"
          description="depuis le mois dernier"
          icon={<UserCircle className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Propriétés"
          value={formatNumber(stats?.totalProperties ?? 0)}
          trend="up"
          trendValue="+8%"
          description="depuis le mois dernier"
          icon={<Home className="h-4 w-4" />}
        />
      </div>

      {/* Financial Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Facturé"
          value={formatCurrency(stats?.totalBilled ?? 0)}
          trend="up"
          trendValue="+15%"
          description="depuis le mois dernier"
          icon={<Receipt className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Payé"
          value={formatCurrency(stats?.totalPaid ?? 0)}
          trend="up"
          trendValue="+18%"
          description="depuis le mois dernier"
          icon={<CreditCard className="h-4 w-4" />}
        />
        <StatsCard
          title="Impayé"
          value={formatCurrency(stats?.outstanding ?? 0)}
          trend="down"
          trendValue="-5%"
          description="depuis le mois dernier"
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <StatsCard
          title="Chiffre d'affaires mensuel"
          value={formatCurrency(stats?.monthlyRevenue ?? 0)}
          trend="up"
          trendValue="+22%"
          description="depuis le mois dernier"
          icon={<TrendingUp className="h-4 w-4" />}
        />
      </div>

      {/* Subscription Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Abonnements Actifs"
          value={formatNumber(stats?.activeSubscriptions ?? 0)}
          trend="up"
          trendValue="+1"
          description="nouveau ce mois-ci"
          icon={<Crown className="h-4 w-4" />}
        />
        <StatsCard
          title="Agences Certifiées"
          value={formatNumber(stats?.certifiedAgencies ?? 0)}
          description={`sur ${stats?.totalAgencies ?? 0} au total`}
          icon={<BadgeCheck className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Contrats"
          value={formatNumber(stats?.totalContracts ?? 0)}
          trend="up"
          trendValue="+3"
          description="nouveau ce mois-ci"
          icon={<FileText className="h-4 w-4" />}
        />
        <StatsCard
          title="Contrats En attente"
          value={formatNumber(stats?.pendingContracts ?? 0)}
          description="en attente de signature"
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Chiffre d'affaires mensuel</CardTitle>
            <CardDescription>Tendance du chiffre d'affaires au cours des 12 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="name"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Statut des factures</CardTitle>
            <CardDescription>Distribution des statuts de facture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={invoiceStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {invoiceStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value}%`, name]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {invoiceStatusData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Data Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Agencies */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Agences Récentes</CardTitle>
              <CardDescription>Dernières agences enregistrées</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/agencies">
                Voir tout
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAgencies.map((agency) => (
                <div key={agency.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {agency.name}
                      </p>
                      {agency.isCertified && (
                        <BadgeCheck className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{agency.city}</p>
                  </div>
                  <StatusBadge status={agency.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Contracts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Contrats Récents</CardTitle>
              <CardDescription>Derniers contrats créés</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/contracts">
                Voir tout
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContracts.map((contract) => (
                <div key={contract.id} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {contract.reference}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {contract.clientName}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(contract.amount)}</p>
                    <StatusBadge status={contract.status} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Activité Récente</CardTitle>
              <CardDescription>Dernière activité de la plateforme</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={recentActivities} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
