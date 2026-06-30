"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export interface AdminClientInfo {
  nom: string;
  prenom: string;
  email: string;
  phone: string;
  address: string | null;
  city: string | null;
  country: string | null;
  birthDate: string | null;
  dateCreation: string;
  agences: string[];
  occupation: string | null;
  employer: string | null;
  typeEmployment: string | null;
  monthlyIncome: string;
}

export interface AdminClientDocumentDetail {
  type: string;
  nom: string;
  taille: number | null;
  dateAjout: string;
}

export interface AdminClientContractDetail {
  reference: string;
  agence: string;
  titreBien: string;
  prixBien: string;
  statut: string;
  date: string;
}

export interface AdminClientWishlistDetail {
  propertyType: string | null;
  monthlyBudget: string | null;
  nbPieces: number | null;
  moveInDate: string | null;
  professionalSituation: string | null;
  acquisitionType: string | null;
  surfaceArea: number | null;
  note: string | null;
}

export interface AdminClientStats {
  nombreContrats: number;
  totalFactures: number;
  totalPaye: number;
}

export interface AdminClientDetailData {
  info: AdminClientInfo;
  stats: AdminClientStats;
  documents: AdminClientDocumentDetail[];
  contracts: AdminClientContractDetail[];
  listeSouhaits: AdminClientWishlistDetail | null;
}

export function useAdminClientDetail(id: string) {
  const [data, setData] = useState<AdminClientDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get(`/api/admin/clients/${id}`)
      .then((res) => {
        setData({
          info: res.data.informationsPersonnelles,
          stats: res.data.stats,
          documents: Array.isArray(res.data.documents) ? res.data.documents : [],
          contracts: Array.isArray(res.data.contracts) ? res.data.contracts : [],
          listeSouhaits: res.data.listeSouhaits ?? null,
        });
      })
      .catch(() => setError("Erreur lors du chargement du client"))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}