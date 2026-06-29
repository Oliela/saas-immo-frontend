"use client"

import { useAuthAgent } from "@/hooks/agence/useAuthAgent";
import { redirect } from "next/navigation";

export default function ProtectedDashboard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthAgent();

  if (loading) return null;

  if (!user) {
    redirect("/login");
  }

  if (user?.user?.account_type === "super_admin") {
    redirect("/admin");
  }

  return <>{children}</>;
}
