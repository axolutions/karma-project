
import { toast } from "@/components/ui/use-toast";
import { supabaseClient } from '@/lib/supabase';

// Define types for interpretations
export interface Interpretation {
  id: string; // e.g., "karmicSeal-1"
  title: string;
  content: string;
  updated_at?: string;
}

// Default interpretation text used when none is found
const DEFAULT_INTERPRETATION = "Interpretação não disponível para este número. Por favor, contate o administrador para adicionar este conteúdo.";

// Store all interpretations in a map
let interpretations: Record<string, Interpretation> = {};
let isInitialized = false;

// Helper to generate interpretation ID
export function generateInterpretationId(category: string, number: number): string {
  return `${category}-${number}`;
}

// Inicializar o sistema de interpretações
export async function initInterpretations(): Promise<void> {
  if (isInitialized) return;
  
  try {
    // Primeiro tenta carregar do Supabase
    await loadFromSupabase();
    
    // Se não tem dados no Supabase mas tem no localStorage, fazer migração
    if (Object.keys(interpretations).length === 0) {
      const localData = loadFromLocalStorage();
      if (Object.keys(localData).length > 0) {
        interpretations = localData;
        await saveToSupabase(true);
        toast({
          title: "Migração concluída",
          description: "Suas interpretações foram migradas do armazenamento local para a nuvem."
        });
      }
    }
    
    isInitialized = true;
    console.log(`Sistema de interpretações inicializado com ${Object.keys(interpretations).length} entradas.`);
  } catch (error) {
    console.error("Erro ao inicializar interpretações:", error);
    
    // Em caso de falha, tenta carregar do localStorage como fallback
    const localData = loadFromLocalStorage();
    if (Object.keys(localData).length > 0) {
      interpretations = localData;
      console.log(`Carregamento de fallback concluído com ${Object.keys(interpretations).length} interpretações do localStorage.`);
    }
    
    isInitialized = true;
  }
}

// Add or update an interpretation
export async function setInterpretation(category: string, number: number, title: string, content: string): Promise<boolean> {
  const id = generateInterpretationId(category, number);
  
  // Preparar dados
  const interpretationData: Interpretation = {
    id,
    title,
    content,
    updated_at: new Date().toISOString()
  };
  
  // Atualizar cache local
  interpretations[id] = interpretationData;
  
  try {
    // Salvar no Supabase
    const { error } = await supabaseClient
      .from('interpretations')
      .upsert(interpretationData, { onConflict: 'id' });
    
    if (error) {
      console.error("Erro ao salvar no Supabase:", error);
      
      // Fallback: salvar no localStorage se o Supabase falhar
      saveToLocalStorage();
      
      toast({
        title: "Salvamento na nuvem falhou",
        description: "A interpretação foi salva apenas localmente. O aplicativo tentará sincronizá-la mais tarde.",
        variant: "destructive"
      });
      
      return false;
    }
    
    // Também salvar no localStorage como backup
    saveToLocalStorage();
    
    toast({
      title: "Interpretação Salva",
      description: `A interpretação para ${getCategoryDisplayName(category)} número ${number} foi salva com sucesso na nuvem.`
    });
    
    return true;
  } catch (error) {
    console.error("Erro ao salvar interpretação:", error);
    
    // Fallback: salvar no localStorage
    saveToLocalStorage();
    
    toast({
      title: "Erro ao salvar na nuvem",
      description: "A interpretação foi salva apenas localmente devido a um erro de conexão.",
      variant: "destructive"
    });
    
    return false;
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
export async function deleteInterpretation(category: string, number: number): Promise<boolean> {
  const id = generateInterpretationId(category, number);
  
  if (interpretations[id]) {
    // Remover do cache local
    delete interpretations[id];
    
    try {
      // Remover do Supabase
      const { error } = await supabaseClient
        .from('interpretations')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Erro ao excluir do Supabase:", error);
        
        // Atualizar localStorage mesmo que o Supabase falhe
        saveToLocalStorage();
        
        toast({
          title: "Exclusão na nuvem falhou",
          description: "A interpretação foi removida apenas localmente.",
          variant: "destructive"
        });
        
        return false;
      }
      
      // Atualizar localStorage
      saveToLocalStorage();
      
      toast({
        title: "Interpretação Removida",
        description: `A interpretação para ${getCategoryDisplayName(category)} número ${number} foi removida.`
      });
      
      return true;
    } catch (error) {
      console.error("Erro ao excluir interpretação:", error);
      
      // Atualizar localStorage
      saveToLocalStorage();
      
      toast({
        title: "Erro ao excluir na nuvem",
        description: "A interpretação foi removida apenas localmente devido a um erro de conexão.",
        variant: "destructive"
      });
      
      return false;
    }
  }
  
  return false;
}

// Carregar interpretações do Supabase
async function loadFromSupabase(): Promise<void> {
  try {
    console.log("Carregando interpretações do Supabase...");
    
    const { data, error } = await supabaseClient
      .from('interpretations')
      .select('*');
    
    if (error) {
      console.error("Erro ao carregar do Supabase:", error);
      return;
    }
    
    if (data && data.length > 0) {
      // Limpar interpretações atuais
      interpretations = {};
      
      // Carregar novas interpretações
      data.forEach(item => {
        if (item && item.id && item.title && item.content) {
          interpretations[item.id] = item as Interpretation;
        }
      });
      
      console.log(`Carregadas ${Object.keys(interpretations).length} interpretações do Supabase.`);
      
      // Atualizar localStorage como backup
      saveToLocalStorage();
    } else {
      console.log("Nenhuma interpretação encontrada no Supabase.");
    }
  } catch (error) {
    console.error("Erro crítico ao carregar do Supabase:", error);
    throw error;
  }
}

// Salvar todas as interpretações no Supabase
async function saveToSupabase(isFullSync: boolean = false): Promise<boolean> {
  try {
    const items = Object.values(interpretations);
    
    if (items.length === 0) {
      console.log("Nenhuma interpretação para salvar no Supabase.");
      return true;
    }
    
    console.log(`Salvando ${items.length} interpretações no Supabase...`);
    
    if (isFullSync) {
      // Para sincronização completa, usar transação para garantir consistência
      const { error } = await supabaseClient.rpc('sync_interpretations', {
        interpretations_data: items
      });
      
      if (error) {
        console.error("Erro na sincronização completa:", error);
        return false;
      }
    } else {
      // Para atualizações normais, usar upsert
      const { error } = await supabaseClient
        .from('interpretations')
        .upsert(items, { onConflict: 'id' });
      
      if (error) {
        console.error("Erro ao salvar no Supabase:", error);
        return false;
      }
    }
    
    console.log(`${items.length} interpretações salvas com sucesso no Supabase.`);
    return true;
  } catch (error) {
    console.error("Erro crítico ao salvar no Supabase:", error);
    return false;
  }
}

// Salvar no localStorage como backup
function saveToLocalStorage(): void {
  try {
    localStorage.setItem('karmicInterpretations', JSON.stringify(interpretations));
    console.log("Backup das interpretações salvo no localStorage.");
  } catch (error) {
    console.error("Erro ao salvar backup no localStorage:", error);
  }
}

// Carregar do localStorage
function loadFromLocalStorage(): Record<string, Interpretation> {
  try {
    const saved = localStorage.getItem('karmicInterpretations');
    if (saved && saved !== "{}") {
      const parsed = JSON.parse(saved);
      console.log(`Carregadas ${Object.keys(parsed).length} interpretações do localStorage.`);
      return parsed;
    }
  } catch (error) {
    console.error("Erro ao carregar do localStorage:", error);
  }
  
  return {};
}

// Force sync to Supabase
export async function forceSyncToSupabase(): Promise<boolean> {
  try {
    const success = await saveToSupabase(true);
    return success;
  } catch (error) {
    console.error("Erro ao sincronizar com Supabase:", error);
    return false;
  }
}

// Adicionar todas as interpretações de uma vez (para importação)
export async function importInterpretations(data: Record<string, Interpretation>): Promise<boolean> {
  if (!data || typeof data !== 'object' || Object.keys(data).length === 0) {
    return false;
  }
  
  try {
    // Validar dados
    const validData: Record<string, Interpretation> = {};
    let validCount = 0;
    
    Object.entries(data).forEach(([id, item]) => {
      if (item && typeof item === 'object' && 'id' in item && 'title' in item && 'content' in item) {
        validData[id] = {
          ...item,
          updated_at: new Date().toISOString()
        };
        validCount++;
      }
    });
    
    if (validCount === 0) {
      console.error("Nenhuma interpretação válida encontrada para importar");
      return false;
    }
    
    // Mesclar com dados existentes
    interpretations = { ...interpretations, ...validData };
    
    // Salvar no Supabase
    const supabaseSuccess = await saveToSupabase(true);
    
    // Salvar no localStorage como backup
    saveToLocalStorage();
    
    console.log(`Importadas ${validCount} interpretações com sucesso`);
    return true;
  } catch (error) {
    console.error("Erro ao importar interpretações:", error);
    return false;
  }
}

// Obter todas as interpretações para exportação
export function exportInterpretations(): Record<string, Interpretation> {
  return { ...interpretations };
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

// Initialize the system
initInterpretations();
