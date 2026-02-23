import { useMemo } from "react";

interface Completion {
  percentage: number;
  completed: { name: string; status: "completed" | "incomplete" }[];
  incomplete: { name: string; status: "completed" | "incomplete" }[];
}

export function useProfileCompletion(
  profile: Record<string, any> | null,
): Completion {
  return useMemo(() => {
    if (!profile) return { percentage: 0, completed: [], incomplete: [] };

    const sections: Record<string, string[]> = {
      "Informations de base": ["nom", "prenom", "birth_date"],
      Coordonnées: ["phone", "address", "city", "country"],
      "Informations professionnelles": [
        "occupation",
        "employer",
        "type_employment",
        "monthly_income",
      ],
      "Préférences immobilières": [
        "property_type",
        "monthly_budget",
        "nb_pieces",
        "move_in_date",
        "note",
      ],
      "Documents du client": [
        "id_document",
        "income_proof",
        "bank_statement",
        "recommendation_letter",
        "work_contract",
        "rental_history",
      ],
    };

    const completed: { name: string; status: "completed" | "incomplete" }[] =
      [];
    const incomplete: { name: string; status: "completed" | "incomplete" }[] =
      [];

    let totalFields = 0;
    let filledFields = 0;

    Object.entries(sections).forEach(([sectionName, fields]) => {
      let sectionFilled = true;

      fields.forEach((field) => {
        totalFields++;
        if (
          !profile.hasOwnProperty(field) ||
          profile[field] === null ||
          profile[field] === ""
        ) {
          sectionFilled = false;
        } else {
          filledFields++;
        }
      });

      if (sectionFilled) {
        completed.push({ name: sectionName, status: "completed" });
      } else {
        incomplete.push({ name: sectionName, status: "incomplete" });
      }
    });

    const percentage = totalFields
      ? Math.round((filledFields / totalFields) * 100)
      : 0;

    return { percentage, completed, incomplete };
  }, [profile]);
}
