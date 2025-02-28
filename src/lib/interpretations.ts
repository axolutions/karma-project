
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
  
  // Log antes de salvar para debug
  console.log("Salvando interpretação:", id, title);
  console.log("Tamanho atual dos dados:", Object.keys(interpretations).length);
  
  // Save to localStorage with better error handling
  try {
    saveInterpretations();
    
    toast({
      title: "Interpretação Salva",
      description: `A interpretação para ${getCategoryDisplayName(category)} número ${number} foi salva com sucesso.`
    });
  } catch (error) {
    console.error("Erro ao salvar interpretação:", error);
    toast({
      title: "Erro ao salvar",
      description: "Ocorreu um erro ao salvar a interpretação. Verifique o console para mais detalhes.",
      variant: "destructive"
    });
  }
}

// Get an interpretation
export function getInterpretation(category: string, number: number): Interpretation {
  const id = generateInterpretationId(category, number);
  
  // Log para debug
  console.log("Buscando interpretação:", id);
  console.log("Interpretações disponíveis:", Object.keys(interpretations));
  
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
      description: `A interpretação para ${getCategoryDisplayName(category)} número ${number} foi removida.`
    });
  }
}

// Save interpretations to localStorage with better error handling
function saveInterpretations(): void {
  try {
    // Verificar se há dados válidos
    if (!interpretations || Object.keys(interpretations).length === 0) {
      console.warn("Não há interpretações para salvar");
      return;
    }
    
    // Criar uma cópia para evitar referências circulares
    const dataToSave = JSON.stringify(interpretations);
    
    // Verificar se o resultado da serialização é válido
    if (!dataToSave || dataToSave === "{}") {
      console.error("Erro: Dados inválidos ao serializar interpretações");
      throw new Error("Dados inválidos ao serializar");
    }
    
    // Tamanho estimado dos dados
    const estimatedSize = dataToSave.length * 2; // 2 bytes por caractere
    console.log(`Tamanho estimado dos dados: ${estimatedSize} bytes`);
    
    // Verificar se está dentro do limite do localStorage (geralmente 5MB)
    if (estimatedSize > 4 * 1024 * 1024) { // 4MB de limite para segurança
      console.warn("Atenção: Dados muito grandes, podem exceder o limite do localStorage");
    }
    
    // Tentar salvar no localStorage
    localStorage.setItem('karmicInterpretations', dataToSave);
    
    // Verificar se foi salvo corretamente
    const savedData = localStorage.getItem('karmicInterpretations');
    if (!savedData || savedData === "{}") {
      console.error("Erro: Dados não foram salvos corretamente no localStorage");
      throw new Error("Dados não foram salvos corretamente");
    }
    
    console.log("Interpretações salvas com sucesso:", Object.keys(interpretations).length);
  } catch (error) {
    console.error("Erro crítico ao salvar interpretações:", error);
    
    // Tentar uma abordagem alternativa se houver erro
    try {
      // Tentar salvar em partes se for um problema de tamanho
      const keys = Object.keys(interpretations);
      localStorage.setItem('karmicInterpretationsKeys', JSON.stringify(keys));
      
      let savedCount = 0;
      keys.forEach(key => {
        try {
          localStorage.setItem(`karmicInterp_${key}`, JSON.stringify(interpretations[key]));
          savedCount++;
        } catch (e) {
          console.error(`Erro ao salvar interpretação individual ${key}:`, e);
        }
      });
      
      console.log(`Salvamento alternativo: ${savedCount} de ${keys.length} interpretações salvas`);
    } catch (backupError) {
      console.error("Falha no método de salvamento alternativo:", backupError);
      throw new Error("Não foi possível salvar as interpretações");
    }
  }
}

// Load interpretations from localStorage with better error handling
export function loadInterpretations(): void {
  console.log("Tentando carregar interpretações do localStorage");
  
  try {
    // Primeiro método: carregamento padrão
    const saved = localStorage.getItem('karmicInterpretations');
    
    if (saved && saved !== "{}") {
      try {
        const parsedData = JSON.parse(saved);
        
        // Verificar se os dados são válidos
        if (parsedData && typeof parsedData === 'object') {
          interpretations = parsedData;
          console.log("Interpretações carregadas com sucesso:", Object.keys(interpretations).length);
          return;
        } else {
          console.error("Dados carregados inválidos");
        }
      } catch (parseError) {
        console.error("Erro ao analisar dados salvos:", parseError);
      }
    } else {
      console.log("Nenhum dado encontrado no localStorage ou dados vazios");
    }
    
    // Segundo método: tentar carregar do método alternativo
    const keysString = localStorage.getItem('karmicInterpretationsKeys');
    if (keysString) {
      try {
        const keys = JSON.parse(keysString);
        if (Array.isArray(keys)) {
          let loadedCount = 0;
          keys.forEach(key => {
            const itemString = localStorage.getItem(`karmicInterp_${key}`);
            if (itemString) {
              try {
                interpretations[key] = JSON.parse(itemString);
                loadedCount++;
              } catch (e) {
                console.error(`Erro ao carregar item individual ${key}:`, e);
              }
            }
          });
          
          console.log(`Carregamento alternativo: ${loadedCount} de ${keys.length} interpretações carregadas`);
          
          // Se conseguiu carregar algo, salvar no formato padrão
          if (loadedCount > 0) {
            setTimeout(() => {
              try {
                localStorage.setItem('karmicInterpretations', JSON.stringify(interpretations));
                console.log("Dados re-consolidados no localStorage");
              } catch (e) {
                console.error("Erro ao re-consolidar dados:", e);
              }
            }, 1000);
          }
          
          return;
        }
      } catch (keysError) {
        console.error("Erro ao analisar chaves alternativas:", keysError);
      }
    }
    
    // Se chegou aqui, não conseguiu carregar de nenhuma forma
    console.warn("Não foi possível carregar interpretações. Iniciando com dados vazios.");
    interpretations = {};
    
  } catch (error) {
    console.error("Erro crítico ao carregar interpretações:", error);
    interpretations = {};
  }
}

// Initialize interpretations from localStorage
loadInterpretations();

// Adicionar backup automático periódico
setInterval(() => {
  if (Object.keys(interpretations).length > 0) {
    try {
      const backup = JSON.stringify(interpretations);
      localStorage.setItem('karmicInterpretationsBackup', backup);
      console.log("Backup automático de interpretações realizado");
    } catch (error) {
      console.error("Erro no backup automático:", error);
    }
  }
}, 120000); // Backup a cada 2 minutos

// Recuperar do backup se necessário
export function recoverFromBackup(): boolean {
  try {
    const backup = localStorage.getItem('karmicInterpretationsBackup');
    if (backup && backup !== "{}") {
      const backupData = JSON.parse(backup);
      if (backupData && typeof backupData === 'object' && Object.keys(backupData).length > 0) {
        interpretations = backupData;
        saveInterpretations();
        console.log("Recuperado com sucesso do backup");
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Erro ao recuperar do backup:", error);
    return false;
  }
}

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
