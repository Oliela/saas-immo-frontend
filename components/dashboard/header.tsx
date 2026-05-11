"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Menu, Search, X, Home } from "lucide-react"
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
import { MobileSidebar } from "./mobile-sidebar"
import { useTache } from "@/hooks/agence/useTache"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import axiosInstance from "@/lib/axios"

export function DashboardHeader() {
  const [searchOpen, setSearchOpen] = useState(false)
  const { user, loading } = useAuthAgent()
  const { data: tache, loading: tacheLoading } = useTache()
  // console.log("Tâches :", tache)
  // console.log("User :", user)
   const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/logout")
    } catch (err) {
      // console.error(err)
    } finally {
      document.cookie = "account_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      window.location.href = "/login"
    }
  }

  return (
    <header className="sticky top-0 z-40 h-16 bg-card border-b border-border">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Mobile Menu & Logo */}
        <div className="flex items-center gap-4 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <MobileSidebar />
            </SheetContent>
          </Sheet>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
               <img src="/icon.svg" alt="icon-galle-connect-pro" />
            </div>
            <span className="text-lg font-semibold text-foreground">Galle Connect Pro</span>
          </Link>
        </div>

        {/* Search */}
        <div className="hidden md:flex md:flex-1 md:max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search properties, messages..."
              className="pl-9 bg-muted border-0"
            />
          </div>
        </div>

        {/* Mobile Search Toggle */}
        <div className="md:hidden">
          {searchOpen ? (
            <div className="fixed inset-x-0 top-0 z-50 bg-card p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-9"
                    autoFocus
                  />
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSearchOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {tache?.pendingTasksCount ?? 0}
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            {/* <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <p className="text-sm font-medium">New message from John Doe</p>
                <p className="text-xs text-muted-foreground">Interested in Modern Downtown Apartment</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <p className="text-sm font-medium">Property viewing scheduled</p>
                <p className="text-xs text-muted-foreground">Tomorrow at 2:00 PM</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                <p className="text-sm font-medium">New lead received</p>
                <p className="text-xs text-muted-foreground">Sarah wants to buy in Manhattan</p>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center text-sm text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent> */}
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/images/agency-1.jpg" alt="Agency" />
                  <AvatarFallback>PP</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{user?.agency?.name || "No agency name available"}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user?.agency?.email || "No email available"}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">Paramètres</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/">Voir le site public</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
