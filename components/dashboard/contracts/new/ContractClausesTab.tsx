"use client"

import { useState } from "react"
import {
  Plus, Trash2, GripVertical, ChevronUp, ChevronDown,
  Pencil, Copy, Loader2, AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button }    from "@/components/ui/button"
import { Input }     from "@/components/ui/input"
import { Label }     from "@/components/ui/label"
import { Textarea }  from "@/components/ui/textarea"
import { Badge }     from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { useCatalogClauses } from "@/hooks/contracts/useCatalogClauses"
import type { ContractClause, CatalogClause, ContractType } from "@/types/contractNew"

// ─── Badge source ──────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: ContractClause["source"] }) {
  if (source === "system")
    return <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">Système</Badge>
  if (source === "agency")
    return <Badge variant="secondary" className="text-xs bg-teal-100 text-teal-700">Agence</Badge>
  return <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-700">Libre</Badge>
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface Props {
  contractType:     ContractType
  agencyId:         number
  activeClauses:    ContractClause[]
  onAddFromCatalog: (clause: CatalogClause) => void
  onAddInline:      (title: string, content: string) => void
  onUpdate:         (clause: ContractClause) => void
  onRemove:         (id: string) => void
  onMove:           (index: number, direction: "up" | "down") => void
  onDuplicate:      (clause: ContractClause) => void
}

export function ContractClausesTab({
  contractType, agencyId, activeClauses,
  onAddFromCatalog, onAddInline,
  onUpdate, onRemove, onMove, onDuplicate,
}: Props) {
  const { catalog, isLoading, error } = useCatalogClauses(contractType, agencyId)

  const [showInlineDialog, setShowInlineDialog] = useState(false)
  const [inlineTitle,      setInlineTitle]      = useState("")
  const [inlineContent,    setInlineContent]    = useState("")
  const [editingClause,    setEditingClause]    = useState<ContractClause | null>(null)

  const isAlreadyAdded = (c: CatalogClause) =>
    c.clause_id
      ? activeClauses.some((a) => a.clause_id === c.clause_id)
      : activeClauses.some((a) => a.id.includes(c.id) || a.title === c.title)

  const handleAddInline = () => {
    if (inlineTitle && inlineContent) {
      onAddInline(inlineTitle, inlineContent)
      setInlineTitle("")
      setInlineContent("")
      setShowInlineDialog(false)
    }
  }

  const handleUpdate = () => {
    if (editingClause) {
      onUpdate(editingClause)
      setEditingClause(null)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      {/* ── Bibliothèque ─────────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Bibliothèque de clauses</CardTitle>
          <CardDescription>
            Clauses disponibles — {contractType === "rental" ? "location" : "vente"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-4 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              Chargement…
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive py-2">
              <AlertCircle className="h-4 w-4" />
              Clauses agence indisponibles
            </div>
          )}

          {/* Clauses système */}
          {catalog.filter((c) => c.source === "system").length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Système
              </p>
              <div className="space-y-2">
                {catalog
                  .filter((c) => c.source === "system")
                  .map((clause) => (
                    <CatalogItem
                      key={clause.id}
                      clause={clause}
                      added={isAlreadyAdded(clause)}
                      onAdd={() => onAddFromCatalog(clause)}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Clauses agence */}
          {!isLoading && catalog.filter((c) => c.source === "agency").length > 0 && (
            <div>
              <Separator className="my-3" />
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                Agence
              </p>
              <div className="space-y-2">
                {catalog
                  .filter((c) => c.source === "agency")
                  .map((clause) => (
                    <CatalogItem
                      key={clause.id}
                      clause={clause}
                      added={isAlreadyAdded(clause)}
                      onAdd={() => onAddFromCatalog(clause)}
                    />
                  ))}
              </div>
            </div>
          )}

          {!isLoading && catalog.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune clause disponible
            </p>
          )}
        </CardContent>
      </Card>

      {/* ── Clauses du contrat ───────────────────────────────────────────── */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Clauses du contrat</CardTitle>
            <CardDescription>
              {activeClauses.length} clause{activeClauses.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>

          <Dialog open={showInlineDialog} onOpenChange={setShowInlineDialog}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline">
                <Plus className="mr-1 h-3 w-3" />
                Clause libre
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter une clause libre</DialogTitle>
                <DialogDescription>
                  Propre à ce contrat uniquement.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    placeholder="ex. Conditions spéciales"
                    value={inlineTitle}
                    onChange={(e) => setInlineTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contenu</Label>
                  <Textarea
                    placeholder="Rédigez la clause…"
                    value={inlineContent}
                    onChange={(e) => setInlineContent(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowInlineDialog(false)}>Annuler</Button>
                <Button onClick={handleAddInline}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {activeClauses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
              <Plus className="h-8 w-8 mb-2 opacity-30" />
              <p className="text-sm">Ajoutez des clauses depuis la bibliothèque</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeClauses.map((clause, index) => (
                <div
                  key={clause.id}
                  className="flex items-start gap-2 p-3 rounded-lg border border-border bg-card"
                >
                  {/* Déplacement */}
                  <div className="flex flex-col items-center gap-0.5 pt-0.5">
                    <button
                      type="button"
                      onClick={() => onMove(index, "up")}
                      disabled={index === 0}
                      className="p-0.5 rounded hover:bg-muted disabled:opacity-30"
                    >
                      <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
                    <button
                      type="button"
                      onClick={() => onMove(index, "down")}
                      disabled={index === activeClauses.length - 1}
                      className="p-0.5 rounded hover:bg-muted disabled:opacity-30"
                    >
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-xs text-muted-foreground">{index + 1}.</span>
                      <span className="text-sm font-medium text-foreground truncate">
                        {clause.title}
                      </span>
                      <SourceBadge source={clause.source} />
                      {clause.isModified && (
                        <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                          Modifiée
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {clause.content}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    {/* Modifier */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost" size="icon" className="h-7 w-7"
                          onClick={() => setEditingClause({ ...clause })}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier la clause</DialogTitle>
                          <DialogDescription>
                            La modification s'applique uniquement à ce contrat.
                          </DialogDescription>
                        </DialogHeader>
                        {editingClause?.id === clause.id && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Titre</Label>
                              <Input
                                value={editingClause.title}
                                onChange={(e) =>
                                  setEditingClause({ ...editingClause, title: e.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Contenu</Label>
                              <Textarea
                                value={editingClause.content}
                                onChange={(e) =>
                                  setEditingClause({ ...editingClause, content: e.target.value })
                                }
                                className="min-h-[140px]"
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingClause(null)}>
                            Annuler
                          </Button>
                          <Button onClick={handleUpdate}>Enregistrer</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Dupliquer */}
                    <Button
                      variant="ghost" size="icon" className="h-7 w-7"
                      onClick={() => onDuplicate(clause)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>

                    {/* Supprimer */}
                    <Button
                      variant="ghost" size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => onRemove(clause.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// ─── Item bibliothèque ─────────────────────────────────────────────────────────

function CatalogItem({
  clause,
  added,
  onAdd,
}: {
  clause: CatalogClause
  added: boolean
  onAdd: () => void
}) {
  return (
    <div className="flex items-start gap-2 p-3 rounded-lg border border-border bg-card/50">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          <span className="text-sm font-medium text-foreground">{clause.title}</span>
          {clause.source === "agency" && (
            <Badge variant="secondary" className="text-xs bg-teal-100 text-teal-700">
              Agence
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{clause.content}</p>
      </div>
      <Button
        size="sm"
        variant={added ? "secondary" : "outline"}
        className="shrink-0 h-7 text-xs"
        onClick={onAdd}
        disabled={added}
      >
        {added ? "Ajoutée" : "+ Ajouter"}
      </Button>
    </div>
  )
}