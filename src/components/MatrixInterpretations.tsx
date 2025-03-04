
import React, { useState, useEffect } from 'react';
import { getInterpretation, getCategoryDisplayName, loadInterpretations, ensureSampleInterpretationsLoaded, forceLoadSampleInterpretations } from '@/lib/interpretations';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

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
  };
}

const MatrixInterpretations: React.FC<MatrixInterpretationsProps> = ({ karmicData }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['karmicSeal']));
  const [interpretationsLoaded, setInterpretationsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load interpretations on component mount
  useEffect(() => {
    console.log("MatrixInterpretations: Carregando interpretações...");
    try {
      // Primeiro, vamos forçar o carregamento das amostras
      forceLoadSampleInterpretations();
      
      // Load interpretations from localStorage or use samples
      loadInterpretations();
      
      // Make sure sample interpretations are available as fallback
      ensureSampleInterpretationsLoaded();
      
      setInterpretationsLoaded(true);
      console.log("MatrixInterpretations: Interpretações carregadas com sucesso");
    } catch (err) {
      console.error("Erro ao carregar interpretações no componente:", err);
      setLoadError("Carregando interpretações alternativas...");
      
      // Try to load sample interpretations as fallback
      try {
        forceLoadSampleInterpretations();
        ensureSampleInterpretationsLoaded();
        setInterpretationsLoaded(true);
        setLoadError(null);
      } catch (e) {
        console.error("Não foi possível carregar interpretações de amostra:", e);
      }
    }
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

  // Verificar se temos dados kármicos válidos
  const hasValidData = karmicData && 
    typeof karmicData === 'object' && 
    Object.keys(karmicData).length > 0;
  
  // Se não tivermos dados válidos, exibir uma mensagem de erro
  if (!hasValidData) {
    console.error("Dados kármicos inválidos ou ausentes", karmicData);
    return (
      <div className="max-w-4xl mx-auto mt-8 p-8 bg-red-50 border border-red-200 rounded-md text-center">
        <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-medium text-red-600 mb-2">Erro ao carregar interpretações</h2>
        <p className="text-red-500">Não foi possível carregar os dados das interpretações kármicas.</p>
        <p className="text-sm text-red-400 mt-2">Tente atualizar a página ou entre em contato com o suporte.</p>
      </div>
    );
  }

  // Se houver erro ao carregar interpretações
  if (loadError) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-8 bg-yellow-50 border border-yellow-200 rounded-md text-center">
        <AlertTriangle className="h-8 w-8 mx-auto text-yellow-500 mb-4" />
        <h2 className="text-xl font-medium text-yellow-600 mb-2">Aviso</h2>
        <p className="text-yellow-600">{loadError}</p>
        <p className="text-sm text-yellow-500 mt-2">Algumas interpretações podem não estar disponíveis.</p>
      </div>
    );
  }

  // Se as interpretações ainda não foram carregadas, mostrar um estado de carregamento
  if (!interpretationsLoaded) {
    return (
      <div className="max-w-4xl mx-auto mt-8 p-8 bg-gray-50 border border-gray-200 rounded-md text-center">
        <h2 className="text-xl font-medium text-gray-600 mb-2">Carregando interpretações...</h2>
        <p className="text-gray-500">Aguarde enquanto carregamos suas interpretações kármicas.</p>
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

  // Função melhorada para processar o HTML e preservar emojis
  const processContent = (htmlContent: string) => {
    // Se estiver vazio, retorna vazio
    if (!htmlContent || htmlContent.trim() === '') return '';
    
    // Preservar emojis e formatação original
    let processedHTML = htmlContent;
    
    // Verifica se é um conteúdo sem formatação HTML e adiciona tags <p>
    if (!htmlContent.includes('<') && !htmlContent.includes('>')) {
      const paragraphs = htmlContent.split('\n\n');
      processedHTML = paragraphs.map(p => `<p>${p}</p>`).join('\n');
    }
    
    // Verificar se há listas não estruturadas corretamente
    if (processedHTML.includes('<li>') && !processedHTML.includes('<ul>')) {
      processedHTML = processedHTML.replace(
        /(<li>.*?<\/li>\s*)+/g,
        '<ul class="my-4 space-y-2">$&</ul>'
      );
    }
    
    // Formatar afirmações de forma mais robusta para capturar variações
    processedHTML = processedHTML.replace(
      /<h3[^>]*>Afirmação[^<]*<\/h3>([\s\S]*?)(?=<h3|$)/g,
      '<div class="affirmation-box"><h3 class="affirmation-title">Afirmação Kármica</h3>$1</div>'
    );
    
    // Adicionar espaçamento em tags p que não tenham classe ou estilo
    processedHTML = processedHTML.replace(
      /<p(?![^>]*class=)([^>]*)>/g, 
      '<p class="my-4 leading-relaxed"$1>'
    );
    
    return processedHTML;
  };

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
