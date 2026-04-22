"use client"

import { useRouter } from "next/navigation"
import InvoiceEditPage from "@/components/dashboard/invoices/edit/page"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useGetBiens } from "@/hooks/agence/useGetBiens"
import { useGetClient } from "@/hooks/agence/useGetClient"
import { useGetContractSigned } from "@/hooks/agence/useGetContractSigned"
import { useOwners } from "@/hooks/agence/useOwner"

export default function EditInvoicePage() {
  const router = useRouter()
  const { user, loading: loadingUser } = useAuthAgent()

  const agencyId = user?.agency?.id ? parseInt(user.agency.id, 10) : undefined

  const { client,    loading: loadingClient    } = useGetClient()
  const { owners,     loading: loadingOwners    } = useOwners({ agencyId })
  const { contracts, loading: loadingContracts } = useGetContractSigned({ agencyId })
  const { biens,     loading: loadingBiens     } = useGetBiens({ agencyId })

  if (loadingUser || !user || !agencyId) {
    return <div>Chargement...</div>
  }

  if (loadingClient || loadingOwners || loadingContracts || loadingBiens) {
    return <div>Chargement des données...</div>
  }
  console.log("Clients:", client)
  

  return (
    <InvoiceEditPage
      clients={client    ?? []}
      owners={owners      ?? []}
      contracts={contracts ?? []}
      biens={biens       ?? []}
    />
  )
}