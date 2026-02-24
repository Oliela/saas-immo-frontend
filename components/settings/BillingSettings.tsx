"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard } from "lucide-react"

export default function BillingSettings() {
    const invoices = [
        { date: "Feb 1, 2026", amount: "$99.00", status: "Paid" },
        { date: "Jan 1, 2026", amount: "$99.00", status: "Paid" },
        { date: "Dec 1, 2025", amount: "$99.00", status: "Paid" },
    ]

    return (
        <div className="space-y-6">
            {/* Current Plan */}
            <Card>
                <CardHeader>
                    <CardTitle>Offre actuelle</CardTitle>
                    <CardDescription>Gérez votre abonnement et la facturation</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-muted/50">
                        <div>
                            <p className="font-semibold text-foreground text-lg">Offre Professionnelle</p>
                            <p className="text-sm text-muted-foreground">99$/mois - Jusqu'à 500 annonces</p>
                        </div>
                        <Button variant="outline" className="bg-transparent">Mettre à niveau l'offre</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
                <CardHeader>
                    <CardTitle>Méthode de paiement</CardTitle>
                    <CardDescription>Gérez vos informations de paiement</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-16 bg-muted rounded flex items-center justify-center">
                                <CreditCard className="h-6 w-6 text-muted-foreground" />
                            </div>

                            <div>
                                <p className="font-medium text-foreground">Visa se terminant par 4242</p>
                                <p className="text-sm text-muted-foreground">Expire 12/2027</p>
                            </div>
                        </div>

                        <Button variant="ghost" size="sm">
                            Modifier
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Billing History */}
            <Card>
                <CardHeader>
                    <CardTitle>Historique de facturation</CardTitle>
                    <CardDescription>Voir vos factures récentes</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="space-y-2">
                        {invoices.map((invoice, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between py-3 border-b border-border last:border-0"
                            >
                                <div>
                                    <p className="font-medium text-foreground">
                                        {invoice.date}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        {invoice.amount}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-green-600">
                                        {invoice.status}
                                    </span>

                                    <Button variant="ghost" size="sm">
                                        Download
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}