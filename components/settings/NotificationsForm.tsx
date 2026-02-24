"use client"

import { useState } from "react"
import { Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function NotificationsForm() {
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false,
        newLeads: true,
        messages: true,
        appointments: true,
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Préférences de notification</CardTitle>
                <CardDescription>Choisissez comment vous souhaitez recevoir les notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-foreground">Notifications par email</p>
                            <p className="text-sm text-muted-foreground">Recevoir des notifications par email</p>
                        </div>
                        <Switch
                            checked={notifications.email}
                            onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, email: checked })
                            }
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-foreground">Notifications push</p>
                            <p className="text-sm text-muted-foreground">Recevoir des notifications push dans le navigateur</p>
                        </div>
                        <Switch
                            checked={notifications.push}
                            onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, push: checked })
                            }
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-foreground">Nouveaux leads</p>
                            <p className="text-sm text-muted-foreground">Être notifié des nouveaux leads</p>
                        </div>
                        <Switch
                            checked={notifications.newLeads}
                            onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, newLeads: checked })
                            }
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-foreground">Messages</p>
                            <p className="text-sm text-muted-foreground">Être notifié des nouveaux messages</p>
                        </div>
                        <Switch
                            checked={notifications.messages}
                            onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, messages: checked })
                            }
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-foreground">Rendez-vous</p>
                            <p className="text-sm text-muted-foreground">Être rappelé des prochains rendez-vous</p>
                        </div>
                        <Switch
                            checked={notifications.appointments}
                            onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, appointments: checked })
                            }
                        />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-foreground">Emails marketing</p>
                            <p className="text-sm text-muted-foreground">Recevoir des conseils et des mises à jour produits</p>
                        </div>
                        <Switch
                            checked={notifications.marketing}
                            onCheckedChange={(checked) =>
                                setNotifications({ ...notifications, marketing: checked })
                            }
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Enregistrer les préférences
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}