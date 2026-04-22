import type { CatalogClause, Client, Property } from "@/types/contractNew"

export const mockClients: Client[] = [
  { id: "1", name: "Émilie Dupont", email: "emilie@example.com", phone: "+33 1 23-45-67-89", status: "approved" },
  { id: "2", name: "David Martin",  email: "david@example.com",  phone: "+33 2 34-56-78-90", status: "approved" },
]

export const mockProperties: Property[] = [
  { id: "1", title: "Appartement Moderne en Centre-Ville", address: "123 Rue Principale, Paris",        price: 2500,   type: "rent" },
  { id: "2", title: "Maison Spacieuse Familiale",          address: "456 Avenue du Chêne, Lyon",        price: 450000, type: "sale" },
  { id: "3", title: "Penthouse Luxueux",                   address: "789 Boulevard du Parc, Marseille", price: 5000,   type: "rent" },
]

// Tokens disponibles :
//   {client_name}        → nom complet du client
//   {agency_name}        → nom de l'agence connectée
//   {bien_title}         → titre du bien
//   {bien_address}       → adresse du bien
//   {start_date}         → date de début
//   {duration}           → durée en mois
//   {amount}             → loyer mensuel ou prix de vente
//   {deposit}            → caution par mois ou dépôt de garantie
//   {caution_total}      → caution × nb mois
//   {caution_months}     → nombre de mois de caution
//   {rent_at_signature}  → loyer à la signature
//   {payment_frequency}  → libellé fréquence de paiement
//
// isDefault: true  → pré-sélectionnée automatiquement (mais modifiable et supprimable)

export const defaultClauses: CatalogClause[] = [

  // ══════════════════════════════════════════
  // LOCATION — pré-sélectionnées par défaut
  // ══════════════════════════════════════════

  {
    id: "system-rental-1", type: "rental", source: "system", isDefault: true,
    title: "Parties",
    content:
      "Le présent contrat de location est conclu entre {client_name} " +
      "(ci-après « le Locataire ») et {agency_name} (ci-après « le Bailleur »).",
  },
  {
    id: "system-rental-2", type: "rental", source: "system", isDefault: true,
    title: "Bien Immobilier",
    content:
      "Le Bailleur donne en location le bien désigné comme « {bien_title} », " +
      "situé à {bien_address}.",
  },
  {
    id: "system-rental-3", type: "rental", source: "system", isDefault: true,
    title: "Conditions du Bail",
    content:
      "Le présent bail prend effet le {start_date} pour une durée de {duration}. " +
      "Le loyer mensuel est fixé à {amount}. " +
      "Les paiements seront effectués selon une fréquence {payment_frequency}.",
  },
  {
    id: "system-rental-4", type: "rental", source: "system", isDefault: true,
    title: "Loyer à la Signature",
    content:
      "À la signature du présent contrat, le Locataire s'acquitte du loyer " +
      "correspondant à la période convenue, soit {rent_at_signature}.",
  },
  {
    id: "system-rental-5", type: "rental", source: "system", isDefault: true,
    title: "Caution",
    content:
      "Un dépôt de garantie de {caution_total} ({deposit} × {caution_months} mois) " +
      "est exigé à la signature du présent contrat. " +
      "Ce dépôt sera restitué dans les 30 jours suivant la résiliation du bail, " +
      "déduction faite des éventuels dommages constatés.",
  },

  // ══════════════════════════════════════════
  // LOCATION — additionnelles
  // ══════════════════════════════════════════

  {
    id: "system-rental-6", type: "rental", source: "system",
    title: "Conditions de Paiement",
    content:
      "Le loyer est payable au plus tard le [JOUR_ECHEANCE] de chaque mois. " +
      "Les paiements en retard entraîneront des frais de [FRAIS_RETARD].",
  },
  {
    id: "system-rental-7", type: "rental", source: "system",
    title: "Responsabilités d'Entretien",
    content:
      "Le Locataire est responsable de l'entretien courant et des réparations " +
      "ne dépassant pas [MONTANT_REPARATION]. " +
      "Les réparations majeures et les problèmes structurels incombent au Bailleur.",
  },
  {
    id: "system-rental-8", type: "rental", source: "system",
    title: "Utilisation du Bien",
    content:
      "Le bien ne peut être utilisé qu'à titre résidentiel exclusif. " +
      "Aucune activité commerciale n'est autorisée sans consentement écrit du Bailleur.",
  },
  {
    id: "system-rental-9", type: "rental", source: "system",
    title: "Résiliation du Bail",
    content:
      "Le Locataire peut résilier le présent contrat moyennant un préavis de [PREAVIS] mois. " +
      "Le Bailleur pourra résilier le bail en cas de non-paiement du loyer " +
      "après [DELAI_MISE_EN_DEMEURE] jours de mise en demeure restée sans effet.",
  },

  // ══════════════════════════════════════════
  // VENTE — pré-sélectionnées par défaut
  // ══════════════════════════════════════════

  {
    id: "system-sale-1", type: "sale", source: "system", isDefault: true,
    title: "Parties",
    content:
      "Le présent compromis de vente est conclu entre {client_name} " +
      "(ci-après « l'Acquéreur ») et {agency_name} (ci-après « le Vendeur »).",
  },
  {
    id: "system-sale-2", type: "sale", source: "system", isDefault: true,
    title: "Bien Immobilier",
    content:
      "Le Vendeur cède à l'Acquéreur le bien désigné comme « {bien_title} », " +
      "situé à {bien_address}.",
  },
  {
    id: "system-sale-3", type: "sale", source: "system", isDefault: true,
    title: "Prix de Vente",
    content:
      "Le prix de vente du bien est fixé à {amount}. " +
      "La signature de l'acte authentique interviendra à compter du {start_date}.",
  },
  {
    id: "system-sale-4", type: "sale", source: "system", isDefault: true,
    title: "Dépôt de Garantie",
    content:
      "À la signature du présent compromis, l'Acquéreur verse un dépôt de garantie " +
      "de {deposit}. Cette somme sera déduite du prix lors de la signature " +
      "de l'acte authentique.",
  },

  // ══════════════════════════════════════════
  // VENTE — additionnelles
  // ══════════════════════════════════════════

  {
    id: "system-sale-5", type: "sale", source: "system",
    title: "Conditions Suspensives",
    content:
      "La présente vente est conclue sous condition suspensive d'obtention " +
      "par l'Acquéreur d'un prêt immobilier au taux maximum de [TAUX_MAX] % " +
      "dans un délai de [DELAI_PRET] jours à compter de la signature.",
  },
  {
    id: "system-sale-6", type: "sale", source: "system",
    title: "État du Bien et Diagnostics",
    content:
      "Le Vendeur déclare que le bien est vendu en l'état. " +
      "Les diagnostics techniques obligatoires (DPE, amiante, plomb, électricité, etc.) " +
      "ont été réalisés et sont annexés au présent contrat.",
  },
  {
    id: "system-sale-7", type: "sale", source: "system",
    title: "Date de Signature de l'Acte Authentique",
    content:
      "Les parties conviennent que la signature de l'acte authentique interviendra " +
      "au plus tard le [DATE_ACTE] chez le notaire désigné d'un commun accord.",
  },
]

export const paymentFrequencyMultiplier: Record<string, number> = {
  monthly: 1, quarterly: 3, biannual: 6, annual: 12,
}

export const paymentFrequencyLabel: Record<string, string> = {
  monthly: "mensuel", quarterly: "trimestriel", biannual: "semestriel", annual: "annuel",
}