"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  Menu,
  Search,
  X,
  Home,
  LayoutDashboard,
  Heart,
  Calendar,
  FileText,
  CheckCircle,
  Receipt,
  MessageSquare,
  User,
  LogOut,
  Eye,
  PlayCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useClient } from "@/hooks/clients/useClient"
import { useNotifications } from "@/hooks/clients/useNotifications"
import { useClientFactures } from "@/hooks/clients/useClientFactures"
import { useGetContracts } from "@/hooks/clients/useGetContracts"
import axiosInstance from "@/lib/axios"
import { TooltipButton } from "@/components/ui/TooltipButton"

export function ClientHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { client, loading } = useClient()
  const clientId = client?.profile?.id
  const { factures, loading: loadingFactures } = useClientFactures(clientId)
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
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <TooltipButton
            tooltip="Ouvrir le menu de navigation"
            variant="ghost"
            size="icon"
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </TooltipButton>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="border-b border-border p-4">
            <SheetTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Home className="h-4 w-4 text-primary-foreground" />
              </div>
              GalleConnectpro
            </SheetTitle>
          </SheetHeader>

          {/* Profile Card */}
          <div className="p-4 border-b border-border">
            <div className="rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                  {client?.prenom?.[0]}{client?.nom?.[0]}
                </div>
                <div>
                  <p className="text-sm font-medium">{client?.prenom} {client?.nom}</p>
                  <p className="text-xs text-muted-foreground">Client</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Complétion du profil</span>
                  <span className="font-medium">{profileCompletion}%</span>
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

          {/* Nav mobile — pas de tooltip ici, c'est un menu Sheet sur mobile */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.filter((item) => item.show).map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                  {item.name === "Notifications" && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                      {nombreNotifications}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-border p-4 space-y-1">
            <Link
              href="/portal/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <User className="h-4 w-4" />
              Mon profil
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Se déconnecter"
            >
              <LogOut className="h-4 w-4" />
              Se déconnecter
            </button>
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1 lg:hidden" />

      {/* Right Section */}
      <div className="flex items-center gap-2">

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TooltipButton
              tooltip="Voir vos notifications"
              variant="ghost"
              size="icon"
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                {nombreNotifications}
              </span>
              <span className="sr-only">Notifications</span>
            </TooltipButton>
          </DropdownMenuTrigger>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <TooltipButton
              tooltip="Accéder à votre compte"
              variant="ghost"
              size="icon"
              className="rounded-full"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                {client?.prenom?.[0]}{client?.nom?.[0]}
              </div>
            </TooltipButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{client?.prenom} {client?.nom}</span>
                <span className="text-xs font-normal text-muted-foreground">{client?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/portal/profile">
                <User className="mr-2 h-4 w-4" />
                Mon profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/portal/notifications">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                aria-label="Se déconnecter"
              >
                <LogOut className="h-4 w-4" />
                Se déconnecter
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Bouton Parcourir */}
        <TooltipButton
          tooltip="Consultez les biens disponibles à la location et à l'achat"
          asChild
          className="w-full md:w-auto"
        >
          <Link href="/buy">
            <Heart className="mr-2 h-4 w-4" />
            Parcourir les biens
          </Link>
        </TooltipButton>

      </div>
    </header>
  )
}