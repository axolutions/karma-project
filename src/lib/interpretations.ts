
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

// Sample interpretations for common numbers - will be used if no user data exists
const SAMPLE_INTERPRETATIONS: Record<string, Interpretation> = {
  'karmicSeal-1': {
    id: 'karmicSeal-1',
    title: 'Selo Kármico 1: O Pioneiro',
    content: '<p>O Selo Kármico 1 representa a energia do pioneirismo, independência e liderança. Pessoas com este número têm uma forte conexão com a força de vontade e a capacidade de iniciar novos projetos.</p><h3>Lições Principais</h3><p>Seu desafio é encontrar equilíbrio entre liderar e colaborar, aprendendo a valorizar os outros e compartilhar suas conquistas.</p><h3>Afirmação Kármica</h3><p>Eu confio em minha capacidade de liderar e inovar, enquanto honro a contribuição dos outros em minha jornada.</p>'
  },
  'karmicSeal-6': {
    id: 'karmicSeal-6',
    title: 'Selo Kármico 6: O Harmonizador',
    content: '<p>O Selo Kármico 6 representa a energia da harmonia, responsabilidade e serviço. Pessoas com este número têm uma forte conexão com o cuidado familiar e comunitário.</p><h3>Lições Principais</h3><p>Seu desafio é encontrar equilíbrio entre cuidar dos outros e cuidar de si mesmo, aprendendo a estabelecer limites saudáveis.</p><h3>Afirmação Kármica</h3><p>Eu nutro os outros com amor e compaixão, enquanto honro minhas próprias necessidades e limites.</p>'
  },
  'destinyCall-3': {
    id: 'destinyCall-3',
    title: 'Chamado do Destino 3: O Comunicador',
    content: '<p>O Chamado do Destino 3 representa a energia da expressão, criatividade e comunicação. Pessoas com este número têm uma forte conexão com a arte e a capacidade de inspirar os outros.</p><h3>Missão de Vida</h3><p>Sua missão é usar seus dons criativos para elevar e inspirar as pessoas ao seu redor, trazendo alegria e beleza ao mundo.</p><h3>Afirmação Kármica</h3><p>Eu expresso minha verdade com alegria e criatividade, inspirando outros a encontrarem sua própria voz autêntica.</p>'
  },
  'karmaPortal-9': {
    id: 'karmaPortal-9',
    title: 'Portal do Karma 9: O Humanitário',
    content: '<p>O Portal do Karma 9 representa a energia da compaixão, sabedoria e serviço à humanidade. Pessoas com este número têm uma forte conexão com o altruísmo e a visão global.</p><h3>Lições Principais</h3><p>Seu desafio é aprender a equilibrar o cuidado com os outros e o desapego, reconhecendo quando ajudar e quando permitir que os outros sigam seu próprio caminho.</p><h3>Afirmação Kármica</h3><p>Eu sirvo à humanidade com compaixão e sabedoria, reconhecendo a interconexão de todos os seres.</p>'
  },
  'karmicInheritance-4': {
    id: 'karmicInheritance-4',
    title: 'Herança Kármica 4: O Construtor',
    content: '<p>A Herança Kármica 4 representa a energia da estabilidade, disciplina e construção de bases sólidas. Pessoas com este número herdam a capacidade de criar estruturas duradouras em suas vidas.</p><h3>Legado Ancestral</h3><p>Você herdou de seus ancestrais a capacidade de trabalhar com determinação e perseverança, construindo passo a passo realizações duradouras.</p><h3>Afirmação Kármica</h3><p>Eu honro minha herança construindo bases sólidas para meu futuro, com paciência e determinação.</p>'
  },
  'karmicReprogramming-3': {
    id: 'karmicReprogramming-3',
    title: 'Códex da Reprogramação 3: Expressão Criativa',
    content: '<p>O Códex da Reprogramação 3 representa a necessidade de transformar padrões relacionados à autoexpressão, comunicação e criatividade. Este número indica que você está reprogramando como você se expressa no mundo.</p><h3>Padrões a Transformar</h3><p>Bloqueios na expressão pessoal, medo de julgamento ao se comunicar, e dificuldade em reconhecer seus talentos criativos são os principais desafios a serem superados.</p><h3>Afirmação Kármica</h3><p>Eu me liberto dos bloqueios de expressão e permito que minha criatividade flua livremente em todas as áreas da minha vida.</p>'
  },
  'cycleProphecy-9': {
    id: 'cycleProphecy-9',
    title: 'Profecia dos Ciclos 9: Completude',
    content: '<p>A Profecia dos Ciclos 9 representa um período de conclusões e finalizações importantes em sua vida. Este número indica que você está no final de um grande ciclo, preparando-se para um novo começo.</p><h3>Ciclo Atual</h3><p>Você está em um momento de integração de lições aprendidas, liberação do que não serve mais, e preparação para uma nova fase de crescimento e expansão.</p><h3>Afirmação Kármica</h3><p>Eu concluo com gratidão este ciclo da minha vida, integrando suas lições e me abrindo para novos começos.</p>'
  },
  'spiritualMark-1': {
    id: 'spiritualMark-1',
    title: 'Marca Espiritual 1: Liderança Espiritual',
    content: '<p>A Marca Espiritual 1 representa seu dom inato para liderança e pioneirismo no caminho espiritual. Este número indica que você tem uma conexão especial com a energia da iniciativa divina.</p><h3>Dom Espiritual</h3><p>Você possui a capacidade de abrir novos caminhos, iniciar projetos inspiradores e liderar outros através do exemplo e da coragem espiritual.</p><h3>Afirmação Kármica</h3><p>Eu aceito meu papel como pioneiro espiritual, usando minha coragem e iniciativa para inspirar a transformação no mundo.</p>'
  },
  'manifestationEnigma-11': {
    id: 'manifestationEnigma-11',
    title: 'Enigma da Manifestação 11: O Mestre Intuitivo',
    content: '<p>O Enigma da Manifestação 11 representa seu potencial para manifestar através da intuição elevada e inspiração espiritual. Este número de mestre indica que você tem acesso a canais intuitivos poderosos para criar sua realidade.</p><h3>Potencial de Manifestação</h3><p>Você pode manifestar com maior facilidade quando confia em sua intuição, segue inspirações súbitas e mantém-se alinhado com propósitos que beneficiam a coletividade.</p><h3>Afirmação Kármica</h3><p>Eu confio em minha intuição superior como ferramenta divina para manifestar inspiração e iluminação em minha vida e no mundo.</p>'
  }
};

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
  
  console.log(`Buscando interpretação para: ${id}`);
  
  // If not found in loaded interpretations, check sample interpretations
  if (!interpretations[id]) {
    console.log(`Interpretação não encontrada em interpretations, verificando em SAMPLE_INTERPRETATIONS`);
    
    if (SAMPLE_INTERPRETATIONS[id]) {
      console.log(`Interpretação encontrada em SAMPLE_INTERPRETATIONS para ${id}`);
      return SAMPLE_INTERPRETATIONS[id];
    }
    
    console.log(`Interpretação não encontrada para ${id}, retornando interpretação padrão`);
    return {
      id,
      title: `${getCategoryDisplayName(category)} ${number}`,
      content: DEFAULT_INTERPRETATION
    };
  }
  
  console.log(`Interpretação encontrada para ${id}`);
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
  try {
    localStorage.setItem('karmicInterpretations', JSON.stringify(interpretations));
    console.log("Interpretações salvas com sucesso no localStorage");
  } catch (error) {
    console.error("Erro ao salvar interpretações no localStorage:", error);
  }
}

// Load interpretations from localStorage
export function loadInterpretations(): void {
  console.log("Tentando carregar interpretações do localStorage...");
  try {
    const saved = localStorage.getItem('karmicInterpretations');
    
    if (saved) {
      console.log("Dados de interpretações encontrados no localStorage");
      interpretations = JSON.parse(saved);
      
      // Verificar se as interpretações foram carregadas corretamente
      const count = Object.keys(interpretations).length;
      console.log(`Número de interpretações carregadas: ${count}`);
      
      if (count === 0) {
        console.log("Nenhuma interpretação encontrada no localStorage, carregando amostras");
        // Se não houver interpretações salvas, preencher com as amostras
        Object.assign(interpretations, SAMPLE_INTERPRETATIONS);
        // Salvar essas amostras no localStorage para uso futuro
        saveInterpretations();
      }
    } else {
      console.log("Nenhum dado de interpretações encontrado no localStorage, carregando amostras");
      // Carregar interpretações de amostra
      Object.assign(interpretations, SAMPLE_INTERPRETATIONS);
      // Salvar essas amostras no localStorage para uso futuro
      saveInterpretations();
    }
  } catch (error) {
    console.error("Erro ao carregar interpretações:", error);
    // Em caso de erro, carregar as interpretações de amostra
    Object.assign(interpretations, SAMPLE_INTERPRETATIONS);
  }
}

// Ensure we have all sample interpretations available as a fallback
export function ensureSampleInterpretationsLoaded(): void {
  console.log("Verificando se as interpretações de amostra estão disponíveis...");
  
  let needToSave = false;
  
  // Check if we have all sample interpretations and add any missing ones
  Object.entries(SAMPLE_INTERPRETATIONS).forEach(([id, interpretation]) => {
    if (!interpretations[id]) {
      console.log(`Adicionando interpretação de amostra faltante: ${id}`);
      interpretations[id] = interpretation;
      needToSave = true;
    }
  });
  
  // If we added any missing sample interpretations, save to localStorage
  if (needToSave) {
    console.log("Salvando interpretações de amostra adicionadas");
    saveInterpretations();
  }
}

// Initialize interpretations from localStorage on module load
console.log("Inicializando módulo de interpretações");
loadInterpretations();
ensureSampleInterpretationsLoaded(); // Make sure we at least have sample interpretations

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

// Generate HTML for download
export function generateInterpretationsHTML(karmicData: any): string {
  if (!karmicData) return '<p>Nenhum dado kármico disponível.</p>';
  
  const categories = getAllCategories();
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
        <div class="date">Gerado em: ${new Date().toLocaleDateString('pt-BR')}</div>
      </div>
  `;
  
  // Verificar se temos números kármicos válidos
  let hasValidData = false;
  
  // Adicionar cada categoria de interpretação
  categories.forEach(category => {
    if (karmicData[category] || karmicData[category] === 0) {
      const number = karmicData[category];
      const interpretation = getInterpretation(category, number);
      
      // Verifica se temos conteúdo real para adicionar
      if (interpretation && interpretation.content && 
          interpretation.content !== DEFAULT_INTERPRETATION) {
        
        hasValidData = true;
        
        htmlContent += `
          <div class="interpretation">
            <h2>${interpretation.title}</h2>
            ${interpretation.content}
          </div>
        `;
      }
    }
  });
  
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
    `;
  }
  
  htmlContent += `
    </body>
    </html>
  `;
  
  return htmlContent;
}
