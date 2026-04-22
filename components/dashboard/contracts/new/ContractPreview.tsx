"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { Client, Property, ContractClause, ContractType, FormData } from "@/types/contractNew"

interface Props {
  open:             boolean
  onOpenChange:     (open: boolean) => void
  contractType:     ContractType
  selectedClient:   Client | null
  selectedProperty: Property | null
  clauses:          ContractClause[]  // tokens déjà injectés
  formData:         FormData
  financials:       { totalAtSignature: number }
}

export function ContractPreview({
  open, onOpenChange,
  contractType, selectedClient, selectedProperty,
  clauses, formData, financials,
}: Props) {
  const fmt = (n: number) => n.toLocaleString("fr-FR")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Aperçu du Contrat</SheetTitle>
          <SheetDescription>Vérifiez le contrat avant de le générer</SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <div className="p-6 border border-border rounded-lg bg-card space-y-6">

            {/* En-tête */}
            <div className="text-center pb-4 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                {contractType === "rental" ? "CONTRAT DE LOCATION" : "COMPROMIS DE VENTE"}
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Contrat n°{Date.now().toString().slice(-6)}
              </p>
            </div>

            {/* Toutes les clauses — dynamiques, tokens déjà injectés */}
            {clauses.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Aucune clause sélectionnée
              </p>
            ) : (
              clauses.map((clause, index) => (
                <div key={clause.id}>
                  <h3 className="font-semibold text-foreground mb-2 uppercase text-sm">
                    {index + 1}. {clause.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {clause.content}
                  </p>
                </div>
              ))
            )}

            {/* Total à la signature */}
            {financials.totalAtSignature > 0 && (
              <div className="border-t border-border pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-foreground">Total à payer à la signature</span>
                  <span className="font-bold text-lg text-foreground">
                    {fmt(financials.totalAtSignature)} FCFA
                  </span>
                </div>
              </div>
            )}

            {/* Signatures */}
            <div className="border-t border-border pt-6">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-sm font-medium text-foreground mb-4">Signature du Client</p>
                  <div className="h-16 border-b border-foreground" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedClient?.name || "Nom du Client"}
                  </p>
                  <p className="text-xs text-muted-foreground">Date : ___________</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground mb-4">Représentant de l'Agence</p>
                  <div className="h-16 border-b border-foreground" />
                  <p className="text-xs text-muted-foreground mt-2">Agence SAS IMO</p>
                  <p className="text-xs text-muted-foreground">Date : ___________</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}