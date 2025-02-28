
import React, { useState } from 'react';
import { getInterpretation, renderHTML, getCategoryDisplayName } from '@/lib/interpretations';
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
  };
}

const MatrixInterpretations: React.FC<MatrixInterpretationsProps> = ({ karmicData }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['karmicSeal']));

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

  // Função que processa o HTML para estilizar automaticamente
  const processInterpretationHTML = (html: string) => {
    // Estiliza os parágrafos com <strong> para dar destaque a certas partes
    let processedHTML = html;
    
    // Cria boxes para afirmações
    processedHTML = processedHTML.replace(
      /<h3>Afirmação.*?<\/h3>(.*?)(?=<h3>|$)/gs, 
      '<div class="affirmation-box"><h3 class="affirmation-title">Afirmação Kármica</h3>$1</div>'
    );
    
    // Destaca títulos secundários (h3)
    processedHTML = processedHTML.replace(
      /<h3>(.*?)<\/h3>/g,
      '<h3 class="karmic-subtitle">$1</h3>'
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
          const processedContent = processInterpretationHTML(interpretation.content);
          
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="karmic-card cursor-pointer"
              onClick={() => toggleSection(item.key)}
            >
              <div className="flex justify-between items-center mb-2">
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
                    <div 
                      className="karmic-content mt-4 pt-4 border-t border-karmic-200" 
                      dangerouslySetInnerHTML={{ __html: processedContent }} 
                    />
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
