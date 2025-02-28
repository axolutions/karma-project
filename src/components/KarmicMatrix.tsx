
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface KarmicMatrixProps {
  karmicData: {
    karmicSeal?: number;
    destinyCall?: number;
    karmaPortal?: number;
    karmicInheritance?: number;
    karmicReprogramming?: number;
    cycleProphecy?: number;
    spiritualMark?: number;
    manifestationEnigma?: number;
  };
  backgroundImage?: string;
}

const KarmicMatrix: React.FC<KarmicMatrixProps> = ({ 
  karmicData = {},
  backgroundImage = "https://darkorange-goldfinch-896244.hostingersite.com/wp-content/uploads/2025/02/Design-sem-nome-1.png"
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(backgroundImage);
  
  console.log("KarmicMatrix: Renderizando com dados:", karmicData);
  
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
  
  // Pré-carrega a imagem para garantir que ela esteja disponível
  useEffect(() => {
    console.log("KarmicMatrix: Carregando imagem:", backgroundImage);
    const img = new Image();
    img.onload = () => {
      console.log("KarmicMatrix: Imagem carregada com sucesso");
      setImageLoaded(true);
    };
    img.onerror = () => {
      console.error("KarmicMatrix: Erro ao carregar imagem. Usando fallback.");
      setImgSrc("/placeholder.svg");
      setImageLoaded(true);
    };
    img.src = backgroundImage;
    
    // Iniciar como carregado após um timeout para caso a imagem não carregue
    const timeout = setTimeout(() => {
      if (!imageLoaded) {
        console.log("KarmicMatrix: Timeout de carregamento de imagem atingido");
        setImageLoaded(true);
      }
    }, 3000);
    
    return () => clearTimeout(timeout);
  }, [backgroundImage]);
  
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

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Background matrix image */}
      <img 
        src={imgSrc} 
        alt="Matriz Kármica 2025" 
        className="w-full h-auto"
        onLoad={() => {
          console.log("KarmicMatrix: Imagem carregada via onLoad");
          setImageLoaded(true);
        }}
        style={{ 
          border: '1px solid #EAE6E1',
          borderRadius: '8px',
          minHeight: '300px' // Altura mínima para evitar colapso enquanto carrega
        }}
      />
      
      {/* Sempre renderizar os números, mesmo se a imagem não estiver carregada completamente */}
      {numbersToDisplay.map((item, index) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="absolute print:!opacity-100"
          style={{ 
            top: numberPositions[item.key].top, 
            left: numberPositions[item.key].left,
            transform: "translate(-50%, -50%)"
          }}
        >
          <div className="flex items-center justify-center">
            <span className="bg-white bg-opacity-80 rounded-full w-10 h-10 flex items-center justify-center text-lg font-serif font-bold text-karmic-800 shadow-lg print:shadow-none print:border print:border-karmic-300">
              {item.value}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KarmicMatrix;
