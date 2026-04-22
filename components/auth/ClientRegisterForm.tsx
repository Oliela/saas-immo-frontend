"use client"
import React, { useState } from "react"
import { ArrowLeft, User } from "lucide-react"
import Link from "next/link"
import axiosInstance from "@/lib/axios" 


import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

interface ClientRegisterFormProps {
    onBack?: () => void
}

export default function ClientRegisterForm({ onBack }: ClientRegisterFormProps): React.ReactElement {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        passwordConfirm: "",
        terms: false,
    })

    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { id, value, type, checked } = e.target as HTMLInputElement
        if (type === "checkbox") {
            setForm((p) => ({ ...p, [id]: checked }))
        } else {
            setForm((p) => ({ ...p, [id]: value }))
        }
    }


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Vérification des mots de passe
        if (form.password !== form.passwordConfirm) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        // Vérification des termes
        if (!form.terms) {
            setError("Vous devez accepter les conditions d'utilisation.");
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                nom: form.lastName,
                prenom: form.firstName,
                email: form.email,
                phone: form.phone,
                password: form.password,
                password_confirmation: form.passwordConfirm, // Laravel nécessite ce champ
            };

            // ⚡ Envoi de la requête via Axios
            const res = await axiosInstance.post('/api/register/client', payload);

            // Si tout va bien
            setSuccess(res.data.message || "Inscription réussie !");
            setSubmitting(false);

            // Redirection vers le login ou portal (selon ce que tu veux)
            window.location.href = res.data.redirect || '/login';
        } catch (err: any) {
            // Gestion des erreurs Laravel
            setError(err.response?.data?.message || "Impossible de contacter le serveur.");
            setSubmitting(false);
        }
    }



    return (
        <Card>
            <CardHeader>
                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit mb-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                </button>

                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                        <User className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Inscription Client</CardTitle>
                        <CardDescription>Créez votre compte personnel</CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input id="firstName" value={form.firstName} onChange={handleChange} placeholder="Jamil" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Nom</Label>
                            <Input id="lastName" value={form.lastName} onChange={handleChange} placeholder="Seye" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={form.email} onChange={handleChange} placeholder="nom@exemple.com" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Téléphone</Label>
                        <Input id="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+221 77 123 45 67" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input id="password" type="password" value={form.password} onChange={handleChange} placeholder="Créez un mot de passe sécurisé" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="passwordConfirm">Confirmer le mot de passe</Label>
                        <Input id="passwordConfirm" type="password" value={form.passwordConfirm} onChange={handleChange} placeholder="Répétez votre mot de passe" required />
                    </div>

                    <div className="flex items-start space-x-2">
                        <Checkbox id="terms" checked={form.terms} onCheckedChange={(checked) => setForm(p => ({ ...p, terms: !!checked }))} className="mt-1" />
                        <Label htmlFor="terms" className="text-sm leading-relaxed font-normal text-muted-foreground">
                            J'accepte les {" "}
                            <Link href="#" className="text-foreground hover:underline">Conditions d'utilisation</Link> et {" "}
                            <Link href="#" className="text-foreground hover:underline">la Politique de confidentialité</Link>
                        </Label>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}
                    {success && <p className="text-sm text-success">{success}</p>}

                    <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                        {submitting ? "Enregistrement..." : "Créer mon compte"}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                        Déjà un compte ? {" "}
                        <Link href="/login" className="font-medium text-foreground hover:underline">Se connecter</Link>
                    </p>
                </form>
            </CardContent>
        </Card>
    )
}
