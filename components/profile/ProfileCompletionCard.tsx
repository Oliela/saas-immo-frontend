"use client"

import { Camera, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useProfileCompletion } from "@/hooks/clients/useProfileCompletion"

export default function ProfileCompletionCard({ profil }: { profil: any }) {
    if (!profil) return null // sécurité si user n'existe pas

    const  profile  = profil
    const { percentage, completed, incomplete } = useProfileCompletion(profile)


    // console.log("Profile Completion:", { percentage, completed, incomplete })
    console.log("User in ProfileCompletionCard:", profile)
    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Avatar */}
                    <div className="relative">
                        {/* <Avatar className="h-24 w-24">
                            {profile?.avatar ? (
                                <AvatarImage src={profile.avatar} />
                            ) : (
                                <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">
                                    {user.nom?.[0]}{user.prenom?.[0]}
                                </AvatarFallback>
                            )}
                        </Avatar> */}
                        <Avatar className="h-24 w-24">

                            {/* <AvatarImage src={profile.avatar} /> */}

                            <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">
                                {profile.nom?.[0]}{profile.prenom?.[0]}
                            </AvatarFallback>

                        </Avatar>

                        <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                            <Camera className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Infos profil */}
                    <div className="flex-1">
                        <div className="flex justify-between mb-4">
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {profile.nom} {profile.prenom}
                                </h2>
                                <p className="text-sm text-muted-foreground">{profile.email}</p>
                            </div>
                            <Badge variant="secondary">
                                {percentage}% complété
                            </Badge>
                        </div>

                        {/* Progress bar */}
                        <Progress value={percentage} className="h-2 mb-3" />

                        {/* Badges sections complétées / incomplètes */}
                        <div className="flex flex-wrap gap-2">
                            {completed.map((item) => (
                                <Badge
                                    key={item.name}
                                    variant="outline"
                                    className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                                >
                                    <CheckCircle className="h-3 w-3" />
                                    {item.name}
                                </Badge>
                            ))}

                            {incomplete.map((item) => (
                                <Badge
                                    key={item.name}
                                    variant="outline"
                                    className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"
                                >
                                    <AlertCircle className="h-3 w-3" />
                                    {item.name}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
