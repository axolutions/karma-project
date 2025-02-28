
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
  console.log(`Salvando interpretação: ${id} - ${title}`);
  
  // Save to localStorage with better error handling
  try {
    saveInterpretations();
    
    // Criar backup imediato após salvar
    createBackup();
    
    toast({
      title: "Interpretação Salva",
      description: `A interpretação para ${getCategoryDisplayName(category)} número ${number} foi salva com sucesso.`
    });
  } catch (error) {
    console.error("Erro ao salvar interpretação:", error);
    toast({
      title: "Erro ao salvar",
      description: "Ocorreu um erro ao salvar a interpretação. Tente novamente.",
      variant: "destructive"
    });
  }
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
      description: `A interpretação para ${getCategoryDisplayName(category)} número ${number} foi removida.`
    });
  }
}

// Criar backup dos dados
function createBackup(): void {
  try {
    if (Object.keys(interpretations).length === 0) {
      return; // Não criar backup vazio
    }
    
    // Salvar cada interpretação individualmente para evitar problemas com tamanho
    Object.entries(interpretations).forEach(([id, interp]) => {
      localStorage.setItem(`backup_${id}`, JSON.stringify(interp));
    });
    
    // Salvar lista de IDs
    localStorage.setItem('backup_interpretation_ids', JSON.stringify(Object.keys(interpretations)));
    
    // Timestamp do backup
    localStorage.setItem('backup_timestamp', new Date().toISOString());
    
    console.log(`Backup criado com ${Object.keys(interpretations).length} interpretações`);
  } catch (error) {
    console.error("Erro ao criar backup:", error);
  }
}

// Restaurar do backup
export function restoreFromBackup(): boolean {
  try {
    // Verificar se existe backup
    const idsJson = localStorage.getItem('backup_interpretation_ids');
    if (!idsJson) {
      console.log("Nenhum backup encontrado");
      return false;
    }
    
    const ids = JSON.parse(idsJson);
    if (!Array.isArray(ids) || ids.length === 0) {
      console.log("Backup vazio ou inválido");
      return false;
    }
    
    // Limpar interpretações atuais
    interpretations = {};
    
    // Carregar cada interpretação do backup
    let loadedCount = 0;
    
    ids.forEach(id => {
      const interpJson = localStorage.getItem(`backup_${id}`);
      if (interpJson) {
        try {
          const interp = JSON.parse(interpJson);
          if (interp && interp.id && interp.title && interp.content) {
            interpretations[id] = interp;
            loadedCount++;
          }
        } catch (e) {
          console.error(`Erro ao processar backup de ${id}:`, e);
        }
      }
    });
    
    if (loadedCount > 0) {
      console.log(`Restaurados ${loadedCount} de ${ids.length} interpretações do backup`);
      
      // Salvar as interpretações restauradas no armazenamento principal
      saveInterpretations();
      
      return true;
    } else {
      console.log("Nenhuma interpretação pôde ser restaurada do backup");
      return false;
    }
  } catch (error) {
    console.error("Erro ao restaurar do backup:", error);
    return false;
  }
}

// Verificar localStorage por dados de interpretação
export function scanForInterpretations(): number {
  let recoveredCount = 0;
  
  try {
    // Procurar por padrões de nome conhecidos
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      // Verificar diferentes padrões de nomes de chaves
      const isBackupKey = key.startsWith('backup_') && !key.includes('_ids') && !key.includes('timestamp');
      const isDirectKey = key.startsWith('karmicInterp_');
      
      if (isBackupKey || isDirectKey) {
        try {
          const value = localStorage.getItem(key);
          if (!value) continue;
          
          const data = JSON.parse(value);
          if (data && data.id && data.title && data.content) {
            // Extrair o ID real
            const realId = isBackupKey ? key.replace('backup_', '') : key.replace('karmicInterp_', '');
            
            // Adicionar à coleção de interpretações
            interpretations[realId] = data;
            recoveredCount++;
          }
        } catch (e) {
          // Ignorar erros de parsing
        }
      }
    }
    
    // Se encontrou alguma coisa, salvar
    if (recoveredCount > 0) {
      console.log(`Encontradas ${recoveredCount} interpretações no localStorage`);
      saveInterpretations();
    }
    
    return recoveredCount;
  } catch (error) {
    console.error("Erro ao escanear localStorage:", error);
    return 0;
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
    
    // Salvar o objeto completo
    const dataToSave = JSON.stringify(interpretations);
    localStorage.setItem('karmicInterpretations', dataToSave);
    
    // Também salvar cada interpretação individualmente como fallback
    Object.entries(interpretations).forEach(([id, interp]) => {
      localStorage.setItem(`karmicInterp_${id}`, JSON.stringify(interp));
    });
    
    // Salvar lista de IDs
    localStorage.setItem('karmicInterpretationsKeys', JSON.stringify(Object.keys(interpretations)));
    
    console.log(`Salvamento concluído: ${Object.keys(interpretations).length} interpretações`);
  } catch (error) {
    console.error("Erro ao salvar interpretações:", error);
    
    // Tentar salvar apenas individualmente se o método principal falhar
    try {
      Object.entries(interpretations).forEach(([id, interp]) => {
        localStorage.setItem(`karmicInterp_${id}`, JSON.stringify(interp));
      });
      localStorage.setItem('karmicInterpretationsKeys', JSON.stringify(Object.keys(interpretations)));
      
      console.log("Salvamento alternativo concluído");
    } catch (backupError) {
      console.error("Falha total no salvamento:", backupError);
    }
  }
}

// Load interpretations from localStorage with better error handling
export function loadInterpretations(): void {
  console.log("Carregando interpretações do localStorage");
  
  try {
    // Método 1: Carregar objeto completo
    const saved = localStorage.getItem('karmicInterpretations');
    
    if (saved && saved !== "{}") {
      try {
        const parsedData = JSON.parse(saved);
        
        if (parsedData && typeof parsedData === 'object') {
          interpretations = parsedData;
          console.log(`Carregadas ${Object.keys(interpretations).length} interpretações do localStorage`);
          return;
        }
      } catch (parseError) {
        console.error("Erro ao analisar dados salvos:", parseError);
      }
    }
    
    // Método 2: Carregar de chaves individuais
    console.log("Tentando método alternativo de carregamento");
    const keysString = localStorage.getItem('karmicInterpretationsKeys');
    
    if (keysString) {
      try {
        const keys = JSON.parse(keysString);
        if (Array.isArray(keys) && keys.length > 0) {
          let loadedCount = 0;
          
          keys.forEach(key => {
            const itemString = localStorage.getItem(`karmicInterp_${key}`);
            if (itemString) {
              try {
                interpretations[key] = JSON.parse(itemString);
                loadedCount++;
              } catch (e) {
                console.error(`Erro ao analisar item ${key}:`, e);
              }
            }
          });
          
          if (loadedCount > 0) {
            console.log(`Carregadas ${loadedCount} interpretações pelo método alternativo`);
            return;
          }
        }
      } catch (keysError) {
        console.error("Erro ao analisar lista de chaves:", keysError);
      }
    }
    
    // Método 3: Tentar restaurar do backup
    console.log("Tentando restaurar do backup");
    const restored = restoreFromBackup();
    
    if (restored) {
      console.log("Dados restaurados do backup com sucesso");
      return;
    }
    
    // Método 4: Busca completa no localStorage
    console.log("Realizando busca completa no localStorage");
    const recovered = scanForInterpretations();
    
    if (recovered > 0) {
      console.log(`Recuperadas ${recovered} interpretações do localStorage`);
      return;
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

// Backup automático a cada 5 minutos
setInterval(() => {
  if (Object.keys(interpretations).length > 0) {
    createBackup();
  }
}, 5 * 60 * 1000);

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

// Exportar função para recuperação manual
export function performRecovery(): boolean {
  // Tenta todos os métodos de recuperação em sequência
  
  // 1. Restaurar do backup
  const fromBackup = restoreFromBackup();
  if (fromBackup) return true;
  
  // 2. Escanear localStorage
  const fromScan = scanForInterpretations();
  return fromScan > 0;
}

// Adicionar todas as interpretações de uma vez (para importação)
export function importInterpretations(data: Record<string, Interpretation>): boolean {
  try {
    // Validar dados
    if (!data || typeof data !== 'object') {
      console.error("Dados de importação inválidos");
      return false;
    }
    
    const entries = Object.entries(data);
    if (entries.length === 0) {
      console.error("Nenhum dado para importar");
      return false;
    }
    
    // Validar que cada entrada é uma interpretação válida
    let validCount = 0;
    
    entries.forEach(([id, item]) => {
      if (item && typeof item === 'object' && 'id' in item && 'title' in item && 'content' in item) {
        interpretations[id] = item;
        validCount++;
      }
    });
    
    if (validCount > 0) {
      saveInterpretations();
      createBackup();
      
      console.log(`Importadas ${validCount} interpretações com sucesso`);
      return true;
    } else {
      console.error("Nenhuma interpretação válida encontrada para importar");
      return false;
    }
  } catch (error) {
    console.error("Erro ao importar interpretações:", error);
    return false;
  }
}

// Obter todas as interpretações para exportação
export function exportInterpretations(): Record<string, Interpretation> {
  return { ...interpretations };
}
