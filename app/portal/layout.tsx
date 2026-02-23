import React from "react"
import { ClientSidebar } from "@/components/client-portal/sidebar"
import { ClientHeader } from "@/components/client-portal/header"

export const metadata = {
  title: "Client Portal | SAS IMO",
  description: "Track your property journey, manage documents, and stay updated on your applications.",
}

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <ClientSidebar />
      <div className="lg:pl-64">
        <ClientHeader />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
