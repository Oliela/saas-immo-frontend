"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

// ─── Types ──────────────────────────────────────────────────────────────────

interface ChannelSettings {
  visits:    boolean
  documents: boolean
  contracts: boolean
  messages:  boolean
  invoices:  boolean
  marketing: boolean
}

interface Props {
  initialEmail?: Partial<ChannelSettings>
  initialPush?:  Partial<ChannelSettings>
}

const defaults: ChannelSettings = {
  visits:    true,
  documents: true,
  contracts: true,
  messages:  true,
  invoices:  true,
  marketing: false,
}

const SETTINGS = [
  {
    key: "visits" as keyof ChannelSettings,
    label: "Mises à jour de visite",
    emailDesc: "Recevez des notifications sur les confirmations et rappels de visite.",
    pushDesc:  "Confirmations et rappels de visite en temps réel.",
  },
  {
    key: "documents" as keyof ChannelSettings,
    label: "Demandes de Documents",
    emailDesc: "Recevez une notification quand des documents sont requis.",
    pushDesc:  "Alertes urgentes de documents requis.",
  },
  {
    key: "contracts" as keyof ChannelSettings,
    label: "Mises à jour de Contrat",
    emailDesc: "Recevez des notifications sur les changements de statut du contrat.",
    pushDesc:  "Changements importants du statut du contrat.",
  },
  {
    key: "messages" as keyof ChannelSettings,
    label: "Messages",
    emailDesc: "Recevez une notification quand vous recevez de nouveaux messages.",
    pushDesc:  "Notifications de messages instantanés.",
  },
  {
    key: "invoices" as keyof ChannelSettings,
    label: "Alertes de Facture",
    emailDesc: "Recevez des notifications sur les nouvelles factures et rappels de paiement.",
    pushDesc:  null,  // ← pas de push pour invoices
  },
  {
    key: "marketing" as keyof ChannelSettings,
    label: "Marketing et Promotions",
    emailDesc: "Recevez des actualités, des mises à jour et des offres spéciales.",
    pushDesc:  null,  // ← pas de push pour marketing
  },
]

// ─── Component ──────────────────────────────────────────────────────────────

export function NotificationsSettings({ initialEmail, initialPush }: Props) {
  const [email, setEmail] = useState<ChannelSettings>({ ...defaults, ...initialEmail })
  const [push, setPush]   = useState<ChannelSettings>({ ...defaults, ...initialPush })

  const handleSave = () => {
    // TODO: PUT /api/notification-settings
    // console.log("Saving settings:", { email, push })
    toast.success("Préférences enregistrées.")
  }

  return (
    <div className="space-y-6">

      {/* ── Email ── */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications par Email</CardTitle>
          <CardDescription>Choisissez les notifications que vous recevez par email.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {SETTINGS.map((setting, index) => (
            <div key={setting.key}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <Label htmlFor={`email-${setting.key}`}>{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">{setting.emailDesc}</p>
                </div>
                <Switch
                  id={`email-${setting.key}`}
                  checked={email[setting.key]}
                  onCheckedChange={(v) => setEmail((prev) => ({ ...prev, [setting.key]: v }))}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Push ── */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications Push</CardTitle>
          <CardDescription>Choisissez les notifications que vous recevez sur votre appareil.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {SETTINGS.filter((s) => s.pushDesc !== null).map((setting, index) => (
            <div key={setting.key}>
              {index > 0 && <Separator className="mb-4" />}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 pr-4">
                  <Label htmlFor={`push-${setting.key}`}>{setting.label}</Label>
                  <p className="text-sm text-muted-foreground">{setting.pushDesc}</p>
                </div>
                <Switch
                  id={`push-${setting.key}`}
                  checked={push[setting.key]}
                  onCheckedChange={(v) => setPush((prev) => ({ ...prev, [setting.key]: v }))}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Enregistrer les préférences</Button>
      </div>
    </div>
  )
}