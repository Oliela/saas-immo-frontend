import type { Metadata } from "next"
import AgencyAccountStatusPage from "@/components/account/AgencyAccountStatusPage"

export const metadata: Metadata = {
  title: "Statut du compte | Galle Connect Pro",
  description:
    "Consultez le statut de votre demande de compte agence.",
}

export default function AccountStatusPage() {
  return <AgencyAccountStatusPage />
}