"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

export interface AdminContractDetailStats {
  montantContrat: string;
  totalPaye: number;
  nombreFactures: number;
  nombrePaiements: number;
}

export interface AdminContractDetailInfo {
  dateDebut: string;
  dateFin: string | null;
  dateSigned: string | null;
  titreBien: string;
  type: string;
  statut: string;
  montantMensuel: string;
}

export interface AdminContractDetailParties {
  client: string;
  proprietaire: string;
  agence: string;
}

export interface AdminContractDetailFacture {
  numero: string;
  dateEcheance: string;
  montant: number;
  resteAPayer: number;
  statut: string;
}

export interface AdminContractDetailPaiement {
  reference: string | null;
  date: string;
  modePaiement: string;
  montant: number;
  statut: string;
}

export interface AdminContractDetailData {
  stats: AdminContractDetailStats;
  informations: AdminContractDetailInfo;
  parties: AdminContractDetailParties;
  factures: AdminContractDetailFacture[];
  paiements: AdminContractDetailPaiement[];
}

export function useAdminContractDetail(id: string) {
  const [data, setData] = useState<AdminContractDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get(`/api/admin/contracts/${id}`)
      .then((res) => {
        setData({
          stats: res.data.stats,
          informations: res.data.informations,
          parties: res.data.parties,
          factures: Array.isArray(res.data.factures) ? res.data.factures : [],
          paiements: Array.isArray(res.data.paiements) ? res.data.paiements : [],
        });
      })
      .catch(() => setError("Erreur lors du chargement du contrat"))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}