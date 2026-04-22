import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function PropertiesNewHeader() {
    return (
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard/properties">
                    <ArrowLeft className="h-4 w-4" />
                </Link>
            </Button>
            <div>
                <h1 className="text-2xl font-bold text-foreground">Ajouter une nouvelle propriété</h1>
                <p className="text-muted-foreground">Créer une nouvelle annonce</p>
            </div>
        </div>
    )
}
