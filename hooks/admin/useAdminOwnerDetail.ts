"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export interface AdminOwnerDetailInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
}

export interface AdminOwnerDetailStats {
  nombreBiens: number;
  nombreContrats: number;
  valeurPortefeuille: number;
  nombreAgences: number;
}

export interface AdminOwnerDetailContract {
  reference: string;
  titreBien: string;
  nomClient: string;
  agence: string;
  montant: string;
  type: string;
  statut: string;
}

export interface AdminOwnerDetailData {
  info: AdminOwnerDetailInfo;
  stats: AdminOwnerDetailStats;
  contracts: AdminOwnerDetailContract[];
}

export function useAdminOwnerDetail(id: string) {
  const [data, setData] = useState<AdminOwnerDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get(`/api/admin/owners/${id}`)
      .then((res) => {
        setData({
          info: res.data.informationsPersonnelles,
          stats: res.data.stats,
          contracts: Array.isArray(res.data.contracts) ? res.data.contracts : [],
        });
      })
      .catch(() => setError("Erreur lors du chargement du propriétaire"))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}