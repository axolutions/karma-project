<lov-code>
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

// Export all interpretations as data
export function exportInterpretations(): Record<string, Interpretation> {
  return { ...interpretations };
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
    
    // Depois tentar carregar do Supabase (pode atualizar os dados do localStorage)\n    try {\n      await loadFromSupabase();\n    } catch (supabaseError) {\n      console.error(\"Erro ao carregar do Supabase durante inicialização:\", supabaseError);\n      // Se falhar, já temos dados do localStorage de qualquer forma\n    }\n    \n    // Se não tem dados no Supabase nem no localStorage, carregar exemplos\n    if (Object.keys(interpretations).length === 0) {\n      console.log(\"Nenhuma interpretação encontrada - carregando exemplos\");\n      loadExampleInterpretations();\n      saveToLocalStorage();\n    }\n    \n    isInitialized = true;\n    console.log(`Sistema de interpretações inicializado com ${Object.keys(interpretations).length} entradas.`);\n  } catch (error) {\n    console.error(\"Erro crítico ao inicializar interpretações:\", error);\n    \n    // Em caso de falha total, ao menos tentar carregar exemplos\n    loadExampleInterpretations();\n    saveToLocalStorage();\n    \n    isInitialized = true;\n  }\n}\n\n// Carregar interpretações de exemplo\nfunction loadExampleInterpretations(): void {\n  // Selo Kármico\n  interpretations[generateInterpretationId('karmicSeal', 11)] = {\n    id: generateInterpretationId('karmicSeal', 11),\n    title: \"Selo Kármico 11: O Iluminador\",\n    content: `<p>O Selo Kármico 11 é conhecido como o número da <strong>Iluminação Espiritual</strong> e representa uma das vibrações mais poderosas da sua matriz kármica. Em 2025, essa energia estará particularmente ativa em sua vida.</p>\n    \n    <h3>Significado Profundo</h3>\n    <p>Como portador do Selo Kármico 11, você traz para esta vida uma sensibilidade elevada e uma conexão natural com dimensões superiores. Este número mestre indica que você tem a capacidade de inspirar e iluminar outras pessoas através da sua própria jornada de autoconhecimento.</p>\n    \n    <p>Sua missão em 2025 será trabalhar como um canal entre o material e o espiritual, trazendo insights e revelações que podem transformar não apenas sua vida, mas também a dos que estão ao seu redor.</p>\n    \n    <h3>Desafios em 2025</h3>\n    <ul>\n      <li>Equilibrar a sensibilidade intensificada com as demandas práticas do cotidiano</li>\n      <li>Desenvolver paciência com aqueles que não compartilham da sua visão elevada</li>\n      <li>Evitar escapismo ou idealismo excessivo</li>\n      <li>Controlar a ansiedade que pode surgir da percepção aguçada</li>\n    </ul>\n    \n    <h3>Potenciais a Desenvolver</h3>\n    <p>Em 2025, você terá oportunidades significativas para:</p>\n    <ul>\n      <li>Aprofundar práticas espirituais e meditativas</li>\n      <li>Compartilhar conhecimento e sabedoria com quem precisa</li>\n      <li>Utilizar sua intuição aguçada para tomar decisões importantes</li>\n      <li>Desenvolver talentos criativos que expressam verdades espirituais</li>\n    </ul>\n    \n    <h3>Afirmação Kármica</h3>\n    <p>Eu sou um canal de luz e inspiração. Confio na minha intuição e uso minha sensibilidade como uma dádiva para auxiliar no crescimento espiritual meu e daqueles que me cercam.</p>`\n  };\n  \n  // Adicionando exemplos para outros números do Selo Kármico\n  interpretations[generateInterpretationId('karmicSeal', 1)] = {\n    id: generateInterpretationId('karmicSeal', 1),\n    title: \"Selo Kármico 1: O Pioneiro\",\n    content: `<p>O Selo Kármico 1 representa a energia do <strong>pioneirismo</strong> e <strong>liderança</strong> em sua matriz para 2025. Esta é uma força poderosa de iniciativa e autossuficiência.</p>\n    <h3>Significado Profundo</h3>\n    <p>Com o Selo Kármico 1, você possui a capacidade inata de iniciar novos caminhos e liderar projetos inovadores. Em 2025, você será chamado a exercer sua independência e força de vontade para criar novas realidades.</p>\n    <h3>Desafios em 2025</h3>\n    <ul>\n      <li>Equilibrar independência com cooperação</li>\n      <li>Evitar tendências autoritárias ou egoístas</li>\n      <li>Aprender a aceitar ajuda quando necessário</li>\n    </ul>\n    <h3>Afirmação Kármica</h3>\n    <p>Eu sou um pioneiro nato e lidero com coragem e determinação. Uso minha força de vontade para criar novos caminhos que beneficiam a mim e aos outros.</p>`\n  };\n  \n  interpretations[generateInterpretationId('karmicSeal', 5)] = {\n    id: generateInterpretationId('karmicSeal', 5),\n    title: \"Selo Kármico 5: O Agente da Mudança\",\n    content: `<p>O Selo Kármico 5 traz a vibração da <strong>liberdade</strong> e <strong>transformação</strong> para sua matriz em 2025. Este selo representa adaptabilidade e amor pela mudança.</p>\n    <h3>Significado Profundo</h3>\n    <p>Como portador do Selo Kármico 5, você tem uma capacidade natural de se adaptar a novas situações e transformar obstáculos em oportunidades. Em 2025, você sentirá um forte impulso para expandir seus horizontes.</p>\n    <h3>Desafios em 2025</h3>\n    <ul>\n      <li>Controlar a impulsividade e tendência à dispersão</li>\n      <li>Encontrar equilíbrio entre liberdade e compromisso</li>\n      <li>Usar a versatilidade com sabedoria</li>\n    </ul>\n    <h3>Afirmação Kármica</h3>\n    <p>Eu abraço a mudança como minha aliada constante. Minha adaptabilidade me permite fluir com as transformações da vida, encontrando liberdade através da flexibilidade.</p>`\n  };\n  \n  // Chamado do Destino\n  interpretations[generateInterpretationId('destinyCall', 3)] = {\n    id: generateInterpretationId('destinyCall', 3),\n    title: \"Chamado do Destino 3: O Comunicador\",\n    content: `<p>O Chamado do Destino 3 na sua matriz kármica para 2025 revela seu talento natural para a <strong>expressão criativa e comunicação</strong>. Este é o ano em que sua voz precisa ser ouvida e suas ideias compartilhadas.</p>\n    \n    <h3>Propósito de Vida em 2025</h3>\n    <p>Com o Chamado do Destino 3, você está sendo convocado a usar seu dom da palavra e sua criatividade para inspirar e elevar os outros. Este não é um talento qualquer - é uma missão cármica que você trouxe para esta encarnação e que será especialmente relevante neste ciclo.</p>\n    \n    <p>Em 2025, o universo criará situações que permitirão que você desenvolva ainda mais suas habilidades de comunicação, seja através da escrita, da fala, da arte ou de qualquer forma de expressão que ressoe com sua alma.</p>\n    \n    <h3>Oportunidades a Serem Abraçadas</h3>\n    <ul>\n      <li>Projetos que envolvam qualquer forma de comunicação ou criatividade</li>\n      <li>Situações sociais onde você possa expressar suas ideias</li>\n      <li>Cursos ou estudos relacionados à comunicação, artes ou mídias</li>\n      <li>Momentos de alegria e leveza que nutram sua criatividade</li>\n    </ul>\n    \n    <h3>Dificuldades a Superar</h3>\n    <p>O número 3 também traz desafios específicos para 2025:</p>\n    <ul>\n      <li>Tendência à dispersão ou falta de foco</li>\n      <li>Superficialidade que pode impedir o aprofundamento em questões importantes</li>\n      <li>Procrastinação em projetos que exigem disciplina prolongada</li>\n      <li>Medo de se expressar autenticamente ou de ser julgado</li>\n    </ul>\n    \n    <h3>Afirmação Kármica</h3>\n    <p>Eu expresso minha verdade com alegria e confiança. Minha criatividade é um dom que compartilho com o mundo, trazendo beleza e inspiração para todos que cruzam meu caminho.</p>`\n  };\n  \n  // Exemplos para Chamado do Destino\n  interpretations[generateInterpretationId('destinyCall', 1)] = {\n    id: generateInterpretationId('destinyCall', 1),\n    title: \"Chamado do Destino 1: O Líder Nato\",\n    content: `<p>O Chamado do Destino 1 na sua matriz kármica para 2025 revela sua vocação para a <strong>liderança e originalidade</strong>. Seu propósito este ano está ligado à iniciativa e independência.</p>\n    <h3>Propósito de Vida em 2025</h3>\n    <p>Com o Chamado do Destino 1, você está sendo convidado a iniciar novos projetos e liderar com coragem. Sua alma escolheu este caminho para desenvolver autonomia e força de vontade.</p>\n    <h3>Afirmação Kármica</h3>\n    <p>Eu sou um líder natural e tenho a coragem de seguir meu próprio caminho. Minhas iniciativas abrem novas possibilidades para mim e para todos ao meu redor.</p>`\n  };\n  \n  interpretations[generateInterpretationId('destinyCall', 7)] = {\n    id: generateInterpretationId('destinyCall', 7),\n    title: \"Chamado do Destino 7: O Místico\",\n    content: `<p>O Chamado do Destino 7 na sua matriz kármica para 2025 revela seu propósito ligado à <strong>busca espiritual e ao conhecimento profundo</strong>. Este é um ano para mergulhar na sabedoria interior.</p>\n    <h3>Propósito de Vida em 2025</h3>\n    <p>Com o Chamado do Destino 7, você está sendo convidado a desenvolver sua espiritualidade e intelecto. Sua alma escolheu este caminho para encontrar verdades transcendentais.</p>\n    <h3>Afirmação Kármica</h3>\n    <p>Eu sou um buscador da verdade e confio em minha sabedoria interior. Através da contemplação e do estudo, descubro os mistérios do universo e de minha própria alma.</p>`\n  };\n  \n  // Portal do Karma\n  interpretations[generateInterpretationId('karmaPortal', 9)] = {\n    id: generateInterpretationId('karmaPortal', 9),\n    title: \"Portal do Karma 9: O Humanitário\",\n    content: `<p>O Portal do Karma 9 em sua matriz para 2025 indica um ano de <strong>conclusões, serviço humanitário e sabedoria universal</strong>. Este é um dos números mais elevados espiritualmente, convidando você a transcender o ego e conectar-se com propósitos maiores.</p>\n    \n    <h3>Lições Kármicas Principais</h3>\n    <p>Com o Portal do Karma 9, você está sendo chamado a completar importantes ciclos de vida e liberar apegos que não servem mais ao seu crescimento espiritual. O número 9 representa a conclusão - é o fim de um ciclo de 9 anos e a preparação para um novo começo.</p>\n    \n    <p>Em 2025, situações surgirão para testar sua capacidade de perdoar, de ser compassivo e de servir à humanidade sem esperar reconhecimento ou recompensa. Este é um karma profundo que você traz para trabalhar nesta vida.</p>\n    \n    <h3>Áreas de Crescimento</h3>\n    <ul>\n      <li>Desenvolvimento de compaixão e empatia universal</li>\n      <li>Participação em causas humanitárias ou serviço comunitário</li>\n      <li>Capacidade de perdoar e liberar ressentimentos do passado</li>\n      <li>Desapego material e emocional</li>\n    </ul>\n    \n    <h3>Desafios Específicos</h3>\n    <p>O Portal do Karma 9 também traz desafios significativos:</p>\n    <ul>\n      <li>Tendência ao sacrifício excessivo ou martírio</li>\n      <li>Dificuldade em estabelecer limites saudáveis com os outros</li>\n      <li>Melancolia ou nostalgia excessiva pelo passado</li>\n      <li>Resistência em concluir situações ou relacionamentos que já cumpriram seu propósito</li>\n    </ul>\n    \n    <h3>Afirmação Kármica</h3>\n    <p>Eu aceito a conclusão de ciclos com gratidão e sabedoria. Sirvo à humanidade com amor incondicional, mantendo meu coração aberto e minha visão elevada. Estou pronto para liberar o passado e abraçar novos começos.</p>`\n  };\n  \n  // Exemplos para Portal do Karma\n  interpretations[generateInterpretationId('karmaPortal', 3)] = {\n    id: generateInterpretationId('karmaPortal', 3),\n    title: \"Portal do Karma 3: O Expressivo\",\n    content: `<p>O Portal do Karma 3 em sua matriz para 2025 revela lições relacionadas à <strong>expressão criativa e comunicação autêntica</strong>. Este portal lhe traz desafios para desenvolver sua voz verdadeira.</p>\n    <h3>Lições Kármicas Principais</h3>\n    <p>Você está sendo chamado a superar bloqueios em sua expressão pessoal e aprender a comunicar sua verdade com alegria e confiança. Antigas repressões devem ser liberadas.</p>\n    <h3>Afirmação Kármica</h3>\n    <p>Eu expresso minha verdade com alegria e criatividade. Minhas palavras e criações são canais para minha alma se manifestar no mundo.</p>`\n  };\n  \n  interpretations[generateInterpretationId('karmaPortal', 8)] = {\n    id: generateInterpretationId('karmaPortal', 8),\n    title: \"Portal do Karma 8: O Manifestador\",\n    content: `<p>O Portal do Karma 8 em sua matriz para 2025 traz lições relacionadas ao <strong>equilíbrio entre poder material e espiritual</strong>. Este portal revela seu relacionamento com abundância e autoridade.</p>\n    <h3>Lições Kármicas Principais</h3>\n    <p>Você está sendo chamado a desenvolver uma relação saudável com recursos, dinheiro e poder. Antigas crenças limitantes sobre prosperidade devem ser transformadas.</p>\n    <h3>Afirmação Kármica</h3>\n    <p>Eu aceito meu poder pessoal e o uso com sabedoria e integridade. A abundância flui para minha vida como uma expressão natural de meu valor interior.</p>`\n  };\n  \n  // Herança Kármica\n  interpretations[generateInterpretationId('karmicInheritance', 4)] = {\n    id: generateInterpretationId('karmicInheritance', 4),\n    title: \"Herança Kármica 4: O Construtor\",\n    content: `<p>A Herança Kármica 4 em sua matriz para 2025 revela um legado ancestral de <strong>construção, ordem e trabalho disciplinado</strong>. Você traz das vidas passadas uma capacidade extraordinária de criar estruturas sólidas, tanto no mundo material quanto no espiritual.</p>\n    \n    <h3>Dons Ancestrais</h3>\n    <p>Com o número 4 como sua Herança Kármica, você recebeu de seus antepassados (tanto biológicos quanto espirituais) uma ética de trabalho exemplar, paciência para construir gradualmente e uma compreensão intuitiva da importância dos alicerces sólidos.</p>\n    \n    <p>Em 2025, estas qualidades serão particularmente importantes, pois você estará em uma fase de estabelecer bases que sustentarão seus próximos anos de desenvolvimento.</p>\n    \n    <h3>Talentos a Serem Utilizados</h3>\n    <ul>\n      <li>Capacidade de organização e planejamento metódico</li>\n      <li>Persistência diante de obstáculos</li>\n      <li>Habilidade para criar sistemas e estruturas funcionais</li>\n      <li>Confiabilidade e senso de responsabilidade</li>\n    </ul>\n    \n    <h3>Lições a Serem Aprendidas</h3>\n    <p>A Herança Kármica 4 também traz desafios específicos:</p>\n    <ul>\n      <li>Rigidez ou resistência a mudanças necessárias</li>\n      <li>Tendência ao perfeccionismo limitante</li>\n      <li>Dificuldade em delegar ou confiar no trabalho dos outros</li>\n      <li>Possibilidade de se perder em detalhes e esquecer a visão mais ampla</li>\n    </ul>\n    \n    <h3>Afirmação Kármica</h3>\n    <p>Eu honro o legado de construção e ordem que trago em minha alma. Construo com paciência e sabedoria, criando estruturas que beneficiarão a mim e aos outros. Meu trabalho disciplinado é uma forma de expressão espiritual.</p>`\n  };\n  \n  // Herança Kármica exemplos adicionais\n  interpretations[generateInterpretationId('karmicInheritance', 2)] = {\n    id: generateInterpretationId('karmicInheritance', 2),\n    title: \"Herança Kármica 2: O Diplomata\",\n    content: `<p>A Herança Kármica 2 em sua matriz para 2025 revela um legado ancestral de <strong>diplomacia, intuição e cooperação</strong>. Você traz de vidas passadas uma sensibilidade aguçada para harmonizar relações.</p>\n    <h3>Dons Ancestrais</h3>\n    <p>Você possui habilidades naturais para mediação de conflitos e para perceber as necessidades emocionais dos outros. Sua intuição é um presente de suas experiências passadas.</p>\n    <h3>Afirmação Kármica</h3>\n    <p>Eu honro minha sensibilidade e intuição como dons preciosos. Através da cooperação e diplomacia, crio harmonia em todas as minhas relações.</p>`\n  };\n  \n  interpretations[generateInterpretationId('karmicInheritance', 7)] = {\n    id: generateInterpretationId('karmicInheritance', 7),\n    title: \"Herança Kármica 7: O Sábio\",\n    content: `<p>A Herança Kármica 7 em sua matriz para 2025 revela um legado ancestral de <strong>sabedoria espiritual e conhecimento profundo</strong>. Você traz de vidas passadas uma conexão com dimensões místicas da existência.</p>\n    <h3>Dons Ancestrais</h3>\n    <p>Você possui uma mente analítica natural e uma capacidade inata para acessar conhecimentos transcendentais. Sua busca espiritual é uma continuação de jornadas passadas.</p>\n    <h3>Afirmação Kármica</h3>\n    <p>Eu honro a sabedoria ancestral que corre em meu ser. Através da contemplação e do estudo, conecto-me com verdades universais que iluminam meu caminho.</p>`\n  };\n  \n  // Códex da Reprogramação\n  interpretations[generateInterpretationId('karmicReprogramming', 5)] = {\n    id: generateInterpretationId('karmicReprogramming', 5),\n    title: \"Códex da Reprogramação 5: O Agente da Mudança\",\n    content: `<p>Seu Códex da Reprogramação 5 indica que 2025 será um ano de <strong>transformações significativas e liberdade</strong>. Esta energia traz a necessidade de quebrar padrões limitantes e abraçar a mudança como forma de crescimento.</p>\n    \n    <h3>Padrões a Transformar</h3>\n    <p>Com o número 5 ativo em sua reprogramação kármica, você está sendo chamado a liberar qualquer resistência à mudança que tenha desenvolvido em vidas passadas ou na atual. Este é um ano para quebrar rotinas estagnadas e permitir-se explorar novos territórios - tanto externos quanto internos.</p>\n    \n    <p>Em 2025, situações surgirão que exigirão adaptabilidade e disposição para sair da zona de conforto. Estas não são coincidências, mas oportunidades cuidadosamente orquestradas para reprogramar antigos padrões de rigidez ou medo do desconhecido.</p>\n    \n    <h3>Ferramentas de Reprogramação</h3>\n    <ul>\n      <li>Práticas que estimulem a adaptabilidade e espontaneidade</li>\n      <li>Viagens e experiências que ampliem seus horizontes</li>\n      <li>Estudos de filosofias que promovam a liberdade interior</li>\n      <li>Atividades que desafiem seus limites percebidos</li>\n    </ul>\n    \n    <h3>Sintomas da Transformação</h3>\n    <p>Durante este processo de reprogramação, você pode experimentar:</p>\n    <ul>\n      <li>Inquietação ou desejo súbito de mudança</li>\n      <li>Sensação de que estruturas antes estáveis estão se dissolvendo</li>\n      <li>Maior disposição para correr riscos calculados</li>\n      <li>Desapego natural de situações, objetos ou relacionamentos que limitam sua evolução</li>\n    </ul>\n    \n    <h3>Afirmação Kármica</h3>\n    <p>Eu abraço a mudança como minha companheira constante. A liberdade de me reinventar é meu direito divino e minha maior aventura.</p>`\n  };\n  \n  // Profecia dos Ciclos\n  interpretations[generateInterpretationId('cycleProphecy', 2)] = {\n    id: generateInterpretationId('cycleProphecy', 2),\n    title: \"Profecia dos Ciclos 2: O Diplomata\",\n    content: `<p>A Profecia dos Ciclos 2 revela que em 2025 seu foco kármico estará nas <strong>parcerias, cooperação e equilíbrio</strong>. Este ciclo profético traz uma energia de receptividade e harmonização para sua jornada espiritual.</p>\n    \n    <h3>Ciclo Energético Ativo</h3>\n    <p>Durante 2025, você estará sob a influência do ciclo profético número 2, que enfatiza a importância das conexões com os outros e a necessidade de desenvolver paciência e sensibilidade. Este não é um período para ações impulsivas ou individualistas, mas sim para cultivar relacionamentos e buscar soluções colaborativas.</p>\n    \n    <p>A profecia indica que você estará mais sensível às energias sutis e às necessidades dos outros, com uma capacidade aumentada de intuição e percepção empática.</p>\n    \n    <h3>Eventos Previstos</h3>\n    <ul>\n      <li>Oportunidades significativas para parcerias pessoais ou profissionais</li>\n      <li>Situações que exigirão mediação e diplomacia</li>\n      <li>Momentos de sincronicidade e conexões intuitivas</li>\n      <li>Possíveis desafios relacionados a dependência emocional</li>\n    </ul>\n    \n    <h3>Propósito do Ciclo</h3>\n    <p>Este ciclo profético visa desenvolver em você:</p>\n    <ul>\n      <li>Maior equilíbrio entre dar e receber</li>\n      <li>Capacidade de cooperação e trabalho em equipe</li>\n      <li>Receptividade às mensagens da sua intuição</li>\n      <li>Harmonização de polaridades em sua vida</li>\n    </ul>\n    \n    <h3>Afirmação Kármica</h3>\n    <p>Eu cultivo harmonia e cooperação em todas as minhas relações. Minha sensibilidade e diplomacia criam pontes de entendimento onde antes havia separação.</p>`\n  };\n  \n  // Marca Espiritual\n  interpretations[generateInterpretationId('spiritualMark', 7)] = {\n    id: generateInterpretationId('spiritualMark', 7),\n    title: \"Marca Espiritual 7: O Místico\",\n    content: `<p>Sua Marca Espiritual 7 indica que 2025 será um período de <strong>introspecção, análise profunda e conexão espiritual</strong>. Esta marca vibra em sua aura trazendo uma energia de busca pelo conhecimento e sabedoria interior.</p>\n    \n    <h3>Assinatura Vibracional</h3>\n    <p>A Marca Espiritual 7 cria em sua aura uma assinatura vibracional de profundidade e busca pela verdade. Em 2025, esta marca estará particularmente ativa, criando um campo energético ao seu redor que favorece o estudo, a meditação e o desenvolvimento de faculdades intuitivas superiores.</p>\n    \n    <p>Pessoas perceberão em você uma qualidade contemplativa e uma sabedoria que vai além do conhecimento comum. Sua presença trará uma sensação de calma e profundidade aos ambientes que frequentar.</p>\n    \n    <h3>Manifestações Espirituais</h3>\n    <ul>\n      <li>Aumento da intuição e possíveis experiências de clarividência</li>\n      <li>Sonhos significativos com mensagens simbólicas</li>\n      <li>Sincronicidades relacionadas a números, especialmente o 7</li>\n      <li>Atração por locais tranquilos e energeticamente elevados</li>\n    </ul>\n    \n    <h3>Potencial de Desenvolvimento</h3>\n    <p>Esta marca espiritual traz potenciais específicos:</p>\n    <ul>\n      <li>Capacidade de análise profunda e discernimento</li>\n      <li>Conexão com conhecimentos universais e atemporais</li>\n      <li>Habilidade para pesquisa e investigação em qualquer área</li>\n      <li>Facilidade para acessar estados meditativos profundos</li>\n    </ul>\n    \n    <h3>Afirmação Kármica</h3>\n    <p>Eu mergulho nas profundezas de meu ser para encontrar a sabedoria universal. No silêncio da contemplação, descubro as respostas que minha alma busca.</p>`\n  };\n  \n  // Enigma da Manifestação\n  interpretations[generateInterpretationId('manifestationEnigma', 6)] = {\n    id: generateInterpretationId('manifestationEnigma', 6),\n    title: \"Enigma da Manifestação 6: O Harmonizador\",\n    content: `<p>O Enigma da Manifestação 6 em sua matriz para 2025 destaca a importância do <strong>equilíbrio, responsabilidade e harmonia</strong> em suas criações. Este enigma revela como você manifesta realidades através da frequência vibracional do amor e da beleza.</p>\n    \n    <h3>Poder de Manifestação</h3>\n    <p>Com o Enigma da Manifestação 6, você possui a capacidade única de criar a partir do coração, manifestando ambientes e situações de harmonia, beleza e equilíbrio. Em 2025, seu poder de atração será especialmente forte para experiências que tragam um senso de ordem e perfeição.</p>\n    \n    <p>Diferente de outros números de manifestação, o 6 atrai não através da força de vontade ou visualização intensa, mas através da energia do amor, do cuidado e da responsabilidade. Quando você nutre genuinamente algo ou alguém, você ativa este enigma em sua matriz kármica.</p>\n    \n    <h3>Chaves de Manifestação</h3>\n    <ul>\n      <li>Criar beleza
