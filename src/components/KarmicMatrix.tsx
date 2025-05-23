
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface KarmicMatrixProps {
  karmicData: any;
  backgroundImage?: string;
  positions?: { [key: string]: { top: string, left: string } };
}

const KarmicMatrix: React.FC<KarmicMatrixProps> = ({ 
  karmicData,
  backgroundImage = "/default_banner.png",
  positions = {}
}) => {
  const [imgSrc, setImgSrc] = useState(backgroundImage);
  
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
  
  // Posições corretas dos números conforme solicitado
  const numberPositions = {
    destinyCall: { top: "27%", left: "27%" },       // chamado_destino
    karmicSeal: { top: "25%", left: "50%" },        // selo_karmico - Número 6 movido para o centro alto
    karmaPortal: { top: "27%", left: "73%" },       // portal_karma
    karmicInheritance: { top: "50%", left: "25%" }, // heranca_karmica
    manifestationEnigma: { top: "50%", left: "75%" }, // enigma_manifestacao - Número 11 subido para o quadrado da direita
    spiritualMark: { top: "73%", left: "27%" },     // marca_espiritual
    karmicReprogramming: { top: "75%", left: "50%" }, // codex_reprogramacao
    cycleProphecy: { top: "73%", left: "73%" },     // profecia_ciclos - Número 9 movido para o quadrado em branco da direita
    ...positions,
  };

  // Mapeamento entre nossos nomes de chaves e os do HTML
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

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Background matrix image */}
      <div 
        className="w-full h-auto aspect-square"
        style={{ 
          backgroundImage: `url(${imgSrc})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          border: '1px solid #EAE6E1',
          borderRadius: '8px',
          minHeight: '300px', // Altura mínima para evitar colapso enquanto carrega
        }}
      >
        {/* Renderizar os números */}
        {numbersToDisplay.map((item, index) => {
          const position = numberPositions[item.key];
          return (
            <div
              key={item.key}
              data-asd={item.key}
              className="absolute print:!opacity-100"
              style={{ 
                ...position,
                transform: "translate(-50%, -50%)"
              }}
            >
              <div className="flex items-center justify-center">
                <span className="bg-white bg-opacity-80 rounded-full w-12 h-12 flex items-center justify-center text-lg font-serif font-bold text-karmic-800 shadow-lg print:shadow-none print:border print:border-karmic-300">
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
