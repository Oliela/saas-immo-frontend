import { useState } from "react";
import axiosInstance from "@/lib/axios";

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendResetLink = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await axiosInstance.post("/api/forgot-password", { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return { sendResetLink, loading, success, error };
}