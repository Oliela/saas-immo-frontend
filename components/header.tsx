"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, Home, ChevronRight, Building2, Key, Users, LogIn, UserPlus, LayoutDashboard, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { getUser } from "@/lib/api/auth"

const navigation = [
  { name: "Acheter", href: "/buy", icon: Building2, description: "Biens à vendre" },
  { name: "Louer", href: "/rent", icon: Key, description: "Biens en location" },
  { name: "Agences", href: "/agencies", icon: Users, description: "Nos agences partenaires" },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUser()
      setUser(data)
      setLoading(false)
    }

    fetchUser()
  }, [])

  const isClient = user?.user?.account_type === "client"
  const isAgency = user?.user?.account_type === "agency_user"
  // console.log("User data in Header:", user, "isClient:", isClient, "isAgency:", isAgency)

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 border-b border-border">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="flex items-center gap-2 -m-1.5 p-1.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">GalleConnectPro</span>
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
          {!loading && !user ? (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Connexion</Link>
              </Button>
              <Button asChild>
                <Link href="/register">S'inscrire</Link>
              </Button>
            </>
          ) : (
            <>
              {isClient && (
                <Button asChild>
                  <Link href="/portal">Mon profil</Link>
                </Button>
              )}

              {isAgency && (
                <Button asChild>
                  <Link href="/dashboard">Tableau de bord</Link>
                </Button>
              )}
            </>
          )}
        </div>

        {/* Mobile / Tablet menu */}
        <div className="flex lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm p-0">
              <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
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
                  <span className="text-xl font-semibold text-foreground">GalleConnectPro</span>
                </Link>
              </div>

              {/* Navigation links */}
              <div className="px-4 py-4">
                <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Explorer
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
                  Compte
                </p>
                <div className="space-y-1">
                  {!loading && !user ? (
                    <>
                      <Link
                        href="/login"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        <LogIn className="h-5 w-5 shrink-0" />
                        <div className="flex-1">
                          <p>Connexion</p>
                          <p className="text-xs text-muted-foreground font-normal">Accéder à votre compte</p>
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
                          <p>S'inscrire</p>
                          <p className="text-xs text-muted-foreground font-normal">Créer un nouveau compte</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </>
                  ) : (
                    <>
                      {isClient && (
                        <Link
                          href="/profile"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          <User className="h-5 w-5 shrink-0" />
                          <div className="flex-1">
                            <p>Mon profil</p>
                            <p className="text-xs text-muted-foreground font-normal">Gérer mon compte</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      )}

                      {isAgency && (
                        <Link
                          href="/dashboard"
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                        >
                          <LayoutDashboard className="h-5 w-5 shrink-0" />
                          <div className="flex-1">
                            <p>Tableau de bord</p>
                            <p className="text-xs text-muted-foreground font-normal">Accéder au tableau de bord</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* CTA at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-muted/50">
                {!loading && !user ? (
                  <Button asChild className="w-full" size="lg">
                    <Link href="/register" onClick={() => setOpen(false)}>
                      Commencer
                    </Link>
                  </Button>
                ) : isClient ? (
                  <Button asChild className="w-full" size="lg">
                    <Link href="/profile" onClick={() => setOpen(false)}>
                      Mon profil
                    </Link>
                  </Button>
                ) : isAgency ? (
                  <Button asChild className="w-full" size="lg">
                    <Link href="/dashboard" onClick={() => setOpen(false)}>
                      Tableau de bord
                    </Link>
                  </Button>
                ) : null}
                <p className="text-xs text-center text-muted-foreground mt-2">
                  Trouvez le bien idéal dès aujourd'hui
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
