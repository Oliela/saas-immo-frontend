// components/PublicOnly.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function PublicOnly({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      switch (user.account_type) {
        case "client":
          router.replace("/portal");
          break;
        case "agency_user":
          router.replace("/dashboard");
          break;
        case "super_admin":
          router.replace("/admin");
          break;
        default:
          router.replace("/");
      }
    }
  }, [user, loading, router]);

  // useEffect(() => {
  //   if (!loading && user) {
  //     router.replace(getRedirectPath(user.account_type));
  //   }
  // }, [user, loading]);

  if (loading || user) return null;

  return <>{children}</>;
}
