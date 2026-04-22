// components/ProtectedRoute.tsx
import { useAuthAgent } from "@/hooks/agence/useAuthAgent";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedDashboard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthAgent();
  const router = useRouter();

  if (!loading && (!user )) {
    redirect("/login");
  }
  

  return <>{children}</>;
}
