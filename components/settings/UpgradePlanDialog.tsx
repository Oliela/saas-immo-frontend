"use client"

import { useState } from "react"
import axios from "axios"
import { Check, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import {
  requestSubscriptionUpgrade,
} from "@/services/agencySubscriptionService"
import type {
  SubscriptionPlan,
} from "@/types/subscription"

interface UpgradePlanDialogProps {
  currentPlan: SubscriptionPlan
  pendingRequestedPlan?: SubscriptionPlan | null
}

interface PlanOption {
  id: SubscriptionPlan
  name: string
  limit: number
  description: string
  rank: number
}

const plans: PlanOption[] = [
  {
    id: "starter",
    name: "Starter",
    limit: 3,
    description: "Pour les petites équipes",
    rank: 1,
  },
  {
    id: "business",
    name: "Business",
    limit: 6,
    description: "Pour les agences en croissance",
    rank: 2,
  },
  {
    id: "pro",
    name: "Pro",
    limit: 10,
    description: "Pour les équipes importantes",
    rank: 3,
  },
]

const planRanks: Record<SubscriptionPlan, number> = {
  starter: 1,
  business: 2,
  pro: 3,
}

export default function UpgradePlanDialog({
  currentPlan,
  pendingRequestedPlan = null,
}: UpgradePlanDialogProps) {
  const [open, setOpen] = useState(false)

  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlan | null>(null)

  const [sending, setSending] = useState(false)

  const availablePlans = plans.filter(
    (plan) => plan.rank > planRanks[currentPlan]
  )

  const canUpgrade = availablePlans.length > 0

  function handleOpenChange(value: boolean) {
    setOpen(value)

    if (!value && !sending) {
      setSelectedPlan(null)
    }
  }

  async function handleUpgrade() {
    if (!selectedPlan || sending) {
      return
    }

    setSending(true)

    try {
      const response = await requestSubscriptionUpgrade(
        selectedPlan
      )

      toast.success(response.message)
      setOpen(false)
      setSelectedPlan(null)
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          "Impossible d’envoyer la demande."

        toast.error(message)
      } else {
        toast.error(
          "Une erreur inattendue est survenue."
        )
      }
    } finally {
      setSending(false)
    }
  }

  if (pendingRequestedPlan) {
    const pendingPlanName =
      plans.find(
        (plan) => plan.id === pendingRequestedPlan
      )?.name ?? pendingRequestedPlan

    return (
      <div className="space-y-2 text-right">
        <Button type="button" disabled>
          {"Demande en attente"}
        </Button>

        <p className="text-xs text-muted-foreground">
          Mise à niveau vers {pendingPlanName}
        </p>
      </div>
    )
  }

  if (!canUpgrade) {
    return (
      <Button type="button" disabled>
        {"Plan maximal atteint"}
      </Button>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <Button type="button">
          {"Mettre à niveau"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {"Mettre à niveau votre abonnement"}
          </DialogTitle>

          <DialogDescription>
            {
              "Sélectionnez un plan. Aucun changement ne sera effectué avant la validation du super-administrateur."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          {availablePlans.map((plan) => {
            const isSelected =
              selectedPlan === plan.id

            return (
              <button
                key={plan.id}
                type="button"
                disabled={sending}
                onClick={() =>
                  setSelectedPlan(plan.id)
                }
                className={cn(
                  "relative rounded-lg border p-5 text-left transition-colors",
                  "hover:border-primary",
                  isSelected &&
                  "border-primary bg-primary/5 ring-2 ring-primary/20"
                )}
              >
                {isSelected && (
                  <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                )}

                <p className="text-lg font-semibold">
                  {plan.name}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {plan.description}
                </p>

                <p className="mt-4 font-medium">
                  {plan.limit} utilisateurs
                </p>

                <p className="text-xs text-muted-foreground">
                  {"Administrateur inclus"}
                </p>
              </button>
            )
          })}
        </div>

        <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
          {selectedPlan
            ? "Cliquez sur « Mettre à niveau » pour envoyer votre demande au Galle Connect."
            : "Sélectionnez d’abord le plan souhaité."}
        </div>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={sending}
            onClick={() => setOpen(false)}
          >
            {"Annuler"}
          </Button>

          <Button
            type="button"
            disabled={!selectedPlan || sending}
            onClick={handleUpgrade}
          >
            {sending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {sending
              ? "Envoi en cours…"
              : "Mettre à niveau"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}