"use client"

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { ReactNode } from "react"

export default function UploadDocumentDialog({
  children,
}: {
  children: ReactNode
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <p>Formulaire upload (mock)</p>
      </DialogContent>
    </Dialog>
  )
}