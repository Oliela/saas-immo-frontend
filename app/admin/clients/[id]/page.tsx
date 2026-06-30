"use client"

import { use } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Calendar,
  Eye,
  Heart,
  FolderOpen,
  Briefcase,
  User,
  Home,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/admin/status-badge"
import { EmptyState } from "@/components/admin/empty-state"
import { useAdminClientDetail } from "@/hooks/useAdminClientDetail"

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const DOC_TYPE_LABELS: Record<string, string> = {
  id_document: "Pièce d'identité",
  income_proof: "Justificatif de revenus",
  cni: "Carte Nationale d'Identité",
  passeport: "Passeport",
  justificatif_domicile: "Justificatif de domicile",
  bulletin_salaire: "Bulletin de salaire",
  contrat_travail: "Contrat de travail",
  autre: "Autre",
}

const ACQUISITION_LABELS: Record<string, string> = {
  sale: "Achat",
  rental: "Location",
}

const EMPLOYMENT_LABELS: Record<string, string> = {
  "temps-plein": "Temps plein",
  "temps-partiel": "Temps partiel",
  freelance: "Freelance",
  entrepreneur: "Entrepreneur",
  "sans-emploi": "Sans emploi",
  retraite: "Retraité",
}

export default function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data, loading, error } = useAdminClientDetail(id)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">{error ?? "Client introuvable"}</p>
      </div>
    )
  }

  const { info, stats, documents, contracts, listeSouhaits } = data

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0">
          <Link href="/admin/clients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-foreground">
            {info.prenom} {info.nom}
          </h1>
          <p className="text-muted-foreground text-sm">Fiche client</p>
        </div>
      </div>

      {/* Onglets */}
      <Tabs defaultValue="informations">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="informations">Informations</TabsTrigger>
          <TabsTrigger value="documents">
            Documents
            <Badge variant="secondary" className="ml-1.5 text-xs">{documents.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="contrats">
            Contrats
            <Badge variant="secondary" className="ml-1.5 text-xs">{contracts.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="souhaits">Liste de souhaits</TabsTrigger>
        </TabsList>

        {/* Onglet 1 — Informations personnelles */}
        <TabsContent value="informations" className="mt-6 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{info.email}</p>
                    <p className="text-xs text-muted-foreground">Email</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{info.phone}</p>
                    <p className="text-xs text-muted-foreground">Téléphone</p>
                  </div>
                </div>
                {info.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{info.address}</p>
                      <p className="text-xs text-muted-foreground">{info.city ?? "—"}</p>
                    </div>
                  </div>
                )}
                {info.agences.length > 0 && (
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">{info.agences.join(", ")}</p>
                      <p className="text-xs text-muted-foreground">Agence(s) affiliée(s)</p>
                    </div>
                  </div>
                )}
                {info.birthDate && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium">
                        {format(new Date(info.birthDate), "d MMMM yyyy", { locale: fr })}
                      </p>
                      <p className="text-xs text-muted-foreground">Date de naissance</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium">
                      {format(new Date(info.dateCreation), "d MMMM yyyy", { locale: fr })}
                    </p>
                    <p className="text-xs text-muted-foreground">Date de création du compte</p>
                  </div>
                </div>
              </div>

              {(info.occupation || info.employer) && (
                <>
                  <Separator />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {info.occupation && (
                      <div className="flex items-center gap-3">
                        <Briefcase className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{info.occupation}</p>
                          <p className="text-xs text-muted-foreground">
                            {info.typeEmployment
                              ? (EMPLOYMENT_LABELS[info.typeEmployment] ?? info.typeEmployment)
                              : "Profession"}
                          </p>
                        </div>
                      </div>
                    )}
                    {info.employer && (
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{info.employer}</p>
                          <p className="text-xs text-muted-foreground">Employeur</p>
                        </div>
                      </div>
                    )}
                    {info.monthlyIncome && parseFloat(info.monthlyIncome) > 0 && (
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div>
                          <p className="text-sm font-medium">
                            {formatCurrency(parseFloat(info.monthlyIncome))}
                          </p>
                          <p className="text-xs text-muted-foreground">Revenu mensuel</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              <Separator />
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-2xl font-bold">{stats.nombreContrats}</p>
                  <p className="text-xs text-muted-foreground mt-1">Contrats</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalFactures)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total facturé</p>
                </div>
                <div className="rounded-lg border p-4 text-center">
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalPaye)}</p>
                  <p className="text-xs text-muted-foreground mt-1">Total payé</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 2 — Documents */}
        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents uploadés</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <EmptyState
                  icon={FolderOpen}
                  title="Aucun document"
                  message="Ce client n'a pas encore uploadé de documents."
                />
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type de document</TableHead>
                        <TableHead className="hidden sm:table-cell">Nom du fichier</TableHead>
                        <TableHead className="hidden lg:table-cell">Date d&apos;ajout</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {documents.map((doc, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <p className="font-medium text-sm">
                              {DOC_TYPE_LABELS[doc.type] ?? doc.type}
                            </p>
                            <p className="text-xs text-muted-foreground sm:hidden">{doc.nom}</p>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                            {doc.nom}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                            {doc.dateAjout
                              ? format(new Date(doc.dateAjout), "d MMM yyyy", { locale: fr })
                              : "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              disabled
                              title="Aperçu non disponible"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">Voir</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 3 — Contrats */}
        <TabsContent value="contrats" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <CardTitle>Contrats</CardTitle>
                <Badge variant="secondary" className="text-sm px-3">
                  {contracts.length} contrat{contracts.length !== 1 ? "s" : ""}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {contracts.length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title="Aucun contrat"
                  message="Ce client n'a pas encore de contrat enregistré."
                />
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Référence</TableHead>
                        <TableHead className="hidden sm:table-cell">Agence</TableHead>
                        <TableHead className="hidden lg:table-cell">Bien</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {contracts.map((contract) => (
                        <TableRow key={contract.reference}>
                          <TableCell className="font-medium text-sm font-mono">
                            {contract.reference}
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">
                            {contract.agence}
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">
                            {contract.titreBien}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {formatCurrency(parseFloat(contract.prixBien))}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={contract.statut} />
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                            {contract.date
                              ? format(new Date(contract.date), "d MMM yyyy", { locale: fr })
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet 4 — Liste de souhaits */}
        <TabsContent value="souhaits" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de recherche</CardTitle>
            </CardHeader>
            <CardContent>
              {!listeSouhaits ? (
                <EmptyState
                  icon={Heart}
                  title="Aucune préférence"
                  message="Ce client n'a pas encore renseigné ses préférences."
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {listeSouhaits.propertyType && (
                    <div className="flex items-start gap-3">
                      <Home className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium capitalize">{listeSouhaits.propertyType}</p>
                        <p className="text-xs text-muted-foreground">Type de bien</p>
                      </div>
                    </div>
                  )}
                  {listeSouhaits.acquisitionType && (
                    <div className="flex items-start gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {ACQUISITION_LABELS[listeSouhaits.acquisitionType] ?? listeSouhaits.acquisitionType}
                        </p>
                        <p className="text-xs text-muted-foreground">Type d&apos;acquisition</p>
                      </div>
                    </div>
                  )}
                  {listeSouhaits.monthlyBudget && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {formatCurrency(parseFloat(listeSouhaits.monthlyBudget))}
                        </p>
                        <p className="text-xs text-muted-foreground">Budget mensuel</p>
                      </div>
                    </div>
                  )}
                  {listeSouhaits.surfaceArea && (
                    <div className="flex items-start gap-3">
                      <Home className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{listeSouhaits.surfaceArea} m²</p>
                        <p className="text-xs text-muted-foreground">Surface souhaitée</p>
                      </div>
                    </div>
                  )}
                  {listeSouhaits.nbPieces && (
                    <div className="flex items-start gap-3">
                      <Home className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">{listeSouhaits.nbPieces} pièces</p>
                        <p className="text-xs text-muted-foreground">Nombre de pièces</p>
                      </div>
                    </div>
                  )}
                  {listeSouhaits.moveInDate && (
                    <div className="flex items-start gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          {format(new Date(listeSouhaits.moveInDate), "d MMMM yyyy", { locale: fr })}
                        </p>
                        <p className="text-xs text-muted-foreground">Date d&apos;emménagement souhaitée</p>
                      </div>
                    </div>
                  )}
                  {listeSouhaits.professionalSituation && (
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {listeSouhaits.professionalSituation}
                        </p>
                        <p className="text-xs text-muted-foreground">Situation professionnelle</p>
                      </div>
                    </div>
                  )}
                  {listeSouhaits.note && (
                    <div className="sm:col-span-2 rounded-lg border p-3 bg-muted/30">
                      <p className="text-xs text-muted-foreground mb-1">Note</p>
                      <p className="text-sm">{listeSouhaits.note}</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}