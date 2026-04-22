import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import type { ServerNotification, Notification } from "@/types/notification"

export function adaptNotification(n: ServerNotification): Notification {
  return {
    id:         n.id,
    type:       n.data.type ?? "system",
    title:      n.data.title,
    message:    n.data.message,
    time:       formatDistanceToNow(new Date(n.created_at), {
                  addSuffix: true,
                  locale: fr,
                }),
    read:       n.read_at !== null,
    actionUrl:  n.data.action_url,
    actionLabel: getActionLabel(n.data.type),
  }
}

function getActionLabel(type: string): string {
  switch (type) {
    case "visit":    return "Voir la visite"
    case "document": return "Voir le document"
    case "contract": return "Voir le contrat"
    case "message":  return "Voir le message"
    case "invoice":  return "Voir la facture"
    default:         return "Voir"
  }
}