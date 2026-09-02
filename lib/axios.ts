import axios from "axios";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function isLoggedIn(): boolean {
  return document.cookie.includes("account_type=");
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosInstance.defaults.xsrfCookieName = "XSRF-TOKEN";
axiosInstance.defaults.xsrfHeaderName = "X-XSRF-TOKEN";

axiosInstance.interceptors.request.use((config) => {
  const token = getCookie("XSRF-TOKEN");
  if (token) {
    config.headers["X-XSRF-TOKEN"] = token;
  }
  return config;
});

let isRedirecting = false;

function clearSessionAndRedirect() {
  if (isRedirecting) return;
  isRedirecting = true;
  window.location.href = "/login?expired=1";
}

const agencyBlockingCodes = new Set([
  "agency_pending",
  "agency_rejected",
  "agency_suspended",
  "agency_not_found",
]);

function redirectBlockedAgency(redirectPath: string) {
  if (isRedirecting) return;

  if (window.location.pathname === redirectPath) {
    return;
  }

  isRedirecting = true;
  window.location.assign(redirectPath);
}

// Un seul intercepteur response
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && isLoggedIn()) {
      clearSessionAndRedirect();
      return Promise.reject(error);
    }

    const code = error.response?.data?.code;
    const redirectPath = error.response?.data?.redirect;

    if (
      error.response?.status === 403 &&
      agencyBlockingCodes.has(code) &&
      typeof redirectPath === "string"
    ) {
      redirectBlockedAgency(redirectPath);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
