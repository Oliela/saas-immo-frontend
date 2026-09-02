import type { Metadata } from "next"
import AgencyAccountStatusPage from "@/components/account/AgencyAccountStatusPage"

export const metadata: Metadata = {
  title: "Compte en attente | Galle Connect Pro",
  description:
    "Votre demande de compte agence est en attente de validation.",
}

export default function AccountPendingPage() {
  return <AgencyAccountStatusPage />
}