"use client";
import React, { useEffect } from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import PortalGuard from "./PortalGuard";



export default function DashboardLayout({children,}: {children: React.ReactNode}) {
 
  return (
    // <PortalGuard>
      <div className="min-h-screen bg-gray-100">
        <DashboardSidebar />
        <div className="lg:pl-64">
          <DashboardHeader />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    // </PortalGuard>
  )
}
