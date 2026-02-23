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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import axiosInstance from "@/lib/axios"
import { useClient } from "@/hooks/useClient"


const navigation = [
  { name: "Aperçu", href: "/portal", icon: LayoutDashboard },
  { name: "Mes favoris", href: "/portal/favorites", icon: Heart },
  { name: "Mes visites", href: "/portal/visits", icon: Calendar },
  { name: "Documents", href: "/portal/documents", icon: FileText },
  { name: "Contrats", href: "/portal/contracts", icon: CheckCircle },
  { name: "Factures", href: "/portal/invoices", icon: Receipt },
  { name: "Messages", href: "/portal/messages", icon: MessageSquare },
  { name: "Notifications", href: "/portal/notifications", icon: Bell },
]


export function ClientSidebar() {
  const pathname = usePathname()
  const { client, loading } = useClient()
  const profileCompletion = client?.profile_completion ?? 75

  console.log("Données client :", client) // Debug: log client data


  const handleLogout = async () => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      await axiosInstance.post("/api/logout", {}, { headers: { Authorization: `Bearer ${token}` } })
    } catch (err) {
      console.error(err)
    } finally {
      localStorage.removeItem("token")
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
            <span className="text-lg font-semibold text-foreground">SAS IMO</span>
          </Link>
        </div>

        {/* Profile Status Card */}
        <div className="p-4">
          <div className="rounded-lg bg-secondary/50 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                {/* JD */}
                {client?.prenom?.[0]}{client?.nom?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{client?.prenom} {client?.nom}</p>
                <p className="text-xs text-muted-foreground">Client</p>
              </div>
            </div>
            {/* <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Profile completion</span>
                <span className="font-medium text-foreground">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-1.5" />
              {profileCompletion < 100 && (
                <Link 
                  href="/portal/profile"
                  className="text-xs text-accent hover:underline block mt-1"
                >
                  Complete your profile
                </Link>
              )}
            </div> */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Complétion du profil</span>
                <span className="font-medium text-foreground">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-1.5" />
              {profileCompletion < 100 && (
                <Link href="/portal/profile" className="text-xs text-accent hover:underline block mt-1">
                  Compléter votre profil
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.name}
                {item.name === "Notifications" && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                    3
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <Separator />

        {/* Bottom Section */}
        <div className="p-3 space-y-1">
          <Link
            href="/portal/profile"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/portal/profile"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <User className="h-4 w-4" />
            Mon profil
          </Link>
          {/* <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Link> */}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </aside>
  )
}
