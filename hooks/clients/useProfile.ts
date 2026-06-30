"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export function useProfile() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   

    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/profile");
        setData(response.data);
        // console.log("Profile data:", response.data);
      } catch {

        setError("Erreur lors du chargement du profil");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { data, loading, error };
}
