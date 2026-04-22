"use client"

import { useState } from "react"
import { Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import axiosInstance from "@/lib/axios"

// const profileData = {
//     occupation: "Software Engineer",
//     employer: "Tech Corp",
//     monthlyIncome: "8000",
//     employmentType: "full-time",
// }

export default function EmploymentTab({ profileData }: { profileData: any }) {
    const [occupation, setOccupation] = useState(profileData.occupation || "")
    const [employer, setEmployer] = useState(profileData.employer || "")
    const [monthlyIncome, setMonthlyIncome] = useState(profileData.monthly_income || "")
    const [employmentType, setEmploymentType] = useState(profileData.type_employment || "")
    const [professionalSituation, setProfessionalSituation] = useState(profileData.professional_situation || "")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const formData = new FormData()
            formData.append("occupation", occupation)
            formData.append("employer", employer)
            formData.append("monthlyIncome", monthlyIncome)
            formData.append("employmentType", employmentType)
            formData.append("professionalSituation", professionalSituation)

            const token = localStorage.getItem("token"); // ton JWT

            const res = await axiosInstance.put("/api/profile/employment/update", formData)

            if (res.status === 200) {
                toast.success("Informations professionnelles mises à jour avec succès")
                window.location.reload() // Recharge la page pour afficher les nouvelles données
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
                <CardTitle>Informations professionnelles</CardTitle>
                <CardDescription>Vos informations d'emploi actuelles.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label>Situation professionnelle</Label>
                        <Select value={professionalSituation} onValueChange={setProfessionalSituation}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez votre situation" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Sans emploi">Sans emploi</SelectItem>
                                <SelectItem value="Salarié">Salarié</SelectItem>
                                <SelectItem value="Entrepreneur/Chef d'entreprise">Entrepreneur/Chef d'entreprise</SelectItem>
                                <SelectItem value="Profession Libérale">Profession libérale</SelectItem>
                                <SelectItem value="Consultant">Consultant</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Profession</Label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    value={occupation}
                                    onChange={(e) => setOccupation(e.target.value)}
                                    className="pl-9"
                                    required
                                />
                            </div>
                        </div>

                        {professionalSituation === "Salarié" && (
                            <div className="space-y-2">
                                <Label>Employeur</Label>
                                <Input
                                    value={employer}
                                    onChange={(e) => setEmployer(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                    </div>

                    {professionalSituation === "Salarié" && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Type d'emploi</Label>
                                <Select value={employmentType} onValueChange={setEmploymentType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Temps plein">Temps plein</SelectItem>
                                        <SelectItem value="Temps partiel">Temps partiel</SelectItem>
                                        <SelectItem value="Contrat">Contrat</SelectItem>
                                        <SelectItem value="Travailleur indépendant">Travailleur indépendant</SelectItem>
                                        <SelectItem value="Retraité">Retraité</SelectItem>
                                        <SelectItem value="Étudiant">Étudiant</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="monthlyIncome">Revenu mensuel (XOF)</Label>
                            <Input
                                id="monthlyIncome"
                                type="number"
                                value={monthlyIncome}
                                onChange={(e) => setMonthlyIncome(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Enregistrement..." : "Enregistrer l'emploi"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
