"use client"

import CreateInvoice from "@/components/dashboard/invoices/create/page"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useGetBiens } from "@/hooks/agence/useGetBiens"
import { useGetClient } from "@/hooks/agence/useGetClient"
import { useGetContractSigned } from "@/hooks/agence/useGetContractSigned"
import { useOwners } from "@/hooks/agence/useOwner"

export default function CreateInvoicePage() {
  const { user, loading: loadingUser } = useAuthAgent()

  const agencyId = user?.agency?.id ? parseInt(user.agency.id, 10) : undefined

  const { client,    loading: loadingClient    } = useGetClient()
  const { owner,     loading: loadingOwners    } = useOwners({ agencyId })
  const { contracts, loading: loadingContracts } = useGetContractSigned({ agencyId })
  const { biens,     loading: loadingBiens     } = useGetBiens({ agencyId })

  if (loadingUser || !user || !agencyId) {
    return <div>Chargement...</div>
  }

  if (loadingClient || loadingOwners || loadingContracts || loadingBiens) {
    return <div>Chargement des données...</div>
  }
  console.log("Clients:", client);

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