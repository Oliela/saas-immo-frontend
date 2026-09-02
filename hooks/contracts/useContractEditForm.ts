"use client";

import { useState, useEffect, useMemo } from "react";
import type {
  ContractClause,
  CatalogClause,
  Client,
  Property,
  FormData,
  ContractType,
  ContractPayload,
} from "@/types/contractNew";
import type { ContractEditData } from "./useContractDetail";
import {
  paymentFrequencyMultiplier,
  paymentFrequencyLabel,
} from "@/data/clauseSysteme";

// ─── Injection des tokens (identique à useContractForm) ───────────────────────

function injectTokens(
  content: string,
  formData: FormData,
  selectedClient: Client | null,
  selectedProperty: Property | null,
  agencyName: string,
  financials: {
    rentAmount: number;
    depositAmount: number;
    cautionTotal: number;
    cautionMonths: number;
    rentAtSignature: number;
  },
): string {
  const fmt = (n: number) =>
    n ? `${n.toLocaleString("fr-FR")} FCFA` : "[MONTANT]";
  return content
    .replace(/\{client_name\}/g, selectedClient?.name || "[NOM DU CLIENT]")
    .replace(/\{agency_name\}/g, agencyName || "[NOM DE L'AGENCE]")
    .replace(
      /\{bien_title\}/g,
      selectedProperty?.title || "[DÉSIGNATION DU BIEN]",
    )
    .replace(
      /\{bien_address\}/g,
      selectedProperty?.address || "[ADRESSE DU BIEN]",
    )
    .replace(/\{start_date\}/g, formData.startDate || "[DATE DE DÉBUT]")
    .replace(
      /\{duration\}/g,
      formData.duration ? `${formData.duration} mois` : "[DURÉE]",
    )
    .replace(/\{amount\}/g, fmt(financials.rentAmount))
    .replace(/\{deposit\}/g, fmt(financials.depositAmount))
    .replace(/\{caution_total\}/g, fmt(financials.cautionTotal))
    .replace(/\{caution_months\}/g, String(financials.cautionMonths))
    .replace(/\{rent_at_signature\}/g, fmt(financials.rentAtSignature))
    .replace(
      /\{payment_frequency\}/g,
      paymentFrequencyLabel[formData.paymentFrequency] || "mensuel",
    );
}

function toContractClause(c: CatalogClause): ContractClause {
  return {
    id: `active-${c.id}-${Date.now()}-${Math.random()}`,
    clause_id: c.clause_id,
    title: c.title,
    content: c.content,
    type: c.type,
    source: c.source,
    isModified: false,
    originalContent: c.content,
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useContractEditForm(initialData: ContractEditData) {
  const [contractType, setContractType] = useState<ContractType>(
    initialData.contractType,
  );
  const [selectedClient, setSelectedClient] = useState<Client | null>(
    initialData.selectedClient,
  );
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    initialData.selectedProperty,
  );
  const [clauses, setClauses] = useState<ContractClause[]>(initialData.clauses);
  const [formData, setFormData] = useState<FormData>(initialData.formData);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const clientRequired = [
    "compromis",
    "habitation",
    "professionnel",
    "commercial",
  ].includes(formData.usageCase);

  // Si initialData change (re-fetch), resynchronise tout
  useEffect(() => {
    setContractType(initialData.contractType);
    setSelectedClient(initialData.selectedClient);
    setSelectedProperty(initialData.selectedProperty);
    setClauses(initialData.clauses);
    setFormData(initialData.formData);
  }, [initialData.contractId]);

  // ── Calculs financiers ─────────────────────────────────────────────────────
  const financials = useMemo(() => {
    const rentAmount = Number(formData.rentAmount || 0);
    const depositAmount = Number(formData.deposit || 0);
    const cautionMonths = Number(formData.cautionMonths || 1);
    const commissionRate = Number(formData.commission || 0);
    const rentMultiplier =
      paymentFrequencyMultiplier[formData.paymentFrequency] ?? 1;

    const cautionTotal = depositAmount * cautionMonths;
    const commissionAmount = (rentAmount * commissionRate) / 100;
    const rentAtSignature = rentAmount * rentMultiplier;
    const totalAtSignature =
      contractType === "rental"
        ? cautionTotal + commissionAmount + rentAtSignature
        : depositAmount + commissionAmount;

    return {
      rentAmount,
      depositAmount,
      cautionMonths,
      commissionRate,
      rentMultiplier,
      cautionTotal,
      commissionAmount,
      rentAtSignature,
      totalAtSignature,
    };
  }, [formData, contractType]);

  // ── Gestion des clauses ────────────────────────────────────────────────────
  const addClauseFromCatalog = (catalogClause: CatalogClause) => {
    const alreadyAdded = clauses.some((c) =>
      c.clause_id
        ? c.clause_id === catalogClause.clause_id
        : c.title === catalogClause.title,
    );
    if (alreadyAdded) return;
    setClauses((prev) => [...prev, toContractClause(catalogClause)]);
  };

  const addInlineClause = (title: string, content: string) => {
    setClauses((prev) => [
      ...prev,
      {
        id: `inline-${Date.now()}`,
        title,
        content,
        type: contractType,
        source: "inline",
        isModified: false,
      },
    ]);
  };

  const updateClause = (updated: ContractClause) => {
    setClauses((prev) =>
      prev.map((c) => {
        if (c.id !== updated.id) return c;
        return {
          ...updated,
          isModified:
            c.originalContent !== undefined
              ? updated.content !== c.originalContent
              : false,
        };
      }),
    );
  };

  const removeClause = (id: string) =>
    setClauses((prev) => prev.filter((c) => c.id !== id));

  const moveClause = (index: number, direction: "up" | "down") => {
    const next = [...clauses];
    const to = direction === "up" ? index - 1 : index + 1;
    if (to >= 0 && to < clauses.length) {
      [next[index], next[to]] = [next[to], next[index]];
      setClauses(next);
    }
  };

  const duplicateClause = (clause: ContractClause) => {
    const dupe: ContractClause = {
      ...clause,
      id: `inline-${Date.now()}`,
      title: `${clause.title} (Copie)`,
      source: "inline",
      clause_id: undefined,
      isModified: false,
      originalContent: undefined,
    };
    setClauses((prev) => {
      const idx = prev.findIndex((c) => c.id === clause.id);
      const next = [...prev];
      next.splice(idx + 1, 0, dupe);
      return next;
    });
  };

  // ── Clauses avec tokens injectés (aperçu) ─────────────────────────────────
  const clausesWithInjectedData = useMemo(
    () =>
      clauses.map((c) => ({
        ...c,
        content: injectTokens(
          c.content,
          formData,
          selectedClient,
          selectedProperty,
          initialData.agencyName,
          financials,
        ),
      })),
    [clauses, formData, selectedClient, selectedProperty, financials],
  );

  // ── Progression ───────────────────────────────────────────────────────────
  const progress = [
    {
      label: "Informations du Contrat",
      done: !!(formData.city && formData.startDate),
      step: 1,
    },
    {
      label: "Parties Sélectionnées",
      done: !!selectedProperty && (!clientRequired || !!selectedClient),
      step: 2,
    },
    { label: "Clauses Ajoutées", done: clauses.length > 0, step: 3 },
    {
      label: "Conditions Financières Définies",
      done: !!formData.rentAmount,
      step: 4,
    },
  ];

  const isReadyToSubmit = progress.every((p) => p.done);

  // ── Payload PUT /api/contracts/{id} ───────────────────────────────────────
  const buildPayload = (): (ContractPayload & { id: number }) | null => {
    if (!selectedProperty || (clientRequired && !selectedClient)) {
      return null;
    }

    const clausePayload = clauses.map((c, index) => {
      const content = injectTokens(
        c.content,
        formData,
        selectedClient,
        selectedProperty,
        initialData.agencyName,
        financials,
      );
      // Si la clause vient du serveur (id server-XX), on envoie son id de ContractClause
      const serverClauseId = c.id.startsWith("server-")
        ? parseInt(c.id.replace("server-", ""))
        : undefined;

      if (c.clause_id)
        return {
          clause_id: c.clause_id,
          title: c.title,
          content,
          order: index,
          source: c.source,
        };
      if (serverClauseId)
        return {
          contract_clause_id: serverClauseId,
          title: c.title,
          content,
          order: index,
          source: c.source,
        };
      return { title: c.title, content, order: index, source: c.source };
    });

    return {
      id: initialData.contractId,
      client_id:
        clientRequired && selectedClient
          ? Number(selectedClient.id)
          : undefined,

      agent_id: formData.agentId ? Number(formData.agentId) : undefined,
      usage_case: formData.usageCase,
      title: formData.title,
      bien_id: Number(selectedProperty.id),
      agency_id: initialData.agencyId,
      type: contractType,
      city: formData.city,
      start_date: formData.startDate,
      duration: Number(formData.duration),
      amount: financials.rentAmount,
      deposit: financials.depositAmount,
      commission: financials.commissionRate,
      cautionMonths: financials.cautionMonths,
      rentAtSignature: financials.rentAtSignature,
      totalAtSignature: financials.totalAtSignature,
      payment_frequency: formData.paymentFrequency,
      clauses: clausePayload,
      
    };
  };

  return {
    activeTab,
    setActiveTab,
    contractType,
    selectedClient,
    setSelectedClient,
    selectedProperty,
    setSelectedProperty,
    showPreview,
    setShowPreview,
    clauses,
    formData,
    setFormData,
    financials,
    clausesWithInjectedData,
    progress,
    isReadyToSubmit,
    addClauseFromCatalog,
    addInlineClause,
    updateClause,
    removeClause,
    moveClause,
    duplicateClause,
    buildPayload,
  };
}
