import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"
import {
  FileText,
  CreditCard,
  Shield,
  UserPlus,
  Crown,
  Receipt,
} from "lucide-react"

interface ActivityItem {
  id: string
  type: string
  title: string
  description: string
  agencyName?: string | null
  amount?: number | null
  createdAt: string
}

interface ActivityTimelineProps {
  activities: ActivityItem[]
  className?: string
}

const activityIcons: Record<string, React.ReactNode> = {
  contract_signed: <FileText className="h-4 w-4" />,
  new_contract: <FileText className="h-4 w-4" />,
  payment_received: <CreditCard className="h-4 w-4" />,
  payment: <CreditCard className="h-4 w-4" />,
  agency_certified: <Shield className="h-4 w-4" />,
  new_agency: <Shield className="h-4 w-4" />,
  client_registered: <UserPlus className="h-4 w-4" />,
  subscription_renewed: <Crown className="h-4 w-4" />,
  invoice_paid: <Receipt className="h-4 w-4" />,
}

const activityColors: Record<string, string> = {
  contract_signed: "bg-blue-100 text-blue-600",
  new_contract: "bg-blue-100 text-blue-600",
  payment_received: "bg-green-100 text-green-600",
  payment: "bg-green-100 text-green-600",
  agency_certified: "bg-purple-100 text-purple-600",
  new_agency: "bg-purple-100 text-purple-600",
  client_registered: "bg-orange-100 text-orange-600",
  subscription_renewed: "bg-yellow-100 text-yellow-600",
  invoice_paid: "bg-teal-100 text-teal-600",
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {activities.map((activity, index) => (
        <div key={activity.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              activityColors[activity.type] || "bg-muted text-muted-foreground"
            )}>
              {activityIcons[activity.type] || <FileText className="h-4 w-4" />}
            </div>
            {index < activities.length - 1 && (
              <div className="flex-1 w-px bg-border my-1" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
                {activity.agencyName && (
                  <p className="text-xs text-muted-foreground mt-1">
                    via {activity.agencyName}
                  </p>
                )}
              </div>
              <div className="text-right">
                {activity.amount && (
                  <p className="text-sm font-medium text-foreground">
                    {formatCurrency(activity.amount)}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
