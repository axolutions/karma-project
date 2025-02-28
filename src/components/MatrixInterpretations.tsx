
import React, { useState, useEffect } from 'react';
import { getInterpretation, getCategoryDisplayName, exportInterpretations } from '@/lib/interpretations';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

interface MatrixInterpretationsProps {
  karmicData: {
    karmicSeal: number;
    destinyCall: number;
    karmaPortal: number;
    karmicInheritance: number;
    karmicReprogramming: number;
    cycleProphecy: number;
    spiritualMark: number;
    manifestationEnigma: number;
  } | undefined;
}

const MatrixInterpretations: React.FC<MatrixInterpretationsProps> = ({ karmicData }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['karmicSeal']));
  const [isLoaded, setIsLoaded] = useState(false);
  const [interpretationsData, setInterpretationsData] = useState<Record<string, any>>({});
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Carregar interpretações logo no início
    const loadAllInterpretations = () => {
      try {
        console.log("Carregando todas as interpretações disponíveis");
        // Extrair todas as interpretações disponíveis para diagnóstico
        const allData = exportInterpretations();
        console.log("Dados de interpretações disponíveis:", allData);
        setInterpretationsData(allData);
        
        if (Object.keys(allData).length === 0) {
          console.warn("Nenhuma interpretação encontrada no armazenamento");
          setLoadError(true);
          toast({
            title: "Aviso sobre interpretações",
            description: "Não foi possível carregar as interpretações. Usando conteúdo padrão.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Erro ao carregar interpretações:", error);
        setLoadError(true);
      } finally {
        // Mesmo com erro, continuamos para mostrar ao menos os defaults
        setIsLoaded(true);
      }
    };

    // Pequeno delay para garantir que as interpretações sejam carregadas
    const timer = setTimeout(() => {
      loadAllInterpretations();
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleSection = (category: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Se karmicData for undefined, exibimos uma mensagem
  if (!karmicData) {
    return (
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <div className="karmic-card p-6">
          <h2 className="text-xl font-serif font-medium text-karmic-800 mb-4">
            Interpretações não disponíveis
          </h2>
          <p className="text-karmic-600">
            Os dados da sua matriz kármica não estão disponíveis no momento. Por favor, verifique seu perfil ou tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  const interpretationItems = [
    { key: 'karmicSeal', value: karmicData.karmicSeal },
    { key: 'destinyCall', value: karmicData.destinyCall },
    { key: 'karmaPortal', value: karmicData.karmaPortal },
    { key: 'karmicInheritance', value: karmicData.karmicInheritance },
    { key: 'karmicReprogramming', value: karmicData.karmicReprogramming },
    { key: 'cycleProphecy', value: karmicData.cycleProphecy },
    { key: 'spiritualMark', value: karmicData.spiritualMark },
    { key: 'manifestationEnigma', value: karmicData.manifestationEnigma }
  ];

  // Função para formatar explicitamente o conteúdo de texto bruto
  const formatRawContent = (text: string) => {
    if (!text) return "";
    
    // Dividir em parágrafos
    const paragraphs = text.split('\n\n');
    return paragraphs.map(p => `<p>${p}</p>`).join('\n');
  };

  // Função mais robusta para processar o HTML
  const processContent = (htmlContent: string) => {
    // Se estiver vazio, retorna vazio
    if (!htmlContent || htmlContent.trim() === '') return '';
    
    // Verifica se é um conteúdo sem formatação HTML
    if (!htmlContent.includes('<') && !htmlContent.includes('>')) {
      return formatRawContent(htmlContent);
    }
    
    // Para conteúdos que já têm HTML
    let processedHTML = htmlContent;
    
    // Garantir que todos os parágrafos tenham tag <p>
    if (!processedHTML.includes('<p>')) {
      processedHTML = formatRawContent(processedHTML);
    }
    
    // Aplicar formatação de negrito a frases-chave
    const commonKeyPhrases = [
      "desenvolvido em 2025", "Selo Kármico", "Portal do Karma", 
      "lições principais", "propósito de vida", "missão cármica",
      "desafio essencial", "consciência espiritual", "potencial interior",
      "auto-confiança", "autoconfiança", "sabedoria", "coragem", "crescimento",
      "transformação"
    ];
    
    // Aplicar negrito a frases-chave que não estão dentro de tags
    commonKeyPhrases.forEach(phrase => {
      // Regex que encontra a frase mas não se estiver dentro de tags HTML
      const regex = new RegExp(`(?<![<>\\w])${phrase}(?![<>\\w])`, 'gi');
      processedHTML = processedHTML.replace(regex, `<strong>${phrase}</strong>`);
    });
    
    // Formatar subtítulos
    processedHTML = processedHTML.replace(
      /<h3>(.*?)<\/h3>/g,
      '<h3 class="karmic-subtitle">$1</h3>'
    );
    
    // Formatar afirmações
    processedHTML = processedHTML.replace(
      /<h3[^>]*>Afirmação[^<]*<\/h3>([\s\S]*?)(?=<h3|$)/g,
      '<div class="affirmation-box"><h3 class="affirmation-title">Afirmação Kármica</h3>$1</div>'
    );
    
    // Destacar palavras específicas de reforço
    const emphasisWords = ["deve", "precisará", "essencial", "importante", "fundamental", "vital"];
    emphasisWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      processedHTML = processedHTML.replace(regex, `<strong>${word}</strong>`);
    });
    
    // Converter marcadores simples que não estejam em listas
    processedHTML = processedHTML.replace(
      /(?<!<li>)- (.*?)(?=<br|<\/p>|$)/g,
      '<li>$1</li>'
    );
    
    // Agrupar itens de lista soltos
    let hasUngroupedItems = processedHTML.includes('<li>') && !processedHTML.includes('<ul>');
    if (hasUngroupedItems) {
      processedHTML = processedHTML.replace(
        /(<li>.*?<\/li>\s*)+/g,
        '<ul class="my-4 space-y-2">$&</ul>'
      );
    }
    
    // Adicionar espaçamento em tags p que não tenham classe ou estilo
    processedHTML = processedHTML.replace(
      /<p(?![^>]*class=)([^>]*)>/g, 
      '<p class="my-4 leading-relaxed"$1>'
    );
    
    return processedHTML;
  };

  // Renderizar conteúdo de exemplo para casos onde a interpretação original não existe
  const getFallbackContent = (category: string, number: number) => {
    const categoryDisplayName = getCategoryDisplayName(category);
    let fallbackContent = '';
    
    // Conteúdo básico baseado na categoria
    switch(category) {
      case 'karmicSeal':
        fallbackContent = `<p>Seu <strong>Selo Kármico ${number}</strong> em 2025 indica um período de crescimento significativo. Este número representa sua essência vital e propósito primordial.</p>
        <h3>Significado Profundo</h3>
        <p>O número ${number} traz a energia de [qualidade principal], convidando você a desenvolver maior [virtude relacionada] enquanto trabalha seus desafios pessoais.</p>`;
        break;
      case 'destinyCall':
        fallbackContent = `<p>O <strong>Chamado do Destino ${number}</strong> em sua matriz para 2025 revela sua vocação profunda e propósito de vida. Este é um momento crucial para ouvir o que sua alma veio realizar.</p>`;
        break;
      case 'karmaPortal':
        fallbackContent = `<p>O <strong>Portal do Karma ${number}</strong> em sua matriz revela as lições que sua alma está trabalhando em 2025. Este portal representa um ponto de transformação importante.</p>`;
        break;
      case 'karmicInheritance':
        fallbackContent = `<p>Sua <strong>Herança Kármica ${number}</strong> representa os dons e talentos que você traz de vidas passadas. Em 2025, estes dons estarão especialmente ativos e disponíveis.</p>`;
        break;
      case 'karmicReprogramming':
        fallbackContent = `<p>O <strong>Códex da Reprogramação ${number}</strong> indica padrões que precisam ser transformados em 2025. Este é um ano importante para liberar limitações antigas.</p>`;
        break;
      case 'cycleProphecy':
        fallbackContent = `<p>A <strong>Profecia dos Ciclos ${number}</strong> revela as energias cíclicas que estarão influenciando sua vida em 2025. Prepare-se para um período de significativa evolução pessoal.</p>`;
        break;
      case 'spiritualMark':
        fallbackContent = `<p>Sua <strong>Marca Espiritual ${number}</strong> indica a frequência vibratória de sua alma em 2025. Esta energia o guiará em sua expansão de consciência ao longo do ano.</p>`;
        break;
      case 'manifestationEnigma':
        fallbackContent = `<p>O <strong>Enigma da Manifestação ${number}</strong> em sua matriz para 2025 revela como você tende a materializar suas intenções e desejos. Esta energia o ajudará a manifestar o que realmente importa.</p>`;
        break;
      default:
        fallbackContent = `<p>Esta interpretação ainda está sendo preparada. Por favor, consulte novamente em breve para obter insights sobre o ${categoryDisplayName} ${number}.</p>`;
    }
    
    // Adicionar afirmação genérica
    fallbackContent += `<h3>Afirmação Kármica</h3>
    <p>Eu abraço plenamente a energia do número ${number} em minha vida, permitindo que ela me guie para meu mais alto potencial em 2025.</p>`;
    
    return fallbackContent;
  };

  if (!isLoaded) {
    return (
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <div className="animate-pulse karmic-card p-6">
          <h2 className="text-xl font-serif font-medium text-karmic-800 mb-4">
            Carregando interpretações...
          </h2>
          <div className="h-4 bg-karmic-200 rounded mb-3"></div>
          <div className="h-4 bg-karmic-200 rounded mb-3 w-3/4"></div>
          <div className="h-4 bg-karmic-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl md:text-3xl font-serif font-medium text-karmic-800 mb-6 text-center">
        Interpretações da Sua Matriz Kármica
      </h2>
      
      {loadError && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Algumas interpretações podem estar usando conteúdo padrão.</strong> Os dados completos não puderam ser carregados neste momento.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {interpretationItems.map((item, index) => {
          // Tenta obter a interpretação, com tratamento de erro
          let interpretation = { title: '', content: '' };
          try {
            interpretation = getInterpretation(item.key, item.value);
            
            // Verificar se temos apenas o conteúdo padrão (indica que não existe interpretação personalizada)
            const isDefaultContent = interpretation.content.includes("Interpretação não disponível");
            
            // Se for conteúdo padrão, usar o fallback
            if (isDefaultContent) {
              interpretation.title = `${getCategoryDisplayName(item.key)} ${item.value}`;
              interpretation.content = getFallbackContent(item.key, item.value);
            }
          } catch (error) {
            console.error(`Erro ao obter interpretação para ${item.key}-${item.value}:`, error);
            interpretation.title = `${getCategoryDisplayName(item.key)} ${item.value}`;
            interpretation.content = getFallbackContent(item.key, item.value);
          }
          
          const isExpanded = expandedSections.has(item.key);
          const processedContent = processContent(interpretation.content);
          
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="karmic-card"
            >
              <div 
                className="flex justify-between items-center mb-2 cursor-pointer"
                onClick={() => toggleSection(item.key)}
              >
                <h3 className="text-xl font-serif font-medium text-karmic-800">
                  {getCategoryDisplayName(item.key)}
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="karmic-number">{item.value}</span>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-karmic-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-karmic-500" />
                  )}
                </div>
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="karmic-content mt-4 pt-4 border-t border-karmic-200">
                      <div 
                        className="prose prose-karmic max-w-none"
                        dangerouslySetInnerHTML={{ __html: processedContent }} 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default MatrixInterpretations;
