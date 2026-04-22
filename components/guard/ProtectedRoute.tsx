"use client"

import { useAuth } from "@/hooks/useAuth";
import { redirect, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
 

 if (!loading && (!user )) {
    redirect("/login");
  }
  
  return <>{children}</>;
}