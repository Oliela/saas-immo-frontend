"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, Building2, User, ArrowLeft, ArrowRight, CheckCircle, MapPin, Phone, Mail, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import AuthHeader from "@/components/auth/AuthHeader"
import AccountTypeSelection from "@/components/auth/AccountTypeSelection"
import ClientRegisterForm from "@/components/auth/ClientRegisterForm"
import AgencyRegisterForm from "@/components/auth/AgencyRegisterForm"

const specialtyOptions = [
  "Residential",
  "Commercial",
  "Luxury",
  "Rentals",
  "New Construction",
  "Land",
  "Investment",
  "Property Management",
]

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<"client" | "agency" | null>(null)
  const [step, setStep] = useState(1)
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const toggleSpecialty = (s: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <header className="py-6 px-4">
          <div className="mx-auto max-w-7xl">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">Galle Connect Pro</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-10 pb-10 space-y-6">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Compte créé !
                </h2>

                <p className="text-muted-foreground">
                  {accountType === "agency"
                    ? "Votre compte agence a été créé. Notre équipe va examiner vos informations et vérifier votre licence."
                    : "Votre compte a été créé. Vous pouvez désormais parcourir les biens et contacter les agences."}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button asChild size="lg">
                  <Link href={accountType === "agency" ? "/dashboard" : "/portal"}>
                    Aller vers {accountType === "agency" ? "le tableau de bord" : "mon espace"}
                  </Link>
                </Button>

                <Button variant="outline" asChild size="lg" className="bg-transparent">
                  <Link href="/">Parcourir les biens</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      {/* Header */}
      <AuthHeader />
    

      {/* Register Form */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg space-y-6">

          {/* Step 1: Choose account type */}
          {!accountType && (
            <AccountTypeSelection setAccountType={setAccountType} />
            
          )}

          {/* CLIENT Registration */}
          {accountType === "client" && (
            <ClientRegisterForm onBack={() => setAccountType(null)} />
          )}

          {/* AGENCY Registration - Multi-step */}
          {accountType === "agency" && (
            
            <AgencyRegisterForm onBack={() => setAccountType(null)}  />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Galle Connect Pro. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}
