"use client"

import { Camera, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useRef, useState, useEffect } from "react"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"
import { set } from "date-fns"

interface Specialty {
  id: number
  name: string
}

interface Agency {
  id: number
  name: string
  email: string
  phone: string
  web_site?: string | null
  address: string
  city: string
  description: string
  specializations: Specialty[]
  logo?: string | null
}

interface Props {
  agency: Agency
}

const specialtiesOptions = [
  { id: 1, name: "Ventes Résidentielles" },
  { id: 2, name: "Locations commerciales" },
  { id: 3, name: "Gestion Immobilière" },
  { id: 4, name: "Investissements immobiliers" },
  { id: 5, name: "Propriétés de luxe" },

]

export default function AgencyProfileForm({ agency }: Props) {
  const [agencyName, setAgencyName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [description, setDescription] = useState("")
  const [selectedSpecialties, setSelectedSpecialties] = useState<number[]>([])
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Charger les données du prop agency
  useEffect(() => {
    if (agency) {
      setAgencyName(agency.name)
      setEmail(agency.email)
      setPhone(agency.phone)
      setWebsite(agency.web_site || "")
      setAddress(agency.address)
      setDescription(agency.description)
      setCity(agency.city) // Assuming city is part of the address for now
      setSelectedSpecialties(agency.specializations.map((s) => s.id) || [])
    }
  }, [agency])

  const toggleSpecialty = (id: number) => {
    setSelectedSpecialties((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    )
  }

  // const toggleSpecialty = (id: number) => {
  //   setSelectedSpecialties((prev) =>
  //     prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
  //   )
  // }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setLogoFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(false)
   

    // console.log("Submitting form with data:", {
    //   agencyName,
    //   email,
    //   phone,
    //   website,
    //   address,
    //   description,
    //   selectedSpecialties,
    //   logoFile,
    // })
    try {
      const formData = new FormData()
      formData.append("name", agencyName)
      formData.append("email", email)
      formData.append("phone", phone)
      formData.append("website", website)
      formData.append("address", address)
      formData.append("city", city)
      formData.append("description", description)
      formData.append("specialties", JSON.stringify(selectedSpecialties))
      if (logoFile) formData.append("logo", logoFile)

      await axiosInstance.get("/sanctum/csrf-cookie")

      const res = await axiosInstance.put(`/api/agency/update/profile/${agency.id}`, formData)

      toast.success("Profil de l'agence mis à jour")
      window.location.reload() // Reload to fetch updated data, ideally should update state instead
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || "Une erreur est survenue"
      toast.error(message)
      console.error("Error updating agency profile:", err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Informations sur l'agence</CardTitle>
          <CardDescription>Mettez à jour le profil de votre agence et les informations publiques</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Logo Upload */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                {/* <AvatarImage
                  src={logoFile ? URL.createObjectURL(logoFile) : agency.logo || "/images/agency-1.jpg"}
                  alt="Logo de l'agence"
                /> */}
                <AvatarImage
                  src="/images/agency-1.jpg"
                  alt="Logo de l'agence"
                />
                <AvatarFallback>PP</AvatarFallback>
              </Avatar>
              {/* <input ref={fileInputRef} onChange={handleFileChange} className="hidden" type="file" accept="image/*" /> */}
              <input ref={fileInputRef} className="hidden" type="file" accept="image/*" />

              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h3 className="font-medium text-foreground">Logo de l'agence</h3>
              <p className="text-sm text-muted-foreground">Téléchargez un logo pour votre agence. Taille recommandée : 200x200px</p>
            </div>
          </div>

          <Separator />

          {/* Agency Details Form */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="agencyName">Nom de l'agence</Label>
              <Input id="agencyName" value={agencyName} onChange={(e) => setAgencyName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email de contact</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} />
            </div>
            <div className="space-y-2 ">
              <Label htmlFor="address">Adresse</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div className="space-y-2 ">
              <Label htmlFor="city">Ville</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description de l'agence</Label>
              <Textarea id="description" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>

          <Separator />

          {/* Specialties */}
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-foreground">Spécialités</h3>
              <p className="text-sm text-muted-foreground">Sélectionnez les spécialités de votre agence</p>
            </div>
            {/* <div className="grid gap-4 sm:grid-cols-3">
              {agency.specializations.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <Switch checked={selectedSpecialties.includes(s.id)} onCheckedChange={() => toggleSpecialty(s.id)} />
                  <Label className="font-normal">{s.name}</Label>
                </div>
              ))}
            </div> */}
            <div className="grid gap-4 sm:grid-cols-3">
              {specialtiesOptions.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <Switch
                    checked={selectedSpecialties.includes(s.id)}
                    onCheckedChange={() => toggleSpecialty(s.id)}
                  />
                  <Label className="font-normal">{s.name}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}