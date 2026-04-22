"use client"

import Link from "next/link"
import { ArrowLeft, FileText, User, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axiosInstance from "@/lib/axios"

import { useContractForm }      from "@/hooks/contracts/useContractForm"
import { useAuth }              from "@/hooks/useAuth"   // ou ton contexte auth
import { ContractInfoTab }      from "@/components/dashboard/contracts/new/ContractInfoTab"
import { ContractPartiesTab }   from "@/components/dashboard/contracts/new/ContractPartiesTab"
import { ContractClausesTab }   from "@/components/dashboard/contracts/new/ContractClausesTab"
import { ContractFinancialTab } from "@/components/dashboard/contracts/new/ContractFinancialTab"
import { ContractPreview }      from "@/components/dashboard/contracts/new/ContractPreview"
import { ContractSidebar }      from "@/components/dashboard/contracts/new/ContractSidebar"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { toast } from "sonner"

export default function NewContractPage() {
  // Récupère le nom et l'id de l'agence depuis ton contexte auth
  // Adapte selon ta structure : useAuth(), useUser(), props, contexte React…
  const { user } = useAuthAgent()
  const AGENCY_ID   = user?.agency.agency_id   ?? 1
  const AGENCY_NAME = user?.agency.name ?? ""
// console.log("AGENCY_ID:", AGENCY_ID, "AGENCY_NAME:", AGENCY_NAME)
  const {
    activeTab, setActiveTab,
    contractType,
    selectedClient,   setSelectedClient,
    selectedProperty, setSelectedProperty,
    showPreview,      setShowPreview,
    clauses,
    formData,         setFormData,
    financials,
    clausesWithInjectedData,
    progress,
    isReadyToSubmit,
    handleContractTypeChange,
    addClauseFromCatalog,
    addInlineClause,
    updateClause,
    removeClause,
    moveClause,
    duplicateClause,
    buildPayload,
  } = useContractForm(AGENCY_NAME)   // ← agencyName passé ici

  const handleSubmit = async () => {
    const payload = buildPayload()
    if (!payload) return
    console.log("📋 Payload :", payload)
    try {
      const res = await axiosInstance.post("/api/contracts", payload)
      console.log("✅ Contrat créé :", res.data)
      toast.success("Contrat créé avec succès !")
    } catch (err) {
      console.error("❌ Erreur :", err.response?.data?.message || err.message)
      toast.error("Erreur lors de la création du contrat : " + (err.response?.data?.message || err.message))
    }
  }

  const handleSaveDraft = () => console.log("💾 Brouillon :", buildPayload())

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/contracts"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Créer un Contrat</h1>
          <p className="text-muted-foreground">Générer un nouveau document de contrat</p>
        </div>
      </div>

      <ContractPreview
        open={showPreview}
        onOpenChange={setShowPreview}
        contractType={contractType}
        selectedClient={selectedClient}
        selectedProperty={selectedProperty}
        clauses={clausesWithInjectedData}
        formData={formData}
        financials={financials}
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
                onContractTypeChange={handleContractTypeChange}
                onFormDataChange={setFormData}
              />
            </TabsContent>

            <TabsContent value="parties" className="mt-6">
              <ContractPartiesTab
                contractType={contractType}
                agencyId={AGENCY_ID}
                selectedClient={selectedClient}
                selectedProperty={selectedProperty}
                onSelectClient={setSelectedClient}
                onSelectProperty={setSelectedProperty}
              />
            </TabsContent>

            <TabsContent value="clauses" className="mt-6">
              <ContractClausesTab
                contractType={contractType}
                agencyId={AGENCY_ID}
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
          onPreview={() => setShowPreview(true)}
          onSubmit={handleSubmit}
          onSaveDraft={handleSaveDraft}
        />
      </div>
    </div>
  )
}