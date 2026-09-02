"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { LoginResponse } from "@/types/auth"
import axios from "axios"
import axiosInstance from "@/lib/axios"
import Link from "next/link"

interface LoginFormProps {
  onSuccess?: () => void
}

interface LoginErrorResponse {
  error?: string
  message?: string
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await axiosInstance.get("/sanctum/csrf-cookie")
      const res = await axiosInstance.post<LoginResponse>(
        "/api/login",
        { email, password }
      )
      if (res.status === 200) {
        onSuccess?.()
        window.location.assign(res.data.redirect)
      }
    } catch (error: unknown) {
      if (axios.isAxiosError<LoginErrorResponse>(error)) {
        setError(
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Impossible de se connecter."
        )
      } else {
        setError("Impossible de se connecter.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-md">
          {error}
        </p>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Adresse e-mail</Label>

        <Input
          id="email"
          type="email"
          placeholder="nom@exemple.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mot de passe</Label>

        <Input
          id="password"
          type="password"
          placeholder="Entrez votre mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Link
          href="/forgot-password"
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={submitting}>
        {submitting ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  )
}