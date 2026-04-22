import axiosInstance from "@/lib/axios";

// Service pour récupérer les propriétaires
export const untilService = {
  // Récupérer plusieurs propriétaires, optionnellement filtrés par agence

  getOwnersByAgency: async ({ agencyId }: { agencyId?: number }) => {
    if (!agencyId) {
      throw new Error("agencyId est requis");
    }

    const url = `/api/owners/agency/${agencyId}`;

    const res = await axiosInstance.get(url);

    if (!res.data) {
      throw new Error("Erreur lors de la récupération des owners");
    }

    return res.data;
  },

  // Récupérer une seule propriété par ID
  getPropertyById: async (id: string) => {
    const res = await axiosInstance.get(`/api/owners/agency/${id}`);
    if (!res.data)
      throw new Error("Erreur lors de la récupération de la propriété");
    return res.data;
  },
};
