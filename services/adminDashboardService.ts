import axiosInstance from "@/lib/axios";

export interface AdminStats {
  totalClients: number;
  totalAgencies: number;
  totalOwners: number;
  totalProperties: number;
  totalContracts: number;
  totalBilled: number;
  totalPaid: number;
  outstanding: number;
  certifiedAgencies: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  pendingContracts: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface RecentAgency {
  id: number;
  name: string;
  city: string;
  status: string;
  isCertified: boolean;
}

export interface RecentContract {
  id: number;
  reference: string;
  clientName: string | null;
  amount: number;
  status: string;
}

export interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  agencyName: string | null;
  amount: number | null;
  createdAt: string;
}

export interface AdminDashboardData {
  stats: AdminStats;
  monthlyRevenue: ChartDataPoint[];
  invoiceStatusDistribution: ChartDataPoint[];
  recentAgencies: RecentAgency[];
  recentContracts: RecentContract[];
  recentActivities: RecentActivity[];
}

export const adminDashboardService = {
  getDashboard: async (): Promise<AdminDashboardData> => {
    const res = await axiosInstance.get("/api/admin/dashboard");
    if (!res.data) throw new Error("Erreur lors du chargement du dashboard admin");
    return res.data;
  },
};
