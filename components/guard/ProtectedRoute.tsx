// components/ProtectedRoute.tsx
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return <p>Chargement...</p>; // ou un spinner

  if (!user) {
    router.push("/login"); // redirige vers login si pas connecté
    return null;
  }

  return <>{children}</>;
}
