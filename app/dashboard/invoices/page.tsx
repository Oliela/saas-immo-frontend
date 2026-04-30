"use client"

import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import { useRouter } from "next/navigation"
import ListingInvoicesPage from "@/components/dashboard/invoices/page"
import { useEffect } from "react"

export default function InvoicesPage() {
  const router = useRouter()
  const { user, loading } = useAuthAgent()

  useEffect(() => {
    if (!loading && !user) router.push("/login")
  }, [loading, user, router])

  // agencyId sera undefined pendant le chargement — useFactures gère ça
  return <ListingInvoicesPage agencyId={user?.agency?.id} />
}