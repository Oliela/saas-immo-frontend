"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/lib/axios"

export function useClient() {
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      setLoading(false)
      return
    }

    axiosInstance
      .get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setClient(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return { client, loading }
}
