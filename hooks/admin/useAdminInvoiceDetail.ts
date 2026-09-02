"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export interface AdminInvoiceDetailStats {
  montantTotal: number;
  totalPaye: number;
  montantRestant: number;
  tauxRecouvrement: number;
  nombrePaiements: number;
}

export interface AdminInvoiceDetailInfo {
  client: string;
  agence: string;
  numeroContrat: string | null;
  dateEcheance: string;
  tauxRecouvrement: number;
}

export interface AdminInvoiceDetailLigne {
  libelle: string;
  description: string | null;
  prixUnitaire: number;
  quantite: number;
  total: number;
}

export interface AdminInvoiceDetailPaiement {
  reference: string | null;
  date: string;
  modePaiement: string;
  montant: number;
  statut: string;
}

export interface AdminInvoiceDetailData {
  stats: AdminInvoiceDetailStats;
  informations: AdminInvoiceDetailInfo;
  lignes: AdminInvoiceDetailLigne[];
  historiquePaiements: AdminInvoiceDetailPaiement[];
}

export function useAdminInvoiceDetail(id: string) {
  const [data, setData] = useState<AdminInvoiceDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get(`/api/admin/factures/${id}`)
      .then((res) => {
        setData({
          stats: res.data.stats,
          informations: res.data.informations,
          lignes: Array.isArray(res.data.lignes) ? res.data.lignes : [],
          historiquePaiements: Array.isArray(res.data.historiquePaiements)
            ? res.data.historiquePaiements
            : [],
        });
      })
      .catch(() => setError("Erreur lors du chargement de la facture"))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}