"use client"

import { User, Building2, Check, Loader2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useClients }    from "@/hooks/contracts/useClients"
import { useProperties } from "@/hooks/contracts/useProperties"
import type { Client, Property, ContractType } from "@/types/contractNew"

interface Props {
  contractType:     ContractType
  agencyId:         number
  selectedClient:   Client | null
  selectedProperty: Property | null
  onSelectClient:   (client: Client) => void
  onSelectProperty: (property: Property) => void
}

export function ContractPartiesTab({
  contractType, agencyId,
  selectedClient, selectedProperty,
  onSelectClient, onSelectProperty,
}: Props) {
  const { clients,    isLoading: clientsLoading,    error: clientsError    } = useClients(agencyId)
  const { properties, isLoading: propertiesLoading, error: propertiesError } = useProperties(agencyId, contractType)

  return (
    <div className="space-y-6">

      {/* ── Clients ───────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Informations du Client</CardTitle>
          <CardDescription>Sélectionnez le client pour ce contrat</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">

          {clientsLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement des clients…
            </div>
          )}

          {clientsError && !clientsLoading && (
            <div className="flex items-center gap-2 text-sm text-destructive py-2">
              <AlertCircle className="h-4 w-4" />
              Impossible de charger les clients — {clientsError}
            </div>
          )}

          {!clientsLoading && !clientsError && clients.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Aucun client avec un intérêt confirmé
            </p>
          )}

          {clients.map((client) => (
            <button
              key={client.id}
              type="button"
              onClick={() => onSelectClient(client)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
                selectedClient?.id === client.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{client.name}</p>
                <p className="text-sm text-muted-foreground truncate">{client.phone}</p>
              </div>
              <Badge variant="secondary">Vérifié</Badge>
              {selectedClient?.id === client.id && (
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* ── Propriétés ────────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Informations de la Propriété</CardTitle>
          <CardDescription>
            Sélectionnez la propriété pour ce contrat de{" "}
            {contractType === "rental" ? "location" : "vente"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">

          {propertiesLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-6 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement des propriétés…
            </div>
          )}

          {propertiesError && !propertiesLoading && (
            <div className="flex items-center gap-2 text-sm text-destructive py-2">
              <AlertCircle className="h-4 w-4" />
              Impossible de charger les propriétés — {propertiesError}
            </div>
          )}

          {!propertiesLoading && !propertiesError && properties.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Building2 className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">
                Aucune propriété disponible pour la{" "}
                {contractType === "rental" ? "location" : "vente"}
              </p>
            </div>
          )}

          {properties.map((property) => (
            <button
              key={property.id}
              type="button"
              onClick={() => onSelectProperty(property)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left",
                selectedProperty?.id === property.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{property.title}</p>
                <p className="text-sm text-muted-foreground truncate">{property.address}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-semibold text-foreground">
                  {property.price.toLocaleString("fr-FR")} xof
                  {property.type === "rent" && (
                    <span className="text-xs font-normal text-muted-foreground"> /mois</span>
                  )}
                </p>
              </div>
              {selectedProperty?.id === property.id && (
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}