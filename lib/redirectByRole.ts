import type { AccountStatus, AccountType } from "@/types/auth";

export function getRedirectPath(
  accountType: AccountType,
  accountStatus: AccountStatus = "active",
): string {
  if (accountType === "agency_user" || accountType === "agent") {
    switch (accountStatus) {
      case "pending":
        return "/account-pending";

      case "rejected":
      case "agency_not_found":
        return "/account-status";

      case "suspended":
        return "/account-suspended";

      case "active":
        return "/dashboard";

      case "subscription_required":
      case "subscription_not_started":
      case "subscription_expired":
        return "/account-subscription-required";

      default:
        return "/login";
    }
  }

  switch (accountType) {
    case "client":
      return "/portal";

    case "super_admin":
      return "/admin";

    default:
      return "/";
  }
}
