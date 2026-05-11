"use client"

import Link from "next/link"
import { ArrowLeft, FileText, User, DollarSign, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axiosInstance from "@/lib/axios"
import { useState } from "react"
import { useParams } from "next/navigation"

import { useContractDetail } from "@/hooks/contracts/useContractDetail"
import { useContractEditForm } from "@/hooks/contracts/useContractEditForm"
import { ContractInfoTab } from "@/components/dashboard/contracts/new/ContractInfoTab"
import { ContractPartiesTab } from "@/components/dashboard/contracts/new/ContractPartiesTab"
import { ContractClausesTab } from "@/components/dashboard/contracts/new/ContractClausesTab"
import { ContractFinancialTab } from "@/components/dashboard/contracts/new/ContractFinancialTab"
import { ContractPreview } from "@/components/dashboard/contracts/new/ContractPreview"
import { ContractSidebar } from "@/components/dashboard/contracts/new/ContractSidebar"
import type { ContractEditData } from "@/hooks/contracts/useContractDetail"
import { toast } from "sonner"

// ─── Page principale ──────────────────────────────────────────────────────────

export default function EditContractPage() {
  const params = useParams()
  const id = params.id as string

  const { data, isLoading, error } = useContractDetail(id)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32 gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />
        Chargement du contrat…
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center py-32 gap-3 text-destructive">
        <AlertCircle className="h-6 w-6" />
        {error ?? "Contrat introuvable"}
      </div>
    )
  }

  // agencyName récupéré depuis les données du contrat et passé à EditForm
  return <EditForm data={data} agencyName={data.agencyName} />
}

// ─── Formulaire ───────────────────────────────────────────────────────────────

interface EditFormProps {
  data: ContractEditData
  agencyName: string
}

function EditForm({ data, agencyName }: EditFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    activeTab, setActiveTab,
    contractType,
    selectedClient, setSelectedClient,
    selectedProperty, setSelectedProperty,
    showPreview, setShowPreview,
    clauses,
    formData, setFormData,
    financials,
    clausesWithInjectedData,
    progress,
    isReadyToSubmit,
    addClauseFromCatalog,
    addInlineClause,
    updateClause,
    removeClause,
    moveClause,
    duplicateClause,
    buildPayload,
  } = useContractEditForm(data)

  const handleSubmit = async () => {
    const payload = buildPayload()
    if (!payload) return
    setSubmitError(null)
    try {
      const res = await axiosInstance.put(`/api/contracts/${data.contractId}`, payload)
      console.log("✅ Contrat modifié :", res.data)
      toast.success("Contrat mis à jour")
      window.location.href = `/dashboard/contracts/${data.contractId}`
    } catch (err: any) {
      setSubmitError(err.response?.data?.message ?? "Une erreur est survenue")
      console.error("❌ Erreur :", err.response?.data || err.message)
      toast.error("Impossible de mettre à jour le contrat")
    }
  }

  const handleSaveDraft = async () => {
    const payload = buildPayload()
    if (!payload) return
    try {
      await axiosInstance.put(`/api/contracts/${data.contractId}`, payload)
      toast.success("Brouillon sauvegardé")
    } catch (err: any) {
      console.error("❌ Erreur :", err.response?.data || err.message)
      toast.error("Impossible de sauvegarder le brouillon") 
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/contracts"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Modifier le Contrat</h1>
          <p className="text-muted-foreground">{data.contractNumber}</p>
        </div>
      </div>

      {/* Aperçu — agencyName vient de la prop */}
      <ContractPreview
        open={showPreview}
        onOpenChange={setShowPreview}
        contractType={contractType}
        selectedClient={selectedClient}
        selectedProperty={selectedProperty}
        clauses={clausesWithInjectedData}
        formData={formData}
        financials={financials}
        agenceName={agencyName}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /><span className="hidden sm:inline">Infos</span>
              </TabsTrigger>
              <TabsTrigger value="parties" className="flex items-center gap-2">
                <User className="h-4 w-4" /><span className="hidden sm:inline">Parties</span>
              </TabsTrigger>
              <TabsTrigger value="clauses" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /><span className="hidden sm:inline">Clauses</span>
              </TabsTrigger>
              <TabsTrigger value="financial" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" /><span className="hidden sm:inline">Financier</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6">
              <ContractInfoTab
                contractType={contractType}
                formData={formData}
                onContractTypeChange={() => { }}
                onFormDataChange={setFormData}
              />
            </TabsContent>

            <TabsContent value="parties" className="mt-6">
              <ContractPartiesTab
                contractType={contractType}
                agencyId={data.agencyId}
                selectedClient={selectedClient}
                selectedProperty={selectedProperty}
                onSelectClient={setSelectedClient}
                onSelectProperty={setSelectedProperty}
              />
            </TabsContent>

            <TabsContent value="clauses" className="mt-6">
              <ContractClausesTab
                contractType={contractType}
                agencyId={data.agencyId}
                activeClauses={clauses}
                onAddFromCatalog={addClauseFromCatalog}
                onAddInline={addInlineClause}
                onUpdate={updateClause}
                onRemove={removeClause}
                onMove={moveClause}
                onDuplicate={duplicateClause}
              />
            </TabsContent>

            <TabsContent value="financial" className="mt-6">
              <ContractFinancialTab
                contractType={contractType}
                formData={formData}
                financials={financials}
                onFormDataChange={setFormData}
              />
            </TabsContent>
          </Tabs>
        </div>

        <ContractSidebar
          contractType={contractType}
          selectedClient={selectedClient}
          selectedProperty={selectedProperty}
          clauseCount={clauses.length}
          progress={progress}
          isReadyToSubmit={isReadyToSubmit}
          submitError={submitError}
          onPreview={() => setShowPreview(true)}
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
          isEdit
        />
      </div>
    </div>
  )
}