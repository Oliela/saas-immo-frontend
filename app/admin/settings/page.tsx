"use client"

import { useState } from "react"
import {
  Crown,
  Settings,
  Globe,
  Bell,
  Shield,
  Pencil,
  Plus,
  Trash2,
  Check,
  X,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockPlans } from "@/lib/admin-mock-data"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export default function AdminSettingsPage() {
  const [plans, setPlans] = useState(mockPlans)
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)

  const [platformSettings, setPlatformSettings] = useState({
    platformName: "SAS IMO",
    platformEmail: "admin@sasimo.com",
    supportEmail: "support@sasimo.com",
    maintenanceMode: false,
    registrationsOpen: true,
    requireEmailVerification: true,
    autoApproveAgencies: false,
    defaultCurrency: "EUR",
    defaultLanguage: "fr",
  })

  const [notifSettings, setNotifSettings] = useState({
    newAgencyAlert: true,
    newPaymentAlert: true,
    subscriptionExpiryAlert: true,
    contractSignedAlert: true,
    overdueInvoiceAlert: true,
    emailDigest: false,
  })

  const togglePlan = (planId: string) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, isActive: !p.isActive } : p))
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground">Configuration globale de la plateforme SaaS</p>
      </div>

      <Tabs defaultValue="platform">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-none lg:flex">
          <TabsTrigger value="platform" className="gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">Plateforme</span>
          </TabsTrigger>
          <TabsTrigger value="plans" className="gap-2">
            <Crown className="h-4 w-4" />
            <span className="hidden sm:inline">Forfaits</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Sécurité</span>
          </TabsTrigger>
        </TabsList>

        {/* Platform Settings */}
        <TabsContent value="platform" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Informations générales
              </CardTitle>
              <CardDescription>
                Paramètres de base de votre plateforme SaaS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Nom de la plateforme</Label>
                  <Input
                    id="platformName"
                    value={platformSettings.platformName}
                    onChange={(e) =>
                      setPlatformSettings((s) => ({ ...s, platformName: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultCurrency">Devise par défaut</Label>
                  <Input
                    id="defaultCurrency"
                    value={platformSettings.defaultCurrency}
                    onChange={(e) =>
                      setPlatformSettings((s) => ({ ...s, defaultCurrency: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platformEmail">Email administrateur</Label>
                  <Input
                    id="platformEmail"
                    type="email"
                    value={platformSettings.platformEmail}
                    onChange={(e) =>
                      setPlatformSettings((s) => ({ ...s, platformEmail: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportEmail">Email support</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={platformSettings.supportEmail}
                    onChange={(e) =>
                      setPlatformSettings((s) => ({ ...s, supportEmail: e.target.value }))
                    }
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Contrôle d&apos;accès</h4>
                <div className="space-y-4">
                  {[
                    {
                      key: "maintenanceMode" as const,
                      label: "Mode maintenance",
                      desc: "Rend la plateforme inaccessible aux utilisateurs",
                    },
                    {
                      key: "registrationsOpen" as const,
                      label: "Inscriptions ouvertes",
                      desc: "Autoriser les nouvelles agences à s'inscrire",
                    },
                    {
                      key: "requireEmailVerification" as const,
                      label: "Vérification email obligatoire",
                      desc: "Les nouveaux comptes doivent vérifier leur email",
                    },
                    {
                      key: "autoApproveAgencies" as const,
                      label: "Approbation automatique des agences",
                      desc: "Les nouvelles agences sont approuvées sans intervention",
                    },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch
                        checked={platformSettings[item.key]}
                        onCheckedChange={(checked) =>
                          setPlatformSettings((s) => ({ ...s, [item.key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Enregistrer les modifications</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Plans Settings */}
        <TabsContent value="plans" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Gestion des forfaits</h2>
              <p className="text-sm text-muted-foreground">
                Configurez les forfaits SaaS proposés aux agences
              </p>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nouveau forfait
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.id} className={!plan.isActive ? "opacity-60" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{plan.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={plan.isActive ? "default" : "secondary"}>
                        {plan.isActive ? "Actif" : "Inactif"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => togglePlan(plan.id)}
                      >
                        {plan.isActive ? (
                          <ToggleRight className="h-4 w-4 text-primary" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Mensuel</p>
                      <p className="font-semibold">{formatCurrency(plan.monthlyPrice)}</p>
                    </div>
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-xs text-muted-foreground">Annuel</p>
                      <p className="font-semibold">{formatCurrency(plan.yearlyPrice)}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Limites</p>
                    <div className="flex justify-between text-sm">
                      <span>Biens</span>
                      <span>{plan.limits.properties < 0 ? "Illimité" : plan.limits.properties}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Agents</span>
                      <span>{plan.limits.agents < 0 ? "Illimité" : plan.limits.agents}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Stockage</span>
                      <span>{plan.limits.storage} Go</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground">Fonctionnalités</p>
                    {plan.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{plan.features.length - 3} autres fonctionnalités
                      </p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-2">
                    <Pencil className="h-3.5 w-3.5" />
                    Modifier
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alertes administrateur
              </CardTitle>
              <CardDescription>
                Choisissez les événements pour lesquels vous souhaitez être notifié
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  {
                    key: "newAgencyAlert" as const,
                    label: "Nouvelle agence inscrite",
                    desc: "Recevoir une alerte lorsqu'une nouvelle agence s'inscrit",
                  },
                  {
                    key: "newPaymentAlert" as const,
                    label: "Paiement reçu",
                    desc: "Recevoir une alerte pour chaque paiement enregistré",
                  },
                  {
                    key: "subscriptionExpiryAlert" as const,
                    label: "Expiration d'abonnement",
                    desc: "Être alerté 7 jours avant l'expiration d'un abonnement",
                  },
                  {
                    key: "contractSignedAlert" as const,
                    label: "Contrat signé",
                    desc: "Recevoir une alerte lors de la signature d'un contrat",
                  },
                  {
                    key: "overdueInvoiceAlert" as const,
                    label: "Facture en retard",
                    desc: "Être alerté lorsqu'une facture dépasse son échéance",
                  },
                  {
                    key: "emailDigest" as const,
                    label: "Résumé quotidien par email",
                    desc: "Recevoir un récapitulatif des activités chaque matin",
                  },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifSettings[item.key]}
                      onCheckedChange={(checked) =>
                        setNotifSettings((s) => ({ ...s, [item.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button>Enregistrer les préférences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Sécurité de la plateforme
              </CardTitle>
              <CardDescription>
                Paramètres de sécurité et d&apos;authentification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                  <h4 className="text-sm font-medium text-destructive mb-1">Zone dangereuse</h4>
                  <p className="text-xs text-muted-foreground mb-4">
                    Ces actions sont irréversibles. Procédez avec précaution.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Réinitialiser les données de demo</p>
                        <p className="text-xs text-muted-foreground">
                          Supprime toutes les données mockées et recharge les données initiales
                        </p>
                      </div>
                      <Button variant="outline" size="sm" className="text-destructive border-destructive/30">
                        Réinitialiser
                      </Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Vider le cache de la plateforme</p>
                        <p className="text-xs text-muted-foreground">
                          Force le rechargement de toutes les données en cache
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Vider le cache
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Politique de mots de passe</h4>
                  {[
                    { label: "Longueur minimale (8 caractères)", checked: true },
                    { label: "Caractères spéciaux requis", checked: true },
                    { label: "Expiration du mot de passe (90 jours)", checked: false },
                    { label: "Authentification à deux facteurs obligatoire", checked: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <p className="text-sm">{item.label}</p>
                      <Switch defaultChecked={item.checked} />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Durée de session (heures)</h4>
                  <Input
                    type="number"
                    defaultValue={24}
                    min={1}
                    max={168}
                    className="w-32"
                  />
                  <p className="text-xs text-muted-foreground">
                    Les sessions inactives expireront après ce délai
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>Enregistrer la configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
