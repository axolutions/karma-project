
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";
import html2canvas from 'html2canvas';

interface KarmicMatrixProps {
  karmicData: any;
}

const KarmicMatrix: React.FC<KarmicMatrixProps> = ({ karmicData }) => {
  const matrixRef = useRef<HTMLDivElement>(null);
  
  console.log("KarmicMatrix: Dados recebidos:", karmicData);
  
  // Criar dados kármicos seguros (garantindo valores padrão para campos ausentes)
  const safeKarmicData = {
    karmicSeal: karmicData?.karmicSeal || 0,
    destinyCall: karmicData?.destinyCall || 0,
    karmaPortal: karmicData?.karmaPortal || 0,
    karmicInheritance: karmicData?.karmicInheritance || 0,
    karmicReprogramming: karmicData?.karmicReprogramming || 0,
    cycleProphecy: karmicData?.cycleProphecy || 0,
    spiritualMark: karmicData?.spiritualMark || 0,
    manifestationEnigma: karmicData?.manifestationEnigma || 0
  };
  
  console.log("KarmicMatrix: Dados seguros:", safeKarmicData);
  
  // Mapeamento entre as chaves do objeto e os IDs no HTML
  const keyToIdMapping = {
    karmicSeal: "selo_karmico",
    destinyCall: "chamado_destino",
    karmaPortal: "portal_karma",
    karmicInheritance: "heranca_karmica",
    karmicReprogramming: "codex_reprogramacao",
    cycleProphecy: "profecia_ciclos",
    spiritualMark: "marca_espiritual",
    manifestationEnigma: "enigma_manifestacao"
  };
  
  // Mapeamento entre as chaves do objeto e os títulos em português
  const keyToTitle = {
    karmicSeal: "Selo Kármico 2025",
    destinyCall: "Chamado do Destino 2025",
    karmaPortal: "Portal do Karma 2025",
    karmicInheritance: "Herança Kármica 2025",
    karmicReprogramming: "Códex da Reprogramação 2025",
    cycleProphecy: "Profecia dos Ciclos 2025",
    spiritualMark: "Marca Espiritual 2025",
    manifestationEnigma: "Enigma da Manifestação 2025"
  };

  const handleDownloadMatrix = async () => {
    if (!matrixRef.current) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar a imagem da matriz.",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Preparando download",
        description: "Gerando imagem da sua matriz kármica..."
      });

      const canvas = await html2canvas(matrixRef.current, { 
        backgroundColor: "#fff",
        scale: 2, // Higher quality
      });
      
      const imageUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'Matriz-Karmica-2025.png';
      link.href = imageUrl;
      link.click();
      
      toast({
        title: "Download concluído",
        description: "Sua matriz kármica foi salva com sucesso!"
      });
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao gerar a imagem da matriz.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto">
      <div 
        ref={matrixRef} 
        className="matrix-container relative w-full max-w-2xl mx-auto rounded-lg bg-white border border-gray-200 shadow-md p-6"
      >
        {/* Título da matriz */}
        <div className="mb-4 text-center">
          <h3 className="text-xl md:text-2xl font-serif font-medium text-gray-800">Matriz Kármica 2025</h3>
        </div>
        
        {/* Matrix grid layout */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div 
            id={keyToIdMapping.karmicSeal} 
            className="bg-white p-4 rounded-lg shadow text-center font-bold text-2xl"
            title={keyToTitle.karmicSeal}
          >
            {safeKarmicData.karmicSeal}
          </div>
          <div 
            id={keyToIdMapping.destinyCall} 
            className="bg-white p-4 rounded-lg shadow text-center font-bold text-2xl"
            title={keyToTitle.destinyCall}
          >
            {safeKarmicData.destinyCall}
          </div>
          <div 
            id={keyToIdMapping.karmaPortal} 
            className="bg-white p-4 rounded-lg shadow text-center font-bold text-2xl"
            title={keyToTitle.karmaPortal}
          >
            {safeKarmicData.karmaPortal}
          </div>
          <div 
            id={keyToIdMapping.karmicInheritance} 
            className="bg-white p-4 rounded-lg shadow text-center font-bold text-2xl"
            title={keyToTitle.karmicInheritance}
          >
            {safeKarmicData.karmicInheritance}
          </div>
          <div 
            id={keyToIdMapping.karmicReprogramming} 
            className="bg-white p-4 rounded-lg shadow text-center font-bold text-2xl"
            title={keyToTitle.karmicReprogramming}
          >
            {safeKarmicData.karmicReprogramming}
          </div>
          <div 
            id={keyToIdMapping.cycleProphecy} 
            className="bg-white p-4 rounded-lg shadow text-center font-bold text-2xl"
            title={keyToTitle.cycleProphecy}
          >
            {safeKarmicData.cycleProphecy}
          </div>
          <div 
            id={keyToIdMapping.spiritualMark} 
            className="bg-white p-4 rounded-lg shadow text-center font-bold text-2xl"
            title={keyToTitle.spiritualMark}
          >
            {safeKarmicData.spiritualMark}
          </div>
          <div 
            id={keyToIdMapping.manifestationEnigma} 
            className="bg-white p-4 rounded-lg shadow text-center font-bold text-2xl"
            title={keyToTitle.manifestationEnigma}
          >
            {safeKarmicData.manifestationEnigma}
          </div>
        </div>
      </div>
      
      {/* Download button */}
      <div className="mt-6 flex justify-center print:hidden">
        <Button 
          onClick={handleDownloadMatrix}
          className="karmic-button flex items-center"
        >
          <Download className="mr-2 h-4 w-4" />
          Baixar Matriz Kármica
        </Button>
      </div>
    </div>
  );
};

export default KarmicMatrix;
