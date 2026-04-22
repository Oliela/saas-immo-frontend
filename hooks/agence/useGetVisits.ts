import { useState, useEffect } from "react"
import axiosInstance from "@/lib/axios"

export interface ReservationAgent {
  id: number
  nom: string
  prenom: string
  phone: string
  email: string
}

export interface ReservationBien {
  id: number
  title: string
  propertyType: string
  listingType: string
  price: string
}

export interface ReservationSchedule {
  id: number
  visit_date: string
  start_time: string
  end_time: string
  status: string
  agent_id: number
  bien_id: number
  agency_id: number
  agent: ReservationAgent
  bien: ReservationBien
  agency: { id: number; name: string }
}

export interface Reservation {
  client: any
  id: number
  client_id: number
  visit_schedule_id: number
  status: "confirmed" | "pending" | "cancelled" | "completed" | string
  done: boolean
  created_at: string
  updated_at: string
  visit_schedule: ReservationSchedule
}

export interface VisitStatistics {
  today_visits: Reservation[]
  today_visits_count: number
  weekly_visits: number
  average_duration: number
  confirmation_rate: number
}

interface UseGetVisitsOptions {
  agencyId?: number
}

export function useGetVisits(options?: UseGetVisitsOptions) {
  const [visits, setVisits] = useState<Reservation[]>([])
  const [statistics, setStatistics] = useState<VisitStatistics | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchVisits = async () => {
    if (!options?.agencyId) return
    setLoading(true)
    try {
      const res = await axiosInstance.get(
        `/api/visit-reservations/agency/${options.agencyId}`
      )
      setVisits(res.data.visits ?? [])
      setStatistics(res.data.statistics ?? null)
    } catch {
      setVisits([])
      setStatistics(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisits()
  }, [options?.agencyId])

  return { visits, statistics, loading, fetchVisits }
}