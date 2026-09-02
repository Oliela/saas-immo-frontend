"use client"

import { FormEvent, useState } from "react"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useAdminUpgradeRequests } from "@/hooks/admin/useAdminUpgradeRequests"
import {
    rejectUpgradeRequest,
    saveSubscription,
} from "@/services/adminSubscriptionService"
import type {
    AdminUpgradeRequest,
    SubscriptionInput,
    SubscriptionPlan,
} from "@/types/subscription"

const planLabels: Record<SubscriptionPlan, string> = {
    starter: "Starter",
    business: "Business",
    pro: "Pro",
}

const statusLabels = {
    pending: "En attente",
    approved: "Approuvée",
    rejected: "Rejetée",
    cancelled: "Annulée",
}

export default function UpgradeRequestsTable() {
    const {
        requests,
        stats,
        loading,
        error,
        refresh,
    } = useAdminUpgradeRequests()

    const [requestToReject, setRequestToReject] =
        useState<AdminUpgradeRequest | null>(null)

    const [requestToProcess, setRequestToProcess] =
        useState<AdminUpgradeRequest | null>(null)

    const [rejectionReason, setRejectionReason] =
        useState("")

    const [submitting, setSubmitting] =
        useState(false)

    const [subscriptionForm, setSubscriptionForm] =
        useState<SubscriptionInput>({
            agency_id: 0,
            plan: "starter",
            starts_at: "",
            expires_at: "",
            amount_paid: 0,
        })

    function openProcessModal(
        upgradeRequest: AdminUpgradeRequest
    ) {
        setRequestToProcess(upgradeRequest)

        setSubscriptionForm({
            agency_id: upgradeRequest.agency.id,
            plan: upgradeRequest.requested_plan,
            starts_at: "",
            expires_at: "",
            amount_paid: 0,
            upgrade_request_id: upgradeRequest.id,
        })
    }

    async function handleReject() {
        if (
            !requestToReject ||
            !rejectionReason.trim() ||
            submitting
        ) {
            return
        }

        setSubmitting(true)

        try {
            const response = await rejectUpgradeRequest(
                requestToReject.id,
                rejectionReason.trim()
            )

            toast.success(response.message)
            setRequestToReject(null)
            setRejectionReason("")
            await refresh()
        } catch {
            toast.error(
                "Impossible de rejeter cette demande."
            )
        } finally {
            setSubmitting(false)
        }
    }

    async function handleProcess(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault()

        if (!requestToProcess || submitting) {
            return
        }

        setSubmitting(true)

        try {
            await saveSubscription(subscriptionForm)

            toast.success(
                "Le nouvel abonnement a été enregistré et la demande approuvée."
            )

            setRequestToProcess(null)
            await refresh()
        } catch {
            toast.error(
                "Impossible de traiter cette demande."
            )
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>
                        {"Demandes de mise à niveau"}
                    </CardTitle>

                    <CardDescription>
                        {stats.pending} demande
                        {stats.pending !== 1 ? "s" : ""} en attente
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {error && (
                        <p className="mb-4 text-destructive">
                            {error}
                        </p>
                    )}

                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Agence</TableHead>
                                    <TableHead>Plan actuel</TableHead>
                                    <TableHead>Plan demandé</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {requests.length === 0 && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="text-center text-muted-foreground"
                                        >
                                            {"Aucune demande disponible."}
                                        </TableCell>
                                    </TableRow>
                                )}

                                {requests.map((upgradeRequest) => (
                                    <TableRow key={upgradeRequest.id}>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {upgradeRequest.agency.name}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {upgradeRequest.agency.email}
                                                </p>
                                            </div>
                                        </TableCell>

                                        <TableCell>
                                            {planLabels[
                                                upgradeRequest.current_plan as SubscriptionPlan
                                            ]}
                                        </TableCell>

                                        <TableCell className="font-medium">
                                            {planLabels[
                                                upgradeRequest.requested_plan as SubscriptionPlan
                                            ]}
                                        </TableCell>

                                        <TableCell>
                                            {upgradeRequest.created_at
                                                ? new Intl.DateTimeFormat(
                                                    "fr-FR"
                                                ).format(
                                                    new Date(
                                                        upgradeRequest.created_at
                                                    )
                                                )
                                                : "—"}
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant={
                                                    upgradeRequest.status ===
                                                        "pending"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                            >
                                                {statusLabels[
                                                    upgradeRequest.status as keyof typeof statusLabels
                                                ]}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            {upgradeRequest.status ===
                                                "pending" ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setRequestToReject(
                                                                upgradeRequest
                                                            )
                                                            setRejectionReason("")
                                                        }}
                                                    >
                                                        <XCircle className="mr-2 h-4 w-4" />
                                                        Rejeter
                                                    </Button>

                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            openProcessModal(
                                                                upgradeRequest
                                                            )
                                                        }
                                                    >
                                                        <CheckCircle className="mr-2 h-4 w-4" />
                                                        Traiter
                                                    </Button>
                                                </div>
                                            ) : (
                                                <p className="text-right text-sm text-muted-foreground">
                                                    {upgradeRequest.processed_by ||
                                                        "Traitée"}
                                                </p>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <Dialog
                open={requestToReject !== null}
                onOpenChange={(open) => {
                    if (!open && !submitting) {
                        setRequestToReject(null)
                        setRejectionReason("")
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {"Rejeter la demande"}
                        </DialogTitle>

                        <DialogDescription>
                            Indiquez la raison du refus pour cette
                            demande de mise à niveau.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-2">
                        <Label htmlFor="rejection-reason">
                            {"Motif du refus"}
                        </Label>

                        <Textarea
                            id="rejection-reason"
                            value={rejectionReason}
                            onChange={(event) =>
                                setRejectionReason(
                                    event.target.value
                                )
                            }
                            placeholder="Exemple : paiement non reçu"
                            maxLength={1000}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            disabled={submitting}
                            onClick={() =>
                                setRequestToReject(null)
                            }
                        >
                            Annuler
                        </Button>

                        <Button
                            variant="destructive"
                            disabled={
                                submitting ||
                                !rejectionReason.trim()
                            }
                            onClick={handleReject}
                        >
                            {submitting
                                ? "Traitement…"
                                : "Confirmer le refus"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog
                open={requestToProcess !== null}
                onOpenChange={(open) => {
                    if (!open && !submitting) {
                        setRequestToProcess(null)
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {"Traiter la mise à niveau"}
                        </DialogTitle>

                        <DialogDescription>
                            Enregistrez le paiement et les dates du
                            nouvel abonnement.
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={handleProcess}
                        className="space-y-4"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Agence</Label>
                                <Input
                                    value={
                                        requestToProcess?.agency.name ?? ""
                                    }
                                    disabled
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Plan demandé</Label>
                                <Input
                                    value={
                                        requestToProcess
                                            ? planLabels[
                                            requestToProcess
                                                .requested_plan
                                            ]
                                            : ""
                                    }
                                    disabled
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="upgrade-start">
                                    Date de début
                                </Label>

                                <Input
                                    id="upgrade-start"
                                    required
                                    type="date"
                                    value={
                                        subscriptionForm.starts_at
                                    }
                                    onChange={(event) =>
                                        setSubscriptionForm({
                                            ...subscriptionForm,
                                            starts_at:
                                                event.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="upgrade-expiry">
                                    Date d’expiration
                                </Label>

                                <Input
                                    id="upgrade-expiry"
                                    required
                                    type="date"
                                    value={
                                        subscriptionForm.expires_at
                                    }
                                    onChange={(event) =>
                                        setSubscriptionForm({
                                            ...subscriptionForm,
                                            expires_at:
                                                event.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="upgrade-amount">
                                Montant payé en FCFA
                            </Label>

                            <Input
                                id="upgrade-amount"
                                required
                                type="number"
                                min={0}
                                value={
                                    subscriptionForm.amount_paid || ""
                                }
                                onChange={(event) =>
                                    setSubscriptionForm({
                                        ...subscriptionForm,
                                        amount_paid: Number(
                                            event.target.value
                                        ),
                                    })
                                }
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={submitting}
                        >
                            {submitting
                                ? "Enregistrement…"
                                : "Enregistrer et approuver"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}