import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

type StatusType = 
  | "active" | "inactive" | "pending" | "suspended"
  | "paid" | "unpaid" | "partially_paid" | "overdue"
  | "signed" | "draft" | "cancelled" | "expired"
  | "completed" | "failed" | "refunded"
  | "certified"

interface StatusBadgeProps {
  status: StatusType | string
  className?: string
}

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
  // Statuts généraux
  active: { label: "Actif", variant: "default", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  inactive: { label: "Inactif", variant: "secondary" },
  pending: { label: "En attente", variant: "outline", className: "border-yellow-500 text-yellow-600" },
  suspended: { label: "Suspendu", variant: "destructive" },

  // Statuts factures
  paid: { label: "Payée", variant: "default", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  unpaid: { label: "Non payée", variant: "outline", className: "border-gray-400 text-gray-600" },
  partially_paid: { label: "Partiel", variant: "outline", className: "border-yellow-500 text-yellow-600" },
  overdue: { label: "En retard", variant: "destructive" },

  // Statuts contrats
  signed: { label: "Signé", variant: "default", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  draft: { label: "Brouillon", variant: "secondary" },
  cancelled: { label: "Annulé", variant: "destructive" },
  expired: { label: "Expiré", variant: "outline", className: "border-gray-400 text-gray-600" },

  // Statuts règlements
  completed: { label: "Encaissé", variant: "default", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  failed: { label: "Échoué", variant: "destructive" },
  refunded: { label: "Remboursé", variant: "outline", className: "border-blue-500 text-blue-600" },

  // Statuts spéciaux
  certified: { label: "Certifiée", variant: "default", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  not_certified: { label: "Non certifiée", variant: "secondary" },

  // Statuts clients (AgencyClient)
  lead: { label: "Lead", variant: "outline", className: "border-blue-400 text-blue-600" },
  prospect: { label: "Prospect", variant: "secondary" },
  "qualifié": { label: "Qualifié", variant: "outline", className: "border-yellow-500 text-yellow-600" },
  en_negociation: { label: "En négociation", variant: "outline", className: "border-orange-500 text-orange-600" },
  converti: { label: "Converti", variant: "default", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  perdu: { label: "Perdu", variant: "destructive" },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: "secondary" as const }
  
  return (
    <Badge
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
