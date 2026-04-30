"use client"

import CreateInvoice from "@/components/dashboard/invoices/create/page"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useGetBiens } from "@/hooks/agence/useGetBiens"
import { useGetClient } from "@/hooks/agence/useGetClient"
import { useGetContractSigned } from "@/hooks/agence/useGetContractSigned"
import { useOwners } from "@/hooks/agence/useOwner"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

function CreateInvoiceSkeleton() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-44" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">

          {/* Dates */}
          <Card>
            <CardHeader><Skeleton className="h-5 w-20" /></CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Type de facture */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-36" />
              <Skeleton className="h-4 w-52" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <div className="flex gap-3">
                  <Skeleton className="h-12 flex-1 rounded-lg" />
                  <Skeleton className="h-12 flex-1 rounded-lg" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>

          {/* Destinataire */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-36" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-28 rounded-md" />
                  <Skeleton className="h-9 w-32 rounded-md" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            </CardContent>
          </Card>

          {/* Bien & Contrat */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Lignes de facture */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-5 gap-2 p-3 bg-muted/50 border-b border-border">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-3 w-full" />
                  ))}
                </div>
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 p-3 border-b border-border last:border-0">
                    <Skeleton className="h-9 col-span-2 rounded-md" />
                    <Skeleton className="h-9 rounded-md" />
                    <Skeleton className="h-9 rounded-md" />
                    <Skeleton className="h-9 rounded-md" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-9 w-full rounded-md" />
            </CardContent>
          </Card>

          {/* Totaux */}
          <Card>
            <CardHeader><Skeleton className="h-5 w-20" /></CardHeader>
            <CardContent>
              <div className="space-y-3 max-w-sm ml-auto">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between items-center py-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
                <div className="flex justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader><Skeleton className="h-5 w-16" /></CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><Skeleton className="h-5 w-20" /></CardHeader>
            <CardContent className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
              <div className="space-y-2 p-3 rounded-lg bg-muted/50">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function CreateInvoicePage() {
  const { user, loading: loadingUser } = useAuthAgent()

  const agencyId = user?.agency?.id ? parseInt(user.agency.id, 10) : undefined

  const { client,    loading: loadingClient    } = useGetClient()
  const { owner,     loading: loadingOwners    } = useOwners({ agencyId })
  const { contracts, loading: loadingContracts } = useGetContractSigned({ agencyId })
  const { biens,     loading: loadingBiens     } = useGetBiens({ agencyId })

  const isLoading = loadingUser || !user || !agencyId
    || loadingClient || loadingOwners || loadingContracts || loadingBiens

  if (isLoading) return <CreateInvoiceSkeleton />

  return (
    <CreateInvoice
      agencyId={agencyId}
      clients={client?.map((item: any) => item.client) || []}
      owners={owner      || []}
      contracts={contracts || []}
      biens={biens       || []}
    />
  )
}