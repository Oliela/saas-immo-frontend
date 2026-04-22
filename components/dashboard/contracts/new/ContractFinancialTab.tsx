"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ContractType, FormData } from "../../../../types/contractNew"
import { paymentFrequencyLabel, paymentFrequencyMultiplier } from "../../../../data/clauseSysteme"

interface Financials {
  rentAmount: number
  depositAmount: number
  cautionMonths: number
  commissionRate: number
  rentMultiplier: number
  cautionTotal: number
  commissionAmount: number
  rentAtSignature: number
  totalAtSignature: number
}

interface Props {
  contractType: ContractType
  formData: FormData
  financials: Financials
  onFormDataChange: (data: FormData) => void
}

export function ContractFinancialTab({
  contractType, formData, financials, onFormDataChange,
}: Props) {
  const set = (key: keyof FormData, value: string) =>
    onFormDataChange({ ...formData, [key]: value })

  const fmt = (n: number) => n.toLocaleString("fr-FR")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conditions Financières</CardTitle>
        <CardDescription>Définir les détails financiers de ce contrat</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">

        {/* Loyer / Prix + Caution */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rentAmount">
              {contractType === "rental" ? "Loyer Mensuel" : "Prix de Vente"}
            </Label>
            <div className="flex items-center border rounded-md px-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <span className="text-muted-foreground text-sm">XOF</span>
              <Input
                id="rentAmount"
                type="number"
                placeholder="0"
                value={formData.rentAmount}
                onChange={(e) => set("rentAmount", e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-2"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deposit">
              {contractType === "rental" ? "Caution (par mois)" : "Dépôt de Garantie"}
            </Label>
            <div className="flex items-center border rounded-md px-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <span className="text-muted-foreground text-sm">XOF</span>
              <Input
                id="deposit"
                type="number"
                placeholder="0"
                value={formData.deposit}
                onChange={(e) => set("deposit", e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-2"
              />
            </div>
          </div>
        </div>

        {/* Nb mois caution + Total caution — location uniquement */}
        {contractType === "rental" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nombre de Mois de Caution</Label>
              <Select
                value={formData.cautionMonths}
                onValueChange={(v) => set("cautionMonths", v)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["1", "2", "3", "6"].map((m) => (
                    <SelectItem key={m} value={m}>{m} mois</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Montant Total de la Caution</Label>
              <div className="flex items-center h-10 px-3 rounded-md border border-border bg-muted/50 text-sm font-medium text-foreground">
                {fmt(financials.cautionTotal)} XOF
                <span className="ml-2 text-xs text-muted-foreground">
                  ({formData.deposit || 0} XOF × {formData.cautionMonths} mois)
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Commission + Fréquence */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="commission">Commission d'Agence (%)</Label>
            <div className="flex items-center border rounded-md px-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
              <Input
                id="commission"
                type="number"
                placeholder="0"
                value={formData.commission}
                onChange={(e) => set("commission", e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 pl-2"
              />
              <span className="text-muted-foreground text-sm">%</span>
            </div>
          </div>

          {contractType === "rental" && (
            <div className="space-y-2">
              <Label>Fréquence de Paiement</Label>
              <Select
                value={formData.paymentFrequency}
                onValueChange={(v) => set("paymentFrequency", v)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensuel</SelectItem>
                  <SelectItem value="quarterly">Trimestriel</SelectItem>
                  <SelectItem value="biannual">Semestriel</SelectItem>
                  <SelectItem value="annual">Annuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Résumé financier */}
        <Separator />
        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-3">Résumé Financier</h4>
          <div className="space-y-2 text-sm">

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {contractType === "rental" ? "Loyer Mensuel" : "Prix de Vente"}
              </span>
              <span className="font-medium text-foreground">{fmt(financials.rentAmount)} XOF</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                {contractType === "rental"
                  ? `Caution (${formData.cautionMonths} mois × ${fmt(financials.depositAmount)} XOF)`
                  : "Dépôt de Garantie"}
              </span>
              <span className="font-medium text-foreground">
                {contractType === "rental"
                  ? fmt(financials.cautionTotal)
                  : fmt(financials.depositAmount)}{" "}XOF
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Commission d'Agence ({financials.commissionRate}%)
              </span>
              <span className="font-medium text-foreground">{fmt(financials.commissionAmount)} XOF</span>
            </div>

            {contractType === "rental" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Loyer à la signature{" "}
                  <span className="text-xs">
                    ({financials.rentMultiplier} mois — {paymentFrequencyLabel[formData.paymentFrequency]})
                  </span>
                </span>
                <span className="font-medium text-foreground">{fmt(financials.rentAtSignature)} XOF</span>
              </div>
            )}

            <Separator className="my-2" />

            <div className="flex justify-between text-base">
              <span className="font-semibold text-foreground">Total à Payer à la Signature</span>
              <span className="font-bold text-foreground text-lg">
                {fmt(financials.totalAtSignature)} XOF
              </span>
            </div>

            {contractType === "rental" && (
              <p className="text-xs text-muted-foreground pt-1">
                Caution ({fmt(financials.cautionTotal)} XOF) + Commission ({fmt(financials.commissionAmount)} XOF) + Loyer ({fmt(financials.rentAtSignature)} XOF)
              </p>
            )}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
