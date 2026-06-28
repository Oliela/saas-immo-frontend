"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminHeader } from "@/components/admin/header"
import AdminGuard from "./AdminGuard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <AdminSidebar />
        <div className="lg:pl-64">
          <AdminHeader />
          <main className="p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  )
}
