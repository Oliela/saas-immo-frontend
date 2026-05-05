"use client"

import Link from "next/link"
import { Suspense } from "react"
import { ArrowLeft, FileText, User, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import axiosInstance from "@/lib/axios"
import { useSearchParams } from "next/navigation"

import { useContractForm }      from "@/hooks/contracts/useContractForm"
import { ContractInfoTab }      from "@/components/dashboard/contracts/new/ContractInfoTab"
import { ContractPartiesTab }   from "@/components/dashboard/contracts/new/ContractPartiesTab"
import { ContractClausesTab }   from "@/components/dashboard/contracts/new/ContractClausesTab"
import { ContractFinancialTab } from "@/components/dashboard/contracts/new/ContractFinancialTab"
import { ContractPreview }      from "@/components/dashboard/contracts/new/ContractPreview"
import { ContractSidebar }      from "@/components/dashboard/contracts/new/ContractSidebar"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { toast } from "sonner"

// ── Skeleton ─────────────────────────────────────────────────────────────────

function NewContractSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-9 w-9 rounded-md" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-4 gap-1 p-1 rounded-lg bg-muted">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-9 rounded-md" />)}
          </div>
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <div className="flex gap-3">
                  <Skeleton className="h-12 flex-1 rounded-lg" />
                  <Skeleton className="h-12 flex-1 rounded-lg" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3"><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-2 w-full rounded-full" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full shrink-0" />
                  <Skeleton className="h-3 w-36" />
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Composant interne qui utilise useSearchParams ─────────────────────────────
// Doit être wrappé dans <Suspense> pour satisfaire Next.js

function NewContractContent() {
  const { user, loading: authLoading } = useAuthAgent()

  // Query params optionnels (pré-sélection depuis une tâche)
  const searchParams = useSearchParams()
  const preClientId  = searchParams.get("client_id") ?? undefined
  const preBienId    = searchParams.get("bien_id")   ?? undefined

  const AGENCY_ID   = user?.agency.agency_id ?? 1
  const AGENCY_NAME = user?.agency.name ?? ""

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
  } = useContractForm(AGENCY_NAME)

  if (authLoading) return <NewContractSkeleton />

  const handleSubmit = async () => {
    const payload = buildPayload()
    if (!payload) return
    try {
      await axiosInstance.post("/api/contracts", payload)
      toast.success("Contrat créé avec succès !")
    } catch (err: any) {
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
                preClientId={preClientId}
                preBienId={preBienId}
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

// ── Export page — Suspense obligatoire autour de useSearchParams ──────────────

export default function NewContractPage() {
  return (
    <Suspense fallback={<NewContractSkeleton />}>
      <NewContractContent />
    </Suspense>
  )
}