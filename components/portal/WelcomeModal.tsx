// components/portal/WelcomeModal.tsx
"use client"

import { CheckCircle, Clock, Circle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const STEPS = [
  { label: "Créer votre profil",        desc: "Informations personnelles,coordonnées, préférences immobilières" },
  { label: "Déposer vos justificatifs(documents)", desc: "Pièce d'identité, justificatifs de revenus" },
  { label: "Sélectionner un bien",      desc: "Mettre en favoris d'un bien" },
  { label: "Planifier une visite",       desc: "Programmation d'une visite d'un bien sélectionné" },
  { label: "Signer et finaliser",       desc: "Signature du contrat" },
]

interface WelcomeModalProps {
  open: boolean
  onClose: () => void
  loginCount: number
  userName?: string
}

export function WelcomeModal({ open, onClose, loginCount, userName }: WelcomeModalProps) {
  const isLast = loginCount === 5

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-3xl mb-1">👋</div>
          <DialogTitle className="text-lg">
            {isLast
              ? "Dernière fois !"
              : `Bienvenue${userName ? `, ${userName}` : ""} !`}
          </DialogTitle>
          <DialogDescription>
            {isLast
              ? "Ce récapitulatif ne réapparaîtra plus après cette connexion."
              : "Voici les étapes pour finaliser votre dossier de location ou d'achat."}
          </DialogDescription>
        </DialogHeader>

        {/* Étapes */}
        <div className="space-y-3 py-2">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium mt-0.5">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-medium leading-tight">{step.label}</p>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Rappel {loginCount} sur 5</p>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <div
                  key={n}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    n <= loginCount ? "bg-primary" : "bg-border"
                  }`}
                />
              ))}
            </div>
          </div>
          <Button onClick={onClose} size="sm">
            {isLast ? "Fermer" : "Commencer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}