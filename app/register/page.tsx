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
              <span className="text-xl font-semibold text-foreground">SAS IMO</span>
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
            // <>
            //   {/* Progress Steps */}
            //   <div className="flex items-center justify-center gap-2">
            //     {[1, 2, 3].map((s) => (
            //       <div key={s} className="flex items-center gap-2">
            //         <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${step >= s ? "bg-primary text-primary-foreground" : "bg-border text-muted-foreground"
            //           }`}>
            //           {step > s ? <CheckCircle className="h-4 w-4" /> : s}
            //         </div>
            //         <span className={`text-sm hidden sm:inline ${step >= s ? "text-foreground font-medium" : "text-muted-foreground"}`}>
            //           {s === 1 ? "Agency Info" : s === 2 ? "Admin Account" : "Details"}
            //         </span>
            //         {s < 3 && <div className={`w-8 sm:w-12 h-0.5 ${step > s ? "bg-primary" : "bg-border"}`} />}
            //       </div>
            //     ))}
            //   </div>

            //   <Card>
            //     <CardHeader>
            //       <button
            //         type="button"
            //         onClick={() => step === 1 ? setAccountType(null) : setStep(step - 1)}
            //         className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-2"
            //       >
            //         <ArrowLeft className="h-4 w-4" />
            //         {step === 1 ? "Back" : "Previous step"}
            //       </button>
            //       <div className="flex items-center gap-3">
            //         <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
            //           <Building2 className="h-5 w-5 text-accent" />
            //         </div>
            //         <div>
            //           <CardTitle className="text-xl">
            //             {step === 1 ? "Agency Information" : step === 2 ? "Admin Account" : "Additional Details"}
            //           </CardTitle>
            //           <CardDescription>
            //             {step === 1 ? "Tell us about your agency" : step === 2 ? "Create the admin account for your agency" : "Specialties and preferences"}
            //           </CardDescription>
            //         </div>
            //       </div>
            //     </CardHeader>
            //     <CardContent>
            //       {/* Step 1: Agency Info */}
            //       {step === 1 && (
            //         <div className="space-y-4">
            //           <div className="space-y-2">
            //             <Label htmlFor="agencyName">Agency name <span className="text-destructive">*</span></Label>
            //             <Input id="agencyName" placeholder="Premier Properties" required />
            //           </div>
            //           <div className="grid grid-cols-2 gap-4">
            //             <div className="space-y-2">
            //               <Label htmlFor="agencyEmail">Agency email <span className="text-destructive">*</span></Label>
            //               <div className="relative">
            //                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            //                 <Input id="agencyEmail" type="email" className="pl-10" placeholder="contact@agency.com" required />
            //               </div>
            //             </div>
            //             <div className="space-y-2">
            //               <Label htmlFor="agencyPhone">Phone <span className="text-destructive">*</span></Label>
            //               <div className="relative">
            //                 <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            //                 <Input id="agencyPhone" type="tel" className="pl-10" placeholder="+33 1 23 45 67 89" required />
            //               </div>
            //             </div>
            //           </div>
            //           <div className="space-y-2">
            //             <Label htmlFor="agencyAddress">Address <span className="text-destructive">*</span></Label>
            //             <Input id="agencyAddress" placeholder="123 Avenue des Champs" required />
            //           </div>
            //           <div className="grid grid-cols-2 gap-4">
            //             <div className="space-y-2">
            //               <Label htmlFor="agencyCity">City <span className="text-destructive">*</span></Label>
            //               <div className="relative">
            //                 <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            //                 <Input id="agencyCity" className="pl-10" placeholder="Paris" required />
            //               </div>
            //             </div>
            //             <div className="space-y-2">
            //               <Label htmlFor="licenseNumber">License number</Label>
            //               <div className="relative">
            //                 <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            //                 <Input id="licenseNumber" className="pl-10" placeholder="CPI-XXXX-XXXX" />
            //               </div>
            //             </div>
            //           </div>
            //           <Button onClick={() => setStep(2)} className="w-full" size="lg">
            //             Continue
            //             <ArrowRight className="ml-2 h-4 w-4" />
            //           </Button>
            //         </div>
            //       )}

            //       {/* Step 2: Admin Account */}
            //       {step === 2 && (
            //         <div className="space-y-4">
            //           <div className="rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
            //             This will be the main administrator account for your agency. You can add more agents later from the dashboard.
            //           </div>
            //           <div className="grid grid-cols-2 gap-4">
            //             <div className="space-y-2">
            //               <Label htmlFor="adminFirst">First name <span className="text-destructive">*</span></Label>
            //               <Input id="adminFirst" placeholder="Jean" required />
            //             </div>
            //             <div className="space-y-2">
            //               <Label htmlFor="adminLast">Last name <span className="text-destructive">*</span></Label>
            //               <Input id="adminLast" placeholder="Dupont" required />
            //             </div>
            //           </div>
            //           <div className="space-y-2">
            //             <Label htmlFor="adminEmail">Admin email <span className="text-destructive">*</span></Label>
            //             <Input id="adminEmail" type="email" placeholder="admin@agency.com" required />
            //           </div>
            //           <div className="space-y-2">
            //             <Label htmlFor="adminPhone">Phone number</Label>
            //             <Input id="adminPhone" type="tel" placeholder="+33 6 12 34 56 78" />
            //           </div>
            //           <div className="space-y-2">
            //             <Label htmlFor="adminPassword">Password <span className="text-destructive">*</span></Label>
            //             <Input id="adminPassword" type="password" placeholder="Min. 8 characters" required />
            //           </div>
            //           <div className="space-y-2">
            //             <Label htmlFor="adminPasswordConfirm">Confirm password <span className="text-destructive">*</span></Label>
            //             <Input id="adminPasswordConfirm" type="password" placeholder="Repeat your password" required />
            //           </div>
            //           <Button onClick={() => setStep(3)} className="w-full" size="lg">
            //             Continue
            //             <ArrowRight className="ml-2 h-4 w-4" />
            //           </Button>
            //         </div>
            //       )}

            //       {/* Step 3: Details & Specialties */}
            //       {step === 3 && (
            //         <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}>
            //           <div className="space-y-2">
            //             <Label>Specialties</Label>
            //             <p className="text-xs text-muted-foreground">Select the domains your agency specializes in</p>
            //             <div className="flex flex-wrap gap-2 pt-1">
            //               {specialtyOptions.map((s) => (
            //                 <Badge
            //                   key={s}
            //                   variant={selectedSpecialties.includes(s) ? "default" : "outline"}
            //                   className={`cursor-pointer transition-colors text-sm py-1.5 px-3 ${selectedSpecialties.includes(s)
            //                       ? ""
            //                       : "bg-transparent hover:bg-secondary"
            //                     }`}
            //                   onClick={() => toggleSpecialty(s)}
            //                 >
            //                   {s}
            //                 </Badge>
            //               ))}
            //             </div>
            //           </div>
            //           <div className="space-y-2">
            //             <Label htmlFor="agencyDescription">Agency description</Label>
            //             <Textarea
            //               id="agencyDescription"
            //               placeholder="Tell clients about your agency, your experience, and what makes you different..."
            //               rows={4}
            //             />
            //           </div>
            //           <Separator />
            //           <div className="flex items-start space-x-2">
            //             <Checkbox id="agencyTerms" className="mt-1" />
            //             <Label htmlFor="agencyTerms" className="text-sm leading-relaxed font-normal text-muted-foreground">
            //               I agree to the{" "}
            //               <Link href="#" className="text-foreground hover:underline">Terms of Service</Link>,{" "}
            //               <Link href="#" className="text-foreground hover:underline">Privacy Policy</Link>{" "}
            //               and{" "}
            //               <Link href="#" className="text-foreground hover:underline">Agency Agreement</Link>
            //             </Label>
            //           </div>
            //           <div className="flex items-start space-x-2">
            //             <Checkbox id="agencyCertify" className="mt-1" />
            //             <Label htmlFor="agencyCertify" className="text-sm leading-relaxed font-normal text-muted-foreground">
            //               I certify that all provided information is accurate and that I am authorized to register this agency
            //             </Label>
            //           </div>
            //           <Button type="submit" className="w-full" size="lg">
            //             <Building2 className="mr-2 h-4 w-4" />
            //             Create Agency Account
            //           </Button>
            //         </form>
            //       )}

            //       <p className="mt-4 text-center text-sm text-muted-foreground">
            //         Already have an account?{" "}
            //         <Link href="/login" className="font-medium text-foreground hover:underline">Sign in</Link>
            //       </p>
            //     </CardContent>
            //   </Card>
            // </>
            <AgencyRegisterForm onBack={() => setAccountType(null)}  />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SAS IMO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
