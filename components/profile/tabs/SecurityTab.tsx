"use client"

import { useState } from "react"
import { Lock, Eye, EyeOff, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SecurityTab() {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className="space-y-6">
            {/* Security */}
            <Card>
                <CardHeader>
                    <CardTitle>Changer le mot de passe</CardTitle>
                    <CardDescription>Mettez à jour votre mot de passe pour sécuriser votre compte.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="currentPassword"
                                type={showPassword ? "text" : "password"}
                                className="pl-9 pr-9"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="newPassword"
                                type="password"
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="confirmPassword"
                                type="password"
                                className="pl-9"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button>Mettre à jour le mot de passe</Button>
                    </div>
                </CardContent>
            </Card>

            {/* composant double facteur authentication */}
            <Card>
                <CardHeader>
                    <CardTitle>Authentification à deux facteurs</CardTitle>
                    <CardDescription>Ajoutez une couche de sécurité supplémentaire à votre compte.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                                <Shield className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">Authentification à deux facteurs</p>
                                <p className="text-xs text-muted-foreground">Non activée</p>
                            </div>
                        </div>
                        <Button variant="outline" className="bg-transparent">Activer</Button>
                    </div>
                </CardContent>
            </Card>

            {/* delete account */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
                    <CardDescription>Actions irréversibles pour votre compte.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-foreground">Supprimer le compte</p>
                            <p className="text-xs text-muted-foreground">Supprimez définitivement votre compte et toutes les données.</p>
                        </div>
                        <Button variant="destructive">Supprimer le compte</Button>
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
