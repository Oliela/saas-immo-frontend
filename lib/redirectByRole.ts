// lib/redirectByRole.ts
export function getRedirectPath(accountType: string) {
  switch (accountType) {
    case "client":
      return "/portal";
    case "agent_user":
      return "/dashboard";
    case "super_admin":
      return "/admin";
    default:
      return "/";
  }
}