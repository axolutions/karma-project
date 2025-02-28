
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
    content: `<p>O Selo Kármico 11 é conhecido como o número da <strong>Iluminação Espiritual</strong> e representa uma das vibrações mais poderosas da sua matriz kármica. Em 2025, essa energia estará particularmente ativa em sua vida.</p>
    
    <h3>Significado Profundo</h3>
    <p>Como portador do Selo Kármico 11, você traz para esta vida uma sensibilidade elevada e uma conexão natural com dimensões superiores. Este número mestre indica que você tem a capacidade de inspirar e iluminar outras pessoas através da sua própria jornada de autoconhecimento.</p>
    
    <p>Sua missão em 2025 será trabalhar como um canal entre o material e o espiritual, trazendo insights e revelações que podem transformar não apenas sua vida, mas também a dos que estão ao seu redor.</p>
    
    <h3>Desafios em 2025</h3>
    <ul>
      <li>Equilibrar a sensibilidade intensificada com as demandas práticas do cotidiano</li>
      <li>Desenvolver paciência com aqueles que não compartilham da sua visão elevada</li>
      <li>Evitar escapismo ou idealismo excessivo</li>
      <li>Controlar a ansiedade que pode surgir da percepção aguçada</li>
    </ul>
    
    <h3>Potenciais a Desenvolver</h3>
    <p>Em 2025, você terá oportunidades significativas para:</p>
    <ul>
      <li>Aprofundar práticas espirituais e meditativas</li>
      <li>Compartilhar conhecimento e sabedoria com quem precisa</li>
      <li>Utilizar sua intuição aguçada para tomar decisões importantes</li>
      <li>Desenvolver talentos criativos que expressam verdades espirituais</li>
    </ul>
    
    <h3>Afirmação Kármica</h3>
    <p>Eu sou um canal de luz e inspiração. Confio na minha intuição e uso minha sensibilidade como uma dádiva para auxiliar no crescimento espiritual meu e daqueles que me cercam.</p>`
  };
  
  // Chamado do Destino
  interpretations[generateInterpretationId('destinyCall', 3)] = {
    id: generateInterpretationId('destinyCall', 3),
    title: "Chamado do Destino 3: O Comunicador",
    content: `<p>O Chamado do Destino 3 na sua matriz kármica para 2025 revela seu talento natural para a <strong>expressão criativa e comunicação</strong>. Este é o ano em que sua voz precisa ser ouvida e suas ideias compartilhadas.</p>
    
    <h3>Propósito de Vida em 2025</h3>
    <p>Com o Chamado do Destino 3, você está sendo convocado a usar seu dom da palavra e sua criatividade para inspirar e elevar os outros. Este não é um talento qualquer - é uma missão cármica que você trouxe para esta encarnação e que será especialmente relevante neste ciclo.</p>
    
    <p>Em 2025, o universo criará situações que permitirão que você desenvolva ainda mais suas habilidades de comunicação, seja através da escrita, da fala, da arte ou de qualquer forma de expressão que ressoe com sua alma.</p>
    
    <h3>Oportunidades a Serem Abraçadas</h3>
    <ul>
      <li>Projetos que envolvam qualquer forma de comunicação ou criatividade</li>
      <li>Situações sociais onde você possa expressar suas ideias</li>
      <li>Cursos ou estudos relacionados à comunicação, artes ou mídias</li>
      <li>Momentos de alegria e leveza que nutram sua criatividade</li>
    </ul>
    
    <h3>Dificuldades a Superar</h3>
    <p>O número 3 também traz desafios específicos para 2025:</p>
    <ul>
      <li>Tendência à dispersão ou falta de foco</li>
      <li>Superficialidade que pode impedir o aprofundamento em questões importantes</li>
      <li>Procrastinação em projetos que exigem disciplina prolongada</li>
      <li>Medo de se expressar autenticamente ou de ser julgado</li>
    </ul>
    
    <h3>Afirmação Kármica</h3>
    <p>Eu expresso minha verdade com alegria e confiança. Minha criatividade é um dom que compartilho com o mundo, trazendo beleza e inspiração para todos que cruzam meu caminho.</p>`
  };
  
  // Portal do Karma
  interpretations[generateInterpretationId('karmaPortal', 9)] = {
    id: generateInterpretationId('karmaPortal', 9),
    title: "Portal do Karma 9: O Humanitário",
    content: `<p>O Portal do Karma 9 em sua matriz para 2025 indica um ano de <strong>conclusões, serviço humanitário e sabedoria universal</strong>. Este é um dos números mais elevados espiritualmente, convidando você a transcender o ego e conectar-se com propósitos maiores.</p>
    
    <h3>Lições Kármicas Principais</h3>
    <p>Com o Portal do Karma 9, você está sendo chamado a completar importantes ciclos de vida e liberar apegos que não servem mais ao seu crescimento espiritual. O número 9 representa a conclusão - é o fim de um ciclo de 9 anos e a preparação para um novo começo.</p>
    
    <p>Em 2025, situações surgirão para testar sua capacidade de perdoar, de ser compassivo e de servir à humanidade sem esperar reconhecimento ou recompensa. Este é um karma profundo que você traz para trabalhar nesta vida.</p>
    
    <h3>Áreas de Crescimento</h3>
    <ul>
      <li>Desenvolvimento de compaixão e empatia universal</li>
      <li>Participação em causas humanitárias ou serviço comunitário</li>
      <li>Capacidade de perdoar e liberar ressentimentos do passado</li>
      <li>Desapego material e emocional</li>
    </ul>
    
    <h3>Desafios Específicos</h3>
    <p>O Portal do Karma 9 também traz desafios significativos:</p>
    <ul>
      <li>Tendência ao sacrifício excessivo ou martírio</li>
      <li>Dificuldade em estabelecer limites saudáveis com os outros</li>
      <li>Melancolia ou nostalgia excessiva pelo passado</li>
      <li>Resistência em concluir situações ou relacionamentos que já cumpriram seu propósito</li>
    </ul>
    
    <h3>Afirmação Kármica</h3>
    <p>Eu aceito a conclusão de ciclos com gratidão e sabedoria. Sirvo à humanidade com amor incondicional, mantendo meu coração aberto e minha visão elevada. Estou pronto para liberar o passado e abraçar novos começos.</p>`
  };
  
  // Herança Kármica
  interpretations[generateInterpretationId('karmicInheritance', 4)] = {
    id: generateInterpretationId('karmicInheritance', 4),
    title: "Herança Kármica 4: O Construtor",
    content: `<p>A Herança Kármica 4 em sua matriz para 2025 revela um legado ancestral de <strong>construção, ordem e trabalho disciplinado</strong>. Você traz das vidas passadas uma capacidade extraordinária de criar estruturas sólidas, tanto no mundo material quanto no espiritual.</p>
    
    <h3>Dons Ancestrais</h3>
    <p>Com o número 4 como sua Herança Kármica, você recebeu de seus antepassados (tanto biológicos quanto espirituais) uma ética de trabalho exemplar, paciência para construir gradualmente e uma compreensão intuitiva da importância dos alicerces sólidos.</p>
    
    <p>Em 2025, estas qualidades serão particularmente importantes, pois você estará em uma fase de estabelecer bases que sustentarão seus próximos anos de desenvolvimento.</p>
    
    <h3>Talentos a Serem Utilizados</h3>
    <ul>
      <li>Capacidade de organização e planejamento metódico</li>
      <li>Persistência diante de obstáculos</li>
      <li>Habilidade para criar sistemas e estruturas funcionais</li>
      <li>Confiabilidade e senso de responsabilidade</li>
    </ul>
    
    <h3>Lições a Serem Aprendidas</h3>
    <p>A Herança Kármica 4 também traz desafios específicos:</p>
    <ul>
      <li>Rigidez ou resistência a mudanças necessárias</li>
      <li>Tendência ao perfeccionismo limitante</li>
      <li>Dificuldade em delegar ou confiar no trabalho dos outros</li>
      <li>Possibilidade de se perder em detalhes e esquecer a visão mais ampla</li>
    </ul>
    
    <h3>Afirmação Kármica</h3>
    <p>Eu honro o legado de construção e ordem que trago em minha alma. Construo com paciência e sabedoria, criando estruturas que beneficiarão a mim e aos outros. Meu trabalho disciplinado é uma forma de expressão espiritual.</p>`
  };
  
  // Outros exemplos básicos
  interpretations[generateInterpretationId('karmicReprogramming', 5)] = {
    id: generateInterpretationId('karmicReprogramming', 5),
    title: "Códex da Reprogramação 5: O Agente da Mudança",
    content: `<p>Seu Códex da Reprogramação 5 indica que 2025 será um ano de <strong>transformações significativas e liberdade</strong>. Esta energia traz a necessidade de quebrar padrões limitantes e abraçar a mudança como forma de crescimento.</p>`
  };
  
  interpretations[generateInterpretationId('cycleProphecy', 2)] = {
    id: generateInterpretationId('cycleProphecy', 2),
    title: "Profecia dos Ciclos 2: O Diplomata",
    content: `<p>A Profecia dos Ciclos 2 revela que em 2025 seu foco kármico estará nas <strong>parcerias, cooperação e equilíbrio</strong>. Você estará trabalhando aspectos de receptividade e harmonização em suas relações.</p>`
  };
  
  interpretations[generateInterpretationId('spiritualMark', 7)] = {
    id: generateInterpretationId('spiritualMark', 7),
    title: "Marca Espiritual 7: O Místico",
    content: `<p>Sua Marca Espiritual 7 indica que 2025 será um período de <strong>introspecção, análise profunda e conexão espiritual</strong>. Este é o momento de buscar conhecimento e sabedoria em níveis mais profundos.</p>`
  };
  
  interpretations[generateInterpretationId('manifestationEnigma', 6)] = {
    id: generateInterpretationId('manifestationEnigma', 6),
    title: "Enigma da Manifestação 6: O Harmonizador",
    content: `<p>O Enigma da Manifestação 6 em sua matriz para 2025 destaca a importância do <strong>equilíbrio, responsabilidade e harmonia</strong> em suas criações. Você tem o poder de manifestar beleza e harmonia em seu ambiente.</p>`
  };

  console.log("Interpretações de exemplo carregadas:", Object.keys(interpretations).length);
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
  if (!isInitialized) {
    console.warn("Sistema de interpretações não inicializado ao tentar recuperar interpretação.");
    initInterpretations(); // Inicializar de forma síncrona
  }
  
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
  if (!isInitialized) {
    console.warn("Sistema de interpretações não inicializado ao tentar listar todas as interpretações.");
    initInterpretations(); // Inicializar de forma síncrona
  }
  
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
      throw error;
    }
    
    if (data && data.length > 0) {
      console.log(`Encontradas ${data.length} interpretações no Supabase.`);
      
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
        
        // Tentar método alternativo com upsert normal
        const { error: upsertError } = await supabaseClient
          .from('interpretations')
          .upsert(items, { onConflict: 'id' });
        
        if (upsertError) {
          console.error("Erro no método alternativo de sincronização:", upsertError);
          return false;
        }
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
      try {
        const parsed = JSON.parse(saved);
        console.log(`Carregadas ${Object.keys(parsed).length} interpretações do localStorage.`);
        return parsed;
      } catch (parseError) {
        console.error("Erro ao analisar dados do localStorage:", parseError);
        // Fazer backup dos dados brutos para não perder nada
        localStorage.setItem('karmicInterpretations_backup_' + Date.now(), saved);
      }
    } else {
      console.log("Nenhuma interpretação encontrada no localStorage ou objeto vazio.");
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
    
    // Backup dos dados atuais antes de mesclar
    const currentData = { ...interpretations };
    localStorage.setItem('karmicInterpretations_preimport_backup', JSON.stringify(currentData));
    
    // Mesclar com dados existentes
    interpretations = { ...interpretations, ...validData };
    
    // Salvar no Supabase
    const supabaseSuccess = await saveToSupabase(true);
    
    if (!supabaseSuccess) {
      console.warn("Não foi possível salvar no Supabase - salvando apenas localmente");
    }
    
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
  if (!isInitialized) {
    console.warn("Sistema de interpretações não inicializado ao tentar exportar.");
    initInterpretations(); // Inicializar de forma síncrona
  }
  
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
