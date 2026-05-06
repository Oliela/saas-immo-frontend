"use client"

import { useState } from "react"
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import axiosInstance from "@/lib/axios"

const passwordRequirements = [
  { id: "length",    label: "Au moins 8 caractères", test: (p: string) => p.length >= 8 },
  { id: "uppercase", label: "Une lettre majuscule",  test: (p: string) => /[A-Z]/.test(p) },
  { id: "lowercase", label: "Une lettre minuscule",  test: (p: string) => /[a-z]/.test(p) },
  { id: "number",    label: "Un chiffre",            test: (p: string) => /\d/.test(p) },
]

export default function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword]         = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showCurrent, setShowCurrent]   = useState(false)
  const [showNew, setShowNew]           = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)

  const [isLoading, setIsLoading]             = useState(false)
  const [success, setSuccess]                 = useState(false)
  const [error, setError]                     = useState("")
  const [currentPasswordError, setCurrentPasswordError] = useState("")

  const allRequirementsMet = passwordRequirements.every((req) => req.test(newPassword))
  const passwordsMatch     = newPassword === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setCurrentPasswordError("")
    setSuccess(false)

    if (!allRequirementsMet) {
      setError("Veuillez respecter toutes les exigences du mot de passe.")
      return
    }
    if (!passwordsMatch) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }

    setIsLoading(true)
    try {
      await axiosInstance.post("/api/change-password", {
        current_password:      currentPassword,
        password:              newPassword,
        password_confirmation: confirmPassword,
      })
      setSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      const errors = err.response?.data?.errors
      if (errors?.current_password) {
        setCurrentPasswordError(errors.current_password[0])
      } else if (errors?.password) {
        setError(errors.password[0])
      } else {
        setError(err.response?.data?.message ?? "Une erreur est survenue.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle>Changer le mot de passe</CardTitle>
          <CardDescription>
            Mettez à jour le mot de passe de votre compte personnel.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Mot de passe actuel */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Mot de passe actuel</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value)
                    if (currentPasswordError) setCurrentPasswordError("")
                  }}
                  required
                  disabled={isLoading}
                  className={cn(
                    "pl-9 pr-9",
                    currentPasswordError && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                <Button type="button" variant="ghost" size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={() => setShowCurrent(!showCurrent)}>
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {currentPasswordError && (
                <p className="flex items-center gap-1 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {currentPasswordError}
                </p>
              )}
            </div>

            {/* Nouveau mot de passe */}
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nouveau mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="newPassword"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-9 pr-9"
                />
                <Button type="button" variant="ghost" size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={() => setShowNew(!showNew)}>
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>

              {/* Indicateurs */}
              {newPassword.length > 0 && (
                <div className="space-y-2 rounded-lg bg-muted p-3">
                  <p className="text-xs font-medium text-muted-foreground">Exigences :</p>
                  <ul className="space-y-1">
                    {passwordRequirements.map((req) => {
                      const met = req.test(newPassword)
                      return (
                        <li key={req.id} className="flex items-center gap-2 text-sm">
                          <CheckCircle className={cn("h-4 w-4 shrink-0 transition-colors",
                            met ? "text-emerald-500" : "text-muted-foreground/40")} />
                          <span className={cn(met ? "text-foreground" : "text-muted-foreground")}>
                            {req.label}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>

            {/* Confirmation */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-9 pr-9"
                />
                <Button type="button" variant="ghost" size="icon"
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
                  onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={cn("flex items-center gap-1 text-sm",
                  passwordsMatch ? "text-emerald-600" : "text-destructive")}>
                  {passwordsMatch
                    ? <><CheckCircle className="h-4 w-4" />Les mots de passe correspondent</>
                    : <><AlertTriangle className="h-4 w-4" />Les mots de passe ne correspondent pas</>}
                </p>
              )}
            </div>

            {/* Erreur générale */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Succès */}
            {success && (
              <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Mot de passe mis à jour avec succès !
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={isLoading || !currentPassword || !allRequirementsMet || !passwordsMatch}
              >
                {isLoading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Mise à jour...
                  </>
                ) : "Mettre à jour le mot de passe"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Zone dangereuse — inchangée */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
          <CardDescription>Actions irréversibles pour votre compte.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Supprimer le compte</p>
              <p className="text-xs text-muted-foreground">
                Supprimez définitivement votre compte et toutes les données.
              </p>
            </div>
            <Button variant="destructive">Supprimer le compte</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}