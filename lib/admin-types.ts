// Admin Types for SUPERADMIN Section

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "superadmin" | "admin";
  avatar?: string;
  createdAt: string;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  status: "active" | "inactive" | "pending";
  affiliatedAgencyId?: string;
  affiliatedAgencyName?: string;
  contractsCount: number;
  totalBilled: number;
  totalPaid: number;
  createdAt: string;
  updatedAt: string;
}

export type AgencyApprovalStatus = "pending" | "approved" | "rejected";

export interface AgencyReviewer {
  id: string;
  name: string;
}

export interface Agency {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  logo?: string;
  description?: string;
  website?: string;
  status: "active" | "inactive" | "suspended";
  isCertified: boolean;
  certifiedAt?: string;
  propertiesCount: number;
  ownersCount: number;
  agentsCount: number;
  contractsCount: number;
  totalRevenue: number;
  subscriptionId?: string;
  subscriptionPlan?: string;
  subscriptionStatus?: "active" | "expired" | "cancelled";
  createdAt: string;
  updatedAt: string;
  approvalStatus: AgencyApprovalStatus;
  rejectionReason: string | null;
  reviewedAt: string | null;
  reviewedBy: AgencyReviewer | null;
}

export interface Owner {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  status: "active" | "inactive";
  linkedAgencyId: string;
  linkedAgencyName: string;
  propertiesCount: number;
  contractsCount: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  type: "apartment" | "house" | "villa" | "land" | "commercial";
  status: "available" | "rented" | "sold" | "pending";
  price: number;
  surface: number;
  rooms: number;
  agencyId: string;
  agencyName: string;
  ownerId: string;
  ownerName: string;
  images: string[];
  createdAt: string;
}

export interface Contract {
  id: string;
  reference: string;
  type: "rental" | "sale" | "management";
  status: "draft" | "pending" | "signed" | "cancelled" | "expired";
  clientId: string;
  clientName: string;
  agencyId: string;
  agencyName: string;
  ownerId: string;
  ownerName: string;
  propertyId: string;
  propertyTitle: string;
  amount: number;
  startDate: string;
  endDate?: string;
  signatureDate?: string;
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  agencyId: string;
  agencyName: string;
  contractId?: string;
  contractReference?: string;
  amount: number;
  paidAmount: number;
  outstanding: number;
  status: "paid" | "unpaid" | "partially_paid" | "overdue";
  dueDate: string;
  paidAt?: string;
  items: InvoiceItem[];
  pdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  amount: number;
  method: "card" | "transfer" | "mobile_money" | "cash" | "check";
  reference: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  agencyId: string;
  agencyName: string;
  status: "completed" | "pending" | "failed" | "refunded";
  paidAt: string;
  createdAt: string;
}

export interface Subscription {
  id: string;
  agencyId: string;
  agencyName: string;
  plan: "starter" | "professional" | "enterprise";
  planName: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  status: "active" | "expired" | "cancelled" | "suspended";
  features: string[];
  limits: {
    properties: number;
    agents: number;
    storage: number;
  };
  usage: {
    properties: number;
    agents: number;
    storage: number;
  };
  startDate: string;
  expiryDate: string;
  autoRenew: boolean;
  paymentHistory: SubscriptionPayment[];
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPayment {
  id: string;
  amount: number;
  method: string;
  status: "completed" | "pending" | "failed";
  paidAt: string;
}

export interface Plan {
  id: string;
  name: string;
  slug: "starter" | "professional" | "enterprise";
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  limits: {
    properties: number;
    agents: number;
    storage: number;
  };
  isActive: boolean;
  createdAt: string;
}

export interface Agent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "agent" | "manager" | "director";
  agencyId: string;
  agencyName: string;
  status: "active" | "inactive" | "suspended";
  createdAt: string;
}

export interface ClientDocument {
  id: string;
  clientId: string;
  type:
    | "cni"
    | "passeport"
    | "justificatif_domicile"
    | "bulletin_salaire"
    | "contrat_travail"
    | "autre";
  typeLabel: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  addedAt: string;
}

export interface WishlistItem {
  id: string;
  clientId: string;
  propertyId: string;
  propertyTitle: string;
  agencyId: string;
  agencyName: string;
  city: string;
  price: number;
  propertyStatus: "available" | "rented" | "sold" | "pending";
  addedAt: string;
}

export interface Activity {
  id: string;
  type:
    | "contract_signed"
    | "payment_received"
    | "agency_certified"
    | "client_registered"
    | "subscription_renewed"
    | "invoice_paid";
  title: string;
  description: string;
  entityId: string;
  entityType:
    | "contract"
    | "payment"
    | "agency"
    | "client"
    | "subscription"
    | "invoice";
  agencyId?: string;
  agencyName?: string;
  amount?: number;
  createdAt: string;
}

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

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}
