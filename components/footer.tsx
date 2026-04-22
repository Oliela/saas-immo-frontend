import Link from "next/link"
import { Home } from "lucide-react"

const footerNavigation = {
  properties: [
    { name: "Acheter un bien", href: "/buy" },
    { name: "Louer un bien", href: "/rent" },
    { name: "Nouvelles annonces", href: "/buy" },
    { name: "Biens en vedette", href: "/buy" },
  ],
  company: [
    { name: "A propos de nous", href: "https://galle-connect-pro.vercel.app/" },
    { name: "Nos agences", href: "/agencies" },
    { name: "Solutions", href: "https://galle-connect-pro.vercel.app/solutions" },
    { name: "Contact", href: "https://galle-connect-pro.vercel.app/contact" },
  ],
  support: [
    { name: "Centre d'aide", href: "#" },
    { name: "Politique de confidentialite", href: "#" },
    { name: "Conditions d'utilisation", href: "#" },
    { name: "FAQ", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground">
                <Home className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl font-semibold">GalleConnectPro</span>
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/80 max-w-xs">
              Votre partenaire de confiance pour trouver le bien ideal. Nous connectons acheteurs, locataires et agences pour une experience immobiliere fluide.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 xl:justify-end">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold">Biens</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.properties.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-10 md:mt-0">
                <h3 className="text-sm font-semibold">Entreprise</h3>
                <ul role="list" className="mt-4 space-y-3">
                  {footerNavigation.company.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Assistance</h3>
              <ul role="list" className="mt-4 space-y-3">
                {footerNavigation.support.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-primary-foreground/20 pt-8">
          <p className="text-sm text-primary-foreground/60 text-center">
            &copy; {new Date().getFullYear()} GalleConnectPro. Tous droits reserves.
          </p>
        </div>
      </div>
    </footer>
  )
}
