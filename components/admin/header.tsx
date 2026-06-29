"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Bell, Search } from "lucide-react"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminMobileSidebar } from "./mobile-sidebar"
import axiosInstance from "@/lib/axios"

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/clients": "Clients",
  "/admin/agencies": "Agences",
  "/admin/owners": "Propriétaires",
  "/admin/contracts": "Contrats",
  "/admin/invoices": "Factures",
  "/admin/payments": "Règlements",
  "/admin/subscriptions": "Abonnements",
  "/admin/settings": "Paramètres",
}

export function AdminHeader() {
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
  
  // Generate breadcrumbs from pathname
  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs: { name: string; href: string }[] = []
    let currentPath = ""
    
    for (const segment of segments) {
      currentPath += `/${segment}`
      const name = breadcrumbMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1)
      breadcrumbs.push({ name, href: currentPath })
    }
    
    return breadcrumbs
  }
  
  const breadcrumbs = getBreadcrumbs()
  const currentPage = breadcrumbs[breadcrumbs.length - 1]?.name || "Dashboard"

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <AdminMobileSidebar />
        </SheetContent>
      </Sheet>

      {/* Breadcrumbs */}
      <div className="hidden lg:flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className="flex items-center gap-2">
            {index > 0 && <span className="text-muted-foreground">/</span>}
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-foreground">{crumb.name}</span>
            ) : (
              <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors">
                {crumb.name}
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Page Title */}
      <h1 className="lg:hidden text-lg font-semibold text-foreground">{currentPage}</h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="hidden md:flex relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="pl-9 bg-muted/50"
        />
      </div>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
              3
            </Badge>
            <span className="sr-only">Notifications</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <div className="flex flex-col gap-1">
              <span className="font-medium">New agency registered</span>
              <span className="text-xs text-muted-foreground">Riviera Estates just signed up</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex flex-col gap-1">
              <span className="font-medium">Payment received</span>
              <span className="text-xs text-muted-foreground">125,000 EUR from Luxury Homes</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <div className="flex flex-col gap-1">
              <span className="font-medium">Subscription expired</span>
              <span className="text-xs text-muted-foreground">Riviera Estates subscription expired</span>
            </div>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-center">
            <Link href="/admin" className="w-full text-sm text-primary">View all notifications</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/images/agency-1.jpg" alt="Admin" />
              <AvatarFallback>SA</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span>Super Admin</span>
              <span className="text-xs font-normal text-muted-foreground">admin@sasimo.com</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
