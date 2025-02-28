
import React, { useState, useEffect } from 'react';
import { getInterpretation, getCategoryDisplayName } from '@/lib/interpretations';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

  useEffect(() => {
    // Pequeno delay para garantir que as interpretações sejam carregadas
    const timer = setTimeout(() => {
      setIsLoaded(true);
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
      
      <div className="space-y-4">
        {interpretationItems.map((item, index) => {
          const interpretation = getInterpretation(item.key, item.value);
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
