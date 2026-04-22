// hooks/useTutorialModal.ts
import { useState, useEffect } from "react"

export function useTutorialModal(loginCount: number) {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (loginCount > 0 && loginCount <= 5) {
      // Petit délai pour laisser la page se rendre avant d'ouvrir le modal
      const timer = setTimeout(() => setShowModal(true), 600)
      return () => clearTimeout(timer)
    }
  }, [loginCount])

  return {
    showModal,
    closeModal: () => setShowModal(false),
  }
}