"use client"

import { CreditCard, Loader2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import UpgradePlanDialog from "@/components/settings/UpgradePlanDialog"
import { useAgencySubscriptions } from "@/hooks/agence/useAgencySubscriptions"
import type {
    AgencySubscription,
    SubscriptionPlan,
    SubscriptionStatus,
} from "@/types/subscription"

const planLabels: Record<SubscriptionPlan, string> = {
    starter: "Starter",
    business: "Business",
    pro: "Pro",
}

const statusLabels: Record<SubscriptionStatus, string> = {
    scheduled: "Planifié",
    active: "Actif",
    grace: "Délai de grâce",
    expired: "Expiré",
    replaced: "Remplacé",
}

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "XOF",
        maximumFractionDigits: 0,
    }).format(amount)
}

function formatDate(date: string): string {
    return new Intl.DateTimeFormat("fr-FR").format(
        new Date(`${date}T00:00:00`)
    )
}

function calculateDuration(subscription: AgencySubscription): string {
    const start = new Date(`${subscription.starts_at}T00:00:00`)
    const end = new Date(`${subscription.expires_at}T00:00:00`)

    const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        end.getMonth() -
        start.getMonth()

    if (months <= 0) {
        return "Moins d’un mois"
    }

    return `${months} mois`
}

export default function BillingSettings() {
    const { data, loading, error } = useAgencySubscriptions()

    if (loading) {
        return (
            <div className="flex min-h-40 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <Card>
                <CardContent className="py-8 text-center text-destructive">
                    {error || "Informations indisponibles."}
                </CardContent>
            </Card>
        )
    }

    const currentSubscription =
        data.subscriptions.find(
            (subscription) =>
                subscription.id === data.current_subscription_id
        ) ?? null

    const usagePercentage =
        data.usage.limit && data.usage.limit > 0
            ? Math.min(
                (data.usage.users / data.usage.limit) * 100,
                100
            )
            : 0

    return (
        <div className="space-y-6">
            {data.pending_upgrade_request && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="py-4">
                        <p className="font-medium text-blue-900">
                            {"Demande de mise à niveau en attente"}
                        </p>

                        <p className="text-sm text-blue-800">
                            Votre demande de passage vers le plan{" "}
                            <span className="font-semibold">
                                {
                                    planLabels[
                                    data.pending_upgrade_request
                                        .requested_plan
                                    ]
                                }
                            </span>{" "}
                            a été transmise au super-administrateur.
                        </p>
                    </CardContent>
                </Card>
            )}
            <Card>
                <CardHeader>
                    <CardTitle>{"Offre actuelle"}</CardTitle>
                    <CardDescription>
                        {
                            "Consultez votre plan actuel et l’utilisation de vos places."
                        }
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {currentSubscription ? (
                        <div className="space-y-5">
                            <div className="flex flex-col justify-between gap-4 rounded-lg border bg-muted/30 p-5 sm:flex-row sm:items-center">
                                <div>
                                    <div className="mb-2 flex items-center gap-2">
                                        <p className="text-xl font-semibold">
                                            {planLabels[currentSubscription.plan]}
                                        </p>

                                        <Badge
                                            variant={
                                                currentSubscription.status === "active"
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {statusLabels[currentSubscription.status]}
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-muted-foreground">
                                        Du {formatDate(currentSubscription.starts_at)} au{" "}
                                        {formatDate(currentSubscription.expires_at)}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        Limite de {currentSubscription.agent_limit} utilisateurs,
                                        administrateur inclus
                                    </p>
                                </div>

                                <UpgradePlanDialog
                                    currentPlan={currentSubscription.plan}
                                    pendingRequestedPlan={
                                        data.pending_upgrade_request
                                            ?.requested_plan ?? null
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>{"Utilisateurs"}</span>

                                    <span className="font-medium">
                                        {data.usage.users}/{data.usage.limit ?? 0}
                                    </span>
                                </div>

                                <Progress value={usagePercentage} />
                            </div>
                        </div>
                    ) : (
                        <div className="rounded-lg border border-dashed p-6 text-center">
                            <p className="font-medium">
                                {"Aucun abonnement actif"}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                {
                                    "Contactez le Galle Connect  pour activer un abonnement."
                                }
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{"Informations de paiement"}</CardTitle>
                    <CardDescription>
                        {
                            "Utilisez ces informations pour renouveler votre abonnement actuel."
                        }
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex items-start gap-4 rounded-lg border p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                            <CreditCard className="h-5 w-5 text-muted-foreground" />
                        </div>

                        <div className="space-y-1">
                            <p className="font-medium">
                                {data.payment.method || "Moyen non configuré"}
                            </p>

                            <p className="text-lg font-semibold">
                                {data.payment.number || "Numéro non configuré"}
                            </p>

                            <p className="text-sm text-muted-foreground">
                                {data.payment.account_name || "Galle Connect Pro"}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{"Historique des abonnements"}</CardTitle>
                    <CardDescription>
                        {"Retrouvez les abonnements et paiements enregistrés."}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {data.subscriptions.length === 0 ? (
                        <p className="py-6 text-center text-muted-foreground">
                            {"Aucun historique disponible."}
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left">
                                        <th className="px-3 py-3 font-medium">Plan</th>
                                        <th className="px-3 py-3 font-medium">Durée</th>
                                        <th className="px-3 py-3 font-medium">Période</th>
                                        <th className="px-3 py-3 font-medium">Limite</th>
                                        <th className="px-3 py-3 font-medium">Montant</th>
                                        <th className="px-3 py-3 font-medium">Statut</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {data.subscriptions.map((subscription) => {
                                        const isFinished = [
                                            "expired",
                                            "replaced",
                                        ].includes(subscription.status)

                                        return (
                                            <tr
                                                key={subscription.id}
                                                className={
                                                    isFinished
                                                        ? "border-b bg-muted/40 text-muted-foreground opacity-70"
                                                        : "border-b"
                                                }
                                            >
                                                <td className="px-3 py-4 font-medium">
                                                    {planLabels[subscription.plan]}
                                                </td>

                                                <td className="px-3 py-4">
                                                    {calculateDuration(subscription)}
                                                </td>

                                                <td className="px-3 py-4">
                                                    {formatDate(subscription.starts_at)}
                                                    {" → "}
                                                    {formatDate(subscription.expires_at)}
                                                </td>

                                                <td className="px-3 py-4">
                                                    {subscription.agent_limit}
                                                </td>

                                                <td className="px-3 py-4">
                                                    {formatCurrency(subscription.amount_paid)}
                                                </td>

                                                <td className="px-3 py-4">
                                                    <Badge
                                                        variant={
                                                            subscription.status === "active"
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                    >
                                                        {statusLabels[subscription.status]}
                                                    </Badge>
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
        </div>
    )
}