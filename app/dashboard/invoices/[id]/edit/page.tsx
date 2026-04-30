"use client"

import { useRouter } from "next/navigation"
import InvoiceEditPage from "@/components/dashboard/invoices/edit/page"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useGetBiens } from "@/hooks/agence/useGetBiens"
import { useGetClient } from "@/hooks/agence/useGetClient"
import { useGetContractSigned } from "@/hooks/agence/useGetContractSigned"
import { useOwners } from "@/hooks/agence/useOwner"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

function EditInvoiceSkeleton() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-28 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">

          {/* Informations générales */}
          <Card>
            <CardHeader><Skeleton className="h-5 w-48" /></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3 w-28" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Destinataire */}
          <Card>
            <CardHeader><Skeleton className="h-5 w-28" /></CardHeader>
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
            <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
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

          {/* Articles */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="space-y-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-24 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="grid grid-cols-5 gap-2 p-3 bg-muted/50 border-b border-border">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-3 w-full" />
                  ))}
                </div>
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="grid grid-cols-5 gap-2 p-3 border-b border-border last:border-0">
                    <Skeleton className="h-9 col-span-2 rounded-md" />
                    <Skeleton className="h-9 rounded-md" />
                    <Skeleton className="h-9 rounded-md" />
                    <Skeleton className="h-9 rounded-md" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><Skeleton className="h-5 w-20" /></CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-28" />
                </div>
              ))}
              <div className="flex justify-between p-3 rounded-lg bg-primary/5 border border-primary/20">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-28" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><Skeleton className="h-5 w-16" /></CardHeader>
            <CardContent>
              <Skeleton className="h-24 w-full rounded-md" />
            </CardContent>
          </Card>

          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    </div>
  )
}

export default function EditInvoicePage() {
  const router = useRouter()
  const { user, loading: loadingUser } = useAuthAgent()

  const agencyId = user?.agency?.id ? parseInt(user.agency.id, 10) : undefined

  const { client,    loading: loadingClient    } = useGetClient()
  const { owners,    loading: loadingOwners    } = useOwners({ agencyId })
  const { contracts, loading: loadingContracts } = useGetContractSigned({ agencyId })
  const { biens,     loading: loadingBiens     } = useGetBiens({ agencyId })

  const isLoading = loadingUser || !user || !agencyId
    || loadingClient || loadingOwners || loadingContracts || loadingBiens

  if (isLoading) return <EditInvoiceSkeleton />

  return (
    <InvoiceEditPage
      clients={client    ?? []}
      owners={owners     ?? []}
      contracts={contracts ?? []}
      biens={biens       ?? []}
    />
  )
}