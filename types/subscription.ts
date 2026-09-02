export type SubscriptionPlan = "starter" | "business" | "pro";
export type SubscriptionStatus =
  | "scheduled"
  | "active"
  | "expired"
  | "grace"
  | "replaced";

export type UpgradeRequestStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled";

export interface AdminUpgradeRequest {
  id: number;

  agency: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
  };

  current_subscription_id: number | null;
  current_plan: SubscriptionPlan;
  requested_plan: SubscriptionPlan;
  status: UpgradeRequestStatus;
  rejection_reason: string | null;
  requested_by: string | null;
  processed_by: string | null;
  processed_at: string | null;
  created_at: string | null;
}

export interface AdminUpgradeRequestResponse {
  stats: {
    pending: number;
    approved: number;
    rejected: number;
  };

  requests: AdminUpgradeRequest[];
}

export interface AdminSubscription {
  id: number;
  agencyId: number;
  agencyName: string;
  agencyEmail: string;
  agencyLogo?: string | null;
  plan: SubscriptionPlan;
  agentLimit: number;
  agentsUsed: number;
  startsAt: string;
  expiresAt: string;
  graceEndsAt: string;
  graceDays: number
  amountPaid: number;
  status: SubscriptionStatus;
  agencyActive: boolean;
  createdAt: string | null;
  createdBy?: string | null;
}

export interface SubscriptionInput {
  agency_id: number;
  plan: SubscriptionPlan;
  starts_at: string;
  expires_at: string;
  amount_paid: number;
  upgrade_request_id?: number;
}

export interface AgencySubscription {
  id: number;
  plan: SubscriptionPlan;
  agent_limit: number;
  starts_at: string;
  expires_at: string;
  amount_paid: number;
  status: SubscriptionStatus;
  grace_ends_at: string;
}

export interface AgencySubscriptionHistoryResponse {
  current_subscription_id: number | null;

  pending_upgrade_request: {
    id: number;
    current_plan: SubscriptionPlan;
    requested_plan: SubscriptionPlan;
    status: "pending";
    created_at: string | null;
  } | null;

  usage: {
    users: number;
    limit: number | null;
  };

  payment: {
    method: string | null;
    number: string | null;
    account_name: string | null;
  };

  subscriptions: AgencySubscription[];
}
