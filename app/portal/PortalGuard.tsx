// /portal/PortalGuard.tsx — Client Component séparé

"use client"

import ProtectedRoute from "@/components/guard/ProtectedRoute"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"



export default function PortalGuard({ children }: { children: React.ReactNode }) {


  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}