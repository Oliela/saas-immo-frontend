"use client"

import { Camera, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { useProfileCompletion } from "@/hooks/clients/useProfileCompletion"

export default function ProfileCompletionCard({
  profil,
  loading,
}: {
  profil: any
  loading?: boolean
}) {
  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <Skeleton className="h-24 w-24 rounded-full shrink-0" />

            {/* Infos */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-52" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-28 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profil) return null

  const profile = profil
  const { percentage, completed, incomplete } = useProfileCompletion(profile)

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">
                {profile.nom?.[0]}{profile.prenom?.[0]}
              </AvatarFallback>
            </Avatar>
            <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{profile.nom} {profile.prenom}</h2>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
              <Badge variant="secondary">{percentage}% complété</Badge>
            </div>

            <Progress value={percentage} className="h-2 mb-3" />

            <div className="flex flex-wrap gap-2">
              {completed.map((item) => (
                <Badge key={item.name} variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />{item.name}
                </Badge>
              ))}
              {incomplete.map((item) => (
                <Badge key={item.name} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />{item.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}