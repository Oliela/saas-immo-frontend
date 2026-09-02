import api from "@/lib/axios"
import type { AgencyApprovalStatus } from "@/lib/admin-types"

interface AgencyApprovalResponse {
  message: string
  agency: {
    id: number
    approval_status: AgencyApprovalStatus
    rejection_reason: string | null
    reviewed_at: string | null
    reviewed_by: number | null
    is_active: boolean
  }
}

interface AgencyActivationResponse {
  message: string
  agency: {
    id: number
    name: string
    approval_status: AgencyApprovalStatus
    is_active: boolean
  }
}

interface AgencyCertificationResponse {
  message: string
  agency: {
    id: number
    name: string
    information_certified: boolean
  }
}

export async function approveAgency(
  agencyId: string
): Promise<AgencyApprovalResponse> {
  const response = await api.patch<AgencyApprovalResponse>(
    `/api/admin/agencies/${agencyId}/approve`
  )

  return response.data
}

export async function rejectAgency(
  agencyId: string,
  reason: string
): Promise<AgencyApprovalResponse> {
  const response = await api.patch<AgencyApprovalResponse>(
    `/api/admin/agencies/${agencyId}/reject`,
    { reason }
  )

  return response.data
}

export async function suspendAgency(
  agencyId: string,
  reason?: string
): Promise<AgencyActivationResponse> {
  const response = await api.patch<AgencyActivationResponse>(
    `/api/admin/agencies/${agencyId}/suspend`,
    {
      reason: reason?.trim() || null,
    }
  )

  return response.data
}

export async function reactivateAgency(
  agencyId: string
): Promise<AgencyActivationResponse> {
  const response = await api.patch<AgencyActivationResponse>(
    `/api/admin/agencies/${agencyId}/reactivate`
  )

  return response.data
}

export async function certifyAgency(
  agencyId: string
): Promise<AgencyCertificationResponse> {
  const response = await api.patch<AgencyCertificationResponse>(
    `/api/admin/agencies/${agencyId}/certify`
  )

  return response.data
}

export async function uncertifyAgency(
  agencyId: string
): Promise<AgencyCertificationResponse> {
  const response = await api.patch<AgencyCertificationResponse>(
    `/api/admin/agencies/${agencyId}/uncertify`
  )

  return response.data
}
