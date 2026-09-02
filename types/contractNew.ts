// types/contractNew.ts

export type ContractType = "rental" | "sale" 


export type UsageCase =
  | "habitation"
  | "professionnel"
  | "commercial"
  | "compromis"
  | "vente"

export interface CatalogClause {
  id: string
  clause_id?: number
  title: string
  content: string
  type: "rental" | "sale" | "both"
  usage_case?: UsageCase
  source: "system" | "agency"
  is_default?: boolean
  isDefault?: boolean  // pré-sélectionné automatiquement dans le contrat
  locked?: boolean     // non supprimable du contrat
}

export interface ContractClause {
  id: string
  clause_id?: number
  title: string
  content: string
  type: "rental" | "sale" | "both"
  usage_case?: UsageCase
  source: "system" | "agency" | "inline"
  isModified: boolean
  originalContent?: string
  locked?: boolean     // hérité de CatalogClause si isDefault
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  status: string
}


export interface Property {
  id: string
  title: string
  address: string
  price: number
  type: "rent" | "sale"
}

export interface FormData {
  agentId: string
  usageCase: UsageCase
  title: string
  city: string
  startDate: string
  duration: string
  rentAmount: string
  deposit: string
  cautionMonths: string
  commission: string
  paymentFrequency: string
}

export interface ApiClause {
  id: number
  agency_id: number
  title: string
  content: string
  type: "rental" | "sale" | "both"
  usage_case?: UsageCase | null
  is_default: number
  created_at: string
  updated_at: string
}

export interface ContractClausePayload {
  clause_id?: number
  title: string
  content: string
  source: "system" | "agency" | "inline"
}

export interface ContractPayload {
  client_id?:        number
  bien_id:           number
  agency_id:         number
  agent_id?:         number
  type:              ContractType
  usage_case:        UsageCase
  title:             string
  city:              string
  start_date:        string
  duration:          number
  amount:            number
  deposit:           number
  commission:        number
  cautionMonths:     number
  rentAtSignature:   number
  totalAtSignature:  number
  payment_frequency: string
  clauses:           ContractClausePayload[]
}