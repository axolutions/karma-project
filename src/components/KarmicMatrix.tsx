
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { toast } from "@/components/ui/use-toast";

interface KarmicMatrixProps {
  karmicData: any;
  backgroundImage?: string;
}

const KarmicMatrix: React.FC<KarmicMatrixProps> = ({ 
  karmicData,
  backgroundImage = "https://acess.matrizkarmica.com/wp-content/uploads/2025/02/Design-sem-nome-1.png"
}) => {
  const [imgSrc, setImgSrc] = useState(backgroundImage);
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
  
  // Pré-carrega a imagem para garantir que ela esteja disponível
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      console.log("KarmicMatrix: Imagem carregada com sucesso");
    };
    img.onerror = () => {
      console.error("KarmicMatrix: Erro ao carregar imagem. Usando fallback.");
      setImgSrc("/placeholder.svg");
    };
    img.src = backgroundImage;
  }, [backgroundImage]);
  
  // Função para baixar a matriz como PNG
  const handleDownloadPNG = async () => {
    if (!matrixRef.current) {
      toast({
        title: "Erro ao gerar imagem",
        description: "Não foi possível encontrar o elemento da matriz.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      toast({
        title: "Gerando imagem",
        description: "Preparando sua Matriz Kármica para download..."
      });
      
      const canvas = await html2canvas(matrixRef.current, {
        backgroundColor: null,
        scale: 2, // Melhor qualidade
        logging: false
      });
      
      // Criar um link de download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'Matriz-Karmica-2025.png';
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Download concluído",
        description: "Sua Matriz Kármica foi salva com sucesso."
      });
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);
      toast({
        title: "Erro ao gerar imagem",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
  };
  
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

  // HTML template para a matriz com a imagem incorporada
  const matrixHTML = `
    <div class="image-container relative w-full">
      <style>
        .image-container {
          max-width: 100%;
          text-align: center;
          position: relative;
        }
        .matrix-image {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          border: 1px solid #EAE6E1;
        }
      </style>
      <img 
        src="${imgSrc}" 
        alt="Matriz Kármica 2025" 
        class="matrix-image"
      />
    </div>
  `;

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="mb-4 flex justify-end print:hidden">
        <Button 
          onClick={handleDownloadPNG}
          variant="outline"
          className="karmic-button-outline flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Baixar Matriz como PNG
        </Button>
      </div>
      
      {/* Matrix container with ref for screenshot */}
      <div 
        ref={matrixRef} 
        className="relative"
      >
        {/* Render the HTML template using dangerouslySetInnerHTML */}
        <div dangerouslySetInnerHTML={{ __html: matrixHTML }} />
        
        {/* Numbers overlay */}
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
    </div>
  );
};

export default KarmicMatrix;
