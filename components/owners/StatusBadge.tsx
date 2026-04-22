import { Badge } from "@/components/ui/badge"

export default function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    { variant: "default" | "secondary" | "outline"; label: string }
  > = {
    active: { variant: "default", label: "Actif" },
    inactive: { variant: "secondary", label: "Inactif" },
    pending: { variant: "outline", label: "En attente" },
  }

  const { variant, label } =
    config[status] || { variant: "outline", label: status }

  return <Badge variant={variant}>{label}</Badge>
}