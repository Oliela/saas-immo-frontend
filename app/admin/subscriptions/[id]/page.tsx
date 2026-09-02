"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Building2, CalendarDays, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getSubscription } from "@/services/adminSubscriptionService"
import type { AdminSubscription } from "@/types/subscription"

const labels = { starter: "Starter", business: "Business", pro: "Pro" }
const statuses = { scheduled: "Planifié", active: "Actif", expired: "Expiré", grace: "En prolongation", replaced: "Remplacé" }
const money = (value: number) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(value)

export default function SubscriptionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [subscription, setSubscription] = useState<AdminSubscription | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    getSubscription(id).then(setSubscription).catch(() => setError("Abonnement introuvable."))
  }, [id])

  if (error) return <p className="text-destructive">{error}</p>
  if (!subscription) return <p className="text-muted-foreground">Chargement…</p>

  return <div className="space-y-6">
    <Button variant="ghost" asChild>
      <Link href="/admin/subscriptions">
        <ArrowLeft className="mr-2 h-4 w-4" />Retour
      </Link>
    </Button>
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold">{subscription.agencyName}</h1>
        <p className="text-muted-foreground">Abonnement #{subscription.id}</p>
      </div>
      <Badge>{statuses[subscription.status]}</Badge>
    </div>
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Building2 className="h-4 w-4" />Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{labels[subscription.plan]}</p>
          <p>{money(subscription.amountPaid)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CalendarDays className="h-4 w-4" />Période
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>{subscription.startsAt} → {subscription.expiresAt}</p>
          <p className="text-sm text-muted-foreground">Grâce jusqu’au {subscription.graceEndsAt}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4" />Utilisateurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-2xl font-bold">{subscription.agentsUsed}/{subscription.agentLimit}</p>
          <Progress value={(subscription.agentsUsed / subscription.agentLimit) * 100} />
        </CardContent></Card>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Informations</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-muted-foreground">Agence</p>
          <p>{subscription.agencyName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p>{subscription.agencyEmail}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Enregistré par</p>
          <p>{subscription.createdBy || "—"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Compte agence</p>
          <p>{subscription.agencyActive ? "Actif" : "Suspendu"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Statut de l’abonnement
          </p>

          <Badge
            variant="outline"
            className={
              subscription.status === "active"
                ? "border-green-200 bg-green-50 text-green-700"
                : subscription.status === "grace"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : subscription.status === "expired"
                    ? "border-red-200 bg-red-50 text-red-700"
                    : subscription.status === "scheduled"
                      ? "border-blue-200 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-slate-50 text-slate-600"
            }
          >
            {statuses[subscription.status]}
          </Badge>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">
            Délai de grâce
          </p>

          <p className="font-medium">
            {subscription.graceDays} jours
          </p>

          <p className="text-xs text-muted-foreground">
            Jusqu’au {subscription.graceEndsAt}
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
}
