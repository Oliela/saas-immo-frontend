"use client";

import Link from "next/link";
import { useState } from "react";
import { UserX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import OwnersHeader from "@/components/owners/OwnersHeader";
import OwnersStats from "@/components/owners/OwnersStats";
import OwnersFilters from "@/components/owners/OwnersFilters";
import OwnersGrid from "@/components/owners/OwnersGrid";

interface OwnersListingProps {
  data: {
    owners: any[];
    statistics: {
      count: number;
      countBiens: number;
      totalValue: number;
      countOwnersThisMonth: number;
      countBiensThisMonth: number;
    };
  } | null | undefined;
}

export default function OwnersListing({ data }: OwnersListingProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  // console.log("OwnersListing data:", data);

  const owners = data?.owners ?? [];
  const statistics = data?.statistics;

  // Stats depuis le backend
  const stat = [
    { label: "Total de propriétaires", value: String(statistics?.count ?? 0) },
    { label: "Total de propriétés", value: String(statistics?.countBiens ?? 0) },
    {
      label: "Valeur du portefeuille",
      value: `${Number(statistics?.totalValue ?? 0).toLocaleString()} CFA`,
    },
    {
      label: "Nouveaux ce mois-ci",
      value: String(statistics?.countOwnersThisMonth ?? 0),
    },
    // {
    //   label: "Nouveaux biens (mois)",
    //   value: statistics?.countBiensThisMonth ?? 0,
    // },
  ];

  // Filtrage
  const filteredOwners = owners.filter((owner: any) => {
    const matchesStatus =
      statusFilter === "all" || owner.status === statusFilter;

    const fullName = `${owner.firstName ?? ""} ${owner.lastName ?? ""}`.toLowerCase();

    const matchesSearch =
      fullName.includes(search.toLowerCase()) ||
      owner.city?.toLowerCase().includes(search.toLowerCase()) ||
      owner.email?.toLowerCase().includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Badge statut
  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      actif: { variant: "default", label: "Actif" },
      inactif: { variant: "secondary", label: "Inactif" },
      pending: { variant: "outline", label: "En attente" },
    };

    const { variant, label } = config[status] || { variant: "outline", label: status };
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <>
      <OwnersHeader />
      <OwnersStats stats={stat} />
      <OwnersFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        search={search}
        setSearch={setSearch}
      />
      {filteredOwners.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="rounded-full bg-muted p-4">
              <UserX className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-lg font-semibold">Aucun proprietaire trouve</p>
              <p className="text-sm text-muted-foreground">
                Ajoutez votre premier proprietaire pour commencer.
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/owners/new">Creer un proprietaire</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <OwnersGrid owners={filteredOwners} getStatusBadge={getStatusBadge} />
      )}
    </>
  );
}