import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [loginCount, setLoginCount] = useState<number>(0); // ← AJOUTER

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/api/user");
        setUser(res.data);
        setLoginCount(res.data.login_count ?? 0); // ← AJOUTER
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading, loginCount }; // ← AJOUTER loginCount
}