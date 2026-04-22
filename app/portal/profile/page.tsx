"use client"

import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileCompletionCard from "@/components/profile/ProfileCompletionCard"
import ProfileTabs from "@/components/profile/ProfilTabs"
import { useProfile } from "@/hooks/clients/useProfile"
import { useState } from "react"


export default function ProfilePage() {

  const { data, loading, error } = useProfile()
  const [isEditing, setIsEditing] = useState(false)

  if (loading) return <p>Chargement...</p>
  if (error) return <p>{error}</p>

  const user = data.user
  const profile = data.profile

  console.log("User:", user)
  // console.log("Profile:", profile)

  return (
    <div className="space-y-6">
      {/* Header */}

      <ProfileHeader />

      {/* Profile Completion Card */}
      <ProfileCompletionCard profil={profile}  />

      {/* composant qui doit etre modifiable  */}
      <ProfileTabs user={profile} userEmail={user.email} />
    </div>
  )
}
