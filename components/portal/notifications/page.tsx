"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { NotificationsList, type Notification } from "./NotificationsList"
import { NotificationsSettings } from "./NotificationsSettings"

const notifications: Notification[] = [
  // ... tes données
]

export default function ListingNotificationsPage({ notifications }: { notifications: Notification[] }) {
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
        <p className="text-muted-foreground">
          {unreadCount > 0
            ? `Vous avez ${unreadCount} notification(s) non lue(s).`
            : "Vous êtes à jour !"}
        </p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            Notifications
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-2">{unreadCount}</Badge>
            )}
          </TabsTrigger>
          {/* <TabsTrigger value="settings">Paramètres</TabsTrigger> */}
        </TabsList>

        <TabsContent value="all">
          <NotificationsList notifications={notifications} />
        </TabsContent>

        <TabsContent value="settings">
          <NotificationsSettings
            initialEmail={{ marketing: false, invoices: true }}
            initialPush={{ invoices: false, marketing: false }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}