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
import { SheetClose } from "@/components/ui/sheet"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
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

export function AdminMobileSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <SheetClose asChild>
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">SAS IMO</span>
            <Badge variant="secondary" className="text-xs">Admin</Badge>
          </Link>
        </SheetClose>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-4 py-6">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            return (
              <SheetClose key={item.name} asChild>
                <Link
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
              </SheetClose>
            )
          })}
        </div>

        <Separator className="my-6" />

        <div className="space-y-1">
          {secondaryNavigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <SheetClose key={item.name} asChild>
                <Link
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
              </SheetClose>
            )
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Back to Public Site */}
        <div className="mb-4">
          <SheetClose asChild>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Home className="h-5 w-5" />
              Retour au site
            </Link>
          </SheetClose>
        </div>

        {/* User Profile */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/images/agency-1.jpg" alt="Admin" />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Super Admin</p>
              <p className="text-xs text-muted-foreground truncate">admin@sasimo.com</p>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link href="/">
                  <LogOut className="h-4 w-4" />
                  <span className="sr-only">Log out</span>
                </Link>
              </Button>
            </SheetClose>
          </div>
        </div>
      </nav>
    </div>
  )
}
