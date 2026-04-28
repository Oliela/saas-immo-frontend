"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import PersonalTab from "./tabs/PersonalTab"
import EmploymentTab from "./tabs/EmploymentTab"
import PreferencesTab from "./tabs/PreferencesTab"
import SecurityTab from "./tabs/SecurityTab"

export default function ProfileTabs({
  user,
  userEmail,
  loading,
}: {
  user: any
  userEmail: string
  loading?: boolean
}) {
  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Tabs bar */}
        <div className="flex gap-2">
          <Skeleton className="h-9 w-44 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-28 rounded-md" />
          <Skeleton className="h-9 w-20 rounded-md" />
        </div>

        {/* Tab content — simule un formulaire */}
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            <Skeleton className="h-10 w-32 rounded-md" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList>
        <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
        <TabsTrigger value="employment">Emploi</TabsTrigger>
        <TabsTrigger value="preferences">Préférences</TabsTrigger>
        <TabsTrigger value="security">Sécurité</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-6">
        <PersonalTab profileData={user} userEmail={userEmail} />
      </TabsContent>
      <TabsContent value="employment" className="space-y-6">
        <EmploymentTab profileData={user} />
      </TabsContent>
      <TabsContent value="preferences" className="space-y-6">
        <PreferencesTab profileData={user} />
      </TabsContent>
      <TabsContent value="security" className="space-y-6">
        <SecurityTab />
      </TabsContent>
    </Tabs>
  )
}