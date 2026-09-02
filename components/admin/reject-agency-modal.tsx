"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface RejectAgencyModalProps {
  open: boolean
  agencyName: string
  loading: boolean
  onCancel: () => void
  onConfirm: (reason: string) => Promise<void>
}

export function RejectAgencyModal({
  open,
  agencyName,
  loading,
  onCancel,
  onConfirm,
}: RejectAgencyModalProps) {
  const [reason, setReason] = useState("")

  const normalizedReason = reason.trim()

  const handleConfirm = async () => {
    if (!normalizedReason) {
      return
    }

    await onConfirm(normalizedReason)
  }

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onCancel()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refuser la demande</DialogTitle>

          <DialogDescription>
            Indiquez pourquoi la demande de l’agence {agencyName} est refusée.
            Ce motif sera communiqué à l’agence.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="rejection-reason">Motif du refus</Label>

          <Textarea
            id="rejection-reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Exemple : le numéro de licence n’a pas pu être vérifié."
            maxLength={1000}
            rows={5}
            disabled={loading}
          />

          <p className="text-right text-xs text-muted-foreground">
            {reason.length}/1000
          </p>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading || !normalizedReason}
          >
            {loading ? "Refus en cours..." : "Confirmer le refus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}