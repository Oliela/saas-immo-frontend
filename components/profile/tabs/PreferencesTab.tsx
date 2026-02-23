"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

// const profileData = {
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@example.com",
//     phone: "+1 (555) 123-4567",
//     dateOfBirth: "1990-05-15",
//     address: "456 Current St, Los Angeles, CA 90001",
//     occupation: "Software Engineer",
//     employer: "Tech Corp",
//     monthlyIncome: "8000",
//     employmentType: "full-time",
//     bio: "Recherche un appartement moderne en centre-ville de LA. De préférence proche des transports en commun.",
// }

export default function PreferencesTab({ profileData }: { profileData: any }) {
    const [propertyType, setPropertyType] = useState(profileData.property_type || "")
    const [budget, setBudget] = useState(profileData.monthly_budget || "")
    const [bedrooms, setBedrooms] = useState(profileData.nb_pieces || "")
    const [moveInDate, setMoveInDate] = useState(profileData.move_in_date || "")
    const [notes, setNotes] = useState(profileData.note || "")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append("property_type", propertyType)
            formData.append("monthly_budget", budget)
            formData.append("nb_pieces", bedrooms)
            formData.append("move_in_date", moveInDate)
            formData.append("note", notes)

            const token = localStorage.getItem("token"); // ton JWT


            const res = await axiosInstance.put("/api/profile/preferences/update", formData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "multipart/form-data"
                }
            })

            if (res.status === 200) {
                toast.success("Préférences mises à jour avec succès")
                window.location.reload() // Rafraîchit la page pour afficher les nouvelles préférences
            }
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.error ||
                err.response?.data?.message ||
                "Erreur lors de la mise à jour"
            toast.error(errorMessage)
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Préférences de recherche</CardTitle>
                <CardDescription>Aidez-nous à trouver des biens correspondant à vos besoins.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="propertyType">Type de bien préféré</Label>
                            <Select value={propertyType} onValueChange={setPropertyType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key="appartement" value="appartement">Appartement</SelectItem>
                                    <SelectItem key="maison" value="maison">Maison</SelectItem>
                                    <SelectItem key="villa" value="villa">Villa</SelectItem>
                                    <SelectItem key="duplex" value="duplex">Duplex</SelectItem>
                                    <SelectItem key="maison_ville" value="maison_ville">Maison de ville</SelectItem>
                                    <SelectItem key="copropriete" value="copropriete">Copropriété</SelectItem>
                                    <SelectItem key="studio" value="studio">Studio</SelectItem>
                                    <SelectItem key="loft" value="loft">Loft</SelectItem>
                                    <SelectItem key="penthouse" value="penthouse">Penthouse</SelectItem>
                                    <SelectItem key="chalet" value="chalet">Chalet</SelectItem>
                                    <SelectItem key="manoir" value="manoir">Manoir</SelectItem>
                                    <SelectItem key="ferme" value="ferme">Ferme</SelectItem>
                                    <SelectItem key="terrain" value="terrain">Terrain</SelectItem>
                                    <SelectItem key="garage" value="garage">Garage</SelectItem>
                                    <SelectItem key="parking" value="parking">Parking</SelectItem>
                                    <SelectItem key="bureaux" value="bureaux">Bureaux</SelectItem>
                                    <SelectItem key="commerce" value="commerce">Commerce</SelectItem>
                                    <SelectItem key="entrepot" value="entrepot">Entrepôt</SelectItem>
                                    <SelectItem key="immeuble" value="immeuble">Immeuble</SelectItem>
                                    <SelectItem key="autre" value="autre">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="budget">Budget mensuel</Label>
                            <Select value={budget} onValueChange={setBudget}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un budget" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key="less_than_500k" value="500000.00">Moins de 500 000 CFA</SelectItem>
                                    <SelectItem key="500k_to_1m" value="1000000.00">500 000 CFA - 1 000 000 CFA</SelectItem>
                                    <SelectItem key="1m_to_2m" value="2000000.00">1 000 000 CFA - 2 000 000 CFA</SelectItem>
                                    <SelectItem key="2m_to_5m" value="5000000.00">2 000 000 CFA - 5 000 000 CFA</SelectItem>
                                    <SelectItem key="5m_to_15m" value="15000000.00">5 000 000 CFA - 15 000 000 CFA</SelectItem>
                                    <SelectItem key="more_than_15m" value="15000001.00">Plus de 15 000 000 CFA</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="bedrooms">Nombre de chambres</Label>
                            <Select value={bedrooms.toString()} onValueChange={(val) => setBedrooms(parseInt(val))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem key="studio" value="0">Studio</SelectItem>
                                    <SelectItem key="1" value="1">1 Chambre</SelectItem>
                                    <SelectItem key="2" value="2">2 Chambres</SelectItem>
                                    <SelectItem key="3" value="3">3 Chambres</SelectItem>
                                    <SelectItem key="4" value="4">4 Chambres</SelectItem>
                                    <SelectItem key="5" value="5">5 Chambres</SelectItem>
                                    <SelectItem key="6_plus" value="6+">6+ Chambres</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="moveInDate">Date d'emménagement souhaitée</Label>
                            <Input
                                id="moveInDate"
                                type="date"
                                value={moveInDate}
                                onChange={(e) => setMoveInDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes supplémentaires</Label>
                        <Textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Décrivez ce que vous recherchez..."
                            className="min-h-[100px]"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Enregistrement..." : "Enregistrer les préférences"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
