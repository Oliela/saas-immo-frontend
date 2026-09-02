"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import type {
  Agency,
  AgencyApprovalStatus,
  AgencyReviewer,
} from "@/lib/admin-types";

interface AdminAgencyApiItem {
  id: number;
  nom: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  ville?: string | null;
  logo?: string | null;
  nombreBiens: number;
  nombreOwners: number;
  nombreAgents: number;
  estCertifiee: boolean;
  estActive: boolean;
  approvalStatus: AgencyApprovalStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  reviewedBy: AgencyReviewer | null;
  createdAt?: string | null;
}

export function useAdminAgencies() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/api/admin/agencies")
      .then((res) => {
        const raw = Array.isArray(res.data.agencies) ? res.data.agencies : [];
        const mapped: Agency[] = raw.map((agency: AdminAgencyApiItem) => ({
          id: String(agency.id),
          name: agency.nom,
          email: agency.email,
          phone: agency.phone ?? "",
          address: agency.address ?? "",
          city: agency.ville ?? "",
          logo: agency.logo ?? undefined,
          propertiesCount: agency.nombreBiens,
          ownersCount: agency.nombreOwners,
          agentsCount: agency.nombreAgents,
          status: agency.estActive ? "active" : "suspended",
          isCertified: agency.estCertifiee,
          approvalStatus: agency.approvalStatus,
          rejectionReason: agency.rejectionReason,
          reviewedAt: agency.reviewedAt,
          reviewedBy: agency.reviewedBy,
          createdAt: agency.createdAt ?? "",
        }));
        setAgencies(mapped);
      })
      .catch(() => setError("Erreur lors du chargement des agences"))
      .finally(() => setLoading(false));
  }, []);

  return { agencies, setAgencies, loading, error };
}
