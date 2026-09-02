"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import type { AgencyApprovalStatus, AgencyReviewer } from "@/lib/admin-types";

export interface AdminAgencyDetailInfo {
  name: string;
  logo: string | null;
  email: string;
  phone: string;
  city: string;
  address: string;
  description: string | null;
  webSite: string | null;
  licenceNumber: string | null;
  termsAccepted: boolean;
  informationCertified: boolean;
  isActive: boolean;
  abonnement: string;
  approvalStatus: AgencyApprovalStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  reviewedBy: AgencyReviewer | null;
}

export interface AdminAgencyDetailStats {
  nombreBiens: number;
  nombreProprietaires: number;
  nombreAgents: number;
  contratsSignes: number;
  totalEncaisse: number;
}

export interface AdminAgencyDetailOwner {
  nomComplet: string;
  phone: string;
  email: string;
  nombreBiens: number;
  statut: string;
}

export interface AdminAgencyDetailAgent {
  nom: string;
  email: string;
  role: string;
  accountType: string;
}

export interface AdminAgencyDetailClient {
  nom: string;
  email: string;
  phone: string;
  nombreContrats: number;
}

export interface AdminAgencyDetailContract {
  reference: string;
  nomClient: string;
  titreBien: string;
  montant: string;
  statut: string;
  dateSigned: string;
}

export interface AdminAgencyDetailReglement {
  reference: string | null;
  montant: number;
  modePaiement: string;
  referenceFacture: string;
  statut: string;
  date: string;
}

export interface AdminAgencyDetailData {
  informations: AdminAgencyDetailInfo;
  stats: AdminAgencyDetailStats;
  proprietaires: AdminAgencyDetailOwner[];
  agents: AdminAgencyDetailAgent[];
  clients: AdminAgencyDetailClient[];
  contracts: AdminAgencyDetailContract[];
  reglements: AdminAgencyDetailReglement[];
}

export function useAdminAgencyDetail(id: string) {
  const [data, setData] = useState<AdminAgencyDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get(`/api/admin/agencies/${id}`)
      .then((res) => {
        setData({
          informations: res.data.informations,
          stats: res.data.stats,
          proprietaires: Array.isArray(res.data.proprietaires) ? res.data.proprietaires : [],
          agents: Array.isArray(res.data.agents) ? res.data.agents : [],
          clients: Array.isArray(res.data.clients) ? res.data.clients : [],
          contracts: Array.isArray(res.data.contracts) ? res.data.contracts : [],
          reglements: Array.isArray(res.data.reglements) ? res.data.reglements : [],
        });
      })
      .catch(() => setError("Erreur lors du chargement de l'agence"))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}
