"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import type { Invoice } from "@/lib/admin-types";

export interface AdminInvoiceStats {
  totalFacture: number;
  totalPaye: number;
  resteAPayer: number;
  tauxRecouvrement: number;
  payeesSemaine: number;
}

const statutMap: Record<string, Invoice["status"]> = {
  payee: "paid",
  non_payee: "unpaid",
  partiellement_payee: "partially_paid",
  en_retard: "overdue",
};

export function useAdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<AdminInvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/api/admin/factures")
      .then((res) => {
        if (res.data.stats) setStats(res.data.stats);

        const raw = Array.isArray(res.data.factures) ? res.data.factures : [];
        const mapped: Invoice[] = raw.map((f: any) => ({
          id: String(f.id),
          number: f.reference ?? "",
          clientId: "",
          clientName: f.client ?? "",
          agencyId: "",
          agencyName: f.agence ?? "",
          amount: f.montant ?? 0,
          paidAmount: (f.montant ?? 0) - (f.resteAPayer ?? 0),
          outstanding: f.resteAPayer ?? 0,
          status: statutMap[f.statut] ?? "unpaid",
          dueDate: f.echeance ?? "",
          items: [],
          createdAt: f.createdAt ?? "",
          updatedAt: f.updatedAt ?? "",
        }));
        setInvoices(mapped);
      })
      .catch(() => setError("Erreur lors du chargement des factures"))
      .finally(() => setLoading(false));
  }, []);

  return { invoices, stats, loading, error };
}