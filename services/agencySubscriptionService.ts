import api from "@/lib/axios";
import type {
  AgencySubscriptionHistoryResponse,
  SubscriptionPlan,
} from "@/types/subscription";

export async function getAgencySubscriptions(): Promise<AgencySubscriptionHistoryResponse> {
  const response = await api.get<AgencySubscriptionHistoryResponse>(
    "/api/agency/subscriptions",
  );

  return response.data;
}

export async function requestSubscriptionUpgrade(
  requestedPlan: SubscriptionPlan,
): Promise<{
  message: string;
  request: {
    id: number;
    current_plan: SubscriptionPlan;
    requested_plan: SubscriptionPlan;
    status: "pending";
  };
}> {
  const response = await api.post("/api/agency/subscription-upgrade-request", {
    requested_plan: requestedPlan,
  });

  return response.data;
}
