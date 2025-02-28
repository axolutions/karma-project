
import React, { useState, useEffect } from 'react';
import { getInterpretation, getCategoryDisplayName, exportInterpretations, getAllInterpretations } from '@/lib/interpretations';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

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
  const [rawStorageData, setRawStorageData] = useState<string>("");

  // Function to force reload interpretations
  const forceReloadInterpretations = async () => {
    setIsLoaded(false);
    
    try {
      // Inspect localStorage directly
      const rawData = localStorage.getItem('karmicInterpretations');
      if (rawData) {
        setRawStorageData(rawData);
        console.log("Raw localStorage data found:", rawData.substring(0, 500) + "...");
      }
      
      // Try to get all interpretations
      const allInterpretations = getAllInterpretations();
      console.log("Total interpretations found:", allInterpretations.length);
      
      if (allInterpretations.length > 0) {
        // Display first 3 for diagnostics
        console.log("Sample interpretations:", allInterpretations.slice(0, 3));
      }

      // Get all data as object
      const allData = exportInterpretations();
      console.log("Exported interpretations data:", Object.keys(allData).length);
      setInterpretationsData(allData);
      
      if (Object.keys(allData).length === 0) {
        setLoadError(true);
        toast({
          title: "Nenhuma interpretação encontrada",
          description: "Não foi possível encontrar suas interpretações no sistema. Verifique se os dados foram importados corretamente.",
          variant: "destructive"
        });
      } else {
        setLoadError(false);
        toast({
          title: "Interpretações carregadas",
          description: `Interpretações carregadas com sucesso.`
        });
      }
    } catch (error) {
      console.error("Erro ao recarregar interpretações:", error);
      setLoadError(true);
      toast({
        title: "Erro ao carregar interpretações",
        description: "Ocorreu um erro ao tentar recuperar suas interpretações.",
        variant: "destructive"
      });
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    // Carregar interpretações logo no início
    const loadAllInterpretations = () => {
      try {
        console.log("Carregando todas as interpretações disponíveis");
        // Extrair todas as interpretações disponíveis para diagnóstico
        const allData = exportInterpretations();
        console.log("Dados de interpretações disponíveis:", allData);
        setInterpretationsData(allData);
        
        // Obter a lista completa de interpretações para depuração
        const allInterpretations = getAllInterpretations();
        console.log("Total de interpretações encontradas:", allInterpretations.length);
        
        if (Object.keys(allData).length === 0) {
          console.warn("Nenhuma interpretação encontrada no armazenamento");
          setLoadError(true);
          
          // Verificar localStorage diretamente
          const rawData = localStorage.getItem('karmicInterpretations');
          if (rawData) {
            setRawStorageData(rawData);
            console.log("Dados brutos encontrados no localStorage:", rawData.substring(0, 500) + "...");
            
            // Tentar recuperar manualmente
            try {
              const parsedData = JSON.parse(rawData);
              if (parsedData && Object.keys(parsedData).length > 0) {
                console.log("Dados recuperados manualmente do localStorage:", Object.keys(parsedData).length);
                setInterpretationsData(parsedData);
                setLoadError(false);
              }
            } catch (parseError) {
              console.error("Erro ao analisar dados do localStorage:", parseError);
            }
          }
          
          if (loadError) {
            toast({
              title: "Dados não encontrados",
              description: "Suas interpretações não foram encontradas. Use o botão 'Recuperar Interpretações' para tentar novamente.",
              variant: "destructive"
            });
          }
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

  // Tentar recuperar e exibir a interpretação real, sem fallback
  const getRawInterpretation = (category: string, number: number) => {
    const id = `${category}-${number}`;
    const interpretationData = interpretationsData[id];
    return interpretationData ? interpretationData.content : null;
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
        <Button
          variant="outline"
          size="sm"
          onClick={forceReloadInterpretations}
          className="h-8 text-xs border-amber-400 text-amber-700 hover:bg-amber-100 mb-4"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Recarregar Interpretações
        </Button>
      )}
      
      {loadError && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded-md">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <AlertCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Problemas ao carregar suas interpretações.</strong> Suas interpretações personalizadas não puderam ser carregadas.
              </p>
              <div className="mt-2 flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={forceReloadInterpretations}
                  className="h-8 text-xs border-amber-400 text-amber-700 hover:bg-amber-100"
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Tentar Novamente
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {interpretationItems.map((item, index) => {
          // Tenta obter a interpretação, com tratamento de erro
          let interpretation = { title: '', content: '' };
          try {
            // Primeiro verificamos se temos a interpretação real nos dados carregados
            const rawInterpretation = getRawInterpretation(item.key, item.value);
            
            if (rawInterpretation) {
              // Se temos a interpretação real, usamos ela
              interpretation = {
                title: `${getCategoryDisplayName(item.key)} ${item.value}`,
                content: rawInterpretation
              };
            } else {
              // Se não temos, tentamos obter do sistema
              interpretation = getInterpretation(item.key, item.value);
              
              // Verificar se temos apenas o conteúdo padrão (indica que não existe interpretação)
              if (interpretation.content.includes("Interpretação não disponível")) {
                console.warn(`Interpretação não encontrada para ${item.key}-${item.value}`);
              }
            }
          } catch (error) {
            console.error(`Erro ao obter interpretação para ${item.key}-${item.value}:`, error);
            interpretation = {
              title: `${getCategoryDisplayName(item.key)} ${item.value}`,
              content: `<p>Não foi possível carregar esta interpretação. Por favor, tente recarregar a página.</p>`
            };
          }
          
          const isExpanded = expandedSections.has(item.key);
          
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
                        dangerouslySetInnerHTML={{ __html: interpretation.content }} 
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
