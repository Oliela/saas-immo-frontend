"use client"

// app/dashboard/contracts/[id]/page.tsx

import ContractViewPage from "@/components/dashboard/contracts/view/page"
import axiosInstance from "@/lib/axios"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { Contract } from "@/types/contracts"

interface ContractDetailResponse {
  success: boolean
  message: string
  data: Contract
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement du contrat...</p>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Contrat introuvable.</p>
      </div>
    )
  }

  return <ContractViewPage contract={contract} />
}