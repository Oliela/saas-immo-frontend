"use client"

import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    redirect("/login");
  }

  if (user.account_type === "super_admin") {
    redirect("/admin");
  }

  return <>{children}</>;
}