// ============================================================
// HOOK – useTasks
// Récupère les tâches depuis le serveur via l'instance Axios
// et expose les actions locales (marquer complétée, supprimer).
// ============================================================

import { useState, useEffect, useCallback } from "react"
import type { AxiosError } from "axios"
import axiosInstance from "@/lib/axios" // ← adaptez ce chemin à votre projet
import type { ServerTask, TasksApiResponse } from "@/types/task.types"

// Durée par défaut en millisecondes (24 heures)
const DEFAULT_DEADLINE_MS = 24 * 60 * 60 * 1000

type UseTasksOptions = {
  /** Endpoint relatif. Ex : "/tasks" ou "/agency/tasks" */
  agency_id: Number
}

type UseTasksReturn = {
  tasks: ServerTask[]
  isLoading: boolean
  error: string | null
  markDone: (id: number) => void
  deleteTask: (id: number) => void
  refresh: () => void
}

export function useTasks({ agency_id }: UseTasksOptions): UseTasksReturn {
  const [tasks, setTasks] = useState<ServerTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await axiosInstance.get<TasksApiResponse>("/api/tasks", { params: { agency_id: agency_id } })

      if (!data.success) throw new Error(data.message)

      setTasks(data.tasks)
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>
      const message =
        axiosError.response?.data?.message ??
        axiosError.message ??
        "Erreur inconnue"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [agency_id])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const markDone = useCallback(async (id: number) => {
    // Mise à jour optimiste
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: "done", completed_at: new Date().toISOString() }
          : t
      )
    )
    try {
      await axiosInstance.patch(`/api/tasks/${id}/done`)
    } catch {
      // Rollback en cas d'erreur serveur
      setTasks((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, status: "pending", completed_at: null } : t
        )
      )
    }
  }, [agency_id])

  const deleteTask = useCallback(async (id: number) => {
    // Mise à jour optimiste
    setTasks((prev) => prev.filter((t) => t.id !== id))
    try {
      await axiosInstance.delete(`/api/agency/${agency_id}/tasks/${id}`)
    } catch {
      // Rollback : re-fetch pour restaurer l'état
      fetchTasks()
    }
  }, [agency_id, fetchTasks])

  return {
    tasks,
    isLoading,
    error,
    markDone,
    deleteTask,
    refresh: fetchTasks,
  }
}