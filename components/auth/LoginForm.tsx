"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import axiosInstance from "@/lib/axios"  // ton axios avec baseURL + withCredentials

interface LoginFormProps {
    onSuccess?: () => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            // Envoi des identifiants au backend
            const res = await axiosInstance.post("/api/login", {
                email,
                password,
            });

            // Vérifie que la requête a réussi
            if (res.status === 200) {
                const { token, redirect } = res.data;

                // Stockage du token dans localStorage pour les requêtes futures
                localStorage.setItem("token", token);

                // Callback pour actions après succès (optionnel)
                onSuccess?.();
                

                // Redirection dynamique selon le backend
                window.location.href = redirect || "/portal";
            }
        } catch (err: any) {
            // Gestion des erreurs
            setError(
                err.response?.data?.error || err.response?.data?.message ||
                "Impossible de se connecter."
            );
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="space-y-2">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="nom@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? "Connexion..." : "Se connecter"}
            </Button>
        </form>
    )
}
