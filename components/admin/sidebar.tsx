"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Users,
  UserCircle,
  FileText,
  Receipt,
  CreditCard,
  Crown,
  Settings,
  LogOut,
  Shield,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import axiosInstance from "@/lib/axios"

const navigation = [
  { name: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { name: "Clients", href: "/admin/clients", icon: Users },
  { name: "Agences", href: "/admin/agencies", icon: Building2 },
  { name: "Propriétaires", href: "/admin/owners", icon: UserCircle },
  { name: "Contrats", href: "/admin/contracts", icon: FileText },
  { name: "Factures", href: "/admin/invoices", icon: Receipt },
  { name: "Règlements", href: "/admin/payments", icon: CreditCard },
  { name: "Abonnements", href: "/admin/subscriptions", icon: Crown },
]

const secondaryNavigation = [
  { name: "Paramètres", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/logout")
    } catch {
    } finally {
      document.cookie = "account_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      window.location.href = "/login"
    }
  }

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-foreground">SAS IMO</span>
          <Badge variant="secondary" className="text-xs">Admin</Badge>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-4 py-6">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
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
              </Link>
            )
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Back to Public Site */}
        <div className="mb-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Home className="h-5 w-5" />
            Retour au site
          </Link>
        </div>

        {/* User Profile */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/images/agency-1.jpg" alt="Admin" />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Super administrateur</p>
              <p className="text-xs text-muted-foreground truncate">admin@sasimo.com</p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Se déconnecter</span>
            </Button>
          </div>
        </div>
      </nav>
    </aside>
  )
}
