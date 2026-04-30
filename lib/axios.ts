import axios from "axios";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

// 🗑️ Supprimez clearAuthCookies() entièrement

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
  // Le middleware va intercepter ce paramètre et effacer le cookie serveur
  window.location.href = "/login?expired=1";
}

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearSessionAndRedirect();
    }
    return Promise.reject(error);
  },
);

// 🗑️ Remplacez tout le bloc interceptors.response par celui-ci
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      clearSessionAndRedirect();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
