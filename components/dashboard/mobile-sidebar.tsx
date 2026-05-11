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
  BarChart3,
  ClipboardList,
  Heart,
  PlayCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SheetClose } from "@/components/ui/sheet"
import { useTache } from "@/hooks/agence/useTache"
import axiosInstance from "@/lib/axios"

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

export function MobileSidebar() {
  const pathname = usePathname()
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
    <div className="flex flex-col h-full bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <SheetClose asChild>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
             <img src="/icon.svg" alt="icon-galle-connect-pro" />
            </div>
            <span className="text-lg font-semibold text-foreground">Galle Connect Pro</span>
          </Link>
        </SheetClose>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-4 py-6">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
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
                  {item.name === "Tâches" && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                      {tache?.pendingTasksCount ?? 0}
                    </span>
                  )}
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

        {/* User Profile */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center gap-3 px-3 py-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/images/agency-1.jpg" alt="Agency" />
              <AvatarFallback>PP</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Premier Properties</p>
              <p className="text-xs text-muted-foreground truncate">Agency Account</p>
            </div>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout} >
                {/* <Link href="/"> */}
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Se déconnecter</span>
                {/* </Link> */}
              </Button>
            </SheetClose>
          </div>
        </div>
      </nav>
    </div>
  )
}
