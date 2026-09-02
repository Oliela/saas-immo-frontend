"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import type { Payment } from "@/lib/admin-types";

export interface AdminPaymentStats {
  totalEncaisse: number;
  nombrePaiements: number;
  enAttente: number;
  parMode: {
    especes: number;
    carte: number;
    mobileMoney: number;
    autre: number;
    virement: number;
  };
}

const methodMap: Record<string, Payment["method"]> = {
  virement: "transfer",
  carte: "card",
  especes: "cash",
  cheque: "check",
  wave: "mobile_money",
  mobileMoney: "mobile_money",
  mobile_money: "mobile_money",
};

const statutMap: Record<string, Payment["status"]> = {
  confirme: "completed",
  en_attente: "pending",
  echoue: "failed",
  rembourse: "refunded",
};

export function useAdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState<AdminPaymentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/api/admin/reglements")
      .then((res) => {
        if (res.data.stats) setStats(res.data.stats);

        const raw = Array.isArray(res.data.reglements) ? res.data.reglements : [];
        const mapped: Payment[] = raw.map((r: any) => ({
          id: String(r.id),
          amount: r.montant ?? 0,
          method: methodMap[r.modePaiement] ?? "mobile_money",
          reference: r.reference ?? `REG-${(r.date ?? "").slice(0, 4)}-${String(r.id).padStart(2, "0")}`,
          invoiceId: "",
          invoiceNumber: r.referenceFacture ?? "",
          clientId: "",
          clientName: r.client ?? "",
          agencyId: "",
          agencyName: r.agence ?? "",
          status: statutMap[r.statut] ?? "completed",
          paidAt: r.date ?? "",
          createdAt: r.date ?? "",
        }));
        setPayments(mapped);
      })
      .catch(() => setError("Erreur lors du chargement des règlements"))
      .finally(() => setLoading(false));
  }, []);

  return { payments, stats, loading, error };
}