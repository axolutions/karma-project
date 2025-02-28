
import React, { useEffect, useState } from 'react';
import { getInterpretation, renderHTML } from '@/lib/interpretations';
import { motion } from 'framer-motion';

interface KarmicMatrixProps {
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
  backgroundImage?: string;
}

const KarmicMatrix: React.FC<KarmicMatrixProps> = ({ 
  karmicData,
  backgroundImage = "https://darkorange-goldfinch-896244.hostingersite.com/wp-content/uploads/2025/02/Design-sem-nome-1.png"
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(backgroundImage);
  const [hasError, setHasError] = useState(false);
  
  // Pré-carrega a imagem para garantir que ela esteja disponível para impressão
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      setHasError(false);
      console.log("Imagem da matriz carregada com sucesso!", img.src);
    };
    img.onerror = (error) => {
      console.error("Erro ao carregar a imagem da matriz:", error);
      setHasError(true);
      // Tentar uma imagem local como fallback
      setImgSrc("/placeholder.svg");
    };
    img.crossOrigin = "anonymous";
    img.src = backgroundImage;
    
    // Se a imagem não carregar em 5 segundos, usar o fallback
    const timeout = setTimeout(() => {
      if (!imageLoaded) {
        console.warn("Timeout ao carregar imagem da matriz, usando fallback");
        setHasError(true);
        setImgSrc("/placeholder.svg");
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [backgroundImage]);
  
  // Vamos listar explicitamente as posições para cada número específico
  const numberPositions = {
    // Para valor específico 11 (karmicSeal) - NÃO MUDAR
    karmicSeal: { top: "23%", left: "25%" },
    
    // Para valor específico 3 (destinyCall) - REPOSICIONADO MAIS PARA CIMA E UM POUCO PARA A ESQUERDA
    destinyCall: { top: "72%", left: "73%" },
    
    // Para valor específico 9 (karmaPortal) - NÃO MUDAR
    karmaPortal: { top: "47%", left: "21%" },
    
    // Para valor específico 4 (karmicInheritance) - NÃO MUDAR
    karmicInheritance: { top: "47%", left: "72%" },
    
    // Para valor específico 3 (karmicReprogramming) - NÃO MUDAR
    karmicReprogramming: { top: "70%", left: "25%" },
    
    // Para valor específico 9 (cycleProphecy) - NÃO MUDAR
    cycleProphecy: { top: "74%", left: "48%" },
    
    // Para valor específico 1 (spiritualMark) - NÃO MUDAR
    spiritualMark: { top: "25%", left: "70%" },
    
    // Para valor específico 11 (manifestationEnigma) - NÃO MUDAR
    manifestationEnigma: { top: "20%", left: "47%" }
  };

  const renderMatrixBackground = () => {
    return (
      <div 
        className="w-full h-auto relative rounded-lg overflow-hidden"
        style={{ 
          minHeight: "400px",
          backgroundColor: hasError ? '#8B4513' : 'transparent',
          border: '1px solid #EAE6E1',
          borderRadius: '8px',
        }}
      >
        {!hasError && (
          <img 
            src={imgSrc} 
            alt="Matriz Kármica 2025"
            crossOrigin="anonymous"
            className="w-full h-auto"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setHasError(true);
              setImgSrc("/placeholder.svg");
            }}
            style={{ 
              display: imageLoaded ? 'block' : 'none'
            }}
          />
        )}
        
        {!imageLoaded && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-karmic-800"></div>
          </div>
        )}
        
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <p>Imagem da matriz indisponível</p>
          </div>
        )}
      </div>
    );
  };

  // Se karmicData for undefined, mostramos apenas a imagem de fundo
  if (!karmicData) {
    return (
      <div className="relative max-w-4xl mx-auto">
        {renderMatrixBackground()}
        <div className="text-center mt-4 text-karmic-600">
          Dados da matriz não disponíveis. Por favor, verifique seu perfil.
        </div>
      </div>
    );
  }

  // Simplificamos o mapeamento para usar os valores diretamente
  const numbersToDisplay = [
    { key: 'karmicSeal', value: karmicData.karmicSeal, title: "Selo Kármico 2025" },
    { key: 'destinyCall', value: karmicData.destinyCall, title: "Chamado do Destino 2025" },
    { key: 'karmaPortal', value: karmicData.karmaPortal, title: "Portal do Karma 2025" },
    { key: 'karmicInheritance', value: karmicData.karmicInheritance, title: "Herança Kármica 2025" },
    { key: 'karmicReprogramming', value: karmicData.karmicReprogramming, title: "Códex da Reprogramação 2025" },
    { key: 'cycleProphecy', value: karmicData.cycleProphecy, title: "Profecia dos Ciclos 2025" },
    { key: 'spiritualMark', value: karmicData.spiritualMark, title: "Marca Espiritual 2025" },
    { key: 'manifestationEnigma', value: karmicData.manifestationEnigma, title: "Enigma da Manifestação 2025" }
  ];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Background matrix image */}
      {renderMatrixBackground()}
      
      {/* Numbers overlay - só mostra se a imagem carregou ou está usando fallback */}
      {(imageLoaded || hasError) && numbersToDisplay.map((item, index) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="absolute print:!opacity-100"
          style={{ 
            top: numberPositions[item.key as keyof typeof numberPositions].top, 
            left: numberPositions[item.key as keyof typeof numberPositions].left,
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
