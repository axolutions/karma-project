
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
  
  // Vamos listar explicitamente as posições para cada número específico
  const numberPositions = {
    karmicSeal: { top: "23%", left: "25%" },
    destinyCall: { top: "72%", left: "73%" },
    karmaPortal: { top: "47%", left: "21%" },
    karmicInheritance: { top: "47%", left: "72%" },
    karmicReprogramming: { top: "70%", left: "25%" },
    cycleProphecy: { top: "74%", left: "48%" },
    spiritualMark: { top: "25%", left: "70%" },
    manifestationEnigma: { top: "20%", left: "47%" }
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
        className="matrix-container relative w-full aspect-square max-w-2xl mx-auto rounded-lg bg-gradient-to-br from-karmic-100 to-white border border-karmic-200 shadow-md p-4"
      >
        {/* Matrix design (HTML/CSS instead of image) */}
        <div className="absolute inset-0 p-8">
          {/* Outer circle */}
          <div className="absolute inset-[8%] rounded-full border-2 border-karmic-300"></div>
          
          {/* Inner circle */}
          <div className="absolute inset-[20%] rounded-full border-2 border-karmic-300"></div>
          
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-[8%] right-[8%] h-[2px] bg-karmic-300 transform -translate-y-1/2"></div>
          
          {/* Vertical line */}
          <div className="absolute left-1/2 top-[8%] bottom-[8%] w-[2px] bg-karmic-300 transform -translate-x-1/2"></div>
          
          {/* Diagonal line (top-left to bottom-right) */}
          <div className="absolute top-[8%] left-[8%] w-[120%] h-[2px] bg-karmic-300 origin-top-left rotate-45"></div>
          
          {/* Diagonal line (top-right to bottom-left) */}
          <div className="absolute top-[8%] right-[8%] w-[120%] h-[2px] bg-karmic-300 origin-top-right -rotate-45"></div>
          
          {/* Central circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[10%] h-[10%] rounded-full border-2 border-karmic-500 bg-karmic-100"></div>
          
          {/* Title at the top */}
          <div className="absolute top-[2%] left-0 right-0 text-center">
            <h3 className="text-lg md:text-xl font-serif font-medium text-karmic-800">Matriz Kármica 2025</h3>
          </div>
        </div>
        
        {/* Numbers */}
        {numbersToDisplay.map((item, index) => {
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
                <span className="bg-white bg-opacity-80 rounded-full w-10 h-10 flex items-center justify-center text-lg font-serif font-bold text-karmic-800 shadow-lg print:shadow-none print:border print:border-karmic-300">
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
