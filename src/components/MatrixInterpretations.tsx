import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { getInterpretation } from "@/lib/interpretations";

// Definição dos tipos
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

interface InterpretationItemProps {
  title: string;
  number: number;
  interpretation: string;
  isOpen?: boolean;
  onToggle?: () => void;
  initialExpanded?: boolean;
}

const InterpretationCard: React.FC<InterpretationItemProps> = ({
  title,
  number,
  interpretation,
  initialExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const isMobile = useIsMobile();
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Função para processar emojis no texto
  const processContent = (content: string) => {
    // Preservar emojis e formatação HTML
    return content;
  };

  // Corrigir o HTML que vem da interpretação
  const sanitizeHtml = (html: string) => {
    // Remover quebras de linha extras e espaços, mas preservar formatação
    return html.replace(/\n\s*\n/g, '\n').trim();
  };
  
  return (
    <div className="karmic-card bg-cream-50 rounded-lg border border-amber-200 mb-6 p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-center cursor-pointer" onClick={toggleExpand}>
        <div className="flex items-center">
          <div className="karmic-number mr-4 bg-amber-100 text-amber-900 font-serif font-bold text-xl rounded-full w-12 h-12 flex items-center justify-center border border-amber-300">{number}</div>
          <h3 className="text-xl font-serif font-semibold text-amber-900">{title}</h3>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="interpretation-toggle p-1 h-8 w-8 text-amber-700 hover:bg-amber-100 hover:text-amber-900"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand();
          }}
        >
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </Button>
      </div>
      
      <div className={`interpretation-content mt-5 ${isExpanded ? '' : 'hidden'}`}>
        {interpretation && (
          <div 
            className="prose prose-amber max-w-none prose-headings:font-serif prose-headings:text-amber-900 prose-p:text-amber-800 prose-li:text-amber-800 prose-strong:text-amber-900 prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ 
              __html: sanitizeHtml(processContent(interpretation)) 
            }}
          />
        )}
      </div>
    </div>
  );
};

// Componente principal para exibir as interpretações da matriz
const MatrixInterpretations: React.FC<MatrixInterpretationsProps> = ({ karmicData }) => {
  const [interpretations, setInterpretations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Carregar interpretações
  const loadInterpretations = async () => {
    setLoading(true);
    try {
      if (!karmicData) {
        throw new Error("Dados kármicos não disponíveis");
      }
      
      const allInterpretations: Record<string, string> = {};
      
      // Obter interpretações para cada número kármico
      const keys = Object.keys(karmicData) as Array<keyof typeof karmicData>;
      
      for (const key of keys) {
        const number = karmicData[key];
        const interpretation = await getInterpretation(key, number);
        
        // Verificar e tratar todos os tipos possíveis de retorno
        if (typeof interpretation === 'string') {
          allInterpretations[key] = interpretation;
        } else if (interpretation && typeof interpretation === 'object' && 'content' in interpretation) {
          allInterpretations[key] = interpretation.content || "Interpretação não disponível no momento.";
        } else {
          allInterpretations[key] = "Interpretação não disponível no momento.";
        }
      }
      
      setInterpretations(allInterpretations);
    } catch (error) {
      console.error("Erro ao carregar interpretações:", error);
      toast({
        title: "Erro ao carregar interpretações",
        description: "Não foi possível obter as interpretações dos números kármicos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (karmicData) {
      loadInterpretations();
    }
  }, [karmicData]);
  
  const forceReloadInterpretations = () => {
    toast({
      title: "Recarregando interpretações",
      description: "Aguarde enquanto atualizamos as interpretações kármicas..."
    });
    loadInterpretations();
  };
  
  // Definir os títulos para cada número kármico
  const numberTitles = {
    karmicSeal: "Selo Kármico 2025",
    destinyCall: "Chamado do Destino 2025",
    karmaPortal: "Portal do Karma 2025",
    karmicInheritance: "Herança Kármica 2025",
    karmicReprogramming: "Códex da Reprogramação 2025",
    cycleProphecy: "Profecia dos Ciclos 2025",
    spiritualMark: "Marca Espiritual 2025",
    manifestationEnigma: "Enigma da Manifestação 2025"
  };
  
  if (!karmicData) {
    return (
      <div className="p-6 bg-amber-50 rounded-lg text-center text-amber-800 border border-amber-200">
        Dados kármicos não disponíveis. Por favor, verifique sua data de nascimento.
      </div>
    );
  }
  
  // Ordenar as interpretações na ordem desejada
  const interpretationOrder = [
    'karmicSeal',
    'destinyCall',
    'karmaPortal', 
    'karmicInheritance',
    'karmicReprogramming',
    'cycleProphecy',
    'spiritualMark',
    'manifestationEnigma'
  ];
  
  return (
    <div className="matrix-interpretations bg-cream-50 p-6 rounded-lg border border-amber-200">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-amber-900 mb-4 md:mb-0">
          Interpretações da sua Matriz
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={forceReloadInterpretations}
          className="h-8 text-xs border-amber-400 text-amber-800 hover:bg-amber-100 mb-4"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Recarregar Interpretações
        </Button>
      </div>
      
      <Separator className="mb-8 bg-amber-200" />
      
      {loading ? (
        <div className="text-center py-10">
          <RefreshCw className="h-8 w-8 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-amber-700 font-serif">Carregando interpretações kármicas...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {interpretationOrder.map((key, index) => {
            const karmicKey = key as keyof typeof karmicData;
            const number = karmicData[karmicKey];
            const title = numberTitles[karmicKey as keyof typeof numberTitles];
            const interpretation = interpretations[karmicKey] || "Interpretação não disponível.";
            
            return (
              <InterpretationCard
                key={karmicKey}
                title={title}
                number={number}
                interpretation={interpretation}
                initialExpanded={index === 0} // Primeiro item expandido por padrão
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MatrixInterpretations;
