"use client"

import ContractViewPage from "@/components/dashboard/contracts/view/page"
import axiosInstance from "@/lib/axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { Contract } from "@/types/contracts"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface ContractDetailResponse {
  success: boolean
  message: string
  data: Contract
}

function ContractViewSkeleton() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-36 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </div>
      </div>

      {/* Progression */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">

          {/* Tabs bar */}
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>

          {/* Bien immobilier */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between py-1">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <Separator />
                </div>
              ))}
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-lg bg-muted/50">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="h-4 w-10" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conditions financières */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between py-1">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  {i < 4 && <Separator />}
                </div>
              ))}
              <div className="flex justify-between p-3 rounded-lg bg-muted/50">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-5 w-32" />
              </div>
            </CardContent>
          </Card>

          {/* Dates clés */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i}>
                  <div className="flex justify-between py-1">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  {i < 4 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Client */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-20" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-12 w-12 rounded-full shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-4 w-44" />
              </div>
              <Separator className="my-3" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="flex flex-wrap gap-1">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-28 rounded-full" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Infos contrat */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-28" />
            </CardHeader>
            <CardContent className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
              <Skeleton className="h-8 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ContractPage() {
  const params = useParams<{ id: string }>()
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const res = await axiosInstance.get<ContractDetailResponse>(`/api/contracts/${params.id}`)
        setContract(res.data.data)
      } catch (error) {
        console.error("Erreur lors du chargement du contrat :", error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) fetchContract()
  }, [params.id])

  if (loading) return <ContractViewSkeleton />

  if (!contract) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-muted-foreground">Contrat introuvable.</p>
    </div>
  )

  return <ContractViewPage contract={contract} />
}