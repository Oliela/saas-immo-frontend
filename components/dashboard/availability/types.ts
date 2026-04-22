export type SlotStatus = "available" | "unavailable" | "reserved"

export interface AvailabilitySlot {
  id: number
  bien_id: number | null
  propertyTitle: string
  visit_date: string
  start_time: string
  end_time: string
  agent_id: number | null
  agency_id: number
  agentName: string
  status: SlotStatus
}

export interface SlotFormData {
  bien_id: string
  visit_date: string
  start_time: string
  end_time: string
  agent_id: string
  agency_id: string
  status: SlotStatus
}

export interface AdaptedAgent {
  id: string
  name: string
}

export interface AdaptedProperty {
  id: string
  title: string
}