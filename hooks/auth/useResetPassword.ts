import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/lib/axios";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const resetPassword = async (data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post("/api/reset-password", data);
      router.push("/login?reset=success");
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading, error };
}