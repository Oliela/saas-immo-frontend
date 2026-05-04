"use client"

import { useState } from "react"
import Link from "next/link"
import { Home, Mail, ArrowLeft, CheckCircle, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import axiosInstance from "@/lib/axios"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")       // ← message d'erreur
  const [emailError, setEmailError] = useState(false) // ← highlight input rouge

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    setError("")
    setEmailError(false)

    try {
      await axiosInstance.get("/sanctum/csrf-cookie")
      await axiosInstance.post("/api/forgot-password", { email })
      setIsSubmitted(true)
    } catch (err: any) {
      const msg = err.response?.data?.message ?? "Une erreur est survenue."
      setError(msg)
      // ← Si email introuvable, on highlight l'input en rouge
      if (err.response?.status === 404) {
        setEmailError(true)
        toast.error("Adresse email non trouvée. Veuillez vérifier et réessayer.")
      }
    } finally {
      setIsLoading(false)
    }
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
          {!isSubmitted ? (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Mail className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-2xl">Mot de passe oublié ?</CardTitle>
                <CardDescription>
                  Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Adresse email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        // ← Reset erreur dès que l'user retape
                        if (emailError) {
                          setEmailError(false)
                          setError("")
                        }
                      }}
                      required
                      disabled={isLoading}
                      // ← Bordure rouge si email introuvable
                      className={cn(emailError && "border-destructive focus-visible:ring-destructive")}
                    />
                    {/* ← Message d'erreur sous l'input */}
                    {error && (
                      <div className="flex items-center gap-2 text-sm text-destructive">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isLoading || !email}
                  >
                    {isLoading ? (
                      <>
                        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      "Envoyer le lien de réinitialisation"
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                  <CheckCircle className="h-7 w-7 text-emerald-500" />
                </div>
                <CardTitle className="text-2xl">Vérifiez votre email</CardTitle>
                <CardDescription>
                  Nous avons envoyé un lien à{" "}
                  <span className="font-medium text-foreground">{email}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
                  <p>Le lien expirera dans 1 heure. Si vous ne voyez pas l'email, vérifiez votre dossier spam.</p>
                </div>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => { setIsSubmitted(false); setEmail(""); setError("") }}
                >
                  Utiliser une autre adresse email
                </Button>
                <div className="text-center">
                  <Link href="/login" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Retour à la connexion
                  </Link>
                </div>
              </CardContent>
            </>
          )}
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