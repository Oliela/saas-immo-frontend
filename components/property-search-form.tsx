"use client"

import { useState } from "react"
import {
  Mail,
  Phone,
  MapPin,
  Home,
  DollarSign,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import axiosInstance from "@/lib/axios"

interface PropertySearchFormProps {
  propertyTitle: string
  propertyType?: string
  listingType?: "sale" | "rent"
  bienId: number
  agencyId: number
}

const FEATURES = ["Piscine", "Jardin", "Parking", "Balcon", "Ascenseur", "Meublé", "Sécurité"]

export function PropertySearchForm({
  propertyTitle,
  propertyType,
  listingType,
  bienId,
  agencyId,
}: PropertySearchFormProps) {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    intent: listingType || "sale",
    propertyType: propertyType || "all",
    city: "",
    minBudget: "",
    maxBudget: "",
    minArea: "",
    bedrooms: "any",
    bathrooms: "any",
    features: [] as string[],
    message: "",
  })

  const toggleFeature = (f: string) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter((x) => x !== f)
        : [...prev.features, f],
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    // console.log("📤 Form data to submit:", {
      ...form,
      agency_id: agencyId,
      bien_title: propertyTitle,
    })
    // try {
    //   await axiosInstance.post(`/api/biens/${bienId}/contact`, {
    //     ...form,
    //     agency_id: agencyId,
    //     bien_title: propertyTitle,
    //   })
    //   setSubmitted(true)
    // } catch {
    //   setError("Une erreur est survenue. Veuillez réessayer.")
    // } finally {
    //   setIsSubmitting(false)
    // }
  }

  const isValid = form.firstName && form.email && form.phone

  if (submitted) {
    return (
      <div className="text-center py-6 space-y-3">
        <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center">
          <CheckCircle className="h-7 w-7 text-emerald-600" />
        </div>
        <h3 className="font-semibold text-foreground">Demande envoyée !</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Un agent vous contactera sous 24 heures avec les biens correspondants.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="bg-transparent mt-2"
          onClick={() => setSubmitted(false)}
        >
          Envoyer une autre demande
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="pb-1 border-b border-border">
        <p className="text-xs text-muted-foreground">
          Intéressé(e) par{" "}
          <span className="font-medium text-foreground">{propertyTitle}</span> ?
          Dites-nous ce que vous cherchez.
        </p>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs">
            Prénom <span className="text-destructive">*</span>
          </Label>
          <Input
            placeholder="Jean"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Nom</Label>
          <Input
            placeholder="Dupont"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="h-9 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs flex items-center gap-1">
          <Mail className="h-3 w-3" /> E-mail{" "}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          type="email"
          placeholder="jean@exemple.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="h-9 text-sm"
        />
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs flex items-center gap-1">
          <Phone className="h-3 w-3" /> Téléphone{" "}
          <span className="text-destructive">*</span>
        </Label>
        <Input
          type="tel"
          placeholder="+221 77 000 00 00"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="h-9 text-sm"
        />
      </div>

      {/* Besoins */}
      <div className="pt-1 border-t border-border space-y-3">
        <p className="text-xs font-semibold text-foreground">Vos besoins</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1">
              <Home className="h-3 w-3" /> Intention
            </Label>
            <Select
              value={form.intent}
              onValueChange={(v) => setForm({ ...form, intent: v })}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">Acheter</SelectItem>
                <SelectItem value="rent">Louer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Type de bien</Label>
            <Select
              value={form.propertyType}
              onValueChange={(v) => setForm({ ...form, propertyType: v })}
            >
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="appartement">Appartement</SelectItem>
                <SelectItem value="maison">Maison</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="duplex">Duplex</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs flex items-center gap-1">
            <MapPin className="h-3 w-3" /> Ville / quartier souhaité
          </Label>
          <Input
            placeholder="ex. Dakar, Plateau..."
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="h-9 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs flex items-center gap-1">
              <DollarSign className="h-3 w-3" /> Budget min
            </Label>
            <Input
              type="number"
              placeholder="0"
              value={form.minBudget}
              onChange={(e) => setForm({ ...form, minBudget: e.target.value })}
              className="h-9 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Budget max</Label>
            <Input
              type="number"
              placeholder="Sans limite"
              value={form.maxBudget}
              onChange={(e) => setForm({ ...form, maxBudget: e.target.value })}
              className="h-9 text-sm"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowMore(!showMore)}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          {showMore ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
          {showMore
            ? "Moins d'options"
            : "Plus d'options (pièces, surface, équipements)"}
        </button>

        {showMore && (
          <div className="space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Pièces</Label>
                <div className="flex flex-wrap gap-1">
                  {["any", "1", "2", "3", "4+"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setForm({ ...form, bedrooms: v })}
                      className={cn(
                        "h-7 min-w-[32px] rounded border px-2 text-xs font-medium transition-all",
                        form.bedrooms === v
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/50"
                      )}
                    >
                      {v === "any" ? "Peu importe" : v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Salles de bain</Label>
                <div className="flex flex-wrap gap-1">
                  {["any", "1", "2", "3+"].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setForm({ ...form, bathrooms: v })}
                      className={cn(
                        "h-7 min-w-[32px] rounded border px-2 text-xs font-medium transition-all",
                        form.bathrooms === v
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/50"
                      )}
                    >
                      {v === "any" ? "Peu importe" : v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Surface min (m²)</Label>
              <Input
                type="number"
                placeholder="ex. 50"
                value={form.minArea}
                onChange={(e) => setForm({ ...form, minArea: e.target.value })}
                className="h-9 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Équipements souhaités</Label>
              <div className="grid grid-cols-2 gap-1.5">
                {FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-1.5">
                    <Checkbox
                      id={`feat-${f}`}
                      checked={form.features.includes(f)}
                      onCheckedChange={() => toggleFeature(f)}
                      className="h-3.5 w-3.5"
                    />
                    <label
                      htmlFor={`feat-${f}`}
                      className="text-xs cursor-pointer text-foreground"
                    >
                      {f}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Message complémentaire</Label>
        <Textarea
          placeholder="Autres exigences ou questions..."
          rows={3}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="text-sm resize-none"
        />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <Button
        className="w-full"
        size="lg"
        onClick={handleSubmit}
        disabled={!isValid || isSubmitting}
      >
        <Send className="mr-2 h-4 w-4" />
        {isSubmitting ? "Envoi en cours..." : "Envoyer ma recherche"}
      </Button>
    </div>
  )
}