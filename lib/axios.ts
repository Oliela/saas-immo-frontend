import axios from "axios"

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? decodeURIComponent(match[2]) : null
}

function clearAuthCookies() {
  document.cookie = "account_type=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

axiosInstance.defaults.xsrfCookieName = "XSRF-TOKEN"
axiosInstance.defaults.xsrfHeaderName = "X-XSRF-TOKEN"

axiosInstance.interceptors.request.use((config) => {
  const token = getCookie("XSRF-TOKEN")
  if (token) {
    config.headers["X-XSRF-TOKEN"] = token
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isUserEndpoint = error.config?.url?.includes('/api/user')

    if (error.response?.status === 401 && typeof window !== 'undefined' && !isUserEndpoint) {
      clearAuthCookies()
      window.location.href = '/login'
    }

    // if (error.response?.status === 401) {
    //   console.log("401 détecté :", error.response);

    //   // option : vérifier message backend
    //   if (error.response.data?.error === "Unauthenticated") {
    //     clearAuthCookies();
    //     window.location.href = "/login";
    //   }
    // }
    return Promise.reject(error)
  }
)

export default axiosInstance