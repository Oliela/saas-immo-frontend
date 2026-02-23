"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Home, ChevronRight, Building2, Key, Users, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Buy", href: "/buy", icon: Building2, description: "Properties for sale" },
  { name: "Rent", href: "/rent", icon: Key, description: "Rental properties" },
  { name: "Agencies", href: "/agencies", icon: Users, description: "Our partner agencies" },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2 -m-1.5 p-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">SAS IMO</span>
          </Link>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-foreground",
                pathname === item.href ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop auth buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started</Link>
          </Button>
        </div>

        {/* Mobile / Tablet menu */}
        <div className="flex lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm p-0">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              {/* Sheet header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                    <Home className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="text-xl font-semibold text-foreground">SAS IMO</span>
                </Link>
              </div>

              {/* Navigation links */}
              <div className="px-4 py-4">
                <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Browse
                </p>
                <div className="space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <div className="flex-1">
                          <p>{item.name}</p>
                          <p className="text-xs text-muted-foreground font-normal">{item.description}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    )
                  })}
                </div>
              </div>

              <Separator />

              {/* Auth section */}
              <div className="px-4 py-4">
                <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Account
                </p>
                <div className="space-y-1">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <LogIn className="h-5 w-5 shrink-0" />
                    <div className="flex-1">
                      <p>Login</p>
                      <p className="text-xs text-muted-foreground font-normal">Access your account</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <UserPlus className="h-5 w-5 shrink-0" />
                    <div className="flex-1">
                      <p>Register</p>
                      <p className="text-xs text-muted-foreground font-normal">Create a new account</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </div>
              </div>

              {/* CTA at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-muted/50">
                <Button asChild className="w-full" size="lg">
                  <Link href="/register" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Find your perfect property today
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
