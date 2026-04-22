import { Card, CardContent } from "@/components/ui/card"

interface Props {
  stats: {
    label: string
    value: string
  }[]
}

export default function OwnersStats({ stats }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}