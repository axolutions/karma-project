
import { toast } from "@/components/ui/use-toast";

// Define types for interpretations
export interface Interpretation {
  id: string; // e.g., "karmicSeal-1"
  title: string;
  content: string;
}

// Default interpretation text used when none is found
const DEFAULT_INTERPRETATION = "Interpretação não disponível para este número. Por favor, contate o administrador para adicionar este conteúdo.";

// Store all interpretations in a map
let interpretations: Record<string, Interpretation> = {};

// Helper to generate interpretation ID
export function generateInterpretationId(category: string, number: number): string {
  return `${category}-${number}`;
}

// Add or update an interpretation
export function setInterpretation(category: string, number: number, title: string, content: string): void {
  const id = generateInterpretationId(category, number);
  
  interpretations[id] = {
    id,
    title,
    content
  };
  
  // Save to localStorage
  saveInterpretations();
  
  toast({
    title: "Interpretação Salva",
    description: `A interpretação para ${category} número ${number} foi salva com sucesso.`
  });
}

// Get an interpretation
export function getInterpretation(category: string, number: number): Interpretation {
  const id = generateInterpretationId(category, number);
  
  // If not found, return a default interpretation
  if (!interpretations[id]) {
    return {
      id,
      title: `${getCategoryDisplayName(category)} ${number}`,
      content: DEFAULT_INTERPRETATION
    };
  }
  
  return interpretations[id];
}

// Get all interpretations
export function getAllInterpretations(): Interpretation[] {
  return Object.values(interpretations);
}

// Delete an interpretation
export function deleteInterpretation(category: string, number: number): void {
  const id = generateInterpretationId(category, number);
  
  if (interpretations[id]) {
    delete interpretations[id];
    saveInterpretations();
    
    toast({
      title: "Interpretação Removida",
      description: `A interpretação para ${category} número ${number} foi removida.`
    });
  }
}

// Save interpretations to localStorage
function saveInterpretations(): void {
  localStorage.setItem('karmicInterpretations', JSON.stringify(interpretations));
}

// Load interpretations from localStorage
export function loadInterpretations(): void {
  const saved = localStorage.getItem('karmicInterpretations');
  
  if (saved) {
    try {
      interpretations = JSON.parse(saved);
    } catch (error) {
      console.error("Error parsing saved interpretations:", error);
    }
  }
}

// Initialize interpretations from localStorage
loadInterpretations();

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
    manifestationEnigma: "Enigma da Manifestação"
  };
  
  return displayNames[category] || category;
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
    "manifestationEnigma"
  ];
}

// Helper function to render HTML content safely
export function renderHTML(html: string) {
  // Processar o HTML para adicionar classes e formatação automática
  return { __html: html };
}
