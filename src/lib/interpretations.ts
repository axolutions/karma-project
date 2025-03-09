import { toast } from "@/components/ui/use-toast"
import { SAMPLE_INTERPRETATIONS } from "./sample-interpretations"
import { supabase } from "@/integrations/supabase/client"

// Define types for interpretations
export interface Interpretation {
  id: string // e.g., "karmicSeal-1"
  title: string
  content: string
}

// Default interpretation text used when none is found
const DEFAULT_INTERPRETATION =
  "Interpretação não disponível para este número. Por favor, contate o administrador para adicionar este conteúdo."

// Store all interpretations in a map
let interpretations: Record<string, Interpretation> = {}


// Helper to generate interpretation ID
export function generateInterpretationId(category: string, number: number): string {
  return `${category}-${number}`
}

// Add or update an interpretation
export async function setInterpretation(category: string, number: number, title: string, content: string) {
  const id = generateInterpretationId(category, number)

  console.log("SETTING INTERPRETAITON", id, title)
  console.log(content)

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

  return data;
}

// Delete an interpretation
export function deleteInterpretation(category: string, number: number): void {
  const id = generateInterpretationId(category, number)

  if (interpretations[id]) {
    delete interpretations[id]
    saveInterpretations()

    toast({
      title: "Interpretação Removida",
      description: `A interpretação para ${category} número ${number} foi removida.`,
    })
  }
}

// Save interpretations to localStorage
function saveInterpretations(): void {
  try {
    localStorage.setItem("karmicInterpretations", JSON.stringify(interpretations))
    console.log("Interpretações salvas com sucesso no localStorage")
  } catch (error) {
    console.error("Erro ao salvar interpretações no localStorage:", error)
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