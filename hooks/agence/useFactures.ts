// hooks/factures/useFactures.ts
import { useState, useEffect } from "react";
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
  type_facture: "revenu" | "depense" | "remboursement";
  categorie: string;
  sous_categorie: string | null;
  montant_ht: string;
  taux_tva: string;
  montant_tva: string;
  montant_ttc: string;
  devise: string;
  statut: "non_payee" | "partiellement_payee" | "soldee" | "annulee";
  fichier_joint: string | null;
  notes: string | null;
  created_by: number;
  montant_regle: number;
  montant_restant: number;
  agency?: any;
  created_at: string;
  updated_at: string;
}

export interface FacturesStats {
  total_revenue: number;
  non_payee: number;
  soldee: number;
  partiellement_payee: number;
  factures_partiellement_payee: number;
  factures_non_payee: number;
  pourcentage_avancement: number;
}

export interface FacturesResponse {
  factures: Facture[];
  stats: FacturesStats;
}

export function useFactures(agencyId: number | undefined) {
  const [factures, setFactures] = useState<Facture[]>([]);
  const [stats, setStats] = useState<FacturesStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!agencyId) return;

    const fetchFactures = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await axiosInstance.get<FacturesResponse>(
          "/api/factures/agency",
          { params: { agency_id: agencyId } },
        );
        setFactures(data.factures);
        setStats(data.stats);
      } catch (err) {
        const axiosError = err as AxiosError<{ message?: string }>;
        setError(
          axiosError.response?.data?.message ||
            axiosError.message ||
            "Une erreur est survenue",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFactures();
  }, [agencyId]);

  return { factures, stats, loading, error, setFactures };
}
