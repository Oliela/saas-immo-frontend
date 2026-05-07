"use client"

// hooks/usePdfDownload.ts

import { useState } from "react"
import { toast } from "sonner"

// L'URL de base de ton API Laravel
// En dev  : http://localhost:8000
// En prod : https://ton-api.com
// À adapter selon ta config (peut venir de NEXT_PUBLIC_API_URL)
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000"

export function usePdfDownload() {
  const [loading, setLoading] = useState<Record<string | number, boolean>>({})

  /**
   * Ouvre le PDF dans un nouvel onglet.
   * Le navigateur affiche le PDF avec son lecteur natif.
   * L'utilisateur peut le télécharger depuis le lecteur (icône ⬇).
   *
   * @param path  Chemin API sans base, ex: "/api/contracts/20/pdf"
   * @param id    Identifiant pour l'état du bouton
   */
  const open = (path: string, id: string | number) => {
    setLoading((prev) => ({ ...prev, [id]: true }))
    try {
      const url = `${API_BASE}${path}?preview=1`
      window.open(url, "_blank", "noopener,noreferrer")
    } catch {
      toast.error("Impossible d'ouvrir le PDF")
    } finally {
      setTimeout(() => setLoading((prev) => ({ ...prev, [id]: false })), 800)
    }
  }

  const isLoading = (id: string | number) => loading[id] ?? false

  return { open, isLoading }
}