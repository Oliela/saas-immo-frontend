"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PersonalTab from "./tabs/PersonalTab"
import EmploymentTab from "./tabs/EmploymentTab"
import PreferencesTab from "./tabs/PreferencesTab"
import SecurityTab from "./tabs/SecurityTab"

export default function ProfileTabs({ user, userEmail }: { user: any, userEmail: string }) {
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
