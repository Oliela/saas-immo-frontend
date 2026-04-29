"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function SecurityForm() {
    return (
        <div className="space-y-6">
            {/* Password */}
            <Card>
                <CardHeader>
                    <CardTitle>Mot de passe</CardTitle>
                    <CardDescription>Changez votre mot de passe pour sécuriser votre compte</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                        <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                        <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmez le nouveau mot de passe</Label>
                        <Input id="confirmPassword" type="password" />
                    </div>
                    <div className="flex justify-end">
                        <Button>Mettre à jour le mot de passe</Button>
                    </div>
                </CardContent>
            </Card>

            {/* 2FA */}
            {/* <Card>
                <CardHeader>
                    <CardTitle>Authentification à deux facteurs</CardTitle>
                    <CardDescription>Ajoutez une couche de sécurité supplémentaire à votre compte</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-foreground">Activer la 2FA</p>
                            <p className="text-sm text-muted-foreground">Utilisez une application d'authentification pour générer des codes à usage unique</p>
                        </div>
                        <Button variant="outline" className="bg-transparent">Configurer 2FA</Button>
                    </div>
                </CardContent>
            </Card> */}
        </div>
    )
}