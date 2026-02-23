// hooks/useAuth.ts
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // token-based
    if (!token) {
      setLoading(false);
      return;
    }

    axiosInstance
      .get("/api/user", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading };
}
