"use client"

// app/dashboard/invoices/page.tsx
import { useRouter } from "next/navigation"
import { useAuthAgent } from "@/hooks/agence/useAuthAgent"
import ListingInvoicesPage from "@/components/dashboard/invoices/page"

export default function InvoicesPage() {
  const router = useRouter()
  const { user, loading } = useAuthAgent()

  if (loading) return <div>Loading...</div>
  if (!user) {
    router.push("/login")
    return null
  }

  return <ListingInvoicesPage agencyId={user?.agency?.id} />
}