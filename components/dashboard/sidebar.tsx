"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Users,
  Settings,
  LogOut,
  Home,
  Calendar,
  CalendarDays,
  FileText,
  Receipt,
  UserCircle,
  Shield,
  Bell,
  BarChart3,
  Heart,
  ClipboardList,
  PlayCircle,
  AlertTriangle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axiosInstance from "@/lib/axios"
import { useTache } from "@/hooks/agence/useTache"
import { useAgency } from "@/hooks/agence/useAgency"

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Propriétés", href: "/dashboard/properties", icon: Building2 },
  { name: "Clients et Prospects", href: "/dashboard/clients", icon: Users },
  { name: "Visites", href: "/dashboard/visits", icon: Calendar },
  { name: "Intérêts clients", href: "/dashboard/interests", icon: Heart },
  { name: "Tâches", href: "/dashboard/tasks", icon: ClipboardList },
  { name: "Calendrier", href: "/dashboard/calendar", icon: CalendarDays },
  { name: "Contrats", href: "/dashboard/contracts", icon: FileText },
  { name: "Factures", href: "/dashboard/invoices", icon: Receipt },
  { name: "Propriétaires", href: "/dashboard/owners", icon: UserCircle },
  { name: "Agents", href: "/dashboard/agents", icon: Shield },
  // { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
]

const secondaryNavigation = [
  { name: "Tutorials", href: "/dashboard/tutorials", icon: PlayCircle },
  { name: "Paramètres", href: "/dashboard/settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: agencyData } = useAgency()

  const currentSubscription =
    agencyData?.agency?.current_subscription

  const paymentInformation =
    agencyData?.subscription_payment

  const expirationDate = currentSubscription?.expires_at
    ? new Date(currentSubscription.expires_at)
    : null

  const remainingDays = expirationDate
    ? Math.ceil(
      (expirationDate.getTime() - Date.now()) /
      (1000 * 60 * 60 * 24)
    )
    : null

  const shouldDisplayRenewalAlert =
    currentSubscription &&
    remainingDays !== null &&
    remainingDays <= 10


  const renewalAlertMessage =
    remainingDays === null
      ? ""
      : remainingDays > 1
        ? `Votre abonnement expire dans ${remainingDays} jours.`
        : remainingDays === 1
          ? "Votre abonnement expire demain."
          : remainingDays === 0
            ? "Votre abonnement expire aujourd’hui."
            : "Votre abonnement a expiré."

  const { data: tache, loading: tacheLoading } = useTache()
  // console.log("Tâches :", tache) // Debug: log tache data


  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/logout")
    } catch (err) {
      console.error(err)
    } finally {
      document.cookie = "account_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      window.location.href = "/login"
    }
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <img src="/icon.svg" alt="icon-galle-connect-pro" />
          </div>
          <span className="text-lg font-semibold text-foreground">Galle Connect Pro</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-4 py-6">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
                {item.name === "Tâches" && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                    {tache?.pendingTasksCount ?? 0}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        <Separator className="my-6" />

        <div className="space-y-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
                {item.name === "Tâches" && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                    {tache?.pendingTasksCount ?? 0}
                  </span>
                )}
              </Link>
            )
          })}
        </div>

        {/* Spacer */}
        {shouldDisplayRenewalAlert && (
          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

              <div className="min-w-0 space-y-2">
                <div>
                  <p className="text-sm font-semibold text-amber-900">
                    Renouvellement
                  </p>

                  <p className="text-xs text-amber-800">
                    {renewalAlertMessage}
                  </p>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="h-8 w-full"
                    >
                      Renouveler
                    </Button>
                  </DialogTrigger>

                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Renouveler votre abonnement
                      </DialogTitle>

                      <DialogDescription>
                        Effectuez le paiement sur le numéro ci-dessous.
                        Le renouvellement sera validé manuellement après
                        vérification du paiement.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div className="rounded-lg border bg-muted/50 p-4">
                        <p className="text-sm text-muted-foreground">
                          Plan actuel
                        </p>

                        <p className="font-semibold capitalize">
                          {currentSubscription.plan}
                        </p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                          Moyen de paiement
                        </p>

                        <p className="font-semibold">
                          {paymentInformation?.method ||
                            "Non configuré"}
                        </p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                          Numéro de paiement
                        </p>

                        <p className="text-lg font-bold">
                          {paymentInformation?.number ||
                            "Non configuré"}
                        </p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                          Nom du compte
                        </p>

                        <p className="font-semibold">
                          {paymentInformation?.account_name ||
                            "Non configuré"}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Utilisez le nom de votre agence comme référence
                        du paiement.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        )}
        <div className="flex-1" />

        {/* User Profile */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/images/agency-1.jpg" alt="Agency" />
              <AvatarFallback>PP</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Premier Properties</p>
              <p className="text-xs text-muted-foreground truncate">Compte Agence</p>
            </div>
            {/* <Button onClick={handleLogout} variant="ghost" size="icon" className="h-8 w-8" asChild  >
              <Link href="/" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Se déconnecter</span>
              </Link>
            </Button> */}
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="h-8 w-8"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Se déconnecter</span>
            </Button>
          </div>
        </div>
      </nav>
    </aside>
  )
}
