// /portal/layout.tsx — Server Component (garde metadata)

import React from "react"
import { ClientSidebar } from "@/components/client-portal/sidebar"
import { ClientHeader } from "@/components/client-portal/header"
import PortalGuard from "./PortalGuard"

export const metadata = {
  title: "Client Portal | GalleConnectpro",
  description: "Track your property journey, manage documents, and stay updated on your applications.",
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalGuard>
      <div className="min-h-screen bg-background">
        <ClientSidebar />
        <div className="lg:pl-64">
          <ClientHeader />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </PortalGuard>
  )
}