// ============================================================
// TYPES – Tâches Agence
// ============================================================

export type TaskStatus = "pending" | "done"

export type TaskType =
  | "contract"
  | "client"
  | "property"
  | "invoice"
  | "visit"
  | string

// Créateur de la tâche (agent assigné – disponible prochaine version)
export type TaskCreator = {
  id: number
  nom: string
  prenom: string
  phone: string
  email: string
  account_type: string
  is_active: number
  created_at: string
  updated_at: string
}

// Données liées à la tâche (contrat, bien, client…)
export type TaskableData = Record<string, unknown>

// Tâche telle que retournée par le serveur
export type ServerTask = {
  id: number
  agency_id: number
  created_by: number
  title: string
  description: string
  type: TaskType
  taskable_type: string | null
  taskable_id: number | null
  status: TaskStatus
  completed_at: string | null
  created_at: string
  updated_at: string
  creator: TaskCreator
  taskable: TaskableData | null
}

// Réponse API
export type TasksApiResponse = {
  success: boolean
  message: string
  tasks: ServerTask[]
}

// Entité client simplifiée (récupérée séparément si client_id dispo)
export type TaskClient = {
  id: number
  nom: string
  prenom: string
  email: string
  phone: string
}

// Image d'un bien
export type BienImage = {
  id: number
  url: string
  alt: string | null
}

// Entité bien simplifiée (récupérée séparément si bien_id dispo)
export type TaskProperty = {
  id: number
  title: string
  address: string
  images: BienImage[]
}