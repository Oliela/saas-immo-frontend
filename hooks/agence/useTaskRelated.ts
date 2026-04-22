// ============================================================
// HOOK – useTaskRelated
// Récupère les données client et bien associés à une tâche
// via l'instance Axios, UNIQUEMENT si les IDs sont disponibles
// dans le champ `taskable`.
// ============================================================

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios"; // ← adaptez ce chemin à votre projet
import type { ServerTask, TaskClient, TaskProperty } from "@/types/task.types";

type UseTaskRelatedReturn = {
  client: TaskClient | null;
  property: TaskProperty | null;
  isLoadingClient: boolean;
  isLoadingProperty: boolean;
};

/**
 * Extrait client_id et bien_id depuis le taskable.
 */
function extractIds(task: ServerTask): {
  clientId: number | null;
  bienId: number | null;
} {
  const t = task.taskable as Record<string, unknown> | null;
  if (!t) return { clientId: null, bienId: null };

  const clientId = typeof t["client_id"] === "number" ? t["client_id"] : null;
  const bienId = typeof t["bien_id"] === "number" ? t["bien_id"] : null;

  return { clientId, bienId };
}

export function useTaskRelated(task: ServerTask | null): UseTaskRelatedReturn {
  const [client, setClient] = useState<TaskClient | null>(null);
  const [property, setProperty] = useState<TaskProperty | null>(null);
  const [isLoadingClient, setIsLoadingClient] = useState(false);
  const [isLoadingProperty, setIsLoadingProperty] = useState(false);

  useEffect(() => {
    if (!task) {
      setClient(null);
      setProperty(null);
      return;
    }

    const { clientId, bienId } = extractIds(task);

    // ── Client ──────────────────────────────────────────────
    if (clientId) {
      setIsLoadingClient(true);
      axiosInstance
        .get(`/api/clients/${clientId}`)
        .then(({ data }) => {
          const c = data?.profile ?? data;
          setClient({
            id: c.id,
            nom: c.nom,
            prenom: c.prenom,
            email: c.email,
            phone: c.phone,
          });
        })
        .catch(() => setClient(null))
        .finally(() => setIsLoadingClient(false));
    } else {
      setClient(null);
    }

    // ── Bien ─────────────────────────────────────────────────
    if (bienId) {
      setIsLoadingProperty(true);
      axiosInstance
        .get(`/api/biens/${bienId}`)
        .then(({ data }) => {
          const b = data?.bien ?? data;
          setProperty({
            id: b.id,
            title: b.title ?? b.nom ?? `Bien #${b.id}`,
            address: [b.address ?? b.adresse, b.neighborhood, b.city]
              .filter(Boolean)
              .join(", "),
            images: Array.isArray(b.images) ? b.images : [],
          });
        })
        .catch(() => setProperty(null))
        .finally(() => setIsLoadingProperty(false));
    } else {
      setProperty(null);
    }
  }, [task?.id]); // Re-fetch uniquement si la tâche sélectionnée change

  return { client, property, isLoadingClient, isLoadingProperty };
}
