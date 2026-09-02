"use client"

import { Calendar, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { ContractType, FormData, UsageCase } from "../../../../types/contractNew"
import { useGetAgent } from "@/hooks/agence/useGetAgent"

const USAGE_CASES: Record<ContractType, { value: UsageCase; label: string }[]> = {
  rental: [
    { value: "habitation", label: "Bail d’habitation" },
    { value: "professionnel", label: "Bail professionnel" },
    { value: "commercial", label: "Bail commercial" },
  ],
  sale: [
    { value: "compromis", label: "Compromis de vente" },
    { value: "vente", label: "Contrat de vente" },
  ],
}

interface Props {
  contractType: ContractType
  formData: FormData
  onContractTypeChange: (type: ContractType) => void
  onFormDataChange: (data: FormData) => void
  lockContractNature?: boolean
  agencyId: number
}

export function ContractInfoTab({
  contractType,
  formData,
  onContractTypeChange,
  onFormDataChange,
  lockContractNature = false,
  agencyId,
}: Props) {
  const { agent: agents, loading: agentsLoading } = useGetAgent({ agencyId })
  const set = (key: keyof FormData, value: string) =>
    onFormDataChange({ ...formData, [key]: value })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations du Contrat</CardTitle>
        <CardDescription>Détails de base et type de contrat</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Type de contrat */}
        <div className="space-y-2">
          <Label>Type de Contrat</Label>
          <div className="grid grid-cols-2 gap-4">
            {(["rental", "sale"] as ContractType[]).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  if (!lockContractNature) onContractTypeChange(type)
                }}
                disabled={lockContractNature}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 p-6 rounded-lg border-2 transition-all disabled:cursor-not-allowed disabled:opacity-70 ",
                  contractType === type
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className={cn("p-3 rounded-full", contractType === type ? "bg-primary/10" : "bg-muted")}>
                  {type === "rental" ? (
                    <Calendar
                      className={cn(
                        "h-6 w-6",
                        contractType === type ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  ) : (
                    <Building2
                      className={cn(
                        "h-6 w-6",
                        contractType === type ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  )}
                </div>
                <div className="text-center">
                  <p className={cn("font-semibold", contractType === type ? "text-primary" : "text-foreground")}>
                    {type === "rental" ? "Contrat de location" : "Contrat de vente"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {type === "rental"
                      ? "Pour les locations de propriétés"
                      : "Pour les ventes de propriétés"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="usageCase">Cas d’usage</Label>
            <Select
              value={formData.usageCase}
              onValueChange={(value) => set("usageCase", value)}
              disabled={lockContractNature}
            >
              <SelectTrigger id="usageCase">
                <SelectValue placeholder="Choisir un cas d’usage" />
              </SelectTrigger>
              <SelectContent>
                {USAGE_CASES[contractType].map((usageCase) => (
                  <SelectItem key={usageCase.value} value={usageCase.value}>
                    {usageCase.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Titre du contrat</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(event) => set("title", event.target.value)}
              placeholder="Ex. Contrat de vente"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agentId">Agent responsable</Label>
            <Select
              value={formData.agentId || "unassigned"}
              onValueChange={(value) =>
                set("agentId", value === "unassigned" ? "" : value)
              }
              disabled={agentsLoading}
            >
              <SelectTrigger id="agentId">
                <SelectValue placeholder="Choisir un agent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Non assigné</SelectItem>

                {agents.map((agent: any) => {
                  const fullName = `${agent.profile?.first_name ?? agent.nom ?? ""} ${agent.profile?.last_name ?? agent.prenom ?? ""
                    }`.trim()

                  return (
                    <SelectItem key={agent.id} value={String(agent.id)}>
                      {fullName || agent.email}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Ville + Date */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Ville</Label>
            {/* <Select value={formData.city} onValueChange={(v) => set("city", v)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner la ville" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="paris">Paris</SelectItem>
                <SelectItem value="lyon">Lyon</SelectItem>
                <SelectItem value="marseille">Marseille</SelectItem>
                <SelectItem value="toulouse">Toulouse</SelectItem>
                <SelectItem value="dakar">Dakar</SelectItem>
              </SelectContent>
            </Select> */}
            <Input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => set("city", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Date de Début</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => set("startDate", e.target.value)}
            />
          </div>
        </div>

        {/* Durée (location seulement) */}
        {contractType !== "sale" && (
          <div className="space-y-2">
            <Label>Durée (mois)</Label>
            <Select value={formData.duration} onValueChange={(v) => set("duration", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {["1", "3", "6", "12", "24", "36"].map((m) => (
                  <SelectItem key={m} value={m}>{m} mois</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
