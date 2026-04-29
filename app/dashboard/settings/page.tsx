"use client"


import { Bell, Lock, Building2, CreditCard, Users } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import AgencyProfileForm from "@/components/settings/AgencyProfileForm"
import NotificationsForm from "@/components/settings/NotificationsForm"
import SecurityForm from "@/components/settings/SecurityForm"
import TeamSettings from "@/components/settings/TeamSettings"
import BillingSettings from "@/components/settings/BillingSettings"
import { useAgency } from "@/hooks/agence/useAgency"
import { useState } from "react"

export default function SettingsPage() {
    const { data, loading } = useAgency()
    
    const [isEditing, setIsEditing] = useState(false)

    if (loading) return <p>Chargement...</p>
    // if (error) return <p>{error}</p>

    const user = data
    const profile = data.agency
    const agent = data?.agency.users

    console.log("Agency data:", data)
    // console.log("agent data:", agent)
    // console.log("profile data:", profile)
    // console.log("user data:", user)

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
                <p className="text-muted-foreground">Gérez votre compte et les paramètres de l'agence</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="flex flex-wrap h-auto gap-2">
                    <TabsTrigger value="profile" className="gap-2">
                        <Building2 className="h-4 w-4" />
                        <span className="hidden sm:inline">Profil de l'agence</span>
                        <span className="sm:hidden">Profil</span>
                    </TabsTrigger>
                    {/* <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="h-4 w-4" />
                        <span className="hidden sm:inline">Notifications</span>
                        <span className="sm:hidden">Notif</span>
                    </TabsTrigger> */}
                    <TabsTrigger value="security" className="gap-2">
                        <Lock className="h-4 w-4" />
                        <span className="hidden sm:inline">Sécurité</span>
                        <span className="sm:hidden">Sécurité</span>
                    </TabsTrigger>
                    <TabsTrigger value="team" className="gap-2">
                        <Users className="h-4 w-4" />
                        <span className="hidden sm:inline">Équipe</span>
                        <span className="sm:hidden">Équipe</span>
                    </TabsTrigger>
                    {/* <TabsTrigger value="billing" className="gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="hidden sm:inline">Facturation</span>
                        <span className="sm:hidden">Facturation</span>
                    </TabsTrigger> */}
                </TabsList>

                {/* Agency Profile */}
                <TabsContent value="profile" className="space-y-6">
                    <AgencyProfileForm agency={profile}/>
                </TabsContent>

                {/* Notifications */}
                {/* <TabsContent value="notifications" className="space-y-6">
                    <NotificationsForm />
                </TabsContent> */}

                {/* Security */}
                <TabsContent value="security" className="space-y-6">
                    <SecurityForm />
                </TabsContent>

                {/* Team */}
                <TabsContent value="team" className="space-y-6">
                    <TeamSettings agent={agent} />
                </TabsContent>

                {/* Billing */}
                {/* <TabsContent value="billing" className="space-y-6">
                    <BillingSettings />
                </TabsContent> */}
            </Tabs>
        </div>
    )
}
