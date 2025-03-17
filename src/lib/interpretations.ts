import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { DEFAULT_INTERPRETATION } from "@/lib/default-interpretations"

// Define types for interpretations
export interface Interpretation {
  id: string // e.g., "karmicSeal-1"
  title: string
  content: string
}

// Define interpretation types/tables
export type InterpretationType = "karmic" | "love" | "professional";

export const INTERPRETATION_TABLES: Record<InterpretationType, string> = {
  karmic: "karmic_interpretations",
  love: "karmic_love",
  professional: "karmic_professional"
};

// Store all interpretations in a map
let interpretations: Record<string, Interpretation> = {}

// Helper to generate interpretation ID
export function generateInterpretationId(category: string, number: number): string {
  return `${category}-${number}`
}

// Add or update an interpretation
export async function setInterpretation(
  category: string, 
  number: number, 
  title: string, 
  content: string, 
  type: InterpretationType = "karmic"
) {
  const id = generateInterpretationId(category, number)
  try {
    const { error } = await supabase.from(INTERPRETATION_TABLES[type]).upsert({
      id,
      title,
      content,
    })
    if (error) {
      throw error;
    }
    toast({
      title: "Interpretação Salva",
      description: `A interpretação para ${getCategoryDisplayName(category, type)} número ${number} foi salva com sucesso.`,
    })
  } catch (error) {
    console.error("Erro ao salvar interpretação:", error)
    toast({
      title: "Erro ao Salvar",
      description: "Ocorreu um erro ao salvar a interpretação. Por favor, tente novamente.",
      variant: "destructive",
    })
  }
}

// Get an interpretation
export async function getInterpretation(
  category: string, 
  number: number, 
  type: InterpretationType = "karmic"
) {
  const id = generateInterpretationId(category, number)
  console.log(`Buscando interpretação para: ${id} na tabela ${INTERPRETATION_TABLES[type]}`)
  const { data } = await supabase.from(INTERPRETATION_TABLES[type]).select("*").eq("id", id).single();
  return data ?? { title: "", content: DEFAULT_INTERPRETATION }
}

// Delete an interpretation
export async function deleteInterpretation(
  category: string, 
  number: number, 
  type: InterpretationType = "karmic"
) {
  const id = generateInterpretationId(category, number)
  try {
    await supabase.from(INTERPRETATION_TABLES[type]).delete().eq("id", id);
    toast({
      title: "Interpretação Removida",
      description: `A interpretação para ${getCategoryDisplayName(category, type)} número ${number} foi removida.`,
    })
  } catch (error) {
    console.error("Erro ao deletar interpretação:", error)
    toast({
      title: "Erro ao Deletar",
      description: "Ocorreu um erro ao deletar a interpretação. Por favor, tente novamente.",
      variant: "destructive",
    })
  }
}

// Initialize interpretations from localStorage on module load
console.log("Inicializando módulo de interpretações")

// Define categories by interpretation type
const CATEGORIES = {
  karmic: [
    "karmicSeal",
    "destinyCall", 
    "karmaPortal",
    "karmicInheritance",
    "karmicReprogramming",
    "cycleProphecy",
    "spiritualMark",
    "manifestationEnigma",
  ],
  love: [
    "loveAffectiveKarmaPortal",
    "loveCycles",
    "loveDestiny",
    "loveEssence",
    "loveKarmaHeranca",
    "loveManifestation",
    "loveReprogrammation",
    "loveSpiritMark",
  ],
  professional: [
    "professionalChallenges",
    "professionalCycles",
    "professionalKarmicHeranca",
    "professionalPropose",
    "professionalSpiritMark",
    "professionalSuccess",
    "professionalSuccessEnigma",
    "realizationProfessional",
  ]
};

// Get all category keys for a specific interpretation type
export function getAllCategories(type: InterpretationType = "karmic"): string[] {
  return CATEGORIES[type];
}

// Get display name for a category
export function getCategoryDisplayName(category: string, type: InterpretationType = "karmic"): string {
  const displayNames: Record<string, Record<string, string>> = {
    karmic: {
      karmicSeal: "Selo Kármico",
      destinyCall: "Chamado do Destino",
      karmaPortal: "Portal do Karma",
      karmicInheritance: "Herança Kármica",
      karmicReprogramming: "Reprogramação Kármica",
      cycleProphecy: "Profecia dos Ciclos",
      spiritualMark: "Marca Espiritual",
      manifestationEnigma: "Enigma da Manifestação",
    },
    love: {
      loveAffectiveKarmaPortal: "Portal Afetivo do Karma",
      loveCycles: "Ciclos do Amor",
      loveDestiny: "Destino Amoroso",
      loveEssence: "Essência do Amor",
      loveKarmaHeranca: "Herança do Karma Amoroso",
      loveManifestation: "Manifestação do Amor",
      loveReprogrammation: "Reprogramação Amorosa",
      loveSpiritMark: "Marca Espiritual do Amor",
    },
    professional: {
      professionalChallenges: "Desafios Profissionais",
      professionalCycles: "Ciclos Profissionais",
      professionalKarmicHeranca: "Herança Kármica Profissional",
      professionalPropose: "Propósito Profissional",
      professionalSpiritMark: "Marca Espiritual Profissional",
      professionalSuccess: "Sucesso Profissional",
      professionalSuccessEnigma: "Enigma do Sucesso Profissional",
      realizationProfessional: "Realização Profissional",
    }
  }
  
  return displayNames[type]?.[category] || category;
}

// Get display name for interpretation type
export function getInterpretationTypeDisplayName(type: InterpretationType): string {
  const displayNames: Record<InterpretationType, string> = {
    karmic: "Interpretação Kármica Pessoal",
    love: "Interpretação Amorosa",
    professional: "Interpretação Profissional"
  }
  return displayNames[type]
}