import { toast } from "@/components/ui/use-toast";
import { supabaseClient, isInOfflineMode } from '@/lib/supabase';

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

// Get interpretation by category and number
export async function getInterpretation(category: string, number: number): Promise<Interpretation> {
  // Make sure interpretations are initialized
  if (!isInitialized) {
    await initInterpretations();
  }
  
  const id = generateInterpretationId(category, number);
  const interpretation = interpretations[id];
  
  if (interpretation) {
    return interpretation;
  }
  
  // Return a default interpretation if not found
  return {
    id,
    title: `${getCategoryDisplayName(category)} ${number}`,
    content: DEFAULT_INTERPRETATION
  };
}

// Set interpretation (create or update)
export async function setInterpretation(
  category: string, 
  number: number, 
  title: string, 
  content: string
): Promise<void> {
  // Make sure interpretations are initialized
  if (!isInitialized) {
    await initInterpretations();
  }
  
  const id = generateInterpretationId(category, number);
  
  // Create or update interpretation
  interpretations[id] = {
    id,
    title,
    content,
    updated_at: new Date().toISOString()
  };
  
  // Save to localStorage
  saveToLocalStorage();
  
  // Show success toast
  toast({
    title: "Interpretação salva",
    description: "As alterações foram salvas com sucesso.",
  });
  
  // Try to sync with Supabase if online
  if (!isInOfflineMode()) {
    try {
      await forceSyncToSupabase();
    } catch (error) {
      console.error("Erro ao sincronizar com Supabase após salvar:", error);
    }
  }
}

// Delete interpretation
export async function deleteInterpretation(category: string, number: number): Promise<void> {
  // Make sure interpretations are initialized
  if (!isInitialized) {
    await initInterpretations();
  }
  
  const id = generateInterpretationId(category, number);
  
  // Check if interpretation exists
  if (!interpretations[id]) {
    toast({
      title: "Interpretação não encontrada",
      description: "Não foi possível excluir pois a interpretação não existe.",
      variant: "destructive"
    });
    return;
  }
  
  // Delete interpretation
  delete interpretations[id];
  
  // Save to localStorage
  saveToLocalStorage();
  
  // Show success toast
  toast({
    title: "Interpretação excluída",
    description: "A interpretação foi excluída com sucesso.",
  });
  
  // Try to sync with Supabase if online
  if (!isInOfflineMode()) {
    try {
      // For Supabase, we could have a deleted flag or actually delete the record
      // This implementation just syncs the current state (where the interpretation is now missing)
      await forceSyncToSupabase();
    } catch (error) {
      console.error("Erro ao sincronizar com Supabase após excluir:", error);
    }
  }
}

// Get display name for category
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

// Get all available categories
export function getAllCategories(): string[] {
  return [
    'karmicSeal',
    'destinyCall',
    'karmaPortal',
    'karmicInheritance',
    'karmicReprogramming',
    'cycleProphecy',
    'spiritualMark',
    'manifestationEnigma'
  ];
}

// Get all interpretations as array for display
export function getAllInterpretations(): Interpretation[] {
  return Object.values(interpretations);
}

// Get all interpretations as Record
export function exportInterpretations(): Record<string, Interpretation> {
  return { ...interpretations };
}

// Load from localStorage
export function loadFromLocalStorage(): Record<string, Interpretation> {
  try {
    const stored = localStorage.getItem('karmicInterpretations');
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log(`Carregadas ${Object.keys(parsed).length} interpretações do localStorage.`);
      return parsed;
    }
  } catch (error) {
    console.error("Erro ao carregar do localStorage:", error);
  }
  return {};
}

// Save to localStorage
export function saveToLocalStorage(): void {
  try {
    localStorage.setItem('karmicInterpretations', JSON.stringify(interpretations));
    
    // Criar um backup com timestamp a cada 24h
    const lastBackup = localStorage.getItem('lastInterpretationBackup');
    const now = new Date().getTime();
    if (!lastBackup || (now - parseInt(lastBackup)) > 24 * 60 * 60 * 1000) {
      const backupKey = `karmicInterpretations_backup_${new Date().toISOString()}`;
      localStorage.setItem(backupKey, JSON.stringify(interpretations));
      localStorage.setItem('lastInterpretationBackup', now.toString());
      console.log(`Backup criado em ${backupKey}`);
    }
  } catch (error) {
    console.error("Erro ao salvar no localStorage:", error);
  }
}

// Load from Supabase
export async function loadFromSupabase(): Promise<void> {
  if (isInOfflineMode()) {
    console.log("Modo offline ativo - não será feita requisição ao Supabase");
    return;
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('interpretations')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    if (data && data.length > 0) {
      const supabaseInterpretations: Record<string, Interpretation> = {};
      
      data.forEach((item: any) => {
        if (item && item.id) {
          supabaseInterpretations[item.id] = item as Interpretation;
        }
      });
      
      // Mesclar com interpretações existentes
      interpretations = { ...interpretations, ...supabaseInterpretations };
      
      // Atualizar localStorage
      saveToLocalStorage();
      
      console.log(`Carregadas ${data.length} interpretações do Supabase.`);
    } else {
      console.log("Nenhuma interpretação encontrada no Supabase.");
    }
  } catch (error) {
    console.error("Erro ao carregar do Supabase:", error);
    throw error;
  }
}

// Force sync to Supabase
export async function forceSyncToSupabase(): Promise<boolean> {
  if (isInOfflineMode()) {
    console.log("Modo offline ativo - sincronização com Supabase não disponível");
    return false;
  }
  
  try {
    const allInterpretations = Object.values(interpretations);
    
    if (allInterpretations.length === 0) {
      console.log("Nenhuma interpretação para sincronizar.");
      return true;
    }
    
    // Divisão em lotes para evitar limites de tamanho de payload
    const batchSize = 50;
    const batches = [];
    
    for (let i = 0; i < allInterpretations.length; i += batchSize) {
      batches.push(allInterpretations.slice(i, i + batchSize));
    }
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(`Sincronizando lote ${i+1}/${batches.length} (${batch.length} interpretações)...`);
      
      const { error } = await supabaseClient
        .from('interpretations')
        .upsert(batch, { onConflict: 'id' });
      
      if (error) {
        console.error(`Erro ao sincronizar lote ${i+1}:`, error);
        return false;
      }
    }
    
    console.log(`Sincronização completa: ${allInterpretations.length} interpretações.`);
    return true;
  } catch (error) {
    console.error("Erro durante sincronização:", error);
    return false;
  }
}

// Import interpretations from external data
export async function importInterpretations(data: Record<string, Interpretation>): Promise<boolean> {
  try {
    // Validar dados
    for (const id in data) {
      if (!data[id].id || !data[id].title || !data[id].content) {
        console.error(`Dados inválidos para ${id}:`, data[id]);
        toast({
          title: "Erro na importação",
          description: `Dados inválidos encontrados para ${id}. Verifique o console para mais detalhes.`,
          variant: "destructive"
        });
        return false;
      }
      
      // Garantir que o ID no objeto corresponda à chave
      if (data[id].id !== id) {
        console.warn(`ID inconsistente para ${id}, corrigindo...`);
        data[id].id = id;
      }
    }
    
    // Mesclar com interpretações existentes
    interpretations = { ...interpretations, ...data };
    
    // Salvar no localStorage
    saveToLocalStorage();
    
    // Tentar salvar no Supabase
    try {
      await forceSyncToSupabase();
    } catch (supabaseError) {
      console.error("Erro ao sincronizar com Supabase após importação:", supabaseError);
      toast({
        title: "Dados importados com aviso",
        description: "Os dados foram importados localmente, mas houve um erro ao sincronizar com a nuvem. Tente sincronizar manualmente mais tarde.",
        variant: "default"
      });
    }
    
    return true;
  } catch (error) {
    console.error("Erro durante importação:", error);
    return false;
  }
}

// Inicializar o sistema de interpretações
export async function initInterpretations(): Promise<void> {
  if (isInitialized) return;
  
  try {
    console.log("Inicializando sistema de interpretações...");
    
    // Primeiro tentar carregar do localStorage para ter acesso rápido aos dados
    const localData = loadFromLocalStorage();
    if (Object.keys(localData).length > 0) {
      interpretations = localData;
      console.log(`Carregadas ${Object.keys(interpretations).length} interpretações do localStorage durante inicialização.`);
    }
    
    // Depois tentar carregar do Supabase (pode atualizar os dados do localStorage)
    try {
      await loadFromSupabase();
    } catch (supabaseError) {
      console.error("Erro ao carregar do Supabase durante inicialização:", supabaseError);
      // Se falhar, já temos dados do localStorage de qualquer forma
    }
    
    // Se não tem dados no Supabase nem no localStorage, carregar exemplos
    if (Object.keys(interpretations).length === 0) {
      console.log("Nenhuma interpretação encontrada - carregando exemplos");
      loadExampleInterpretations();
      saveToLocalStorage();
    }
    
    isInitialized = true;
    console.log(`Sistema de interpretações inicializado com ${Object.keys(interpretations).length} entradas.`);
  } catch (error) {
    console.error("Erro crítico ao inicializar interpretações:", error);
    
    // Em caso de falha total, ao menos tentar carregar exemplos
    loadExampleInterpretations();
    saveToLocalStorage();
    
    isInitialized = true;
  }
}

// Carregar interpretações de exemplo
function loadExampleInterpretations(): void {
  // Selo Kármico
  interpretations[generateInterpretationId('karmicSeal', 11)] = {
    id: generateInterpretationId('karmicSeal', 11),
    title: "Selo Kármico 11: O Iluminador",
    content: `<p>O Selo Kármico 11 é conhecido como o número da <strong>Iluminação Espiritual</strong> e representa uma das vibrações mais poderosas da sua matriz kármica. Em 2025, essa energia estará particularmente ativa em sua vida.</p>`
  };
  
  // Adicionando exemplos para outros números do Selo Kármico
  interpretations[generateInterpretationId('karmicSeal', 1)] = {
    id: generateInterpretationId('karmicSeal', 1),
    title: "Selo Kármico 1: O Pioneiro",
    content: `<p>O Selo Kármico 1 representa a energia do <strong>pioneirismo</strong> e <strong>liderança</strong> em sua matriz para 2025. Esta é uma força poderosa de iniciativa e autossuficiência.</p>`
  };
  
  interpretations[generateInterpretationId('karmicSeal', 5)] = {
    id: generateInterpretationId('karmicSeal', 5),
    title: "Selo Kármico 5: O Agente da Mudança",
    content: `<p>O Selo Kármico 5 traz a vibração da <strong>liberdade</strong> e <strong>transformação</strong> para sua matriz em 2025. Este selo representa adaptabilidade e amor pela mudança.</p>`
  };
  
  // Chamado do Destino
  interpretations[generateInterpretationId('destinyCall', 3)] = {
    id: generateInterpretationId('destinyCall', 3),
    title: "Chamado do Destino 3: O Comunicador",
    content: `<p>O Chamado do Destino 3 na sua matriz kármica para 2025 revela seu talento natural para a <strong>expressão criativa e comunicação</strong>. Este é o ano em que sua voz precisa ser ouvida e suas ideias compartilhadas.</p>`
  };
  
  // Exemplos para Chamado do Destino
  interpretations[generateInterpretationId('destinyCall', 1)] = {
    id: generateInterpretationId('destinyCall', 1),
    title: "Chamado do Destino 1: O Líder Nato",
    content: `<p>O Chamado do Destino 1 na sua matriz kármica para 2025 revela sua vocação para a <strong>liderança e originalidade</strong>. Seu propósito este ano está ligado à iniciativa e independência.</p>`
  };
  
  interpretations[generateInterpretationId('destinyCall', 7)] = {
    id: generateInterpretationId('destinyCall', 7),
    title: "Chamado do Destino 7: O Místico",
    content: `<p>O Chamado do Destino 7 na sua matriz kármica para 2025 revela seu propósito ligado à <strong>busca espiritual e ao conhecimento profundo</strong>. Este é um ano para mergulhar na sabedoria interior.</p>`
  };
  
  // Portal do Karma
  interpretations[generateInterpretationId('karmaPortal', 9)] = {
    id: generateInterpretationId('karmaPortal', 9),
    title: "Portal do Karma 9: O Humanitário",
    content: `<p>O Portal do Karma 9 em sua matriz para 2025 indica um ano de <strong>conclusões, serviço humanitário e sabedoria universal</strong>. Este é um dos números mais elevados espiritualmente, convidando você a transcender o ego e conectar-se com propósitos maiores.</p>`
  };
  
  // Exemplos para Portal do Karma
  interpretations[generateInterpretationId('karmaPortal', 3)] = {
    id: generateInterpretationId('karmaPortal', 3),
    title: "Portal do Karma 3: O Expressivo",
    content: `<p>O Portal do Karma 3 em sua matriz para 2025 revela lições relacionadas à <strong>expressão criativa e comunicação autêntica</strong>. Este portal lhe traz desafios para desenvolver sua voz verdadeira.</p>`
  };
  
  interpretations[generateInterpretationId('karmaPortal', 8)] = {
    id: generateInterpretationId('karmaPortal', 8),
    title: "Portal do Karma 8: O Manifestador",
    content: `<p>O Portal do Karma 8 em sua matriz para 2025 traz lições relacionadas ao <strong>equilíbrio entre poder material e espiritual</strong>. Este portal revela seu relacionamento com abundância e autoridade.</p>`
  };
  
  // Herança Kármica
  interpretations[generateInterpretationId('karmicInheritance', 4)] = {
    id: generateInterpretationId('karmicInheritance', 4),
    title: "Herança Kármica 4: O Construtor",
    content: `<p>A Herança Kármica 4 em sua matriz para 2025 revela um legado ancestral de <strong>construção, ordem e trabalho disciplinado</strong>. Você traz das vidas passadas uma capacidade extraordinária de criar estruturas sólidas, tanto no mundo material quanto no espiritual.</p>`
  };
  
  // Herança Kármica exemplos adicionais
  interpretations[generateInterpretationId('karmicInheritance', 2)] = {
    id: generateInterpretationId('karmicInheritance', 2),
    title: "Herança Kármica 2: O Diplomata",
    content: `<p>A Herança Kármica 2 em sua matriz para 2025 revela um legado ancestral de <strong>diplomacia, intuição e cooperação</strong>. Você traz de vidas passadas uma sensibilidade aguçada para harmonizar relações.</p>`
  };
  
  interpretations[generateInterpretationId('karmicInheritance', 7)] = {
    id: generateInterpretationId('karmicInheritance', 7),
    title: "Herança Kármica 7: O Sábio",
    content: `<p>A Herança Kármica 7 em sua matriz para 2025 revela um legado ancestral de <strong>sabedoria espiritual e conhecimento profundo</strong>. Você traz de vidas passadas uma conexão com dimensões místicas da existência.</p>`
  };
  
  // Códex da Reprogramação
  interpretations[generateInterpretationId('karmicReprogramming', 5)] = {
    id: generateInterpretationId('karmicReprogramming', 5),
    title: "Códex da Reprogramação 5: O Agente da Mudança",
    content: `<p>Seu Códex da Reprogramação 5 indica que 2025 será um ano de <strong>transformações significativas e liberdade</strong>. Esta energia traz a necessidade de quebrar padrões limitantes e abraçar a mudança como forma de crescimento.</p>`
  };
  
  // Profecia dos Ciclos
  interpretations[generateInterpretationId('cycleProphecy', 2)] = {
    id: generateInterpretationId('cycleProphecy', 2),
    title: "Profecia dos Ciclos 2: O Diplomata",
    content: `<p>A Profecia dos Ciclos 2 revela que em 2025 seu foco kármico estará nas <strong>parcerias, cooperação e equilíbrio</strong>. Este ciclo profético traz uma energia de receptividade e harmonização para sua jornada espiritual.</p>`
  };
  
  // Marca Espiritual
  interpretations[generateInterpretationId('spiritualMark', 7)] = {
    id: generateInterpretationId('spiritualMark', 7),
    title: "Marca Espiritual 7: O Místico",
    content: `<p>Sua Marca Espiritual 7 indica que 2025 será um período de <strong>introspecção, análise profunda e conexão espiritual</strong>. Esta marca vibra em sua aura trazendo uma energia de busca pelo conhecimento e sabedoria interior.</p>`
  };
  
  // Enigma da Manifestação
  interpretations[generateInterpretationId('manifestationEnigma', 6)] = {
    id: generateInterpretationId('manifestationEnigma', 6),
    title: "Enigma da Manifestação 6: O Harmonizador",
    content: `<p>O Enigma da Manifestação 6 em sua matriz para 2025 destaca a importância do <strong>equilíbrio, responsabilidade e harmonia</strong> em suas criações. Este enigma revela como você manifesta realidades através da frequência vibracional do amor e da beleza.</p>`
  };
    
  // Adicionar números adicionais para os outros campos
  interpretations[generateInterpretationId('manifestationEnigma', 1)] = {
    id: generateInterpretationId('manifestationEnigma', 1),
    title: "Enigma da Manifestação 1: O Iniciador",
    content: `<p>O Enigma da Manifestação 1 em sua matriz para 2025 revela seu poder de <strong>iniciar e criar novos começos</strong>. Sua capacidade de manifestação está ligada à força de vontade e intenção clara.</p>`
  };
}
