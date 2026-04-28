"use client"

import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileCompletionCard from "@/components/profile/ProfileCompletionCard"
import ProfileTabs from "@/components/profile/ProfilTabs"
import { useProfile } from "@/hooks/clients/useProfile"
import { useState } from "react"

export default function ProfilePage() {
  const { data, loading, error } = useProfile()
  const [isEditing, setIsEditing] = useState(false)

  if (error) return <p>{error}</p>

  return (
    <div className="space-y-6">
      {/* Pas de données → pas de loading */}
      <ProfileHeader />

      {/* Chacun gère son propre skeleton */}
      <ProfileCompletionCard profil={data?.profile} loading={loading} />
      <ProfileTabs user={data?.profile} userEmail={data?.user?.email} loading={loading} />
    </div>
  )
}