import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { DEFAULT_INTERPRETATION } from "@/lib/default-interpretations"

// Define types for interpretations
export interface Interpretation {
  id: string // e.g., "karmicSeal-1"
  title: string
  content: string
}

// Store all interpretations in a map
let interpretations: Record<string, Interpretation> = {}


// Helper to generate interpretation ID
export function generateInterpretationId(category: string, number: number): string {
  return `${category}-${number}`
}

// Add or update an interpretation
export async function setInterpretation(category: string, number: number, title: string, content: string) {
  const id = generateInterpretationId(category, number)

  try {
    const { error } = await supabase.from("karmic_interpretations").upsert({
      id,
      title,
      content,
    })

    if (error) {
      throw error;
    }

    toast({
      title: "Interpretação Salva",
      description: `A interpretação para ${getCategoryDisplayName(category)} número ${number} foi salva com sucesso.`,
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
export async function getInterpretation(category: string, number: number) {
  const id = generateInterpretationId(category, number)

  console.log(`Buscando interpretação para: ${id}`)

  const { data } = await supabase.from("karmic_interpretations").select("*").eq("id", id).single();

  return data ?? { title: "", content: DEFAULT_INTERPRETATION }
}

// Delete an interpretation
export async function deleteInterpretation(category: string, number: number) {
  const id = generateInterpretationId(category, number)

  try {
    await supabase.from("karmic_interpretations").delete().eq("id", id);

    toast({
      title: "Interpretação Removida",
      description: `A interpretação para ${category} número ${number} foi removida.`,
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

// Get display name for a category
export function getCategoryDisplayName(category: string): string {
  const displayNames: Record<string, string> = {
    karmicSeal: "Selo Kármico",
    destinyCall: "Chamado do Destino",
    karmaPortal: "Portal do Karma",
    karmicInheritance: "Herança Kármica",
    karmicReprogramming: "Códex da Reprogramação",
    cycleProphecy: "Profecia dos Ciclos",
    spiritualMark: "Marca Espiritual",
    manifestationEnigma: "Enigma da Manifestação",
  }

  return displayNames[category] || category
}

// Get all category keys
export function getAllCategories(): string[] {
  return [
    "karmicSeal",
    "destinyCall",
    "karmaPortal",
    "karmicInheritance",
    "karmicReprogramming",
    "cycleProphecy",
    "spiritualMark",
    "manifestationEnigma",
  ]
}