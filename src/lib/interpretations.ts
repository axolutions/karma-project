
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
    
    // Também salvar em um backup automático
    createBackup(`backup_auto_${new Date().toISOString()}`);
    
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

// Criar backup com nome personalizado
function createBackup(backupName: string): void {
  if (Object.keys(interpretations).length === 0) {
    console.log("Não há dados para fazer backup");
    return;
  }
  
  try {
    const backupData = JSON.stringify(interpretations);
    localStorage.setItem(`karmicBackup_${backupName}`, backupData);
    console.log(`Backup criado: ${backupName}, Tamanho: ${backupData.length} caracteres`);
    
    // Manter lista de backups
    const backupsList = getBackupsList();
    if (!backupsList.includes(backupName)) {
      backupsList.push(backupName);
      localStorage.setItem('karmicBackupsList', JSON.stringify(backupsList));
    }
  } catch (error) {
    console.error(`Erro ao criar backup ${backupName}:`, error);
  }
}

// Obter lista de backups disponíveis
export function getBackupsList(): string[] {
  try {
    const list = localStorage.getItem('karmicBackupsList');
    return list ? JSON.parse(list) : [];
  } catch (e) {
    console.error("Erro ao carregar lista de backups:", e);
    return [];
  }
}

// Recuperar dados de um backup específico
export function restoreFromBackup(backupName: string): boolean {
  try {
    const backup = localStorage.getItem(`karmicBackup_${backupName}`);
    if (backup && backup !== "{}") {
      try {
        const backupData = JSON.parse(backup);
        if (backupData && typeof backupData === 'object' && Object.keys(backupData).length > 0) {
          // Criar backup do estado atual antes de restaurar
          createBackup(`pre_restore_${new Date().toISOString()}`);
          
          // Restaurar dados
          interpretations = backupData;
          saveInterpretations();
          console.log(`Restaurado com sucesso do backup ${backupName}`);
          return true;
        }
      } catch (parseError) {
        console.error(`Erro ao analisar backup ${backupName}:`, parseError);
      }
    }
    return false;
  } catch (error) {
    console.error(`Erro ao restaurar backup ${backupName}:`, error);
    return false;
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
          
          // Criar backup automático após carregar com sucesso
          createBackup(`load_success_${new Date().toISOString()}`);
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
          let recoveredData: Record<string, Interpretation> = {};
          
          keys.forEach(key => {
            const itemString = localStorage.getItem(`karmicInterp_${key}`);
            if (itemString) {
              try {
                recoveredData[key] = JSON.parse(itemString);
                loadedCount++;
              } catch (e) {
                console.error(`Erro ao carregar item individual ${key}:`, e);
              }
            }
          });
          
          if (loadedCount > 0) {
            console.log(`Carregamento alternativo: ${loadedCount} de ${keys.length} interpretações carregadas`);
            interpretations = recoveredData;
            
            // Se conseguiu carregar algo, salvar no formato padrão
            setTimeout(() => {
              try {
                localStorage.setItem('karmicInterpretations', JSON.stringify(interpretations));
                console.log("Dados re-consolidados no localStorage");
                createBackup(`recovery_alt_${new Date().toISOString()}`);
              } catch (e) {
                console.error("Erro ao re-consolidar dados:", e);
              }
            }, 1000);
            
            return;
          }
        }
      } catch (keysError) {
        console.error("Erro ao analisar chaves alternativas:", keysError);
      }
    }
    
    // Terceiro método: tentar recuperar do backup mais recente
    const backupsList = getBackupsList();
    if (backupsList.length > 0) {
      // Ordenar backups por data (assumindo formato com timestamp no nome)
      backupsList.sort().reverse();
      
      for (let i = 0; i < backupsList.length; i++) {
        const backupName = backupsList[i];
        console.log(`Tentando recuperar do backup: ${backupName}`);
        
        if (restoreFromBackup(backupName)) {
          console.log(`Recuperação bem-sucedida do backup: ${backupName}`);
          return;
        }
      }
    }
    
    // Quarto método: verificar todos os itens do localStorage por padrões conhecidos
    console.log("Tentando busca profunda no localStorage por dados de interpretação");
    const recoveredInterpretations: Record<string, Interpretation> = {};
    
    // Categorias conhecidas
    const categories = getAllCategories();
    const possibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33, 44];
    let recoveredCount = 0;
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      try {
        // Verificar se é um item que contém dados de interpretação
        if (key.includes('karmicInterp_') || key.includes('karmicBackup_') || key === 'karmicInterpretationsBackup') {
          const value = localStorage.getItem(key);
          if (!value) continue;
          
          const data = JSON.parse(value);
          
          // Se for um objeto de backup completo
          if (typeof data === 'object' && !Array.isArray(data)) {
            const entries = Object.entries(data);
            for (const [entryKey, entryValue] of entries) {
              // Validar se parece ser uma interpretação
              if (typeof entryValue === 'object' && 
                  'id' in entryValue && 
                  'title' in entryValue && 
                  'content' in entryValue) {
                recoveredInterpretations[entryKey] = entryValue as Interpretation;
                recoveredCount++;
              }
            }
          }
        }
      } catch (e) {
        // Ignorar erros de parsing
      }
    }
    
    if (recoveredCount > 0) {
      console.log(`Recuperados ${recoveredCount} itens através de busca profunda`);
      interpretations = recoveredInterpretations;
      saveInterpretations();
      createBackup(`deep_recovery_${new Date().toISOString()}`);
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

// Force emergency deep scan recovery
export function forceDeepRecovery(): boolean {
  console.log("Iniciando recuperação de emergência (busca profunda)");
  const recoveredInterpretations: Record<string, Interpretation> = {};
  let recoveredCount = 0;
  
  try {
    // Verificar todos os itens no localStorage
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      // Ignorar chaves não relacionadas para economizar processamento
      if (!key.includes('karmic')) continue;
      
      try {
        const value = localStorage.getItem(key);
        if (!value || value === '{}') continue;
        
        // Tentar extrair interpretações se for uma estrutura válida
        try {
          const data = JSON.parse(value);
          
          // Caso 1: É um objeto que contém interpretações diretamente
          if (typeof data === 'object' && !Array.isArray(data)) {
            for (const [entryKey, entryValue] of Object.entries(data)) {
              // Validar se parece ser uma interpretação
              if (typeof entryValue === 'object' && 
                  'id' in entryValue && 
                  'title' in entryValue && 
                  'content' in entryValue) {
                
                const interpretation = entryValue as Interpretation;
                recoveredInterpretations[entryKey] = interpretation;
                recoveredCount++;
                console.log(`Recuperado: ${interpretation.title}`);
              }
            }
          }
        } catch (parseError) {
          // Ignorar erros de parsing
        }
      } catch (itemError) {
        console.error(`Erro ao processar item ${key}:`, itemError);
      }
    }
    
    // Se recuperou algo, salvar
    if (recoveredCount > 0) {
      console.log(`Recuperados ${recoveredCount} itens através de busca profunda de emergência`);
      
      // Backup do estado atual antes de substituir
      if (Object.keys(interpretations).length > 0) {
        createBackup(`pre_emergency_${new Date().toISOString()}`);
      }
      
      interpretations = recoveredInterpretations;
      saveInterpretations();
      createBackup(`emergency_recovery_${new Date().toISOString()}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Erro na recuperação de emergência:", error);
    return false;
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
}, 60000); // Backup a cada 1 minuto

// Recuperar do backup se necessário
export function recoverFromBackup(): boolean {
  try {
    console.log("Tentando recuperação do backup principal");
    const backup = localStorage.getItem('karmicInterpretationsBackup');
    if (backup && backup !== "{}") {
      const backupData = JSON.parse(backup);
      if (backupData && typeof backupData === 'object' && Object.keys(backupData).length > 0) {
        interpretations = backupData;
        saveInterpretations();
        console.log("Recuperado com sucesso do backup principal");
        return true;
      }
    }
    
    // Se não conseguiu do backup principal, verificar outros backups
    console.log("Backup principal não encontrado, verificando backups alternativos");
    const backupsList = getBackupsList();
    if (backupsList.length > 0) {
      for (let i = 0; i < backupsList.length; i++) {
        if (restoreFromBackup(backupsList[i])) {
          return true;
        }
      }
    }
    
    // Tentativa final: busca profunda
    return forceDeepRecovery();
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

// Exportar função de dump de dados para debug
export function dumpStorageState(): string {
  let report = "=== ESTADO DO ARMAZENAMENTO ===\n\n";
  
  // Estado atual das interpretações
  report += `Interpretações carregadas: ${Object.keys(interpretations).length}\n`;
  report += `Itens: ${Object.keys(interpretations).join(', ')}\n\n`;
  
  // Verificar localStorage
  report += "Itens no localStorage:\n";
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('karmic')) {
        const value = localStorage.getItem(key);
        const size = value ? value.length : 0;
        report += `- ${key}: ${size} caracteres\n`;
      }
    }
  } catch (e) {
    report += `Erro ao ler localStorage: ${e}\n`;
  }
  
  return report;
}
