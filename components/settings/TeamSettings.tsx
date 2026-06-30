"use client"

import Link from "next/link"
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

interface Role {
  id: number
  name: string
}

interface User {
  id: number
  nom: string
  prenom: string
  email: string
  account_type: string
  is_active: number
  roles: Role[] // 🔥 AJOUT
  profile?: any
  pivot: {
    agency_id: number
    user_id: number
    created_at: string
    updated_at: string
  }
}

interface Props {
  agent: {
    users: User[]
  }
}

export default function TeamSettings({ agent }: Props) {
  const members = agent || []
  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "admin_agence":
        return "Admin"
      case "agent":
        return "Agent"
      default:
        return "Agent"
    }
  }
 
  // console.log("Team members:", agent)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Membres de l'équipe</CardTitle>
          <CardDescription>
            Gérez les membres de l'équipe de votre agence et leurs rôles
          </CardDescription>
        </div>

        <Button asChild>
          <Link href="/dashboard/agents">Ajouter un membre</Link>
        </Button>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 border border-border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>
                    {member.prenom?.charAt(0) || member.nom?.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <p className="font-medium text-foreground">
                    {member.prenom} {member.nom}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* <Select defaultValue={
                  member?.roles?.[0]?.name === "admin_agence"
                    ? "admin_agence"
                    : member?.roles?.[0]?.name || "agent"
                }>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agent_admin">Admin</SelectItem>
                    <SelectItem value="agent">Agent</SelectItem>
                    <SelectItem value="viewer">Lecteur</SelectItem>
                  </SelectContent>
                </Select> */}
                <input
                  type="text"
                  disabled
                  value={getRoleLabel(member?.roles?.[0]?.name)}
                  className="w-[140px] px-3 py-2 text-sm border border-border rounded-md bg-muted text-muted-foreground"
                />

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