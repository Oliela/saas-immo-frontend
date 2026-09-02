import axiosInstance from "@/lib/axios"
import { AxiosError } from "axios"

export type RecurringInvoiceStatus =
  | "active"
  | "paused"
  | "stopped"

export interface RecurringInvoice {
  id: number
  agency_id: number
  template_invoice_id: number
  created_by: number
  frequency: "monthly"
  day_of_month: number
  send_time: string
  due_days: number
  starts_on: string
  ends_on: string | null
  next_run_on: string
  last_run_at: string | null
  status: RecurringInvoiceStatus
  last_error: string | null
  created_at: string
  updated_at: string
}

export interface RecurringInvoiceFormData {
  day_of_month: number
  send_time: string
  starts_on: string
  ends_on: string | null
}

interface RecurringInvoiceResponse {
  message?: string
  recurring_invoice: RecurringInvoice | null
}

/**
 * Active la récurrence mensuelle d’une facture.
 */
export async function createRecurringInvoice(
  factureId: number,
  payload: RecurringInvoiceFormData,
): Promise<RecurringInvoice> {
  const { data } =
    await axiosInstance.post<RecurringInvoiceResponse>(
      `/api/factures/${factureId}/recurrence`,
      payload,
    )

  if (!data.recurring_invoice) {
    throw new Error(
      "La programmation récurrente n’a pas été retournée.",
    )
  }

  return data.recurring_invoice
}

/**
 * Récupère la récurrence d’une facture.
 *
 * Retourne null lorsque la facture n’est pas encore récurrente.
 */
export async function getRecurringInvoice(
  factureId: number,
): Promise<RecurringInvoice | null> {
  try {
    const { data } =
      await axiosInstance.get<RecurringInvoiceResponse>(
        `/api/factures/${factureId}/recurrence`,
      )

    return data.recurring_invoice
  } catch (error) {
    if ((error as AxiosError).response?.status === 404) {
      return null
    }

    throw error
  }
}

/**
 * Modifie les paramètres de programmation.
 */
export async function updateRecurringInvoice(
  recurringInvoiceId: number,
  payload: Partial<RecurringInvoiceFormData>,
): Promise<RecurringInvoice> {
  const { data } =
    await axiosInstance.patch<RecurringInvoiceResponse>(
      `/api/recurring-invoices/${recurringInvoiceId}`,
      payload,
    )

  if (!data.recurring_invoice) {
    throw new Error(
      "La programmation récurrente n’a pas été retournée.",
    )
  }

  return data.recurring_invoice
}

async function changeRecurringInvoiceStatus(
  recurringInvoiceId: number,
  action: "pause" | "resume" | "stop",
): Promise<RecurringInvoice> {
  const { data } =
    await axiosInstance.patch<RecurringInvoiceResponse>(
      `/api/recurring-invoices/${recurringInvoiceId}/${action}`,
    )

  if (!data.recurring_invoice) {
    throw new Error(
      "La programmation récurrente n’a pas été retournée.",
    )
  }

  return data.recurring_invoice
}

export function pauseRecurringInvoice(
  recurringInvoiceId: number,
): Promise<RecurringInvoice> {
  return changeRecurringInvoiceStatus(
    recurringInvoiceId,
    "pause",
  )
}

export function resumeRecurringInvoice(
  recurringInvoiceId: number,
): Promise<RecurringInvoice> {
  return changeRecurringInvoiceStatus(
    recurringInvoiceId,
    "resume",
  )
}

export function stopRecurringInvoice(
  recurringInvoiceId: number,
): Promise<RecurringInvoice> {
  return changeRecurringInvoiceStatus(
    recurringInvoiceId,
    "stop",
  )
}