// Type brut venant du serveur
export interface ServerNotification {
  id: string
  type: string
  read_at: string | null
  created_at: string
  updated_at: string
  notifiable_id: number
  notifiable_type: string
  data: {
    type: string
    title: string
    message: string
    action_url?: string
    reservation_id?: number
  }
}

// Type interne utilisé par les composants
export interface Notification {
  id: string
  type: string
  title: string
  message: string
  time: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
  priority?: string
}