// ============================================================
// CONFIG – Libellés et couleurs partagés
// ============================================================

import {
  User,
  Building2,
  FileText,
  Calendar,
} from "lucide-react"

// ── Priorités ────────────────────────────────────────────────
// Commentées – disponibles pour une prochaine version
/*
export const priorityConfig = {
  high: {
    label: "Élevée",
    color: "bg-destructive/10 text-destructive border-destructive/20",
  },
  medium: {
    label: "Moyenne",
    color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  low: {
    label: "Basse",
    color: "bg-muted text-muted-foreground border-border",
  },
} as const
*/

// ── Types de tâche ───────────────────────────────────────────
export const typeConfig: Record<
  string,
  { label: string; icon: React.ElementType }
> = {
  client:   { label: "Client",   icon: User },
  property: { label: "Propriété", icon: Building2 },
  contract: { label: "Contrat",  icon: FileText },
  invoice:  { label: "Facture",  icon: FileText },
  visit:    { label: "Visite",   icon: Calendar },
}

export const DEFAULT_TYPE_CONFIG = { label: "Tâche", icon: FileText }

export function getTypeConfig(type: string) {
  return typeConfig[type] ?? DEFAULT_TYPE_CONFIG
}
