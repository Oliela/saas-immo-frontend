"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Home, Lock, Eye, EyeOff, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ← Récupération du token et email depuis l'URL du lien email
  const token = searchParams.get("token") ?? ""
  const email = searchParams.get("email") ?? ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const allRequirementsMet = passwordRequirements.every((req) => req.test(password))
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  // ← Lien invalide (token ou email manquant)
  if (!token || !email) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <header className="py-6 px-4">
          <div className="mx-auto max-w-7xl">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold">Galle Connect Pro</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-7 w-7 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Lien invalide</CardTitle>
              <CardDescription>
                Ce lien de réinitialisation est invalide ou a expiré.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => router.push("/forgot-password")}>
                Demander un nouveau lien
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

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
      // ← Appel API réel vers Laravel
      await axiosInstance.post("/api/reset-password", {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      })
      setIsSubmitted(true)
    } catch (err: any) {
      const msg = err.response?.data?.message
      // Token expiré → proposer un nouveau lien
      if (msg?.includes("expiré") || msg?.includes("invalide")) {
        setError(msg + " — Veuillez demander un nouveau lien.")
      } else {
        setError(msg ?? "Une erreur est survenue. Réessayez.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex flex-col bg-muted">
        <header className="py-6 px-4">
          <div className="mx-auto max-w-7xl">
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Home className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground">Galle Connect Pro</span>
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle className="h-7 w-7 text-emerald-500" />
              </div>
              <CardTitle className="text-2xl">Réinitialisation réussie !</CardTitle>
              <CardDescription>
                Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" size="lg" onClick={() => router.push("/login")}>
                Aller à la connexion
              </Button>
            </CardContent>
          </Card>
        </main>
        <footer className="py-6 px-4">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Galle Connect Pro. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted">
      <header className="py-6 px-4">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="flex items-center gap-2 w-fit">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Home className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground">Galle Connect Pro</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
              <Lock className="h-7 w-7 text-primary" />
            </div>
            <CardTitle className="text-2xl">Réinitialisez votre mot de passe</CardTitle>
            <CardDescription>Saisissez un nouveau mot de passe pour votre compte.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Saisissez un nouveau mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {password.length > 0 && (
                <div className="space-y-2 rounded-lg bg-muted p-3">
                  <p className="text-xs font-medium text-muted-foreground">Exigences du mot de passe :</p>
                  <ul className="space-y-1">
                    {passwordRequirements.map((req) => {
                      const met = req.test(password)
                      return (
                        <li key={req.id} className="flex items-center gap-2 text-sm">
                          <CheckCircle className={cn("h-4 w-4 shrink-0 transition-colors", met ? "text-emerald-500" : "text-muted-foreground/40")} />
                          <span className={cn(met ? "text-foreground" : "text-muted-foreground")}>{req.label}</span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmez le nouveau mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="pr-10"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <p className={cn("text-sm flex items-center gap-1", passwordsMatch ? "text-emerald-600" : "text-destructive")}>
                    {passwordsMatch
                      ? <><CheckCircle className="h-4 w-4" />Les mots de passe correspondent</>
                      : <><AlertTriangle className="h-4 w-4" />Les mots de passe ne correspondent pas</>}
                  </p>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                  {/* ← Lien direct si token expiré */}
                  {error.includes("nouveau lien") && (
                    <Link href="/forgot-password" className="ml-1 underline font-medium">
                      Cliquez ici
                    </Link>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading || !allRequirementsMet || !passwordsMatch}
              >
                {isLoading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Réinitialisation...
                  </>
                ) : (
                  "Réinitialiser le mot de passe"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Retour à la connexion
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="py-6 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Galle Connect Pro. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  )
}