import type { Metadata } from "next"
import AgencyAccountStatusPage from "@/components/account/AgencyAccountStatusPage"

export const metadata: Metadata = {
  title: "Abonnement requis | Galle Connect Pro",
  description:
    "Un abonnement doit être activé pour accéder au dashboard de l’agence.",
}

export default function SubscriptionRequiredPage() {
  return <AgencyAccountStatusPage />
}