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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SheetClose } from "@/components/ui/sheet"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Properties", href: "/dashboard/properties", icon: Building2 },
  { name: "Clients & Leads", href: "/dashboard/clients", icon: Users },
  { name: "Visits", href: "/dashboard/visits", icon: Calendar },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { name: "Contracts", href: "/dashboard/contracts", icon: FileText },
  { name: "Invoices", href: "/dashboard/invoices", icon: Receipt },
  { name: "Owners", href: "/dashboard/owners", icon: UserCircle },
  { name: "Agents", href: "/dashboard/agents", icon: Shield },
  { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
]

const secondaryNavigation = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function MobileSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-6 border-b border-border">
        <SheetClose asChild>
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-foreground">SAS IMO</span>
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
