"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Heart,
  Calendar,
  MessageSquare,
  Receipt,
  Bell,
  User,
  LogOut,
  Home,
  CheckCircle,
  Eye,
  PlayCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import axiosInstance from "@/lib/axios"
import { useClient } from "@/hooks/clients/useClient"
import { useNotifications } from "@/hooks/clients/useNotifications"
import { useClientFactures } from "@/hooks/clients/useClientFactures"
import { useGetContracts } from "@/hooks/clients/useGetContracts"
import { TooltipButton } from "@/components/ui/TooltipButton"


export function ClientSidebar() {
  const pathname = usePathname()
  const { client, loading } = useClient()
  const clientId = client?.profile?.id
  const { factures, loading: loadingFactures, error } = useClientFactures(clientId)
  const { contracts, loading: contractsLoading } = useGetContracts({ client_id: clientId })

  const { data: notifications, loading: notificationsLoading } = useNotifications()
  const profileCompletion = client?.profile_completion ?? 75
  const nombreNotifications = notifications?.unreadNotifications

  const hasFactures = factures && factures.length > 0
  const hasContracts = contracts && contracts.length > 0

  const navigation = [
    {
      name: "Tableau de bord",
      href: "/portal",
      icon: LayoutDashboard,
      show: true,
      tooltip: "Accédez à votre espace principal",
    },
    {
      name: "Mes favoris",
      href: "/portal/favorites",
      icon: Heart,
      show: true,
      tooltip: "Consultez vos biens sauvegardés",
    },
    {
      name: "Mes Intérêts",
      href: "/portal/interests",
      icon: Eye,
      show: true,
      tooltip: "Les biens pour lesquels vous avez manifesté un intérêt",
    },
    {
      name: "Mes visites",
      href: "/portal/visits",
      icon: Calendar,
      show: true,
      tooltip: "Gérez vos visites programmées",
    },
    {
      name: "Documents",
      href: "/portal/documents",
      icon: FileText,
      show: true,
      tooltip: "Téléversez et consultez vos documents",
    },
    {
      name: "Contrats",
      href: "/portal/contracts",
      icon: CheckCircle,
      show: hasContracts,
      tooltip: "Consultez vos contrats signés",
    },
    {
      name: "Factures",
      href: "/portal/invoices",
      icon: Receipt,
      show: hasFactures,
      tooltip: "Consultez et téléchargez vos factures",
    },
    {
      name: "Notifications",
      href: "/portal/notifications",
      icon: Bell,
      show: true,
      tooltip: "Vos messages et alertes non lus",
    },
    {
      name: "Tutoriel",
      href: "/portal/tutorials",
      icon: PlayCircle,
      show: true,
      tooltip: "Découvrez comment utiliser votre espace client",
    }
  ]

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/logout")
    } catch (err) {
      // console.error(err)
    } finally {
      document.cookie = "account_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = "saas-immo-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      document.cookie = "XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      window.location.href = "/login"
    }
  }

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex flex-1 flex-col border-r border-border bg-card">

        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">Galle Connect Pro</span>
          </Link>
        </div>

        {/* Profile Status Card */}
        <div className="p-4">
          <div className="rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                {client?.prenom?.[0]}{client?.nom?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {client?.prenom} {client?.nom}
                </p>
                <p className="text-xs text-muted-foreground">Client</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Complétion du profil</span>
                <span className="font-medium text-foreground">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-1.5" />
              {profileCompletion < 100 && (
                <Link
                  href="/portal/profile"
                  className="text-xs text-accent hover:underline block mt-1"
                >
                  Compléter votre profil
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto">
          {navigation.filter((item) => item.show).map((item) => {
            const isActive = pathname === item.href
            return (
              <TooltipButton
                key={item.name}
                asChild
                tooltip={item.tooltip}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.name}
                  {item.name === "Notifications" && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                      {nombreNotifications}
                    </span>
                  )}
                </Link>
              </TooltipButton>
            )
          })}
        </nav>

        <Separator />

        {/* Bottom Section */}
        <div className="p-3 space-y-1">
          <TooltipButton
            asChild
            tooltip="Modifiez vos informations personnelles"
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 px-3 py-2 text-sm font-medium",
              pathname === "/portal/profile"
                ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Link href="/portal/profile">
              <User className="h-4 w-4" />
              Mon profil
            </Link>
          </TooltipButton>

          <TooltipButton
            tooltip="Fermer votre session en cours"
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </TooltipButton>
        </div>

      </div>
    </aside>
  )
}