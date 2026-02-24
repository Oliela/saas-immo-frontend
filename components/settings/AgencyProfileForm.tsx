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

const specialties = [
    "Maisons de luxe",
    "Penthouses",
    "Commercial",
    "Résidentiel",
    "Maisons de vacances",
    "Investissement",
  ]

export default function AgencyProfileForm() {
    return (
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
                            <AvatarImage src="/images/agency-1.jpg" alt="Logo de l'agence" />
                            <AvatarFallback>PP</AvatarFallback>
                        </Avatar>
                        <Button
                            size="icon"
                            variant="secondary"
                            className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
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
                        <Input id="agencyName" defaultValue="Premier Properties Group" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email de contact</Label>
                        <Input id="email" type="email" defaultValue="info@premierproperties.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website">Site web</Label>
                        <Input id="website" type="url" defaultValue="https://premierproperties.com" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="address">Adresse</Label>
                        <Input id="address" defaultValue="123 Real Estate Avenue, New York, NY 10001" />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="description">Description de l'agence</Label>
                        <Textarea
                            id="description"
                            rows={4}
                            defaultValue={"Agence immobilière de luxe leader avec plus de 20 ans d'expérience dans les biens résidentiels et commerciaux haut de gamme."}
                        />
                    </div>
                </div>

                <Separator />

                {/* Specialties */}
                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-foreground">Spécialités</h3>
                        <p className="text-sm text-muted-foreground">Sélectionnez les spécialités de votre agence</p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {specialties.map((specialty) => (
                            <div key={specialty} className="flex items-center gap-2">
                                <Switch defaultChecked={["Maisons de luxe", "Penthouses", "Commercial"].includes(specialty)} />
                                <Label className="font-normal">{specialty}</Label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les modifications
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}