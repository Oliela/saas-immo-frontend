// hooks/factures/useClientFactures.ts
import { useState, useEffect, useCallback } from "react";
import type { AxiosError } from "axios";
import axiosInstance from "@/lib/axios";

export interface Facture {
  id: number;
  numero_facture: string;
  agency_id: number;
  destinataire_type: "client" | "proprietaire" | "fournisseur" | null;
  destinataire_id: number | null;
  destinataire?: {
    id: number;
    nom?: string;
    prenom?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  } | null;
  fournisseur_nom: string | null;
  fournisseur_telephone: string | null;
  fournisseur_email: string | null;
  bien_id: number | null;
  bien?: {
    id: number;
    title: string;
    city: string;
    address: string;
  } | null;
  contract_id: number | null;
  contract?: any | null;
  date_emission: string;
  date_echeance: string | null;
  type_facture: string;
  categorie: string | null;
  sous_categorie: string | null;
  montant_ht: string;
  taux_tva: string;
  montant_tva: string;
  montant_ttc: string;
  remise: string;
  montant_remise: string;
  devise: string;
  statut: "non_payee" | "partiellement_payee" | "soldee" | "annulee";
  fichier_joint: string | null;
  notes: string | null;
  created_by: number;
  montant_regle: number;
  montant_restant: number;
  agency?: any;
  articles?: any[];
  reglements?: any[];
  created_at: string;
  updated_at: string;
}

export interface FacturesStats {
  total_factures:        number;
  total_paiement:        number;
  facture_payee:         number;
  tatol_payee:           number;
  paiement_attente:      number;
  facture_reste_a_payer: number;
}

export interface FacturesResponse {
  factures: Facture[];
  stats:    FacturesStats;
}

export function useClientFactures(clientId: number | undefined) {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [stats,    setStats]    = useState<FacturesStats | null>(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const fetchFactures = useCallback(async () => {
    if (!clientId) return;
    setLoading(true);
    setError(null);

    try {
      // ✅ GET avec params — client_id passé en query string
      const { data } = await axiosInstance.get<FacturesResponse>(
        "/api/factures/client",
        { params: { client_id: clientId } }
      );
      setFactures(data.factures);
      setStats(data.stats);
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Une erreur est survenue"
      );
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchFactures();
  }, [fetchFactures]);

  return {
    factures,
    stats,
    loading,
    error,
    setFactures,
    refetch: fetchFactures,
  };
}