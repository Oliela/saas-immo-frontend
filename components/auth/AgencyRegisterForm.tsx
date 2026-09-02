"use client"
import React, { useState } from "react"
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Building2,
  Mail,
  Phone,
  MapPin,
  Shield,
} from "lucide-react"
import axios from "@/lib/axios"

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@radix-ui/react-separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { africanTimezones, DEFAULT_AGENCY_TIMEZONE } from "@/data/africanTimezones"
import Link from "next/link"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

type Specialty = {
  id: number
  label: string
}

interface AgencyFormData {
  agencyName: string
  agencyEmail: string
  agencyPhone: string
  agencyAddress: string
  agencyCity: string
  agencyTimezone: string
  licenseNumber: string

  adminFirst: string
  adminLast: string
  adminEmail: string
  adminPhone: string
  adminPassword: string
  adminPassword_confirmation: string

  specialties: number[]
  agencyDescription: string
  agencyTerms: boolean
  agencyCertify: boolean
}

interface AgencyRegisterFormProps {
  onBack?: () => void
}

export default function AgencyRegisterForm({ onBack }: AgencyRegisterFormProps): React.ReactElement {
  const [step, setStep] = useState<number>(1)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const specialtyOptions: Specialty[] = [
    { id: 1, label: "Ventes résidentielles" },
    { id: 2, label: "Location commerciale" },
    { id: 3, label: "Gestion immobilière" },
    { id: 4, label: "Investissement immobilier" },
  ];

  const [formData, setFormData] = useState<AgencyFormData>({
    agencyName: "",
    agencyEmail: "",
    agencyPhone: "",
    agencyAddress: "",
    agencyCity: "",
    agencyTimezone: DEFAULT_AGENCY_TIMEZONE,
    licenseNumber: "",

    adminFirst: "",
    adminLast: "",
    adminEmail: "",
    adminPhone: "",
    adminPassword: "",
    adminPassword_confirmation: "",

    specialties: [],
    agencyDescription: "",
    agencyTerms: false,
    agencyCertify: false,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement
    const id = target.id
    const value = (target as HTMLTextAreaElement).value ?? (target as HTMLInputElement).value
    const type = (target as HTMLInputElement).type ?? undefined
    const checked = (target as HTMLInputElement & { checked?: boolean }).checked

    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? Boolean(checked) : value,
    } as unknown as AgencyFormData))
  }

  // function toggleSpecialty(specialty: Specialty) {
  //   setFormData((prev) => ({
  //     ...prev,
  //     specialties: prev.specialties.includes(specialty)
  //       ? prev.specialties.filter((s) => s !== specialty)
  //       : [...prev.specialties, specialty],
  //   }))
  // }
  const toggleSpecialty = (id: number) => {
    setFormData((prev) => {
      const exists = prev.specialties.includes(id);

      return {
        ...prev,
        specialties: exists
          ? prev.specialties.filter((s) => s !== id)
          : [...prev.specialties, id],
      };
    });
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (formData.adminPassword !== formData.adminPassword_confirmation) {
      // setError("Les mots de passe ne correspondent pas")
      toast.error("Les mots de passe ne correspondent pas")
      return
    }

    const missingAgency = [
      "agencyName",
      "agencyEmail",
      "agencyPhone",
      "agencyAddress",
      "agencyCity",
      "agencyTimezone",
    ].filter((k) => !(formData as any)[k])

    const missingAdmin = [
      "adminFirst",
      "adminLast",
      "adminEmail",
      "adminPassword",
      "adminPassword_confirmation",
    ].filter((k) => !(formData as any)[k])

    if (missingAgency.length) {
      // setError("Veuillez remplir toutes les informations de l'agence.")
      toast.error("Veuillez remplir toutes les informations de l'agence.")

      return
    }

    if (missingAdmin.length) {
      // setError("Veuillez remplir toutes les informations de l'administrateur.")
      toast.error("Veuillez remplir toutes les informations de l'administrateur.")

      return
    }

    if (!formData.agencyTerms) {
      // setError("Vous devez accepter les conditions.")
      toast.error("Vous devez accepter les conditions.")
      return
    }
    if (!formData.agencyCertify) {
      // setError("Vous devez confirmer que les informations sont correctes.")
      toast.error("Vous devez confirmer que les informations sont correctes.")
      return
    }
    // console.log("Soumission du formulaire agence :", formData)

    setSubmitting(true)
    try {
      await axiosInstance.get("/sanctum/csrf-cookie")

      const payload = { ...formData, role: "agency" }

      const res = await axiosInstance.post("/api/register/agency", payload)

      // setSuccess("Compte agence créé avec succès.")
      toast.success("Compte agence créé avec succès.")

      setSubmitting(false)
      setSubmitted(true)

      window.location.href = res.data.redirect || '/login';

    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err)
      const message = err?.response?.data?.message || err?.message || "Erreur lors de la création du compte"
      // setError(message)
      toast.error(message)
      setSubmitting(false)
    }
  }

  if (submitted) {
    return <div className="text-center py-20">Compte agence créé 🎉</div>
  }

  return (
    <>
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors ${step >= s ? "bg-primary text-primary-foreground" : "bg-border text-muted-foreground"
                }`}
            >
              {step > s ? <CheckCircle className="h-4 w-4" /> : s}
            </div>
            <span className={`text-sm hidden sm:inline ${step >= s ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              {s === 1 ? "Infos agence" : s === 2 ? "Compte admin" : "Détails"}
            </span>
            {s < 3 && <div className={`w-8 sm:w-12 h-0.5 ${step > s ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <button
            type="button"
            onClick={() => {
              if (step === 1) {
                onBack?.()
              } else {
                setStep(step - 1)
              }
            }}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {step === 1 ? "Retour" : "Étape précédente"}
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
              <Building2 className="h-5 w-5 text-accent" />
            </div>
            <div>
              <CardTitle className="text-xl">
                {step === 1 ? "Informations sur l'agence" : step === 2 ? "Compte administrateur" : "Détails supplémentaires"}
              </CardTitle>
              <CardDescription>
                {step === 1
                  ? "Parlez-nous de votre agence"
                  : step === 2
                    ? "Créez le compte administrateur pour votre agence"
                    : "Spécialités et préférences"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Step 1: Agency Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agencyName">
                  Nom de l'agence <span className="text-destructive">*</span>
                </Label>
                <Input id="agencyName" value={formData.agencyName} onChange={handleChange} placeholder="Ex : Premier Properties" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agencyEmail">
                    Email de l'agence <span className="text-destructive">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="agencyEmail" type="email" value={formData.agencyEmail} onChange={handleChange} className="pl-10" placeholder="contact@agence.com" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agencyPhone">Téléphone <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="agencyPhone" type="tel" value={formData.agencyPhone} onChange={handleChange} className="pl-10" placeholder="+33 1 23 45 67 89" required />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="agencyAddress">Adresse <span className="text-destructive">*</span></Label>
                <Input id="agencyAddress" value={formData.agencyAddress} onChange={handleChange} placeholder="123 Avenue des Champs" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="agencyCity">Ville <span className="text-destructive">*</span></Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="agencyCity" className="pl-10" value={formData.agencyCity} onChange={handleChange} placeholder="Paris" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Numéro de licence</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="licenseNumber" className="pl-10" value={formData.licenseNumber} onChange={handleChange} placeholder="CPI-XXXX-XXXX" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="agencyTimezone">
                  Fuseau horaire <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.agencyTimezone}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, agencyTimezone: value }))}
                >
                  <SelectTrigger id="agencyTimezone">
                    <SelectValue placeholder="Sélectionnez le pays de l’agence" />
                  </SelectTrigger>
                  <SelectContent>
                    {africanTimezones.map(({ country, timezone }) => (
                      <SelectItem key={timezone} value={timezone}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Les automatisations seront exécutées selon l’heure locale de ce pays.
                </p>
              </div>
              <Button type="button" onClick={() => setStep(2)} className="w-full" size="lg">
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Admin Account */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
                Ceci sera le compte administrateur principal pour votre agence. Vous pourrez ajouter d'autres agents depuis le tableau de bord.
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminFirst">Prénom <span className="text-destructive">*</span></Label>
                  <Input id="adminFirst" value={formData.adminFirst} onChange={handleChange} placeholder="Jean" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminLast">Nom <span className="text-destructive">*</span></Label>
                  <Input id="adminLast" value={formData.adminLast} onChange={handleChange} placeholder="Dupont" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Email administrateur <span className="text-destructive">*</span></Label>
                <Input id="adminEmail" type="email" value={formData.adminEmail} onChange={handleChange} placeholder="admin@agence.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPhone">Téléphone</Label>
                <Input id="adminPhone" type="tel" value={formData.adminPhone} onChange={handleChange} placeholder="+33 6 12 34 56 78" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Mot de passe <span className="text-destructive">*</span></Label>
                <Input id="adminPassword" type="password" value={formData.adminPassword} onChange={handleChange} placeholder="Min. 8 caractères" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminPassword_confirmation">Confirmer le mot de passe <span className="text-destructive">*</span></Label>
                <Input id="adminPassword_confirmation" type="password" value={formData.adminPassword_confirmation} onChange={handleChange} placeholder="Répétez votre mot de passe" required />
              </div>
              <Button type="button" onClick={() => setStep(3)} className="w-full" size="lg">
                Continuer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 3: Details & Specialties */}
          {step === 3 && (
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label>Spécialités</Label>
                <p className="text-xs text-muted-foreground">Sélectionnez les domaines de spécialisation de votre agence</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {/* {specialtyOptions.map((s) => (
                    <Badge
                      key={s}
                      variant={formData.specialties.includes(s) ? "default" : "outline"}
                      className={`cursor-pointer transition-colors text-sm py-1.5 px-3 ${formData.specialties.includes(s) ? "" : "bg-transparent hover:bg-secondary"}`}
                      onClick={() => toggleSpecialty(s)}
                    >
                      {s}
                    </Badge>
                  ))} */}
                  {specialtyOptions.map((s) => (
                    <Badge
                      key={s.id}
                      variant={
                        formData.specialties.includes(s.id) ? "default" : "outline"
                      }
                      className={`cursor-pointer transition-colors text-sm py-1.5 px-3 ${formData.specialties.includes(s.id)
                        ? ""
                        : "bg-transparent hover:bg-secondary"
                        }`}
                      onClick={() => toggleSpecialty(s.id)}
                    >
                      {s.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="agencyDescription">Description de l'agence</Label>
                <Textarea id="agencyDescription" value={formData.agencyDescription} onChange={handleChange} placeholder="Parlez aux clients de votre agence, de votre expérience et de ce qui vous différencie..." rows={4} />
              </div>
              <Separator />
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agencyTerms"
                  checked={formData.agencyTerms}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agencyTerms: Boolean(checked) }))}
                  className="mt-1"
                />
                <Label htmlFor="agencyTerms" className="text-sm leading-relaxed font-normal text-muted-foreground">
                  J'accepte les {" "}
                  <Link href="#" className="text-foreground hover:underline">Conditions d'utilisation</Link>, {" "}
                  <Link href="#" className="text-foreground hover:underline">la Politique de confidentialité</Link> {" "}
                  et {" "}
                  <Link href="#" className="text-foreground hover:underline">la Convention d'agence</Link>
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="agencyCertify"
                  checked={formData.agencyCertify}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agencyCertify: Boolean(checked) }))}
                  className="mt-1"
                />
                <Label htmlFor="agencyCertify" className="text-sm leading-relaxed font-normal text-muted-foreground">
                  Je certifie que toutes les informations fournies sont exactes et que je suis autorisé(e) à enregistrer cette agence
                </Label>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {success && <p className="text-sm text-success">{success}</p>}

              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                <Building2 className="mr-2 h-4 w-4" />
                {submitting ? "Création..." : "Créer le compte agence"}
              </Button>
            </form>
          )}

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ? {" "}
            <Link href="/login" className="font-medium text-foreground hover:underline">Se connecter</Link>
          </p>
        </CardContent>
      </Card>
    </>
  )
}
