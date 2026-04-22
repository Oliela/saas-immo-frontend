"use client"

import ListingNotificationsPage from "@/components/portal/notifications/page"
import { useGetNotifications } from "@/hooks/clients/useGetNotifications"
import { adaptNotification } from "@/utils/notifications"
import type { ServerNotification } from "@/types/notification"
import ProtectedRoute from "@/components/guard/ProtectedRoute"

export default function NotificationsPage() {
  const { data, loading, error } = useGetNotifications()

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">Chargement...</p>
    </div>
  )

  if (error) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-destructive">{error}</p>
    </div>
  )

  const notifications = (data ?? []).map((n: ServerNotification) => adaptNotification(n))

  return(
    <ProtectedRoute>
      <ListingNotificationsPage notifications={notifications} />
    </ProtectedRoute>
  )
}