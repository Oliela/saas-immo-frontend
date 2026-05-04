"use client"

import { useState } from "react"
import { MessageSquare, CheckCircle, User, Mail, Phone, Home, MapPin, BedDouble, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

const propertyTypes = ["Appartement", "Maison", "Villa", "Studio", "Duplex", "Penthouse", "Commercial", "Terrain"]

const featuresList = [
  "Parking", "Jardin", "Piscine", "Balcon", "Terrasse", "Ascenseur",
  "Securite", "Meuble", "Vue mer", "Vue ville", "Salle de sport", "Concierge",
]

interface ContactAgencyDialogProps {
  agencyId: number
  agencyName: String
  currencySymbol?: string
  children: React.ReactNode
}

export function ContactAgencyDialog({ agencyId, agencyName, currencySymbol = "FCFA", children }: ContactAgencyDialogProps) {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    listingType: "",
    propertyType: "",
    city: "",
    neighborhood: "",
    budgetMin: "",
    budgetMax: "",
    bedrooms: "",
    bathrooms: "",
    areaMin: "",
    areaMax: "",
    features: [] as string[],
    message: "",
    timeline: "",
  })

  const set = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleFeature = (feature: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const handleSubmit = async () => {
    if (!form.firstName || !form.email || !form.listingType || !form.propertyType) return

    const payload = {
      agency_id: agencyId,           // à passer en prop
      nom: form.lastName,
      prenom: form.firstName,
      email: form.email,
      phone: form.phone,

      // Champs wish_form
      property_type: form.propertyType,
      listing_type: form.listingType,
      budget_min: form.budgetMin ? Number(form.budgetMin) : null,
      budget_max: form.budgetMax ? Number(form.budgetMax) : null,
      nb_pieces: form.bedrooms && form.bedrooms !== "any" ? Number(form.bedrooms) : null,
      ville: form.city,
      description: form.message,
      timeline: form.timeline,
      area_min: form.areaMin ? Number(form.areaMin) : null,
      area_max: form.areaMax ? Number(form.areaMax) : null,
      features: form.features.length > 0 ? form.features : null,
    }
    console.log("Submitting contact form with payload:", payload)

    try {
      await axiosInstance.post("/api/leads", payload)
      setSubmitted(true)
      toast.success("Votre demande a été envoyée avec succès ! L'agence vous contactera bientôt.")
    } catch (e) {
      console.error(e)
      toast.error("Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer plus tard.")
    }
  }

  const handleClose = (val: boolean) => {
    setOpen(val)
    if (!val) {
      setTimeout(() => {
        setSubmitted(false)
        setShowAdvanced(false)
        setForm({
          firstName: "", lastName: "", email: "", phone: "",
          listingType: "", propertyType: "", city: "", neighborhood: "",
          budgetMin: "", budgetMax: "", bedrooms: "", bathrooms: "",
          areaMin: "", areaMax: "", features: [], message: "", timeline: "",
        })
      }, 300)
    }
  }

  const isValid = form.firstName && form.email && form.listingType && form.propertyType

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Demande envoyee !</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-xs">
                {agencyName} a recu votre demande de recherche de bien et vous recontactera bientot.
              </p>
            </div>
            <Button onClick={() => handleClose(false)} className="mt-2">Fermer</Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Contacter {agencyName}
              </DialogTitle>
              <DialogDescription>
                Dites-nous ce que vous cherchez et nous trouverons le bien ideal pour vous.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-2">
              {/* Contact info */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Vos informations
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="firstName">
                      Prenom <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="Jean"
                      value={form.firstName}
                      onChange={(e) => set("firstName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      placeholder="Dupont"
                      value={form.lastName}
                      onChange={(e) => set("lastName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">
                      E-mail <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="jean@exemple.com"
                        className="pl-9"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">Telephone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+221 123 45 67 89"
                        className="pl-9"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Property needs */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  Vos besoins immobiliers
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>
                      Je souhaite <span className="text-destructive">*</span>
                    </Label>
                    <Select value={form.listingType} onValueChange={(v) => set("listingType", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Acheter ou louer ?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">Acheter</SelectItem>
                        <SelectItem value="rent">Louer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>
                      Type de bien <span className="text-destructive">*</span>
                    </Label>
                    <Select value={form.propertyType} onValueChange={(v) => set("propertyType", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selectioner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyTypes.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="city">
                      Ville / Region
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="city"
                        placeholder="ex. Dakar, Thies..."
                        className="pl-9"
                        value={form.city}
                        onChange={(e) => set("city", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="neighborhood">Quartier</Label>
                    <Input
                      id="neighborhood"
                      placeholder="ex. Mariste, Ouakam..."
                      value={form.neighborhood}
                      onChange={(e) => set("neighborhood", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Budget min</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">xof</span>
                      <Input
                        type="number"
                        placeholder="0"
                        className="pl-9"
                        value={form.budgetMin}
                        onChange={(e) => set("budgetMin", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Budget max</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">xof</span>
                      <Input
                        type="number"
                        placeholder="Sans limite"
                        className="pl-9"
                        value={form.budgetMax}
                        onChange={(e) => set("budgetMax", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Chambres</Label>
                    <Select value={form.bedrooms} onValueChange={(v) => set("bedrooms", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Peu importe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Peu importe</SelectItem>
                        <SelectItem value="1">1+</SelectItem>
                        <SelectItem value="2">2+</SelectItem>
                        <SelectItem value="3">3+</SelectItem>
                        <SelectItem value="4">4+</SelectItem>
                        <SelectItem value="5">5+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Delai</Label>
                    <Select value={form.timeline} onValueChange={(v) => set("timeline", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Quand en avez-vous besoin ?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">Au plus tot</SelectItem>
                        <SelectItem value="1month">Dans 1 mois</SelectItem>
                        <SelectItem value="3months">Dans 3 mois</SelectItem>
                        <SelectItem value="6months">Dans 6 mois</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Advanced options toggle */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronDown className={cn("h-4 w-4 transition-transform", showAdvanced && "rotate-180")} />
                {showAdvanced ? "Masquer les options avancees" : "Afficher les options avancees (surface, equipements)"}
              </button>

              {showAdvanced && (
                <div className="space-y-4">
                  <Separator />
                  {/* Area */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label>Surface min (m²)</Label>
                      <Input
                        type="number"
                        placeholder="ex. 50"
                        value={form.areaMin}
                        onChange={(e) => set("areaMin", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Surface max (m²)</Label>
                      <Input
                        type="number"
                        placeholder="ex. 200"
                        value={form.areaMax}
                        onChange={(e) => set("areaMax", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <Label>Equipements souhaites</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {featuresList.map((feature) => (
                        <label
                          key={feature}
                          className="flex items-center gap-2 cursor-pointer select-none"
                        >
                          <Checkbox
                            checked={form.features.includes(feature)}
                            onCheckedChange={() => toggleFeature(feature)}
                          />
                          <span className="text-sm">{feature}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Message */}
              <div className="space-y-1.5">
                <Label htmlFor="message">Message complementaire</Label>
                <Textarea
                  id="message"
                  placeholder="Tous les details specifiques ou exigences que vous souhaitez partager avec l'agence..."
                  rows={3}
                  className="resize-none"
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" className="bg-transparent" onClick={() => handleClose(false)}>
                Annuler
              </Button>
              <Button onClick={handleSubmit} disabled={!isValid}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Envoyer la demande
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
