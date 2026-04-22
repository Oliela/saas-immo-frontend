"use client"

import { Eye, Send, Save, Check, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button }    from "@/components/ui/button"
import { Badge }     from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn }        from "@/lib/utils"
import type { Client, Property, ContractType } from "../../../../types/contractNew"

interface ProgressStep {
  label: string
  done:  boolean
  step:  number
}

interface Props {
  contractType:     ContractType
  selectedClient:   Client | null
  selectedProperty: Property | null
  clauseCount:      number
  progress:         ProgressStep[]
  isReadyToSubmit:  boolean
  onPreview:        () => void
  onSubmit:         () => void
  onSaveDraft:      () => void
}

export function ContractSidebar({
  contractType,
  selectedClient,
  selectedProperty,
  clauseCount,
  progress,
  isReadyToSubmit,
  onPreview,
  onSubmit,
  onSaveDraft,
}: Props) {
  return (
    <div className="space-y-6">
      {/* ── Résumé ─────────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Résumé du Contrat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Type</span>
              <Badge variant="outline">
                {contractType === "rental" ? "Location" : "Vente"}
              </Badge>
            </div>

            <Separator />

            <div>
              <span className="text-sm text-muted-foreground">Client</span>
              {selectedClient ? (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedClient.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedClient.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">Non sélectionné</p>
              )}
            </div>

            <Separator />

            <div>
              <span className="text-sm text-muted-foreground">Propriété</span>
              {selectedProperty ? (
                <div className="mt-2">
                  <p className="text-sm font-medium text-foreground">{selectedProperty.title}</p>
                  <p className="text-xs text-muted-foreground">{selectedProperty.address}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground mt-1">Non sélectionnée</p>
              )}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Clauses</span>
              <span className="text-sm font-medium text-foreground">{clauseCount}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── État d'avancement ──────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">État d'Avancement</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {progress.map(({ label, done, step }) => (
            <div key={step} className="flex items-center gap-3">
              <div
                className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center",
                  done ? "bg-primary" : "bg-muted"
                )}
              >
                {done ? (
                  <Check className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <span className="text-xs text-muted-foreground">{step}</span>
                )}
              </div>
              <span className={cn("text-sm", done ? "text-foreground" : "text-muted-foreground")}>
                {label}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Actions ────────────────────────────────────────────────────────── */}
      <div className="space-y-3">
        <Button variant="outline" className="w-full" onClick={onPreview}>
          <Eye className="mr-2 h-4 w-4" />
          Aperçu du Contrat
        </Button>
        <Button
          className="w-full"
          onClick={onSubmit}
          disabled={!isReadyToSubmit}
        >
          {/* <Send className="mr-2 h-4 w-4" /> */}
          <Save className="mr-2 h-4 w-4" />

          Générer le Contrat
        </Button>
        {/* <Button variant="outline" className="w-full bg-transparent" onClick={onSaveDraft}>
          <Save className="mr-2 h-4 w-4" />
          Enregistrer en Brouillon
        </Button> */}
      </div>
    </div>
  )
}
