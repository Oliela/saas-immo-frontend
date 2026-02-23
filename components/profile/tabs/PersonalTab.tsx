"use client"

import { useState } from "react"
import { Mail, Phone, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner";


// const profileData = {
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@example.com",
//     phone: "+1 (555) 123-4567",
//     dateOfBirth: "1990-05-15",
//     address: "456 Current St, Los Angeles, CA 90001",
// }

export default function PersonalTab({ profileData, userEmail }: { profileData: any, userEmail: string }) {
    const [isEditing, setIsEditing] = useState(false)
    const [firstName, setFirstName] = useState(profileData.prenom || "")
    const [lastName, setLastName] = useState(profileData.nom || "")
    const [email, setEmail] = useState(userEmail || "")
    const [phone, setPhone] = useState(profileData.phone || "")
    const [birthDate, setBirthDate] = useState(profileData.birth_date || "")
    const [address, setAddress] = useState(profileData.address || "")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    async function handleSave() {
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("prenom", firstName);
            formData.append("nom", lastName);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("birth_date", birthDate);
            formData.append("address", address);

            const token = localStorage.getItem("token"); // ton JWT

            const res = await axiosInstance.put("/api/profile", formData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "multipart/form-data",
                },
            });

            toast.success("Informations mises à jour avec succès 🎉");
            setIsEditing(false);

        } catch (err: any) {
            const message =
                err.response?.data?.message ||
                err.message ||
                "Erreur lors de la mise à jour";

            toast.error(message);
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Informations personnelles</CardTitle>
                        <CardDescription>Vos informations personnelles de base.</CardDescription>
                    </div>
                    <Button
                        variant={isEditing ? "default" : "outline"}
                        onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                        className={!isEditing ? "bg-transparent" : ""}
                        disabled={isLoading}
                    >
                        {isEditing ? (isLoading ? 'Enregistrement...' : 'Enregistrer') : 'Modifier'}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            disabled={!isEditing || isLoading}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            disabled={!isEditing || isLoading}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!isEditing || isLoading}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Téléphone</Label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={!isEditing || isLoading}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Date de naissance</Label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            disabled={!isEditing || isLoading}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Adresse actuelle</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            disabled={!isEditing || isLoading}
                            className="pl-9 min-h-[80px]" />
                    </div>
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
                {success && <p className="text-green-600 text-sm">{success}</p>}
            </CardContent>
        </Card>
    )
}
