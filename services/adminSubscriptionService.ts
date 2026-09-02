import api from "@/lib/axios";
import type {
  AdminSubscription,
  SubscriptionInput,
  AdminUpgradeRequestResponse,
  UpgradeRequestStatus,
} from "@/types/subscription";

export async function getSubscriptions() {
  const response = await api.get<{
    subscriptions: AdminSubscription[];
    stats: { active: number; expired: number; revenue: number };
  }>("/api/admin/subscriptions");
  return response.data;
}

export async function getSubscription(id: string) {
  const response = await api.get<{ subscription: AdminSubscription }>(
    `/api/admin/subscriptions/${id}`,
  );
  return response.data.subscription;
}

export async function saveSubscription(input: SubscriptionInput) {
  const response = await api.post<{ subscription: AdminSubscription }>(
    "/api/admin/subscriptions",
    input,
  );
  return response.data.subscription;
}

export async function getUpgradeRequests(
  status?: UpgradeRequestStatus,
): Promise<AdminUpgradeRequestResponse> {
  const response = await api.get<AdminUpgradeRequestResponse>(
    "/api/admin/subscription-upgrade-requests",
    {
      params: status ? { status } : undefined,
    },
  );

  return response.data;
}

export async function rejectUpgradeRequest(
  requestId: number,
  reason: string,
): Promise<{
  message: string;
  request: {
    id: number;
    status: "rejected";
    rejection_reason: string;
    processed_at: string;
  };
}> {
  const response = await api.patch(
    `/api/admin/subscription-upgrade-requests/${requestId}/reject`,
    {
      reason,
    },
  );

  return response.data;
}
