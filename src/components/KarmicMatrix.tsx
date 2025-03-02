
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
  
  // Posições corretas com base na imagem de referência
  const numberPositions = {
    // Posições atualizadas conforme a imagem de referência
    manifestationEnigma: { top: "20%", left: "50%" },    // 11 (topo)
    spiritualMark: { top: "32%", left: "77%" },          // 1 (direita superior)
    karmicInheritance: { top: "67%", left: "77%" },      // 4 (direita inferior)
    cycleProphecy: { top: "80%", left: "50%" },          // 9 (embaixo)
    karmicReprogramming: { top: "67%", left: "22%" },    // 3 (esquerda inferior)
    karmaPortal: { top: "32%", left: "22%" },            // 9 (esquerda superior)
    karmicSeal: { top: "30%", left: "41%" },             // 6 (diagonal superior esquerda)
    destinyCall: { top: "67%", left: "57%" }             // 3 (diagonal inferior direita)
  };

  // Simplificamos o mapeamento para usar os valores diretamente
  const numbersToDisplay = [
    { key: 'karmicSeal', value: safeKarmicData.karmicSeal, title: "Selo Kármico 2025" },
    { key: 'destinyCall', value: safeKarmicData.destinyCall, title: "Chamado do Destino 2025" },
    { key: 'karmaPortal', value: safeKarmicData.karmaPortal, title: "Portal do Karma 2025" },
    { key: 'karmicInheritance', value: safeKarmicData.karmicInheritance, title: "Herança Kármica 2025" },
    { key: 'karmicReprogramming', value: safeKarmicData.karmicReprogramming, title: "Códex da Reprogramação 2025" },
    { key: 'cycleProphecy', value: safeKarmicData.cycleProphecy, title: "Profecia dos Ciclos 2025" },
    { key: 'spiritualMark', value: safeKarmicData.spiritualMark, title: "Marca Espiritual 2025" },
    { key: 'manifestationEnigma', value: safeKarmicData.manifestationEnigma, title: "Enigma da Manifestação 2025" }
  ];

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
        className="matrix-container relative w-full aspect-square max-w-2xl mx-auto rounded-lg bg-white border border-gray-200 shadow-md p-4"
      >
        {/* Título da matriz */}
        <div className="absolute top-[5%] left-0 right-0 text-center">
          <h3 className="text-xl md:text-2xl font-serif font-medium text-gray-800">Matriz Kármica 2025</h3>
        </div>
        
        {/* Matrix design (HTML/CSS) */}
        <div className="absolute inset-0 p-8">
          {/* Círculo externo */}
          <div className="absolute inset-[5%] rounded-full border border-gray-300"></div>
          
          {/* Círculo interno */}
          <div className="absolute inset-[20%] rounded-full border border-gray-300"></div>
          
          {/* Linha horizontal */}
          <div className="absolute top-1/2 left-[5%] right-[5%] h-[1px] bg-gray-300 transform -translate-y-1/2"></div>
          
          {/* Linha vertical */}
          <div className="absolute left-1/2 top-[5%] bottom-[5%] w-[1px] bg-gray-300 transform -translate-x-1/2"></div>
          
          {/* Linha diagonal (superior esquerda para inferior direita) */}
          <div className="absolute top-[5%] left-[5%] w-[127%] h-[1px] bg-gray-300 origin-top-left rotate-45"></div>
          
          {/* Linha diagonal (superior direita para inferior esquerda) */}
          <div className="absolute top-[5%] right-[5%] w-[127%] h-[1px] bg-gray-300 origin-top-right -rotate-45"></div>
          
          {/* Círculo central */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[8%] h-[8%] rounded-full border border-gray-400 bg-gray-100"></div>
        </div>
        
        {/* Números */}
        {numbersToDisplay.map((item) => {
          const position = numberPositions[item.key];
          return (
            <div
              key={item.key}
              className="absolute print:!opacity-100"
              style={{ 
                top: position.top, 
                left: position.left,
                transform: "translate(-50%, -50%)"
              }}
              title={item.title}
            >
              <div className="flex items-center justify-center">
                <span className="bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold text-gray-800">
                  {item.value}
                </span>
              </div>
            </div>
          );
        })}
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
