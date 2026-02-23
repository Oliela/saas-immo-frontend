import Link from "next/link"
import { Home } from "lucide-react"

const footerNavigation = {
  properties: [
    { name: "Buy Property", href: "/buy" },
    { name: "Rent Property", href: "/rent" },
    { name: "New Listings", href: "/buy" },
    { name: "Featured Properties", href: "/buy" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Our Agencies", href: "/agencies" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
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
              <span className="text-xl font-semibold">SAS IMO</span>
            </Link>
            <p className="text-sm leading-relaxed text-primary-foreground/80 max-w-xs">
              Your trusted partner in finding the perfect property. We connect buyers, renters, and agencies for seamless real estate experiences.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 xl:justify-end">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold">Properties</h3>
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
                <h3 className="text-sm font-semibold">Company</h3>
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
              <h3 className="text-sm font-semibold">Support</h3>
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
            &copy; {new Date().getFullYear()} SAS IMO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
