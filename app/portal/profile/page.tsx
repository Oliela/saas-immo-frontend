"use client"
import ProfileCompletionCard from "@/components/profile/ProfileCompletionCard"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileTabs from "@/components/profile/ProfilTabs"
import { PageLoader } from "@/components/ui/PageLoader"
import { ProfileSkeleton } from "@/components/ui/skeletons/ProfileSkeleton"
import { useProfile } from "@/hooks/clients/useProfile"
import { useState } from "react"

export default function ProfilePage() {
  const { data, loading, error } = useProfile()
  const [isEditing, setIsEditing] = useState(false)

  return (
    <PageLoader loading={loading} error={error} skeleton={<ProfileSkeleton />}>
      <div className="space-y-6">
        <ProfileHeader />
        <ProfileCompletionCard profil={data?.profile} />
        <ProfileTabs user={data?.profile} userEmail={data?.user.email} />
      </div>
    </PageLoader>
  )
}