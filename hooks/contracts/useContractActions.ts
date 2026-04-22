"use client"

import { useState } from "react"
import axiosInstance from "@/lib/axios"

type ActionType = "send" | "cancel"

interface ActionState {
  loading: boolean
  error: string | null
}

export function useContractActions(onSuccess?: (id: number, action: ActionType) => void) {
  const [states, setStates] = useState<Record<number, ActionState>>({})

  const setLoading = (id: number, loading: boolean, error: string | null = null) =>
    setStates((prev) => ({ ...prev, [id]: { loading, error } }))

  const sendContract = async (id: number) => {
    setLoading(id, true)
    try {
      await axiosInstance.post(`/contracts/send/${id}`)
      setLoading(id, false)
      onSuccess?.(id, "send")
    } catch (err: any) {
      setLoading(id, false, err?.response?.data?.message ?? "Erreur lors de l'envoi")
    }
  }

  const cancelContract = async (id: number) => {
    setLoading(id, true)
    try {
      await axiosInstance.post(`/contracts/cancel/${id}`)
      setLoading(id, false)
      onSuccess?.(id, "cancel")
    } catch (err: any) {
      setLoading(id, false, err?.response?.data?.message ?? "Erreur lors de l'annulation")
    }
  }

  const getState = (id: number): ActionState =>
    states[id] ?? { loading: false, error: null }

  return { sendContract, cancelContract, getState }
}
