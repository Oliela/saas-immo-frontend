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

// Formate un nombre avec séparateur de milliers
function formatNumber(value: string): string {
    const digits = value.replace(/\D/g, "")
    if (!digits) return ""
    return parseInt(digits, 10).toLocaleString("fr-FR")
}

// Supprime le formatage pour récupérer la valeur brute
function unformatNumber(value: string): string {
    return value.replace(/\s/g, "").replace(/\u00a0/g, "")
}

export default function PreferencesTab({ profileData }: { profileData: any }) {
    const [acquisitionType, setAcquisitionType] = useState(profileData.acquisition_type || "")
    const [propertyType, setPropertyType] = useState(profileData.property_type || "")

    // Budget : pour "rent" → select, pour "sale" → input texte libre
    const [budget, setBudget] = useState(profileData.monthly_budget || "")
    const [budgetInput, setBudgetInput] = useState(
        profileData.monthly_budget
            ? parseInt(profileData.monthly_budget).toLocaleString("fr-FR")
            : ""
    )

    const [bedrooms, setBedrooms] = useState(profileData.nb_pieces || "")
    const [surfaceArea, setSurfaceArea] = useState(
        profileData.surface_area
            ? parseInt(profileData.surface_area).toLocaleString("fr-FR")
            : ""
    )
    const [moveInDate, setMoveInDate] = useState(profileData.move_in_date || "")
    const [notes, setNotes] = useState(profileData.note || "")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleBudgetInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumber(e.target.value)
        setBudgetInput(formatted)
        setBudget(unformatNumber(formatted))
    }

    const handleSurfaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatNumber(e.target.value)
        setSurfaceArea(formatted)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append("acquisition_type", acquisitionType)
            formData.append("property_type", propertyType)
            formData.append("monthly_budget", unformatNumber(budget))
            formData.append("nb_pieces", bedrooms.toString())
            formData.append("surface_area", unformatNumber(surfaceArea))
            formData.append("move_in_date", moveInDate)
            formData.append("note", notes)

            const res = await axiosInstance.put("/api/profile/preferences/update", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })

            if (res.status === 200) {
                toast.success("Préférences mises à jour avec succès")
                window.location.reload()
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

                    {/* Type d'acquisition */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="acquisitionType">Type d'acquisition</Label>
                            <Select value={acquisitionType} onValueChange={setAcquisitionType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="rent">Location</SelectItem>
                                    <SelectItem value="sale">Vente</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="propertyType">Type de bien préféré</Label>
                            <Select value={propertyType} onValueChange={setPropertyType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="appartement">Appartement</SelectItem>
                                    <SelectItem value="villa">Villa</SelectItem>
                                    <SelectItem value="duplex">Duplex</SelectItem>
                                    <SelectItem value="studio">Studio</SelectItem>
                                    <SelectItem value="terrain">Terrain</SelectItem>
                                    <SelectItem value="bureaux">Bureaux</SelectItem>
                                    <SelectItem value="commerce">Commerce</SelectItem>
                                    <SelectItem value="entrepot">Entrepôt</SelectItem>
                                    <SelectItem value="immeuble">Immeuble</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Budget — conditionnel selon le type d'acquisition */}
                    <div className="space-y-2">
                        {acquisitionType === "sale" ? (
                            <>
                                <Label htmlFor="budgetInput">Budget d'achat (FCFA)</Label>
                                <Input
                                    id="budgetInput"
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="Ex : 25 000 000"
                                    value={budgetInput}
                                    onChange={handleBudgetInputChange}
                                />
                            </>
                        ) : (
                            <>
                                <Label htmlFor="budget">Budget mensuel (FCFA)</Label>
                                <Select value={budget} onValueChange={setBudget} disabled={!acquisitionType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={!acquisitionType ? "Choisir d'abord le type d'acquisition" : "Sélectionner un budget"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="500000.00">Moins de 500 000 FCFA</SelectItem>
                                        <SelectItem value="1000000.00">500 000 – 1 000 000 FCFA</SelectItem>
                                        <SelectItem value="2000000.00">1 000 000 – 2 000 000 FCFA</SelectItem>
                                        <SelectItem value="5000000.00">2 000 000 – 5 000 000 FCFA</SelectItem>
                                        <SelectItem value="15000000.00">5 000 000 – 15 000 000 FCFA</SelectItem>
                                        <SelectItem value="15000001.00">Plus de 15 000 000 FCFA</SelectItem>
                                    </SelectContent>
                                </Select>
                            </>
                        )}
                    </div>

                    {/* Pièces + Superficie */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="bedrooms">Nombre de pièces</Label>
                            <Select value={bedrooms.toString()} onValueChange={(val) => setBedrooms(val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Studio</SelectItem>
                                    <SelectItem value="1">1 Pièce</SelectItem>
                                    <SelectItem value="2">2 Pièces</SelectItem>
                                    <SelectItem value="3">3 Pièces</SelectItem>
                                    <SelectItem value="4">4 Pièces</SelectItem>
                                    <SelectItem value="5">5 Pièces</SelectItem>
                                    <SelectItem value="6+">6+ Pièces</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="surfaceArea">Superficie (m²)</Label>
                            <Input
                                id="surfaceArea"
                                type="text"
                                inputMode="numeric"
                                placeholder="Ex : 120"
                                value={surfaceArea}
                                onChange={handleSurfaceChange}
                            />
                        </div>
                    </div>

                    {/* Date d'emménagement */}
                    <div className="space-y-2">
                        <Label htmlFor="moveInDate">Date d'emménagement souhaitée</Label>
                        <Input
                            id="moveInDate"
                            type="date"
                            value={moveInDate}
                            onChange={(e) => setMoveInDate(e.target.value)}
                        />
                    </div>

                    {/* Notes */}
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