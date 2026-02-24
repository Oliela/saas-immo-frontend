"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TeamSettings() {
  const members = [
    { name: "John Anderson", email: "john@premierproperties.com", role: "Admin" },
    { name: "Sarah Miller", email: "sarah@premierproperties.com", role: "Agent" },
    { name: "Mike Thompson", email: "mike@premierproperties.com", role: "Agent" },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Membres de l'équipe</CardTitle>
          <CardDescription>
            Gérez les membres de l'équipe de votre agence et leurs rôles
          </CardDescription>
        </div>

        <Button>Ajouter un membre</Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.email}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {member.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium text-foreground">
                    {member.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Select defaultValue={member.role.toLowerCase()}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="viewer">Lecteur</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}