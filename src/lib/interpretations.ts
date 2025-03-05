import { toast } from "@/components/ui/use-toast"
import { SAMPLE_INTERPRETATIONS } from "./sample-interpretations"

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
export function setInterpretation(category: string, number: number, title: string, content: string): void {
  const id = generateInterpretationId(category, number)

  // Check if we're overriding a sample interpretation
  const isOverridingSample = SAMPLE_INTERPRETATIONS[id] !== undefined

  console.log("SETTING INTERPRETAITON", id, title)
  console.log(content)

  interpretations[id] = {
    id,
    title,
    content,
  }

  // Save to localStorage
  saveInterpretations()

  console.log(`Interpretação ${id} ${isOverridingSample ? "(sobrescrevendo amostra)" : ""} salva com sucesso`)

  toast({
    title: "Interpretação Salva",
    description: `A interpretação para ${getCategoryDisplayName(category)} número ${number} foi salva com sucesso.${isOverridingSample ? " (Sobrescrevendo amostra)" : ""}`,
  })
}

// Get an interpretation
export function getInterpretation(category: string, number: number): Interpretation {
  const id = generateInterpretationId(category, number)

  console.log(`Buscando interpretação para: ${id}`)

  // First check if it exists in the user's saved interpretations
  if (interpretations[id]) {
    console.log(`Interpretação encontrada em interpretations para ${id}`)
    return interpretations[id]
  }

  // If not found in loaded interpretations, check sample interpretations
  if (SAMPLE_INTERPRETATIONS[id]) {
    console.log(`Interpretação encontrada em SAMPLE_INTERPRETATIONS para ${id}`)
    return SAMPLE_INTERPRETATIONS[id]
  }

  console.log(`Interpretação não encontrada para ${id}, retornando interpretação padrão`)
  return {
    id,
    title: `${getCategoryDisplayName(category)} ${number}`,
    content: DEFAULT_INTERPRETATION,
  }
}

// Get all interpretations
export function getAllInterpretations(): Interpretation[] {
  return Object.values(interpretations)
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

// Load interpretations from localStorage
export function loadInterpretations(): void {
  console.log("Tentando carregar interpretações do localStorage...")
  try {
    const saved = localStorage.getItem("karmicInterpretations")

    if (saved) {
      console.log("Dados de interpretações encontrados no localStorage")
      const loadedInterpretations = JSON.parse(saved)

      // Verificar se as interpretações foram carregadas corretamente
      const count = Object.keys(loadedInterpretations).length
      console.log(`Número de interpretações carregadas: ${count}`)

      // Inicializar com as interpretações carregadas
      interpretations = loadedInterpretations

      if (count === 0) {
        console.log("Nenhuma interpretação encontrada no localStorage, carregando amostras")
        // Se não houver interpretações salvas, preencher com as amostras
        Object.assign(interpretations, SAMPLE_INTERPRETATIONS)
        // Salvar essas amostras no localStorage para uso futuro
        saveInterpretations()
      }
    } else {
      console.log("Nenhum dado de interpretações encontrado no localStorage, carregando amostras")
      // Carregar interpretações de amostra
      interpretations = { ...SAMPLE_INTERPRETATIONS }
      // Salvar essas amostras no localStorage para uso futuro
      saveInterpretations()
    }
  } catch (error) {
    console.error("Erro ao carregar interpretações:", error)
    // Em caso de erro, carregar as interpretações de amostra
    interpretations = { ...SAMPLE_INTERPRETATIONS }
  }
}

// Ensure we have all sample interpretations available as a fallback
export function ensureSampleInterpretationsLoaded(): void {
  console.log("Verificando se as interpretações de amostra estão disponíveis...")

  let needToSave = false

  // Check if we have all sample interpretations and add any missing ones
  Object.entries(SAMPLE_INTERPRETATIONS).forEach(([id, interpretation]) => {
    if (!interpretations[id]) {
      console.log(`Adicionando interpretação de amostra faltante: ${id}`)
      interpretations[id] = interpretation
      needToSave = true
    }
  })

  // If we added any missing sample interpretations, save to localStorage
  if (needToSave) {
    console.log("Salvando interpretações de amostra adicionadas")
    saveInterpretations()
  }
}

// Força a adição das interpretações de amostra como fallback em produção
export function forceLoadSampleInterpretations(): void {
  if (true) return;
  console.log("Forçando carregamento de interpretações de amostra para ambiente de produção")
  // Carregar interpretações de amostra diretamente
  Object.entries(SAMPLE_INTERPRETATIONS).forEach(([id, interpretation]) => {
    interpretations[id] = interpretation
  })

  // Salvar no localStorage
  saveInterpretations()
  console.log("Interpretações de amostra forçadas carregadas e salvas")
}

// Initialize interpretations from localStorage on module load
console.log("Inicializando módulo de interpretações")
loadInterpretations()
ensureSampleInterpretationsLoaded() // Make sure we at least have sample interpretations

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

// Helper function to render HTML content safely
export function renderHTML(html: string) {
  // Processar o HTML para adicionar classes e formatação automática
  return { __html: html }
}

// Generate HTML for download
export function generateInterpretationsHTML(karmicData: any): string {
  if (!karmicData) return "<p>Nenhum dado kármico disponível.</p>"

  const categories = getAllCategories()
  let htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Suas Interpretações Kármicas</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          color: #333; 
          line-height: 1.6; 
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        h1 { 
          color: #8B5CF6; 
          text-align: center; 
          margin-bottom: 20px; 
          font-size: 28px;
        }
        h2 { 
          color: #8B5CF6; 
          margin-top: 30px; 
          border-bottom: 1px solid #ddd; 
          padding-bottom: 8px; 
          font-size: 20px;
        }
        h3 { 
          color: #6D28D9; 
          margin-top: 20px; 
          font-size: 18px;
        }
        p { margin-bottom: 10px; }
        .header {
          margin-bottom: 30px;
          text-align: center;
        }
        .date {
          font-size: 14px;
          color: #666;
          text-align: center;
          margin-bottom: 30px;
        }
        .interpretation { 
          margin-bottom: 40px; 
          padding: 20px; 
          border-radius: 8px; 
          background-color: #f9f7ff; 
          border: 1px solid #e4e0ec;
        }
        .affirmation-box { 
          background-color: #f0ebff; 
          padding: 15px; 
          border-radius: 8px; 
          margin: 20px 0; 
          border-left: 4px solid #8B5CF6;
        }
        .affirmation-title { 
          color: #6D28D9; 
          margin-top: 0; 
        }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; }
        img.logo {
          max-width: 120px;
          margin: 0 auto 20px auto;
          display: block;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Suas Interpretações Kármicas</h1>
        <div class="date">Gerado em: ${new Date().toLocaleDateString("pt-BR")}</div>
      </div>
  `

  // Verificar se temos números kármicos válidos
  let hasValidData = false

  // Adicionar cada categoria de interpretação
  categories.forEach((category) => {
    if (karmicData[category] || karmicData[category] === 0) {
      const number = karmicData[category]
      const interpretation = getInterpretation(category, number)

      // Verifica se temos conteúdo real para adicionar
      if (interpretation && interpretation.content && interpretation.content !== DEFAULT_INTERPRETATION) {
        hasValidData = true

        htmlContent += `
          <div class="interpretation">
            <h2>${interpretation.title}</h2>
            ${interpretation.content}
          </div>
        `
      }
    }
  })

  // Se não houver dados válidos
  if (!hasValidData) {
    htmlContent += `
      <div style="text-align: center; padding: 40px 20px;">
        <p style="color: #6b7280; font-size: 18px;">
          Não foram encontradas interpretações para seus números kármicos.
        </p>
        <p style="color: #8B5CF6; margin-top: 20px;">
          Por favor, contate o administrador para adicionar interpretações.
        </p>
      </div>
    `
  }

  htmlContent += `
    </body>
    </html>
  `

  return htmlContent
}

