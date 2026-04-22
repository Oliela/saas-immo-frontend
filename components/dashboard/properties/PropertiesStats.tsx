import { Card, CardContent } from "@/components/ui/card"

interface Props {
  stats: {
    total: number
    sale: number
    rent: number
  }
}

export default function statsStats({ stats }: Props) {
  const total = stats?.total
  const buy = stats?.sale || 0
  const rent = stats?.rent || 0

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="p-4 flex justify-between">
          <p className="text-sm text-muted-foreground">Annonces totales</p>
          <p className="text-2xl font-bold">{total}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex justify-between">
          <p className="text-sm text-muted-foreground">À vendre</p>
          <p className="text-2xl font-bold">{buy}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 flex justify-between">
          <p className="text-sm text-muted-foreground">À louer</p>
          <p className="text-2xl font-bold">{rent}</p>
        </CardContent>
      </Card>
    </div>
  )
}