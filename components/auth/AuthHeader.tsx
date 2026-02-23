"use client"
import { Home } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function AuthHeader(): React.ReactElement {
  return (
    <header className="py-6 px-4">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-semibold text-foreground">SAS IMO</span>
        </Link>
      </div>
    </header>
  )
}
