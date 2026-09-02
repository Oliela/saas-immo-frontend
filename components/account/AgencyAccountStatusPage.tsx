"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  Building2,
  Clock3,
  Home,
  LogOut,
  RefreshCw,
  ShieldAlert,
  XCircle,
  CreditCard,
} from "lucide-react"

import axiosInstance from "@/lib/axios"
import { useAuth } from "@/hooks/useAuth"
import type { AccountStatus } from "@/types/auth"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type BlockedAccountStatus =
  | "pending"
  | "rejected"
  | "suspended"
  | "agency_not_found"
  | "subscription_required"
  | "subscription_not_started"
  | "subscription_expired"

interface StatusConfiguration {
  title: string
  description: string
  badge: string
  icon: LucideIcon
  iconClassName: string
  iconContainerClassName: string
}

const statusConfigurations: Record<
  BlockedAccountStatus,
  StatusConfiguration
> = {
  pending: {
    title: "Compte en attente de validation",
    description:
      "Votre demande a bien été enregistrée et sera examinée par notre équipe.",
    badge: "En attente",
    icon: Clock3,
    iconClassName: "text-amber-600",
    iconContainerClassName: "bg-amber-100",
  },

  rejected: {
    title: "Demande d’agence refusée",
    description:
      "Votre demande n’a pas été validée par le super administrateur.",
    badge: "Refusée",
    icon: XCircle,
    iconClassName: "text-red-600",
    iconContainerClassName: "bg-red-100",
  },

  suspended: {
    title: "Compte agence suspendu",
    description:
      "L’accès au dashboard de votre agence est temporairement suspendu.",
    badge: "Suspendu",
    icon: ShieldAlert,
    iconClassName: "text-orange-600",
    iconContainerClassName: "bg-orange-100",
  },

  agency_not_found: {
    title: "Agence introuvable",
    description:
      "Aucune agence n’est actuellement associée à votre compte.",
    badge: "Configuration incomplète",
    icon: ShieldAlert,
    iconClassName: "text-red-600",
    iconContainerClassName: "bg-red-100",
  },
  subscription_required: {
    title: "Abonnement requis",
    description:
      "Votre agence a été approuvée, mais aucun abonnement n’a encore été activé.",
    badge: "Abonnement requis",
    icon: CreditCard,
    iconClassName: "text-blue-600",
    iconContainerClassName: "bg-blue-100",
  },

  subscription_not_started: {
    title: "Abonnement bientôt actif",
    description:
      "Votre abonnement est enregistré, mais sa date de début n’est pas encore arrivée.",
    badge: "Planifié",
    icon: Clock3,
    iconClassName: "text-blue-600",
    iconContainerClassName: "bg-blue-100",
  },

  subscription_expired: {
    title: "Abonnement expiré",
    description:
      "Votre abonnement et son délai de grâce sont terminés.",
    badge: "Expiré",
    icon: CreditCard,
    iconClassName: "text-red-600",
    iconContainerClassName: "bg-red-100",
  },
}

function isBlockedStatus(
  status: AccountStatus | null
): status is BlockedAccountStatus {
  return (
    status === "pending" ||
    status === "rejected" ||
    status === "suspended" ||
    status === "agency_not_found" ||
    status === "subscription_required" ||
    status === "subscription_not_started" ||
    status === "subscription_expired"
  )
}

function canonicalPath(status: BlockedAccountStatus): string {
  switch (status) {
    case "pending":
      return "/account-pending"

    case "suspended":
      return "/account-suspended"

    case "rejected":
    case "agency_not_found":
      return "/account-status"
    case "subscription_required":
    case "subscription_not_started":
    case "subscription_expired":
      return "/account-subscription-required"
  }
}

export default function AgencyAccountStatusPage() {
  const {
    user,
    agency,
    accountStatus,
    redirectPath,
    loading,
  } = useAuth()

  const router = useRouter()
  const pathname = usePathname()

  const [loggingOut, setLoggingOut] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (loading) return

    if (!user) {
      router.replace("/login")
      return
    }

    if (
      user.account_type !== "agency_user" &&
      user.account_type !== "agent"
    ) {
      router.replace(redirectPath ?? "/")
      return
    }

    if (accountStatus === "active") {
      router.replace("/dashboard")
      return
    }

    if (isBlockedStatus(accountStatus)) {
      const expectedPath = canonicalPath(accountStatus)

      if (pathname !== expectedPath) {
        router.replace(expectedPath)
      }
    }
  }, [
    user,
    accountStatus,
    redirectPath,
    loading,
    pathname,
    router,
  ])

  const handleRefresh = () => {
    setRefreshing(true)
    window.location.reload()
  }

  const handleLogout = async () => {
    if (loggingOut) return

    setLoggingOut(true)

    try {
      await axiosInstance.post("/api/logout")
    } catch {
      // La redirection doit quand même être effectuée si l’API est indisponible.
    }

    try {
      await fetch("/api/clear-session", {
        method: "POST",
      })
    } catch {
      // Le cookie accessible au navigateur est aussi supprimé ci-dessous.
    } finally {
      document.cookie =
        "account_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

      window.location.assign("/login")
    }
  }

  if (
    loading ||
    !user ||
    !isBlockedStatus(accountStatus)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <RefreshCw className="h-7 w-7 animate-spin text-primary" />
      </div>
    )
  }

  const configuration = statusConfigurations[accountStatus]
  const StatusIcon = configuration.icon

  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>

            <div>
              <p className="font-semibold text-foreground">
                Galle Connect Pro
              </p>
              <p className="text-xs text-muted-foreground">
                Espace agence
              </p>
            </div>
          </Link>

          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {loggingOut ? "Déconnexion..." : "Se déconnecter"}
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl px-4 py-16">
        <Card className="w-full">
          <CardHeader className="items-center text-center">
            <div
              className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full ${configuration.iconContainerClassName}`}
            >
              <StatusIcon
                className={`h-8 w-8 ${configuration.iconClassName}`}
              />
            </div>

            <Badge variant="outline">
              {configuration.badge}
            </Badge>

            <CardTitle className="text-2xl">
              {configuration.title}
            </CardTitle>

            <CardDescription className="max-w-lg">
              {configuration.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {agency && (
              <div className="rounded-lg border bg-muted/40 p-4">
                <div className="flex items-start gap-3">
                  <Building2 className="mt-0.5 h-5 w-5 text-muted-foreground" />

                  <div className="min-w-0">
                    <p className="font-medium text-foreground">
                      {agency.name}
                    </p>

                    <p className="truncate text-sm text-muted-foreground">
                      {agency.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {accountStatus === "pending" && (
              <Alert>
                <Clock3 />
                <AlertDescription>
                  Tu recevras un email dès que le super administrateur aura
                  validé ou refusé la demande. Aucune action supplémentaire
                  n’est nécessaire pour le moment.
                </AlertDescription>
              </Alert>
            )}

            {accountStatus === "rejected" && (
              <Alert variant="destructive">
                <XCircle />
                <AlertDescription>
                  <p>
                    Contacte le support si tu souhaites demander un nouvel
                    examen de ton dossier.
                  </p>

                  {agency?.rejection_reason && (
                    <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3">
                      <p className="font-medium">Motif du refus :</p>
                      <p>{agency.rejection_reason}</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {accountStatus === "suspended" && (
              <Alert>
                <ShieldAlert />
                <AlertDescription>
                  Contacte le support pour connaître le motif de la suspension
                  et les démarches nécessaires à la réactivation du compte.
                </AlertDescription>
              </Alert>
            )}

            {accountStatus === "agency_not_found" && (
              <Alert variant="destructive">
                <ShieldAlert />
                <AlertDescription>
                  Ton utilisateur existe, mais aucune agence ne lui est
                  associée. Contacte le support pour corriger cette
                  configuration.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full sm:w-auto"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Se déconnecter
            </Button>

            <Button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="w-full sm:w-auto"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""
                  }`}
              />
              {refreshing
                ? "Actualisation..."
                : "Actualiser le statut"}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}