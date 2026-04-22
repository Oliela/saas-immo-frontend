"use client"

import { useState, useMemo } from "react"
import type { AvailabilitySlot, SlotFormData, AdaptedAgent, AdaptedProperty } from "./types"
import { AvailabilityHeader } from "./AvailabilityHeader"
import { AvailabilityFilters } from "./AvailabilityFilters"
import { WeeklyCalendar } from "./WeeklyCalendar"
import { AvailabilityTable } from "./AvailabilityTable"
import { AvailabilityStats } from "./AvailabilityStats"
import axiosInstance from "@/lib/axios"

// ─── Adapters ───────────────────────────────────────────────────────────────

function adaptCreneau(c: any): AvailabilitySlot {
  return {
    id:            c.id,
    bien_id:       c.bien_id ?? null,
    propertyTitle: c.bien?.title ?? (c.bien_id ? `Bien #${c.bien_id}` : "Toute l'agence"),
    visit_date:    c.visit_date,
    start_time:    c.start_time?.slice(0, 5) ?? "",
    end_time:      c.end_time?.slice(0, 5) ?? "",
    agent_id:      c.agent_id ?? null,
    agency_id:     c.agency_id,
    agentName:     c.agent ? `${c.agent.prenom} ${c.agent.nom}` : (c.agent_id ? `Agent #${c.agent_id}` : "—"),
    status:        c.status ?? "available",
  }
}

function adaptAgent(a: any): AdaptedAgent {
  return { id: String(a.id), name: `${a.prenom} ${a.nom}` }
}

function adaptBien(b: any): AdaptedProperty {
  return { id: String(b.id), title: b.title ?? `Bien #${b.id}` }
}

// ─── Props ──────────────────────────────────────────────────────────────────

interface Props {
  agents: any[]
  properties: any[]
  AvailabilitySlot: any[]
  agencyId: number
}

// ─── API calls ──────────────────────────────────────────────────────────────

async function apiCreateCreneau(data: SlotFormData): Promise<AvailabilitySlot> {
  const res = await axiosInstance.post("/api/visit-schedules", {
    agency_id:  Number(data.agency_id),
    bien_id:    data.bien_id ? Number(data.bien_id) : null,
    agent_id:   data.agent_id ? Number(data.agent_id) : null,
    visit_date: data.visit_date,
    start_time: data.start_time,
    end_time:   data.end_time,
    status:     data.status,
  })
  return adaptCreneau(res.data?.data ?? res.data)
}

async function apiUpdateCreneau(id: number, data: SlotFormData): Promise<AvailabilitySlot> {
  const res = await axiosInstance.put(`/api/visit-schedules/${id}`, {
    agency_id:  Number(data.agency_id),
    bien_id:    data.bien_id ? Number(data.bien_id) : null,
    agent_id:   data.agent_id ? Number(data.agent_id) : null,
    visit_date: data.visit_date,
    start_time: data.start_time,
    end_time:   data.end_time,
    status:     data.status,
  })
  return adaptCreneau(res.data?.data ?? res.data)
}

async function apiDeleteCreneau(id: number): Promise<void> {
  await axiosInstance.delete(`/api/visit-schedules/${id}`)
}

async function apiConfirmReservation(slot: AvailabilitySlot): Promise<void> {
  await axiosInstance.patch(`/api/reservations/${slot.id}/confirm`)
}

async function apiCancelReservation(slot: AvailabilitySlot): Promise<void> {
  await axiosInstance.patch(`/api/reservations/${slot.id}/cancel`)
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function AvailabilityPage({
  agents: rawAgents,
  properties: rawBiens,
  AvailabilitySlot: rawCreneaux,
  agencyId,
}: Props) {

  const agents     = useMemo(() => (rawAgents   ?? []).map(adaptAgent),   [rawAgents])
  const properties = useMemo(() => (rawBiens    ?? []).map(adaptBien),    [rawBiens])
  const initial    = useMemo(() => (rawCreneaux ?? []).map(adaptCreneau), [rawCreneaux])

  const emptyForm = (): SlotFormData => ({
    bien_id:    "",
    visit_date: "",
    start_time: "",
    end_time:   "",
    agent_id:   "",
    agency_id:  String(agencyId ?? ""),
    status:     "available",
  })

  // ── State ──────────────────────────────────────────────────────────────────
  const [slots, setSlots]               = useState<AvailabilitySlot[]>(initial)
  const [viewMode, setViewMode]         = useState<"table" | "calendar">("calendar")
  const [currentWeek, setCurrentWeek]   = useState(new Date())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filterProperty, setFilterProperty] = useState("all")
  const [filterAgent, setFilterAgent]       = useState("all")
  const [filterStatus, setFilterStatus]     = useState("all")
  const [formData, setFormData]         = useState<SlotFormData>(emptyForm())
  const [formErrors, setFormErrors]     = useState<Record<string, string>>({})
  const [overlapWarning, setOverlapWarning] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError]   = useState<string | null>(null)

  // ── Validation ─────────────────────────────────────────────────────────────

  const checkOverlap = (newSlot: SlotFormData) =>
    slots.find((slot) => {
      if (newSlot.bien_id && String(slot.bien_id) !== newSlot.bien_id) return false
      if (slot.visit_date !== newSlot.visit_date) return false
      return newSlot.start_time < slot.end_time && newSlot.end_time > slot.start_time
    })

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.visit_date) errors.visit_date = "La date est requise"
    if (!formData.start_time) errors.start_time = "L'heure de début est requise"
    if (!formData.end_time)   errors.end_time   = "L'heure de fin est requise"
    if (!formData.status)     errors.status     = "Le type de créneau est requis"
    if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time)
      errors.end_time = "L'heure de fin doit être après l'heure de début"

    setFormErrors(errors)

    if (formData.visit_date && formData.start_time && formData.end_time) {
      const overlap = checkOverlap(formData)
      setOverlapWarning(
        overlap ? `Ce créneau chevauche un existant (${overlap.start_time} - ${overlap.end_time})` : null
      )
    }

    return Object.keys(errors).length === 0
  }

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    if (!validateForm() || overlapWarning) return
    setIsSubmitting(true); setServerError(null)
    try {
      const created = await apiCreateCreneau(formData)
      setSlots((prev) => [...prev, created])
      resetForm()
      setIsDialogOpen(false)
      window.location.reload()
    } catch (err: any) {
      setServerError(
        err.response?.data?.message ??
        err.response?.data?.error ??
        err.message ??
        "Une erreur est survenue, veuillez réessayer."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData(emptyForm())
    setFormErrors({})
    setOverlapWarning(null)
    setServerError(null)
  }

  // ── Filtered slots ─────────────────────────────────────────────────────────

  const filteredSlots = slots.filter((slot) => {
    if (filterProperty !== "all" && String(slot.bien_id) !== filterProperty) return false
    if (filterAgent    !== "all" && String(slot.agent_id) !== filterAgent)   return false
    if (filterStatus   !== "all" && slot.status !== filterStatus)             return false
    return true
  })

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      <AvailabilityHeader
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        formData={formData}
        setFormData={setFormData}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        overlapWarning={overlapWarning}
        serverError={serverError}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onReset={resetForm}
        agents={agents}
        properties={properties}
      />

      <AvailabilityFilters
        filterProperty={filterProperty}
        setFilterProperty={setFilterProperty}
        filterAgent={filterAgent}
        setFilterAgent={setFilterAgent}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        viewMode={viewMode}
        setViewMode={setViewMode}
        agents={agents}
        properties={properties}
      />

      {viewMode === "calendar" ? (
        <WeeklyCalendar
          slots={filteredSlots}
          currentWeek={currentWeek}
          setCurrentWeek={setCurrentWeek}
          onEdit={async (id, data) => { await apiUpdateCreneau(id, data) }}
          onDelete={async (id) => { await apiDeleteCreneau(id) }}
          onConfirm={async (slot) => { await apiConfirmReservation(slot) }}
          onCancel={async (slot) => { await apiCancelReservation(slot) }}
        />
      ) : (
        <AvailabilityTable
          slots={filteredSlots}
          agents={agents}
          onEdit={async (id, data) => { await apiUpdateCreneau(id, data) }}
          onDelete={async (id) => { await apiDeleteCreneau(id) }}
          onConfirm={async (slot) => { await apiConfirmReservation(slot) }}
          onCancel={async (slot) => { await apiCancelReservation(slot) }}
        />
      )}

      <AvailabilityStats slots={filteredSlots} />
    </div>
  )
}