import type { Metadata } from "next"
import AgencyAccountStatusPage from "@/components/account/AgencyAccountStatusPage"

export const metadata: Metadata = {
  title: "Compte suspendu | Galle Connect Pro",
  description:
    "L’accès au compte de votre agence est temporairement suspendu.",
}

export default function AccountSuspendedPage() {
  return <AgencyAccountStatusPage />
}