// /portal/PortalGuard.tsx — Client Component séparé

"use client"

import ProtectedDashboard from "@/components/guard/ProtectedDashboard"

export default function PortalGuard({ children }: { children: React.ReactNode }) {

  return (
   <ProtectedDashboard>
      {children}
    </ProtectedDashboard>
  )
}